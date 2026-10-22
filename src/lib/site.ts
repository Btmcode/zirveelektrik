// Site geneli sabit konfigürasyon - Zirve Elektrik
// Not: Telefon/WhatsApp/e-posta gibi değerler DB'deki Setting tablosundan
// yönetilir; buradaki değerler yalnızca fallback (varsayılan) olarak kullanılır.

export const SITE = {
  name: "Zirve Elektrik",
  legalName: "Zirve Elektrik Elektrik Tesisat Hizmetleri",
  domain: "zirveelektrik.net",
  url: "https://zirveelektrik.net",
  city: "İstanbul",
  region: "İstanbul",
  description:
    "İstanbul genelinde 7/24 elektrikçi ve elektrik arıza tespiti hizmeti. Sigorta, pano, topraklama, aydınlatma ve tüm elektrik arızalarında aynı gün servis.",
  shortDescription:
    "İstanbul'da 7/24 acil elektrikçi. Arıza tespiti, onarım ve tesisat hizmetlerinde güvenilir çözüm.",
  // Gerçek iletişim bilgileri (admin panelinden değiştirilebilir)
  phone: "+90 537 720 13 45",
  phoneHref: "+905377201345",
  whatsapp: "+90 537 720 13 45",
  whatsappHref: "+905377201345",
  email: "zirveeneeji@gmail.com",
  address: "Eski Habipler Mah. Sümbüller Sk. A Blok No: 17-21A İç Kapı No: 11",
  addressLocality: "Sultangazi",
  addressRegion: "İstanbul",
  workingHours: "7/24 Acil Servis",
  foundedYear: 2005,
  social: {
    instagram: "https://instagram.com/zirveelektrik",
    facebook: "https://facebook.com/zirveelektrik",
    x: "https://x.com/zirveelektrik",
  },
} as const;

/** Google Haritalar tam adres sorgusu (embed + yol tarifi ortak veri kaynağı). */
const FULL_ADDRESS = `${SITE.address}, ${SITE.addressLocality}/${SITE.addressRegion}`;

/** İletişim sayfası için gömülü harita iframe kaynağı (API anahtarı gerektirmez). */
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(FULL_ADDRESS)}&z=15&output=embed`;

/** "Yol Tarifi Al" butonu için Google Haritalar yön tarif linki. */
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(FULL_ADDRESS)}`;

export const DEFAULT_META = {
  title: "Zirve Elektrik | İstanbul 7/24 Acil Elektrikçi - Arıza Tespiti",
  titleTemplate: "%s | Zirve Elektrik",
  description: SITE.description,
  keywords: [
    "istanbul elektrikçi",
    "acil elektrikçi",
    "7/24 elektrikçi",
    "elektrik arıza tespiti",
    "nöbetçi elektrikçi",
    "elektrikçi fiyatları",
    "sigorta arızası",
    "elektrik panosu",
    "topraklama",
    "zirve elektrik",
  ],
};

export const REQUEST_STATUS = {
  NEW: "Yeni",
  CONTACTED: "Arandı",
  SCHEDULED: "Randevulu",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
} as const;

export type RequestStatus = keyof typeof REQUEST_STATUS;

export const REQUEST_STATUS_ORDER: RequestStatus[] = [
  "NEW",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
];
