"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/**
 * "Çerez Ayarları" tetikleyicisi: çerez onay penceresini ayar görünümünde
 * yeniden açar (KVKK - rızayı dilediği zaman geri alma hakkı).
 * Footer sunucu bileşeni olduğu için event gönderen ince bir istemci
 * bileşeni olarak ayrıştırıldı.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Çerez Ayarları
    </button>
  );
}
