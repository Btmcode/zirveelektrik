"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONSENT_CHANGE_EVENT, hasConsent } from "@/lib/consent";

/**
 * Google Haritalar rıza kapısı:
 * - "fonksiyonel" kategorisine rıza verilmişse harita otomatik yüklenir.
 * - Rıza yoksa harita YÜKLENMEZ; kullanıcıya "Haritayı Yükle" tek seferlik
 *   yükleme seçeneği sunulur (KVKK Kurulu çerez esasları - üçüncü taraf
 *   gömme yalnızca kullanıcı talebiyle devreye alınır).
 * - Çerez tercihleri değişirse ("zr-consent-change") bileşen kendini günceller.
 */
export function MapEmbed({
  embedUrl,
  directionsUrl,
}: {
  embedUrl: string;
  directionsUrl: string;
}) {
  const [allowed, setAllowed] = useState(false);
  const [manualLoad, setManualLoad] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasConsent("functional"));
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  if (allowed || manualLoad) {
    return (
      <iframe
        src={embedUrl}
        title="Zirve Elektrik konumu - Google Haritalar"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-56 w-full border-0 sm:h-64"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className="flex h-56 flex-col items-center justify-center gap-3 bg-muted/40 px-4 text-center sm:h-64"
      role="region"
      aria-label="Google Haritalar haritası - yükleme izni bekleniyor"
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
        aria-hidden="true"
      >
        <MapPin className="size-5 text-primary" />
      </span>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Harita harici bir Google servisidir ve{" "}
        <Link
          href="/cerez-politikasi"
          className="font-medium text-primary hover:underline"
        >
          fonksiyonel çerez izniyle
        </Link>{" "}
        yüklenir. İzninizi vermek istemiyorsanız yol tarifi bağlantısını
        kullanabilirsiniz.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="sm" onClick={() => setManualLoad(true)}>
          <ShieldCheck className="size-4" aria-hidden="true" />
          Haritayı Yükle
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Haritalar'da yol tarifi al"
          >
            Yol Tarifi Al
          </a>
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground/80">
        "Haritayı Yükle" tek seferliktir; kalıcı izin için çerez ayarlarınızdan
        fonksiyonel çerezleri açabilirsiniz.
      </p>
    </div>
  );
}
