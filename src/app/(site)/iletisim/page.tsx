import type { Metadata } from "next";
import {
  AlertTriangle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { RequestForm } from "@/components/site/request-form";
import { CtaBanner } from "@/components/site/cta-banner";
import { getActiveFaqs, getDistrictNames, getServiceTitles } from "@/lib/queries";
import { getSettings, telHref, waHref } from "@/lib/settings";
import { MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "İletişim - Arıza Bildirimi",
    description:
      "Zirve Elektrik'e telefon, WhatsApp veya arıza bildirim formuyla ulaşın. İstanbul genelinde 7/24 acil elektrikçi hizmeti için bizi arayın.",
    alternates: { canonical: "/iletisim" },
  };
}

export default async function ContactPage() {
  const [settings, districts, services, faqs] = await Promise.all([
    getSettings(),
    getDistrictNames(),
    getServiceTitles(),
    getActiveFaqs(),
  ]);

  const telUrl = telHref(settings.phone);
  const waUrl = waHref(
    settings.whatsapp,
    "Merhaba, elektrik arıza talebi oluşturmak istiyorum."
  );

  const contactItems = [
    {
      icon: MapPin,
      label: "Adres",
      value: settings.address,
      href: null as string | null,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone,
      href: telUrl,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: waUrl,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: settings.workingHours,
      href: null as string | null,
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE.url}/iletisim`,
          name: "İletişim | Zirve Elektrik",
          inLanguage: "tr-TR",
          about: { "@id": `${SITE.url}/#organization` },
        }}
      />
      <Breadcrumbs items={[{ name: "İletişim", url: "/iletisim" }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            İletişim
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Arıza Bildirin, Hemen Dönelim
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Telefonla arayın, WhatsApp'tan yazın veya formu doldurun - hangisi
            kolayınıza geliyorsa. Ustalarımız 7/24 görev başında.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Sol - form */}
          <RequestForm
            districts={districts.map((d) => d.name)}
            services={services.map((s) => s.title)}
          />

          {/* Sağ - iletişim bilgileri */}
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                İletişim Bilgileri
              </h2>
              <ul className="mt-5 space-y-4">
                {contactItems.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="size-4 text-primary" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                          aria-label={`${item.label}: ${item.value}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Badge className="text-xs">7/24 Acil Servis</Badge>
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <iframe
                src={MAPS_EMBED_URL}
                title="Zirve Elektrik konumu - Google Haritalar"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0 sm:h-64"
                allowFullScreen
              />
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Sultangazi merkezli</span> hizmet; Avrupa ve Anadolu Yakası'nın tamamına aynı gün ulaşım.
                </p>
                <Button asChild variant="outline">
                  <a
                    href={MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google Haritalar'da yol tarifi al"
                  >
                    <MapPin className="size-4" aria-hidden="true" />
                    Yol Tarifi Al
                  </a>
                </Button>
              </div>
            </Card>

            <aside
              aria-label="Acil durum bilgilendirmesi"
              className="rounded-xl border border-destructive/30 bg-destructive/10 p-6"
            >
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
                Acil Arıza mı?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sigorta sürekli atıyor, yanma kokusu veya kıvılcım var mı? Form
                yerine doğrudan arayın - acil durumlar öncelikli müdahale edilir.
              </p>
              <Button asChild className="mt-4 w-full">
                <a href={telUrl} aria-label={`Acil hattı: ${settings.phone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  {settings.phone}
                </a>
              </Button>
            </aside>

            {faqs.length > 0 ? (
              <Card className="p-6 md:p-8">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Merak Edilenler
                </h2>
                <div className="mt-2">
                  <FaqAccordion faqs={faqs.slice(0, 3)} />
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
