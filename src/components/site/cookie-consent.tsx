"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_META,
  CONSENT_OPEN_EVENT,
  FULL_CONSENT,
  NECESSARY_ONLY,
  persistConsent,
  readConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * Çerez onay sistemi (KVKK Kurulu çerez esasları):
 * - Küçük banner: "Tümüne İzin Ver", "Yalnızca Zorunlu Çerezler" ve
 *   "Çerez Ayarları" seçenekleri sunar.
 * - Gelişmiş ayar görünümü: kategorileri (zorunlu / fonksiyonel /
 *   ölçümleme / pazarlama) tek tek seçme imkânı verir; zorunlu çerezler
 *   kapatılamaz, diğerleri varsayılan olarak kapalıdır (yalnızca kaydedilen
 *   tercihe göre açılır).
 * - Tercih localStorage'da saklanır; window.__zrConsent ve
 *   "zr-consent-change" event'i ile diğer kodlar (ör. harita kapısı) dinler.
 * - Footer'daki "Çerez Ayarları" bağlantısı "zr-open-cookie-settings"
 *   event'ini göndererek bu pencereyi tekrar açar.
 */

/** Native input tabanlı, hydration-güvenli mini switch (Radix kullanmadan). */
function ConsentToggle({
  checked,
  disabled,
  onToggle,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        aria-label={label}
        className="peer h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-input/50 shadow-xs transition-colors outline-none checked:border-primary checked:bg-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
      />
    </span>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"banner" | "settings">("banner");
  const [prefs, setPrefs] = useState<ConsentState>(NECESSARY_ONLY);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      window.__zrConsent = stored;
      return;
    }
    // Küçük gecikme: sayfa yüklenmesini/LCP'yi bozmasın
    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  // Footer "Çerez Ayarları" tetikleyicisi: pencereyi ayar görünümünde açar
  useEffect(() => {
    const open = () => {
      setPrefs(readConsent() ?? NECESSARY_ONLY);
      setView("settings");
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const decide = useCallback((state: ConsentState) => {
    persistConsent(state);
    setVisible(false);
    setView("banner");
  }, []);

  const openSettings = useCallback(() => {
    setPrefs(readConsent() ?? NECESSARY_ONLY);
    setView("settings");
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setView("banner");
  }, []);

  if (!visible) return null;

  if (view === "settings") {
    return (
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Çerez ayarları"
        className="fixed inset-x-3 bottom-[4.75rem] z-40 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-xl border bg-card shadow-lg md:inset-x-auto md:bottom-4 md:right-4 md:max-w-md"
      >
        <div className="flex items-start gap-3 border-b p-4 md:p-5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15"
            aria-hidden="true"
          >
            <Settings2 className="size-4.5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Çerez Ayarları
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Kategorileri tek tek seçebilirsiniz. Zorunlu çerezler her zaman
              etkindir; isteğe bağlı çerezler varsayılan olarak kapalıdır.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Çerez ayarlarını kaydetmeden kapat"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <ul className="divide-y px-4 md:px-5">
          {CATEGORY_META.map((category) => (
            <li key={category.id} className="flex items-start gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                  {category.name}
                  {category.required ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <ShieldCheck className="size-3" aria-hidden="true" />
                      Her zaman etkin
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground/80">
                  Örnek: <span className="font-mono">{category.examples}</span>
                </p>
              </div>
              <ConsentToggle
                checked={category.required ? true : prefs[category.id]}
                disabled={category.required}
                onToggle={() =>
                  setPrefs((prev) => ({
                    ...prev,
                    [category.id]: !prev[category.id],
                  }))
                }
                label={`${category.name} - ${
                  category.required
                    ? "her zaman etkin"
                    : prefs[category.id]
                      ? "izin verildi"
                      : "izin verilmedi"
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t p-4 md:p-5">
          <Button
            className="w-full"
            onClick={() => decide(prefs)}
            aria-label="Seçilen çerez tercihlerini kaydet"
          >
            Tercihleri Kaydet
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => decide(FULL_CONSENT)}
            >
              Tümüne İzin Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => decide(NECESSARY_ONLY)}
            >
              Yalnızca Zorunlu
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setView("banner")}
            className="mx-auto flex items-center gap-1 rounded-sm pt-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Geri dön
          </button>
          <p className="pt-1 text-center text-[11px] leading-relaxed text-muted-foreground">
            Detaylar:{" "}
            <Link
              href="/cerez-politikasi"
              className="font-medium text-primary hover:underline"
            >
              Çerez Politikası
            </Link>
          </p>
        </div>
      </div>
    );
  }

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
              Sitemiz temel işleyiş için zorunlu çerezler kullanır. İsteğe
              bağlı çerezleri kategori bazında seçebilirsiniz. Detaylar:{" "}
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
            onClick={() => decide(NECESSARY_ONLY)}
            aria-label="Kapat ve yalnızca zorunlu çerezleri kabul et"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button size="sm" className="w-full" onClick={() => decide(FULL_CONSENT)}>
            Tümüne İzin Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => decide(NECESSARY_ONLY)}
          >
            Yalnızca Zorunlu Çerezler
          </Button>
        </div>
        <button
          type="button"
          onClick={openSettings}
          className="mx-auto mt-3 flex items-center gap-1.5 rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Settings2 className="size-3.5" aria-hidden="true" />
          Çerez Ayarları
        </button>
      </div>
    </div>
  );
}
