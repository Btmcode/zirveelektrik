import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllDistricts, getAllServices } from "@/lib/queries";
import { getSettings, telHref, waHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

const SOCIAL_LINKS = [
  { href: SITE.social.instagram, label: "Instagram", icon: Instagram },
  { href: SITE.social.facebook, label: "Facebook", icon: Facebook },
  { href: SITE.social.x, label: "X (Twitter)", icon: Twitter },
];

/** Alt bardaki yasal sayfa bağlantıları (Türkiye mevzuatı uygunluğu). */
const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik & KVKK" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

export async function Footer() {
  const [settings, services, districts] = await Promise.all([
    getSettings(),
    getAllServices(),
    getAllDistricts(),
  ]);

  const telUrl = telHref(settings.phone);
  const waUrl = waHref(settings.whatsapp, "Merhaba, elektrik arıza talebi oluşturmak istiyorum.");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 md:py-16 lg:grid-cols-4 lg:px-8">
        {/* 1 - Marka */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-white p-2.5 shadow-md focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Zirve Elektrik - ana sayfa"
          >
            <Image
              src="/logo.png"
              alt="Zirve Elektrik"
              width={96}
              height={96}
              className="size-11 object-contain"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {SITE.shortDescription} İstanbul'un 39 ilçesinde yerinde arıza tespiti,
            net fiyat teklifi ve garantili işçilik.
          </p>
          <ul className="mt-5 flex gap-2" aria-label="Sosyal medya bağlantıları">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Zirve Elektrik ${social.label}`}
                  className="flex size-10 items-center justify-center rounded-md bg-zinc-800 text-zinc-300 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 - Hizmetler */}
        <nav aria-label="Hizmetler">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-50">
            Hizmetler
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="text-zinc-400 transition-colors hover:text-primary"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 - Popüler bölgeler */}
        <nav aria-label="Hizmet bölgeleri">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-50">
            Popüler Bölgeler
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {districts.slice(0, 12).map((district) => (
              <li key={district.id}>
                <Link
                  href={`/bolgeler/${district.slug}`}
                  className="text-zinc-400 transition-colors hover:text-primary"
                >
                  {district.name} Elektrikçi
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 4 - İletişim */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-50">
            İletişim
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-zinc-400">{settings.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={telUrl}
                className="font-bold tabular-nums text-zinc-100 transition-colors hover:text-primary"
                aria-label={`Telefon: ${settings.phone}`}
              >
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-primary"
                aria-label="WhatsApp ile yaz"
              >
                WhatsApp Destek
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`mailto:${settings.email}`}
                className="text-zinc-400 transition-colors hover:text-primary"
                aria-label={`E-posta: ${settings.email}`}
              >
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-zinc-400">{settings.workingHours}</span>
              <Badge className="text-xs">7/24 Acil</Badge>
            </li>
          </ul>
        </div>
      </div>

      {/* Alt bar - mobilde çağrı çubuğu için ek boşluk (DESIGN.md §5) */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 pb-24 pt-6 text-xs text-zinc-500 sm:flex-row sm:px-6 md:pb-6 lg:px-8">
          <p>
            © {year} Zirve Elektrik - zirveelektrik.net. Tüm hakları saklıdır.
          </p>
          <nav aria-label="Yasal sayfalar">
            <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
              {LEGAL_LINKS.map((link, index) => (
                <li key={link.href} className="flex items-center">
                  {index > 0 && (
                    <span aria-hidden="true" className="mx-1.5 text-zinc-700">
                      •
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
