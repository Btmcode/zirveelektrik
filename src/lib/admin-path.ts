/**
 * Yonetim paneli gizli giris yolu.
 *
 * Guvenlik modeli:
 * - "/admin/login" ve "/admin" gibi bilinen yollar oturum yoksa 404 dondurur;
 *   panelin varligi disariya sızmaz, bot taramaları anlamsızlasir.
 * - Panele giris YALNIZCA bu gizli yol uzerinden yapilir (proxy
 *   bu yolu gercek /admin/login rotasina rewrite eder).
 * - Yol NEXT_PUBLIC_ADMIN_PATH env degiskeninden okunur (varsayilan:
 *   "REDACTED"). Not: bu deger istemci bundle'ina da inline edilir;
 *   cunku oturum bitince istemciyi gizli yola yonlendiren api-client ve
 *   admin-shell ayni sabiti kullanir (bugun de durum boyledir).
 * - Vercel'e deploy ederken degiskeni Project Settings > Environment
 *   Variables altina BUILD zamaninda eklemeniz gerekir.
 *
 * Dikkat: segment yalnizca harf/rakam/tire icerip 4-64 karakter
 * araliginda olabilir; gecersiz degerlerde varsayilan kullanilir.
 */

const FALLBACK_SEGMENT = "REDACTED";

function resolveAdminPath(raw: string | undefined): string {
  const segment = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (/^[a-zA-Z0-9-]{4,64}$/.test(segment)) {
    return `/admin/${segment}`;
  }
  return `/admin/${FALLBACK_SEGMENT}`;
}

export const ADMIN_LOGIN_PATH = resolveAdminPath(
  process.env.NEXT_PUBLIC_ADMIN_PATH
);

/**
 * Giris sayfasinin gercek (icerik) rotasi.
 * Dogrudan erisime kapalidir; yalnizca proxy rewrite icin kullanir.
 */
export const ADMIN_LOGIN_ROUTE = "/admin/login";
