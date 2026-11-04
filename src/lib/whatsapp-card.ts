// WhatsApp "Acil Çağrı Mesaj Kartı"  ortak formatlayıcı.
// NOT: client ve server tarafında birlikte kullanılabilir; server-only import YOK.

export interface RequestCardData {
  code: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  serviceType: string | null;
  message: string;
  createdAt: string | Date;
}

/**
 * Telefon numarasını WhatsApp (wa.me) için uluslararası basamak dizisine çevirir.
 * "0538 694 94 69" \u{2192} "905386949469"; "+90 5xx..." \u{2192} "905xx..."; geçersizse null.
 */
export function normalizeWaDigits(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("5")) return `90${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `90${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("90")) return digits;
  return null;
}

/** Telefonu "0538 694 94 69" biçiminde gösterime çevirir (mümkünse). */
export function formatTrPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // 0XXXXXXXXXX (11 hane) veya 90 sonrası 10 hane beklenir
  const local = digits.length === 12 && digits.startsWith("90") ? `0${digits.slice(2)}` : digits;
  if (/^0\d{10}$/.test(local)) {
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 9)} ${local.slice(9, 11)}`;
  }
  return raw;
}

/** Adres için Google Maps arama linki üretir. */
export function buildMapsLink(address: string, district?: string): string {
  const q = encodeURIComponent([address, district, "İstanbul"].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** HH:MM (tr) biçiminde saat döndürür. */
export function formatTimeTr(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "--:--";
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(d);
}

/** Giriş sahibi numarasına wa.me deep link üretir (opsiyonel metinle). */
export function buildOwnerWaLink(text: string, ownerDigits = "905377201345"): string {
  return `https://wa.me/${ownerDigits}?text=${encodeURIComponent(text)}`;
}

/** Müşteri numarasına wa.me deep link üretir (hazır karşılama metniyle). */
export function buildCustomerWaLink(request: RequestCardData): string | null {
  const digits = normalizeWaDigits(request.phone);
  if (!digits) return null;
  const text =
    `Merhaba ${request.name},\n\n` +
    `Zirve Elektrik \u{2014} ${request.code} numaralı arıza talebiniz sistemimize düşmüştür. ` +
    `Ustalarımız en kısa sürede sizi arayarak randevu planlayacaktır.\n\n` +
    `Acil durumlar için: 0537 720 13 45`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Talebi, referans "Acil Çağrı Mesaj Kartı" biçiminde WhatsApp metnine çevirir.
 * WhatsApp kalın yazı için *yıldız* sözdizimini kullanır.
 */
export function formatRequestCard(r: RequestCardData): string {
  const phoneDisplay = formatTrPhoneDisplay(r.phone);
  const time = formatTimeTr(r.createdAt);
  const maps = buildMapsLink(r.address, r.district);

  const lines = [
    "\u{1f6a8} *7/24 YENİ ACİL SERVİS ÇAĞRISI* \u{26a1}",
    "",
    `\u{1f464} *Müşteri:* ${r.name}`,
    `\u{1f4de} *Telefon:* ${phoneDisplay}`,
    `\u{1f4cd} *Bölge:* ${r.district}`,
    `\u{1f3e0} *Açık Adres:* ${r.address}`,
    `\u{1f6e0} *Arıza Türü:* ${r.serviceType || "Belirtilmemiş"}`,
    `\u{1f4dd} *Not:* ${r.message}`,
    `\u{1f550} *Saat:* ${time} (7/24 Nöbetçi Ekip)`,
    `\u{1f3ab} *Takip Kodu:* ${r.code}`,
    "",
    `\u{1f5fa} *Haritada Aç:* ${maps}`,
  ];
  return lines.join("\n");
}

// ---------- Şablon motoru (admin Ayarlar'dan düzenlenebilir) ----------

/** Şablonda kullanılabilen tokenlar; editörde çip olarak listelenir. */
export interface WaTemplateToken {
  token: string;
  label: string;
}

export const WA_TEMPLATE_TOKENS: WaTemplateToken[] = [
  { token: "{takipKodu}", label: "Takip Kodu" },
  { token: "{adSoyad}", label: "Müşteri Adı" },
  { token: "{telefon}", label: "Telefon" },
  { token: "{bolge}", label: "Bölge (İlçe)" },
  { token: "{adres}", label: "Açık Adres" },
  { token: "{arizaTuru}", label: "Arıza Türü" },
  { token: "{not}", label: "Müşteri Notu" },
  { token: "{saat}", label: "Saat (TR)" },
  { token: "{haritaLinki}", label: "Google Maps Linki" },
];

/** Varsayılan kartın token'lı metin temsili; editörde "Varsayılanı Getir" ile yüklenir. */
export const DEFAULT_WA_TEMPLATE = [
  "🚨 *7/24 YENİ ACİL SERVİS ÇAĞRISI* ⚡",
  "",
  "👤 *Müşteri:* {adSoyad}",
  "📞 *Telefon:* {telefon}",
  "📍 *Bölge:* {bolge}",
  "🏠 *Açık Adres:* {adres}",
  "🛠️ *Arıza Türü:* {arizaTuru}",
  "📝 *Not:* {not}",
  "🕐 *Saat:* {saat} (7/24 Nöbetçi Ekip)",
  "🎫 *Takip Kodu:* {takipKodu}",
  "",
  "🗺️ *Haritada Aç:* {haritaLinki}",
].join("\n");

/**
 * Talebi, admin şablonuna göre WhatsApp metnine çevirir.
 * Şablon boş/tanımsızsa yerleşik varsayılan kart (formatRequestCard) kullanılır.
 * Tanınmayan token'lar düzenlenebilsin diye metin olarak bırakılır (sessizce silinmez);
 * böylece yazım hatası önizlemede görünür ve düzeltilebilir.
 */
export function renderRequestCard(r: RequestCardData, template?: string | null): string {
  if (!template || !template.trim()) return formatRequestCard(r);
  const phoneDisplay = formatTrPhoneDisplay(r.phone);
  const time = formatTimeTr(r.createdAt);
  const maps = buildMapsLink(r.address, r.district);
  return template
    .replaceAll("{takipKodu}", r.code)
    .replaceAll("{adSoyad}", r.name)
    .replaceAll("{telefon}", phoneDisplay)
    .replaceAll("{bolge}", r.district)
    .replaceAll("{adres}", r.address)
    .replaceAll("{arizaTuru}", r.serviceType || "Belirtilmemiş")
    .replaceAll("{not}", r.message)
    .replaceAll("{saat}", time)
    .replaceAll("{haritaLinki}", maps);
}
