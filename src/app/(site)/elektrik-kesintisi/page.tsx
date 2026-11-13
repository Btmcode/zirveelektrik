import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Phone,
  PlugZap,
  Power,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getSettings, telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "İstanbul'da Elektrik Kesintisi: Ne Yapmalı, Kime Aramalı?",
    description:
      "Elektrik kesintisinde kimi aramalı, ne zaman gelir? Yakasına göre İstanbul dağıtım şirketi tablosu (BedaŞ, CK Boğaziçi, Ayedaş), 186 ihbar hattı ve kesintide güvenlik listesi. Tesisat kaynaklı arızalarda 7/24 elektrikçi.",
    alternates: { canonical: "/elektrik-kesintisi" },
  };
}

/**
 * Bu sayfa Google Ads negatif anahtar kelime raporundan beslenir:
 * "ayedaş telefon numarası", "elektrik ne zaman gelecek", "elektrik kesintisi
 * için nereyi arayacağız" gibi reklamlarda parasal israf olan tesis-dışı
 * aramalar, organikte tek rehber sayfayla yakalanır ve tesis-içi arızalara
 * (yani gerçek müşteriye) yönlendirilir.
 */

/** İlçeler ve hizmet verdikleri dağıtım şirketi (faturadan doğrulanmalı). */
const CK_BOGAZICI = [
  { name: "Beşiktaş", slug: "besiktas" },
  { name: "Beyoğlu", slug: "beyoglu" },
  { name: "Eyüpsultan", slug: "eyupsultan" },
  { name: "Kâğıthane", slug: "kagithane" },
  { name: "Sarıyer", slug: "sariyer" },
  { name: "Şişli", slug: "sisli" },
];

const BEDAS = [
  { name: "Arnavutköy", slug: "arnavutkoy" },
  { name: "Avcılar", slug: "avcilar" },
  { name: "Bağcılar", slug: "bagcilar" },
  { name: "Bahçelievler", slug: "bahcelievler" },
  { name: "Bakırköy", slug: "bakirkoy" },
  { name: "Başakşehir", slug: "basaksehir" },
  { name: "Bayrampaşa", slug: "bayrampasa" },
  { name: "Beylikdüzü", slug: "beylikduzu" },
  { name: "Büyükçekmece", slug: "buyukcekmece" },
  { name: "Çatalca", slug: "catalca" },
  { name: "Esenler", slug: "esenler" },
  { name: "Esenyurt", slug: "esenyurt" },
  { name: "Fatih", slug: "fatih" },
  { name: "Gaziosmanpaşa", slug: "gaziosmanpasa" },
  { name: "Güngören", slug: "gungoren" },
  { name: "Küçükçekmece", slug: "kucukcekmece" },
  { name: "Silivri", slug: "silivri" },
  { name: "Sultangazi", slug: "sultangazi" },
  { name: "Zeytinburnu", slug: "zeytinburnu" },
];

const AYEDAS = [
  { name: "Adalar", slug: "adalar" },
  { name: "Ataşehir", slug: "atasehir" },
  { name: "Beykoz", slug: "beykoz" },
  { name: "Çekmeköy", slug: "cekmekoy" },
  { name: "Kadıköy", slug: "kadikoy" },
  { name: "Kartal", slug: "kartal" },
  { name: "Maltepe", slug: "maltepe" },
  { name: "Pendik", slug: "pendik" },
  { name: "Sancaktepe", slug: "sancaktepe" },
  { name: "Şile", slug: "sile" },
  { name: "Sultanbeyli", slug: "sultanbeyli" },
  { name: "Tuzla", slug: "tuzla" },
  { name: "Ümraniye", slug: "umraniye" },
  { name: "Üsküdar", slug: "uskudar" },
];

