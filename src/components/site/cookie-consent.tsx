"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Çerez onay sistemi (KVKK Kurulu çerez esasları):
 * - Zorunlu olmayan çerezler (analitik, reklam ölçümleme) yalnızca
 *   açık rızayla yüklenebilir. Şu an site zorunlu olmayan çerez
 *   kullanmıyor; sistem Google Ads ölçümleme eklenirse rıza durumunu
 *   gtag entegrasyonuna hazır tutar.
 * - Tercih localStorage'da saklanır; window.__zrConsent ve
 *   "zr-consent-change" event'i ile diğer kodlar dinleyebilir.
 */

const STORAGE_KEY = "zr-cookie-consent";
export type ConsentValue = "accepted" | "necessary";

declare global {
  interface Window {
    __zrConsent?: ConsentValue;
  }
}

function persistConsent(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    window.__zrConsent = value;
    window.dispatchEvent(new CustomEvent("zr-consent-change", { detail: value }));
  } catch {
    // localStorage kapalıysa sessizce geç: banner tekrar gösterilir
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "necessary") {
        window.__zrConsent = stored;
      }
    } catch {
      stored = null;
    }
    if (stored !== "accepted" && stored !== "necessary") {
      // Küçük gecikme: sayfa yüklenmesini/LCP'yi bozmasın
      const timer = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const decide = useCallback((value: ConsentValue) => {
    persistConsent(value);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Çerez tercihi"
      className="fixed inset-x-3 bottom-[4.75rem] z-40 md:inset-x-auto md:bottom-4 md:right-4 md:max-w-md"
    >
      <div className="rounded-xl border bg-card p-4 shadow-lg md:p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15"
            aria-hidden="true"
          >
            <Cookie className="size-4.5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Çerez Tercihleriniz
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sitemiz temel işleyiş için zorunlu çerezler kullanır. Deneyimi
              iyileştirmek ve hizmet kalitemizi ölçmek için isteğe bağlı
              çerezlere izin verebilirsiniz. Detaylar:{" "}
              <Link
                href="/cerez-politikasi"
                className="font-medium text-primary hover:underline"
              >
                Çerez Politikası
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={() => decide("necessary")}
            aria-label="Kapat ve yalnızca zorunlu çerezleri kabul et"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button size="sm" className="w-full" onClick={() => decide("accepted")}>
            Tümüne İzin Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => decide("necessary")}
          >
            Yalnızca Zorunlu Çerezler
          </Button>
        </div>
      </div>
    </div>
  );
}
