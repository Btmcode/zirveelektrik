import "server-only";

/**
 * Basit TTL cache (harici bağımlılık gerektirmez).
 *
 * Amaç: halka açık sayfaların her render'ında tekrarlanan sıcak DB okumalarını
 * (hizmet listesi, ilçe listesi, SSS vb.) hafızada tutarak hem gecikmeyi hem
 * DB yükünü düşürmek. Vercel serverless'ta instance başına çalışır; verilen
 * TTL'ler kısa (2-5 dk) tutulduğu için en kötü durumda bile veri bu süre
 * içinde tazelenir. Yönetim panelinden yapılan değişiklikler ilgili önek
 * bustlanarak anında yansıtılır (bkz. clearCacheByPrefix).
 *
 * - Aynı anahtara gelen eşzamanlı istekler tek loader'a birleştirilir
 *   (serverless burst'te DB'ye kısa süreli yük binmesini önler).
 * - Loader hatası cache'lenmez; her çağrıda tekrar denenir.
 */

interface Entry {
  value: unknown;
  expiresAt: number;
}

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

/** Süresi geçmiş girişleri temizler (hafıza hijyeni). */
function sweep(now: number): void {
  if (store.size < 64) return;
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

export async function cached<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  sweep(now);

  const hit = store.get(key);
  if (hit && hit.expiresAt > now) return hit.value as T;

  // Eşzamanlı aynı-anahtar isteklerini tek yüklemede birleştir.
  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const task = loader()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, task);
  return task;
}

/**
 * Belirtilen önekle başlayan tüm girişleri düşürür.
 * Kullanım: hizmet CRUD sonrası clearCacheByPrefix("svc")
 */
export function clearCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Tüm cache'i düşürür (test/koruma amaçlı). */
export function clearAllCache(): void {
  store.clear();
}
