import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Admin oturum yönetimi.
 * Güvenlik kuralları:
 * - Şifre asla düz metin saklanmaz (bcrypt hash, seed/rotate üzerinden).
 * - Oturum: imzalı JWT, httpOnly + sameSite=lax cookie (XSS'e karşı koruma).
 * - Secret ortam değişkeninden alınır, asla koda gömülmez.
 */

export const SESSION_COOKIE = "zirve_admin_session";
const SESSION_TTL_HOURS = 12;

/**
 * Secret yalnızca ADMIN_SESSION_SECRET env değişkeninden gelir; bilinen bir
 * string'e fallback YOKTUR (repo herkese açık olsa bile oturum sahteciliği
 * mümkün olmasın). Değişken yoksa sunucu bilinçli olarak hata verir.
 */
function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET env değişkeni tanımlı olmalıdır (en az 32 karakter)."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string; // AdminUser id
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("zirveelektrik.net")
    .setAudience("zirve-admin")
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "zirveelektrik.net",
      audience: "zirve-admin",
    });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      role: typeof payload.role === "string" ? payload.role : "ADMIN",
    };
  } catch {
    return null;
  }
}

/** Sunucu tarafında (route handler / server component) mevcut oturumu döndürür. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * CSRF/Origin kontrolü: cookie tabanlı auth'ta state-changing isteklerde
 * Origin header'ı doğrulanır (SCW backend kuralı).
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // aynı-origin fetch/tooling: origin header yoksa kabul
  try {
    const host = request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
