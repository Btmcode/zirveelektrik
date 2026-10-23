/**
 * Hybrid rate limiter.
 *
 * - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN tanımlıysa:
 *   Upstash Redis üzerinden FIXED WINDOW limit uygulanır (Vercel'de serverless
 *   instance'lar arası ortak sayaç — dağıtık koruma).
 * - Değişkenler yoksa (yerel geliştirme / sandbox): mevcut in-memory sayaç
 *   kullanılır; harici bağımlılık olmadan çalışmaya devam eder.
 * - Upstash erişiminde beklenmedik hata olursa in-memory sayaca düşülür;
 *   rate limiter arızası formun/admin girişinin çalışmasını engellemez.
 *
 * Kullanım: await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

/* ------------------------------------------------------------------ */
/* Upstash (dağıtık) katman                                            */
/* ------------------------------------------------------------------ */

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  upstashUrl && upstashToken
    ? new Redis({ url: upstashUrl, token: upstashToken })
    : null;

/** Aynı pencere için Ratelimit nesnelerini yeniden kullan (bağlantı/SDK cache). */
const limiterCache = new Map<string, Ratelimit>();

function getUpstashLimiter(maxRequests: number, seconds: number): Ratelimit | null {
  if (!redis) return null;
  const signature = `${maxRequests}:${seconds}`;
  let limiter = limiterCache.get(signature);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(maxRequests, `${seconds} s`),
      prefix: "zirve-rl",
    });
    limiterCache.set(signature, limiter);
  }
  return limiter;
}

/* ------------------------------------------------------------------ */
/* In-memory fallback katmanı                                          */
/* ------------------------------------------------------------------ */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Eski kayıtları periyodik temizle (bellek sızıntısı önleme)
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

/* ------------------------------------------------------------------ */
/* Genel API (async — Upstash çağrıları asenkron olduğundan)           */
/* ------------------------------------------------------------------ */

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const seconds = Math.max(1, Math.round(windowMs / 1000));
  const limiter = getUpstashLimiter(maxRequests, seconds);

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining ?? Math.max(0, maxRequests - 1),
        retryAfterSec: result.success
          ? 0
          : Math.max(
              1,
              Math.ceil(
                ((result.reset ?? Date.now() + windowMs) - Date.now()) / 1000
              )
            ),
      };
    } catch (error) {
      // Upstash erişilemiyor: servisi bloklamadan in-memory sayaca düş.
      console.error("[rate-limit] Upstash hatası, in-memory fallback:", error);
    }
  }

  return memoryRateLimit(key, maxRequests, windowMs);
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
