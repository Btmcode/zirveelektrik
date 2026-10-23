/**
 * Yonetim paneli gizli giris yolu — YALNIZCA SUNUCU TARAFI.
 *
 * Guvenlik modeli (2026 guvenlik denetimi sonrasi):
 * - Yol ARTIK client bundle'ina GIRMEZ. Eski NEXT_PUBLIC_ADMIN_PATH yaklasimi
 *   kaldirildi; cunku NEXT_PUBLIC_ on ekli her degisken build zamaninda
 *   tarayiciya gonderilen JS'in icine gomulur ve "gizli" yol herkese acik olur.
 * - Yalnizca ADMIN_LOGIN_PATH env degiskeninden (sunucu/Edge runtime) okunur.
 * - FAIL-CLOSED: Degisken tanimli degilse VEYA gecersizse giris yolu HIC
 *   uretilmez; proxy tum /admin/** isteklerine oturum yoksa 404 dondurur ve
 *   giris sayfasi hicbir adresten render edilemez. Yani "bilinen bir varsayilan
 *   yol" yoktur — panel env tanimlanmadan acilamaz.
 * - Oturumu biten yonetici client tarafinda gizli yolu BILMEZ; ana sayfaya
 *   yonlendirilir ve kendi bildigi gizli adresten tekrar giris yapar.
 *
 * Edge uyumu: proxy.ts (Edge runtime) bu modulu import eder; bu yuzden
 * "server-only" paketi import EDILMEZ ve Node'a ozgu API kullanilmaz.
 *
 * Dikkat: segment yalnizca harf/rakam/tire icerip 4-64 karakter
 * araliginda olabilir; gecersiz degerler yol uretmez (fail-closed).
 */

function resolveAdminPath(raw: string | undefined): string | null {
  const segment = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (/^[a-zA-Z0-9-]{4,64}$/.test(segment)) {
    return `/admin/${segment}`;
  }
  return null;
}

/**
 * Gizli giris yolu (orn. "/admin/ze-xxxx-xxxx-xxxx").
 * ADMIN_LOGIN_PATH env degiskeni tanimli degilse null doner —
 * bu durumda giris sayfasina HICBIR adresten ulasilamaz (fail-closed).
 */
export const ADMIN_LOGIN_PATH: string | null = resolveAdminPath(
  process.env.ADMIN_LOGIN_PATH
);

/**
 * Giris sayfasinin gercek (icerik) rotasi.
 * Dogrudan erisime kapalidir; yalnizca proxy rewrite icin kullanir.
 */
export const ADMIN_LOGIN_ROUTE = "/admin/login";
