import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_LOGIN_PATH, ADMIN_LOGIN_ROUTE } from "@/lib/admin-path";

/**
 * Admin oturum koruması ve gizli giriş (Edge runtime).
 *
 * Not: src/lib/auth.ts "server-only" import ettiği için Edge'de kullanılamaz;
 * burada jose jwtVerify ile aynı parametrelerle (ADMIN_SESSION_SECRET,
 * issuer "zirveelektrik.net", audience "zirve-admin") doğrulama yapılır.
 *
 * Kurallar:
 * - Gizli giriş yolu (ADMIN_LOGIN_PATH): oturum YOKSA giriş sayfasına rewrite,
 *   oturum VARSA /admin'e yönlendir.
 * - Gerçek giriş rotası (/admin/login) doğrudan erişime KAPALI (404); aksi
 *   halde gizli yol, rewrite zinciri üzerinden dışarıya sıza bilirdi.
 * - Diğer tüm /admin/** yolları: oturum YOKSA 404 (login'e yönlendirme
 *   YAPILMAZ ki panelin varlığı ve gizli yol dışarıya sızmasın).
 * - Public rotalara dokunulmaz (matcher yalnızca /admin/:path*).
 */

const SESSION_COOKIE = "zirve_admin_session";
const SESSION_ISSUER = "zirveelektrik.net";
const SESSION_AUDIENCE = "zirve-admin";

/**
 * Secret yalnızca ADMIN_SESSION_SECRET env değişkeninden gelir; bilinen bir
 * string'e fallback YOKTUR. Değişken yoksa imza doğrulama başarısız olur ve
 * tüm /admin/** yolları 404 döndürür.
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET env değişkeni tanımlı olmalıdır (en az 32 karakter)."
    );
  }
  return new TextEncoder().encode(secret);
}

async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await hasValidSession(request.cookies.get(SESSION_COOKIE)?.value);

  // 1) Gizli giriş yolu: panelin tek halka açık kapısı.
  if (pathname === ADMIN_LOGIN_PATH) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Tarayıcıdaki URL gizli yol olarak kalır, içerik giriş sayfasından gelir.
    return NextResponse.rewrite(new URL(ADMIN_LOGIN_ROUTE, request.url));
  }

  // 2) Gerçek giriş rotasına doğrudan erişim kapalı (gizli yol korunur).
  if (pathname === ADMIN_LOGIN_ROUTE) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return notFoundResponse(request);
  }

  // 3) Oturum yoksa panelin varlığını belli etmeden 404 döndür.
  if (!authed) {
    return notFoundResponse(request);
  }

  return NextResponse.next();
}

/**
 * Uygulamanın 404 sayfasını (status 404 ile) render eder.
 * Var olmayan bir rotaya rewrite yapılarak Next.js not-found akışı tetiklenir.
 */
function notFoundResponse(request: NextRequest): NextResponse {
  const url = new URL("/404-sayfa-bulunamadi", request.url);
  const res = NextResponse.rewrite(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
