/**
 * PostgreSQL tabanlı dağıtık rate limiter (harici servis gerektirmez).
 *
 * Neden PostgreSQL? Yalnızca iletişim formu ve admin girişi gibi DÜŞÜK
 * TRAFİKLİ uçlar için koruma; Vercel serverless instance'ları arasında
 * ortak sayaç sağlar (in-memory'nin aksine). Ek servis/anahtar gerektirmez.
 *
 * Nasıl çalışır?
 * - Tek atomik SQL: INSERT ... ON CONFLICT — pencere süresi dolmuşsa sayacı
 *   1'e indirip pencereyi yeniler; dolmadıysa sayacı artırır ve güncel
 *   (count, resetAt) ikilisini tek round-trip'te döndürür.
 * - DB hatasında yerel in-memory sayaca güvenli düşüş yapılır; rate limit
 *   altyapısı formun/girişin çalışmasını asla engellemez.
 * - Süresi geçmiş satırlar %5 olasılıkla fırsat temizliğiyle silinir
 *   (tablo küçük kalır; sayaç satırları pencere başına 1 satırdır).
 *
 * Kullanım: await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
 */

import { db } from "@/lib/db";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowMsSafe = Math.max(1000, windowMs);
  try {
    const rows = await db.$queryRaw<
      { count: number; resetAt: Date }[]
    >`
      INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
      VALUES (${key}, 1, NOW() + ${windowMsSafe} * INTERVAL '1 millisecond')
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimitBucket"."resetAt" < NOW() THEN 1
          ELSE "RateLimitBucket"."count" + 1
        END,
        "resetAt" = CASE
          WHEN "RateLimitBucket"."resetAt" < NOW()
          THEN NOW() + ${windowMsSafe} * INTERVAL '1 millisecond'
          ELSE "RateLimitBucket"."resetAt"
        END
      RETURNING "count", "resetAt"
    `;

    const bucket = rows[0];
    if (!bucket) {
      // Teorik olarak ulaşılmaz; güvenli tarafta kal.
      return { allowed: true, remaining: maxRequests - 1, retryAfterSec: 0 };
    }

    if (bucket.count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec: Math.max(
          1,
          Math.ceil((bucket.resetAt.getTime() - Date.now()) / 1000)
        ),
      };
    }

    maybeCleanupExpired();
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - bucket.count),
      retryAfterSec: 0,
    };
  } catch (error) {
    // DB erişilemiyor: servisi bloklamadan yerel sayaca düş.
    console.error("[rate-limit] DB hatası, in-memory fallback:", error);
    return memoryRateLimit(key, maxRequests, windowMsSafe);
  }
}

/** Süresi geçmiş sayaç satırlarını düşük olasılıkla temizler (hafıza/DB hijyeni). */
function maybeCleanupExpired(): void {
  if (Math.random() >= 0.05) return;
  db.rateLimitBucket
    .deleteMany({ where: { resetAt: { lt: new Date() } } })
    .catch((error) =>
      console.error("[rate-limit] temizlik hatası:", error)
    );
}

/* ------------------------------------------------------------------ */
/* In-memory fallback katmanı (yalnızca DB hatasında)                  */
/* ------------------------------------------------------------------ */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key);
  }
}

function memoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSec: 0 };
  }

  if (bucket.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - bucket.count,
    retryAfterSec: 0,
  };
}

/**
 * İstek sahibinin IP'sini güvenli şekilde türetir.
 * Öncelik sırası:
 *  1) x-vercel-forwarded-for / x-real-ip — platformun (Vercel) kendisinin
 *     set ettiği, istemcinin SAHTELEYEMEYECEĞİ güvenilir başlıklar.
 *  2) x-forwarded-for zincirinin SON değeri — standart XFF davranışında her
 *     proxy kendi gördüğü peer'i sona ekler; son eleman bizim altyapımıza en
 *     yakın hop'un gördüğü gerçek kaynaktır (istemci başa sahte değer
 *     ekleyerek ilk değeri zehirleyebilir).
 */
export function getClientIp(request: Request): string {
  const trusted =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip");
  if (trusted) return trusted.trim();

  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const hops = fwd
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    return hops[hops.length - 1] ?? "unknown";
  }
  return "unknown";
}
