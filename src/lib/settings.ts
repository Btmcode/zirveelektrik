import "server-only";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

/**
 * Site ayarları DB'den okunur; yoksa SITE sabitlerine düşer (fallback).
 * Sayfa render'larında sık çağrıldığı için basit memory cache kullanılır.
 */

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

const CACHE_TTL_MS = 30 * 1000;
let cache: { data: SiteSettings; at: number } | null = null;

export const SETTINGS_DEFAULTS: SiteSettings = {
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  address: `${SITE.address}, ${SITE.addressLocality}/${SITE.addressRegion}`,
  workingHours: SITE.workingHours,
};

export async function getSettings(): Promise<SiteSettings> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  try {
    const rows = await db.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const data: SiteSettings = {
      phone: map["phone"] || SETTINGS_DEFAULTS.phone,
      whatsapp: map["whatsapp"] || SETTINGS_DEFAULTS.whatsapp,
      email: map["email"] || SETTINGS_DEFAULTS.email,
      address: map["address"] || SETTINGS_DEFAULTS.address,
      workingHours: map["workingHours"] || SETTINGS_DEFAULTS.workingHours,
    };
    cache = { data, at: Date.now() };
    return data;
  } catch {
    return SETTINGS_DEFAULTS;
  }
}

export function invalidateSettingsCache(): void {
  cache = null;
}

/** "0537 720 13 45" → "tel:+90..." biçimi için normalize eder. */
export function telHref(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("0")) digits = `+90${digits.slice(1)}`;
  if (digits.startsWith("90")) digits = `+${digits}`;
  return `tel:${digits}`;
}

export function waHref(whatsapp: string, message?: string): string {
  let digits = whatsapp.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
