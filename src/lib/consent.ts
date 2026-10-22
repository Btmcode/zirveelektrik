/**
 * Çerez onay durumu - paylaşılan kütüphane (yalnızca tarayıcı tarafında kullanılır).
 *
 * KVKK Kurulu çerez esasları: zorunlu olmayan çerezler yalnızca açık rızayla
 * yüklenebilir. Sitede şu an zorunlu olmayan tek kategori, İletişim
 * sayfasındaki Google Haritalar gömmesidir (fonksiyonel). Analitik ve
 * pazarlama araçları henüz devreye alınmamıştır; kategoriler ileriye dönük
 * hazır tutulur.
 *
 * Onay penceresi: src/components/site/cookie-consent.tsx
 * Harita kapısı:   src/components/site/map-embed.tsx
 */

export const CONSENT_STORAGE_KEY = "zr-cookie-consent";
export const CONSENT_CHANGE_EVENT = "zr-consent-change";
export const CONSENT_OPEN_EVENT = "zr-open-cookie-settings";

export const CONSENT_CATEGORIES = [
  "necessary",
  "functional",
  "analytics",
  "marketing",
] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type ConsentState = Record<ConsentCategory, boolean>;

/** "Tümüne İzin Ver" karşılığı: tüm isteğe bağlı kategoriler açık. */
export const FULL_CONSENT: ConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

/** "Yalnızca Zorunlu Çerezler" karşılığı. */
export const NECESSARY_ONLY: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export interface ConsentCategoryMeta {
  id: ConsentCategory;
  name: string;
  description: string;
  examples: string;
  /** Zorunlu kategori kapatılamaz. */
  required: boolean;
}

/** Onay panelindeki kategori bilgileri - /cerez-politikasi içeriğiyle uyumlu. */
export const CATEGORY_META: ConsentCategoryMeta[] = [
  {
    id: "necessary",
    name: "Zorunlu Çerezler",
    description:
      "Sitenin temel işleyişi için gereklidir; bu çerezler olmadan site güvenli şekilde çalışmaz. Bu nedenle her zaman etkindir.",
    examples: "Oturum güvenliği (zr_admin_session)",
    required: true,
  },
  {
    id: "functional",
    name: "Fonksiyonel Çerezler",
    description:
      "Deneyimi zenginleştirir. İletişim sayfasındaki Google Haritalar haritası bu izinle yüklenir; harita yüklenirken Google çerez yerleştirebilir.",
    examples: "Google Haritalar gömmesi",
    required: false,
  },
  {
    id: "analytics",
    name: "Ölçümleme (Analitik)",
    description:
      "Hangi sayfaların daha çok görüntülendiğini anonim ölçmemizi sağlar. Şu anda aktif bir analitik aracımız yok; izin verirseniz ileride devreye alınabilir.",
    examples: "İleri dönemde Google Analytics vb.",
    required: false,
  },
  {
    id: "marketing",
    name: "Pazarlama (Reklam)",
    description:
      "İlgi alanınıza göre reklam gösterimi ve ölçümlemesi için kullanılır. Şu anda hiçbir pazarlama çerezi kullanmıyoruz.",
    examples: "İleri dönemde reklam ölçümlemesi",
    required: false,
  },
];

declare global {
  interface Window {
    __zrConsent?: ConsentState;
  }
}

function withNecessary(state: ConsentState): ConsentState {
  return { ...state, necessary: true };
}

/**
 * localStorage'dan onay durumunu okur; hiç tercih yoksa null döner.
 * Eski tek-değer formatı ("accepted" / "necessary") da desteklenir.
 */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    if (raw === "accepted") return FULL_CONSENT;
    if (raw === "necessary") return NECESSARY_ONLY;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      necessary: true,
      functional: parsed.functional === true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return null;
  }
}

/** Onay durumunu kaydeder, global değişkeni ve değişiklik event'ini günceller. */
export function persistConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const normalized = withNecessary(state);
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ ...normalized, ts: new Date().toISOString() })
    );
  } catch {
    // localStorage kapalıysa tercih kalıcı olmaz; oturumluk olarak tutulur
  }
  window.__zrConsent = normalized;
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: normalized })
  );
}

/** Belirli kategoriye rıza verilmiş mi? (state verilmezse global tercih okunur) */
export function hasConsent(
  category: ConsentCategory,
  state?: ConsentState | null
): boolean {
  const current =
    state ??
    (typeof window === "undefined" ? null : window.__zrConsent ?? readConsent());
  if (!current) return false;
  return current[category] === true;
}
