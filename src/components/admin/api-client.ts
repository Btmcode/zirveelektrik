"use client";

/**
 * Admin istemci fetch sarmalayıcısı.
 * - 401 → oturum bitmiş: ANA SAYFAYA yönlendirir. Gizli giriş yolu bilinçli
 *   olarak istemciye verilmez (client bundle'da taşınmaz); yönetici kendi
 *   bildiği gizli adresten tekrar giriş yapar.
 * - 4xx/5xx → sunucudan gelen genel hata mesajını fırlatır.
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401) {
    // Bilinçli tam sayfa geçişi: tüm istemci durumu (bellek cache'i, form
    // state'i) sıfırlansın; apiFetch bileşen dışı yardımcı olduğu için
    // useRouter erişimi yoktur. window.location.assign uyarısı bastırıldı.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
    throw new Error("Oturum sona erdi, lütfen tekrar giriş yapın");
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Bir hata oluştu");
  }

  return data as T;
}