const FAQS = [
  {
    id: "ne-zaman-gelir",
    question: "Elektrik ne zaman gelir, kime sorulur?",
    answer:
      "Tesis dışı kesintilerde elektrik, ilçenize hizmet veren dağıtım şirketinden (Ayedaş, BedaŞ veya CK Boğaziçi) gelir. Arıza ihbar hattı 186'yı arayarak veya dağıtım şirketinizin resmi web sitesi/mobil uygulamasından kesinti kaydı oluşturup tahmini süreyi öğrenebilirsiniz. Elektrik sadece sizin dairenizde yoksa sorun sizin tesisatınızdadır; bu durumda dağıtım şirketi değil elektrikçi gerekir.",
  },
  {
    id: "kime-ararim",
    question: "Elektrik kesintisinde kimi aramalıyım?",
    answer:
      "Önce kapsamı belirleyin: Komşuların elektriği de yoksa kesinti tesis dışıdır; ilçenizin dağıtım şirketinin arıza hattı olan 186'yı arayın. Komşularda elektrik var ama sizde yoksa sorun daire veya bina tesisatınızdır; ana sigortanızı kontrol edin ve gerekirse elektrikçi çağırın.",
  },
  {
    id: "sartel-kesinti",
    question: "Şalter atmış olabilir mi; kesinti mi tesisat arızası mı?",
    answer:
      "Panodaki ana sigortayı ve kaçak akım rölesini (COM) kontrol edin: hepsi yukarıda ve komşularda elektrik varken sizde yoksa arıza tesisatınızdadır. Kaçak akım rölesi sürekli atıyorsa tesisatta kaçak olabilir; tekrar tekrar kaldırmayın, elektrikçi çağırın.",
  },
  {
    id: "kesintide-guvenlik",
    question: "Kesinti sırasında evde ne yapmalıyım?",
    answer:
      "Isıtıcı, ütü ve çamaşır makinesi gibi cihazları fişten çekin; elektrik geldiğinde eşzamanlı yük şalter atmasın. Buzdolabı ve derin dondurucunun kapısını kapalı tutun; kapalı dondurucu gıdayı yaklaşık 24 saat, buzdolabı birkaç saat korur. Mum yerine batarya ile çalışan lamba kullanın.",
  },
  {
    id: "elektrikci-ne-zaman",
    question: "Hangi durumda kesinti değil elektrikçi gerekir?",
    answer:
      "Komşularda elektrik varken sizde yoksa, sigorta sürekli atıyorsa, elektrik geldiği hâlde bazı prizler veya lambalar çalışmıyorsa, prizden kıvılcım veya yanma kokusu geliyorsa sorun sizin tesisatınızdır. Bu durumlarda dağıtım şirketi değil, yerinde arıza tespiti yapan bir elektrikçi gerekir.",
  },
];

