import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSettings, telHref, waHref } from "@/lib/settings";

const GUARANTEES = ["Garantili İşçilik", "Aynı Gün Servis", "Şeffaf Fiyat"] as const;

/** Ana sayfa hero bölümü - 2 kolonlu, mobilde tek kolon. */
export async function Hero() {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const waUrl = waHref(
    settings.whatsapp,
    "Merhaba, elektrik arıza talebi oluşturmak istiyorum."
  );

  return (
    <section
      aria-label="İstanbul acil elektrikçi hizmeti"
      className="bg-gradient-to-b from-amber-50 to-background"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        {/* Sol - metin ve CTA'lar */}
        <div>
          <Badge className="gap-1.5 px-3 py-1 text-xs">
            <Zap className="size-3.5" aria-hidden="true" />
            İstanbul 7/24 Acil Elektrikçi
          </Badge>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            İstanbul Elektrikçi - 7/24 Arıza Tespiti ve Anında Çözüm
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sigorta atması, elektrik kaçağı, pano arızası ya da priz sorunu...
            Telefonla arayın, arızanızı anlatın; ustalarımız adresinize gelsin.
            Yerinde tespit yapar, net fiyat teklifi sunar, onayınızla garantili
            şekilde çözeriz.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="text-base">
              <a href={telUrl} aria-label={`Hemen ara: ${settings.phone}`}>
                <Phone className="size-5" aria-hidden="true" />
                Hemen Ara
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base text-green-700 hover:text-green-800"
            >
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile arıza bildir"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base">
              <Link href="/iletisim">Arıza Bildir</Link>
            </Button>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2" aria-label="Güven güvenceleri">
            {GUARANTEES.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ - markalı görsel + yüzen mini kart */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-amber-100 via-amber-50 to-background shadow-lg">
            <Image
              src="/images/hero.jpg"
              alt="Zirve Elektrik ustası markalı formasıyla dairesinde avize montajı yaparken; camda 7/24 servis aracımız görünüyor"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg md:left-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">7/24 Hizmet</p>
              <p className="text-xs text-muted-foreground">
                Gece gündüz her an yanınızdayız
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
