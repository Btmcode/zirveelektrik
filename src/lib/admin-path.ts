/**
 * Yonetim paneli gizli giris yolu.
 *
 * Guvenlik modeli:
 * - "/admin/login" ve "/admin" gibi bilinen yollar oturum yoksa 404 dondurur;
 *   panelin varligi disariya sızmaz, bot taramaları anlamsızlasir.
 * - Panele giris YALNIZCA bu gizli yol uzerinden yapilir (middleware
 *   bu yolu gercek /admin/login rotasina rewrite eder).
 * - Yolu degistirmek isterseniz yalnizca bu sablonu guncelleyin,
 *   ornegin: "/admin/o7-kontrol-kapisi".
 *   Dikkat: yol mutlaka "/admin/" ile baslamalidir (middleware matcher
 *   yalnizca /admin/** rotalarini kapsar).
 */
export const ADMIN_LOGIN_PATH = "/admin/REDACTED";

/**
 * Giris sayfasinin gercek (icerik) rotasi.
 * Dogrudan erisime kapalidir; yalnizca middleware rewrite icin kullanir.
 */
export const ADMIN_LOGIN_ROUTE = "/admin/login";