function DistrictChips({
  districts,
}: {
  districts: { name: string; slug: string }[];
}) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {districts.map((d) => (
        <li key={d.slug}>
          <Link
            href={`/bolgeler/${d.slug}`}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            {d.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function OutageGuidePage() {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const path = "/elektrik-kesintisi";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Elektrik Kesintisi Rehberi", url: path },
        ])}
      />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: `${SITE.url}${path}`,
          name: "İstanbul'da Elektrik Kesintisi: Ne Yapmalı, Kime Aramalı?",
          inLanguage: "tr-TR",
          about: { "@id": `${SITE.url}/#organization` },
          audience: {
            "@type": "Audience",
            audienceType:
              "İstanbul'da elektrik kesintisi yaşayan kişi",
          },
        }}
      />
      <Breadcrumbs items={[{ name: "Elektrik Kesintisi Rehberi", url: path }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/* Hero + kısa cevap (AEO) */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Elektrik Kesintisi Rehberi
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            İstanbul'da Elektrik Kesintisi: Ne Yapmalı, Kime Aramalı?
          </h1>
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-5">
            <p className="text-sm leading-relaxed text-foreground md:text-base">
              <strong>Kısa cevap:</strong> Elektriğin tamamen gitmesi çoğunlukla
              tesis dışı bir kesintidir ve sorumlusu ilçenize hizmet veren{" "}
              <strong>elektrik dağıtım şirketidir</strong> - Anadolu Yakası ve
              Adalar'da <strong>Ayedaş</strong>, Avrupa Yakası'nın kuzeyinde{" "}
              <strong>CK Boğaziçi Elektrik</strong>, güneyinde{" "}
              <strong>BedaŞ</strong> hizmet verir. Tüm Türkiye'de ortak arıza
              ihbar hattı <strong>186</strong>'dır. Elektrik yalnızca sizin
              dairenizde yoksa sorun sizin tesisatınızdadır; o zaman{" "}
              <strong>elektrikçi</strong> gerekir.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a
                href={telUrl}
                aria-label={`Tesisat arızası için ara: ${settings.phone}`}
              >
                <Phone className="size-4" aria-hidden="true" />
                Tesisat Arızası: {settings.phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/iletisim">
                Online Arıza Bildirimi
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mt-12 space-y-14 md:mt-16 md:space-y-16">
          {/* 1. Ayırım testi */}
          <section aria-labelledby="ayirim-testi">
            <h2
              id="ayirim-testi"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Kesinti mi, tesisat arızası mı? 60 saniyelik test
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              Bu üç adımı sırayla yapın; sonucu görmeden sigortayla oynamayın.
            </p>
            <ol className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                {
                  title: "1. Komşulara bakın",
                  text: "Aynı binada veya sokakta elektrik var mı? Herkeste yoksa kesinti tesis dışıdır; 186'yı arayın.",
                },
                {
                  title: "2. Panonuza bakın",
                  text: "Ana sigorta ve kaçak akım rölesi (COM) yukarıda mı? Aşağıya indiyseniz sorun binada veya dairenizdedir.",
                },
                {
                  title: "3. Kapsama bakın",
                  text: "Bazı prizler çalışıyor ama bazıları çalışmıyorsa daire içi tesisat arızasıdır.",
                },
              ].map((step) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* 2. Dağıtım şirketi haritası (GEO) */}
          <section aria-labelledby="dagitim-sirketi">
            <h2
              id="dagitim-sirketi"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              İstanbul'da hangi ilçeye hangi dağıtım şirketi bakar?
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              Tesis dışı kesintilerin ihbarı ve takibi dağıtım şirketinin
              görevidir. Aşağıdaki tablo yakalara göre dağılımı özetler; kesin
              doğrulamayı <strong>elektrik faturanızdaki</strong> şirketin
              adından yapabilirsiniz. Üç şirket için de ortak arıza ihbar hattı{" "}
              <strong>186</strong>'dır.
            </p>
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Ayedaş - Anadolu Yakası ve Adalar
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kadıköy, Üsküdar, Ümraniye, Ataşehir, Maltepe, Kartal, Pendik,
                  Tuzla, Sancaktepe, Sultanbeyli, Çekmeköy, Beykoz, Şile ve
                  Adalar ilçelerinde tesis dışı kesintiler Ayedaş'ın görevidir.
                </p>
                <DistrictChips districts={AYEDAS} />
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  CK Boğaziçi Elektrik - Avrupa Yakası'nın kuzeyi
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Şişli, Beşiktaş, Beyoğlu, Sarıyer, Kâğıthane ve Eyüpsultan
                  ilçelerinde tesis dışı kesintiler CK Boğaziçi'nin görevidir.
                </p>
                <DistrictChips districts={CK_BOGAZICI} />
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  BedaŞ - Avrupa Yakası'nın güneyi
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Esenyurt, Beylikdüzü, Avcılar, Başakşehir, Sultangazi, Bağcılar
                  ve çevre ilçelerde tesis dışı kesintiler BedaŞ'ın görevidir.
                </p>
                <DistrictChips districts={BEDAS} />
              </div>
            </div>
            <p className="mt-5 max-w-3xl">
              <Link
                href="/bolgeler"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Tüm 39 ilçe hizmet sayfaları
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </section>

          {/* 3. Kesintide güvenlik */}
          <section aria-labelledby="kesintide-guvenlik">
            <h2
              id="kesintide-guvenlik"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Kesinti sırasında 5 maddelik güvenlik listesi
            </h2>
            <ul className="mt-4 max-w-3xl space-y-3 leading-relaxed text-muted-foreground">
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Cihazları fişten çekin:
                  </strong>{" "}
                  ütü, ısıtıcı ve çamaşır makinesi gibi yüksek çekimli cihazlar
                  elektrik geldiğinde eşzamanlı yük şalter atmasın.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Soğutucuları kapalı tutun:
                  </strong>{" "}
                  buzdolabı ve dondurucu kapısı açılmazsa gıdalar saatlerce
                  korunur.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Mum yerine bataryalı lamba:
                  </strong>{" "}
                  yangın riskini sıfırlar; el feneri veya telefon lambası
                  yeterlidir.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Kaçak akım rölesi atıyorsa:
                  </strong>{" "}
                  kesintiden bağımsız bir kaçak arıza sinyalidir; tekrar tekrar
                  kaldırmayın.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Yanma kokusu ve kıvılcım:
                  </strong>{" "}
                  ana sigortayı indirin ve tesisat arızasında hemen elektrikçi
                  arayın.
                </span>
              </li>
            </ul>
          </section>

          {/* 4. Elektrik geldiğinde */}
          <section aria-labelledby="elektrik-geldiginde">
            <h2
              id="elektrik-geldiginde"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Elektrik geldiğinde ne yapmalı?
            </h2>
            <div className="mt-6 max-w-3xl space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Sigortaları sırayla açın
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Elektrik geldiğinde tüm sigortaları tek seferde değil, birkaç
                  dakika arayla sırayla kaldırın. Böylece hangi hat yük aldığında
                  sorun çıkarsa kolayca görürsünüz ve panoya ani yük binmez.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Cihazları kontrollü takın
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Fişten çektiğiniz cihazları önce birkaçını takıp birkaç dakika
                  bekleyin; sıçrayan bir sigorta varsa hangi cihazın buna yol
                  açtığını bulabilirsiniz.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Elektrik gelmediyse
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Komşularda elektrik var, sigortalarınız sağlam ama elektrik
                  sizde hâlâ yoksa tesisatta bir sorun var demektir. Bu
                  durumda elektrikçi gerekir.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Elektrikçi gerektiren durumlar (CTA) */}
          <section
            aria-labelledby="elektrikci-gerekir"
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 md:p-8"
          >
            <h2
              id="elektrikci-gerekir"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Bu durumlarda kesinti değil, elektrikçi gerektirir
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Aşağıdaki belirtiler tesis dışı kesintinin işaretleri değil,
              tesisat arızasıdır. Dağıtım şirketi bu arızalara müdahale etmez;
              yerinde arıza tespiti yapan bir elektrikçi gerekir.
            </p>
            <ul className="mt-4 space-y-2.5 leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Komşularda elektrik varken sizde yok:
                </strong>{" "}
                daire veya bina tesisatında arıza olabilir.
              </li>
              <li>
                <strong className="text-foreground">
                  Sigorta veya kaçak akım rölesi sürekli atıyor:
                </strong>{" "}
                kaçak, kısa devre veya aşırı yük işaretidir.
              </li>
              <li>
                <strong className="text-foreground">
                  Prizden kıvılcım, ısınma veya yanma kokusu geliyor:
                </strong>{" "}
                hemen ana sigortayı indirin; bu öncelikli müdahale gerektirir.
              </li>
              <li>
                <strong className="text-foreground">
                  Elektrik kısmi geliyor:
                </strong>{" "}
                bazı lambalar veya prizler çalışmıyorsa hat veya bağlantı
                arızası vardır.
              </li>
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a
                  href={telUrl}
                  aria-label={`Tesisat arızası için ara: ${settings.phone}`}
                >
                  <Phone className="size-4" aria-hidden="true" />
                  7/24 Elektrikçi: {settings.phone}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/iletisim">
                  Online Arıza Bildirimi
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>

          {/* SSS */}
          <section aria-labelledby="sss-bolumu">
            <SectionHeading
              eyebrow="Sıkça Sorulan Sorular"
              title="Elektrik Kesintisi Hakkında Merak Edilenler"
              description="Elektrik kesintilerinde kime aramalı, ne zaman elektrikçi gerekir gibi soruların kısa cevapları."
            />
            <div className="mt-6 max-w-3xl">
              <FaqAccordion faqs={FAQS} />
            </div>
          </section>

          {/* İlgili içerikler */}
          <section aria-labelledby="ilgili-icerikler">
            <h2
              id="ilgili-icerikler"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              İlgili içerikler
            </h2>
            <ul className="mt-4 max-w-3xl space-y-2.5 leading-relaxed text-muted-foreground">
              <li>
                <Link
                  href="/blog/sigorta-surekli-atiyor-neden-ve-cozumleri"
                  className="text-primary hover:underline"
                >
                  Sigorta sürekli atıyor: nedenleri ve çözümleri
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/evin-yarisinda-elektrik-yok-cozumu"
                  className="text-primary hover:underline"
                >
                  Evin yarısında elektrik var, yarısında yok: çözümü
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/gece-elektrikcisi-hafta-sonu-acil-servis"
                  className="text-primary hover:underline"
                >
                  Gece elektrikçisi ve hafta sonu acil servis
                </Link>
              </li>
            </ul>
          </section>

          <div className="mt-14 flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-xs">
              <MapPin className="mr-1.5 size-3" aria-hidden="true" />
              İstanbul'un 39 ilçesinde tesisat arızalarında hizmet
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Power className="mr-1.5 size-3" aria-hidden="true" />
              Kesinti ihbarı: 186
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <PlugZap className="mr-1.5 size-3" aria-hidden="true" />
              Tesisat arızaları: 7/24 elektrikçi
            </Badge>
          </div>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
