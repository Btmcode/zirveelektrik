import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Timer,
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
      "En Yakın Elektrikçi | İstanbul 7/24 Yerinde Arıza Tespiti - Zirve Elektrik",
    description:
      "İstanbul'da en yakın elektrikçi arıyorsanız: 39 ilçeye aynı gün hizmet, Avrupa Yakası'nda ortalama 30-60 dakika varış, ücretsiz keşif, net fiyat ve garantili işçilik. 7/24 nöbetçi elektrikçi.",
    alternates: { canonical: "/en-yakin-elektrikci" },
  };
}

/** İki yakada öne çıkan ilçe bağlantıları (kalanlar /bolgeler sayfasında). */
const EUROPE_DISTRICTS = [
  { name: "Sultangazi", slug: "sultangazi" },
  { name: "Bağcılar", slug: "bagcilar" },
  { name: "Esenler", slug: "esenler" },
  { name: "Gaziosmanpaşa", slug: "gaziosmanpasa" },
  { name: "Eyüpsultan", slug: "eyupsultan" },
  { name: "Kâğıthane", slug: "kagithane" },
  { name: "Başakşehir", slug: "basaksehir" },
  { name: "Küçükçekmece", slug: "kucukcekmece" },
  { name: "Bahçelievler", slug: "bahcelievler" },
  { name: "Bayrampaşa", slug: "bayrampasa" },
  { name: "Zeytinburnu", slug: "zeytinburnu" },
  { name: "Arnavutköy", slug: "arnavutkoy" },
];

const ANATOLIA_DISTRICTS = [
  { name: "Üsküdar", slug: "uskudar" },
  { name: "Kadıköy", slug: "kadikoy" },
  { name: "Ümraniye", slug: "umraniye" },
  { name: "Ataşehir", slug: "atasehir" },
  { name: "Maltepe", slug: "maltepe" },
  { name: "Kartal", slug: "kartal" },
  { name: "Pendik", slug: "pendik" },
  { name: "Tuzla", slug: "tuzla" },
  { name: "Sancaktepe", slug: "sancaktepe" },
  { name: "Sultanbeyli", slug: "sultanbeyli" },
  { name: "Çekmeköy", slug: "cekmekoy" },
  { name: "Beykoz", slug: "beykoz" },
];

const FAQS = [
  {
    id: "varis-suresi",
    question: "En yakın elektrikçi ne kadar sürede gelir?",
    answer:
      "Avrupa Yakası'nda ortalama varış süresi 30-60 dakikadır; Sultangazi ve çevre ilçelerde bu süre daha kısadır. Anadolu Yakası'nda aynı gün randevulu hizmet veriyoruz. Trafik ve yoğunluğa göre değişebilir; aradığınızda güncel varış süresini telefonda söylüyoruz.",
  },
  {
    id: "kesif-ucreti",
    question: "Keşif için ayrıca ücret ödüyor muyum?",
    answer:
      "Hayır, İstanbul içi keşif ücretsizdir. Ustamız yerinde arızayı inceleyip net fiyatı söyler; onayınız alınmadan işçiliğe başlanmaz.",
  },
  {
    id: "gece-hizmet",
    question: "Gece veya hafta sonu da elektrikçi geliyor mu?",
    answer:
      "Evet, 7/24 nöbetçi elektrikçi hizmeti veriyoruz. Gece ve tatil tarifesi konusunda fark varsa iş öncesi telefonda açıkça bildirilir; sonradan sürpriz ek ücret çıkmaz.",
  },
  {
    id: "hizmet-bolgesi",
    question: "Hangi bölgelere hizmet veriyorsunuz?",
    answer:
      "İstanbul'un 39 ilçesinin tamamına hizmet veriyoruz. Sultangazi merkezli ekibimiz Avrupa Yakası'nda aynı saatte, Anadolu Yakası'nda aynı gün yerinde olur.",
  },
];

export default async function NearestElectricianPage() {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const path = "/en-yakin-elektrikci";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "En Yakın Elektrikçi", url: path },
        ])}
      />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: `${SITE.url}${path}`,
          name: "En Yakın Elektrikçi | İstanbul 7/24",
          inLanguage: "tr-TR",
          about: { "@id": `${SITE.url}/#organization` },
          audience: {
            "@type": "Audience",
            audienceType: "İstanbul'da acil elektrikçi arayanlar",
          },
        }}
      />
      <Breadcrumbs items={[{ name: "En Yakın Elektrikçi", url: path }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/* Hero + kısa cevap (AEO) */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            7/24 Nöbetçi Elektrikçi
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            İstanbul'da En Yakın Elektrikçi: Aynı Gün Yerinde Tespit
          </h1>
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-5">
            <p className="text-sm leading-relaxed text-foreground md:text-base">
              <strong>Kısa cevap:</strong> Zirve Elektrik, Sultangazi merkezli
              ekibiyle İstanbul'un <strong>39 ilçesine</strong> aynı gün hizmet
              verir; Avrupa Yakası'nda ortalama <strong>30-60 dakika</strong>,
              Anadolu Yakası'nda aynı gün randevu ile yerinde olur. "En yakın
              elektrikçi" aramalarında belirleyici olan mesafe değil,{" "}
              <strong>varış süresi ve arızanın ilk girişte çözülmesidir</strong>{" "}
              - ikisini de biz sağlıyoruz.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={telUrl} aria-label={`Hemen ara: ${settings.phone}`}>
                <Phone className="size-4" aria-hidden="true" />
                {settings.phone}
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
          {/* Neden önemli */}
          <section aria-labelledby="neden-onemli">
            <h2
              id="neden-onemli"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              "En yakın elektrikçi" araması neden önemli?
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              Elektrik arızası zamanla büyüyen bir sorundur: buzdolabı ve
              derin dondurucuda gıda bozulur, kombi kapanınca ev soğur,
              işyerlerinde üretim durur. Yakın bir ekip yalnızca daha hızlı
              varmakla kalmaz; arızanın kaynağını yerinde görüp aynı girişte
              çözecek malzemeyi de yanında taşır. Bu yüzden arama
              sonuçlarında "en yakın" vurgusu yapılır - ama dürüst bir
              firmada yakınlık, şeffaf fiyat ve garanti ile birlikte gelir.
            </p>
          </section>

          {/* Nasıl en yakın oluruz */}
          <section aria-labelledby="yakinlik">
            <h2
              id="yakinlik"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Zirve Elektrik size nasıl "en yakın" olur?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MapPin,
                  title: "Sultangazi Merkez",
                  text: "Avrupa Yakası'nın kalbinde merkez; çevre ilçelere aynı saat içinde sevkıyat.",
                },
                {
                  icon: Timer,
                  title: "2 Dakikada Adres",
                  text: "Telefonda adres ve arıza bilgisi alınıp en yakın uygun usta hemen yönlendirilir.",
                },
                {
                  icon: BadgeCheck,
                  title: "Stoklu Araçlar",
                  text: "En sık görülen arızalar (sigorta, priz, kaçak) ilk girişte, araç stokundan çözülür.",
                },
                {
                  icon: ShieldCheck,
                  title: "Keşif + Net Fiyat",
                  text: "Yerinde ücretsiz keşif, onayınızla net fiyat; garanti belgeli işçilik.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <span
                    className="flex size-10 items-center justify-center rounded-lg bg-primary/10"
                    aria-hidden="true"
                  >
                    <item.icon className="size-5 text-primary" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* İlçeler */}
          <section aria-labelledby="bolgeler-bolumu">
            <h2
              id="bolgeler-bolumu"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Hangi ilçelere "aynı gün" geliyoruz?
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              Aşağıdaki ilçelerde aynı gün hizmet veriyoruz; İstanbul'un 39
              ilçesinin tamamı servis ağımızdadır. İlçenize özel sayfadan
              bölgenizdeki hizmetleri görebilirsiniz.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Avrupa Yakası
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {EUROPE_DISTRICTS.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/bolgeler/${d.slug}`}
                        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {d.name} elektrikçi
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Anadolu Yakası
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ANATOLIA_DISTRICTS.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/bolgeler/${d.slug}`}
                        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {d.name} elektrikçi
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-5">
              <Link
                href="/bolgeler"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Tüm 39 ilçe hizmet sayfaları
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </section>

          {/* Nelere dikkat */}
          <section aria-labelledby="dikkat">
            <h2
              id="dikkat"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              "En yakın elektrikçi" ararken nelere dikkat etmeli?
            </h2>
            <ul className="mt-4 max-w-3xl space-y-3 leading-relaxed text-muted-foreground">
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Gerçek firma olup olmadığını doğrulayın:
                  </strong>{" "}
                  telefonu arayın, adres sorun, web sitesi ve Google profili
                  olsun. "Yakın usta" yazıp adres vermeyen ilanlara itibar
                  etmeyin.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Fiyatı iş öncesi isteyin:
                  </strong>{" "}
                  keşfeden usta net fiyat söylemeli; "çıkınca konuşuruz"
                  diyen firmadan uzak durun.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    Garanti ve fatura şart:
                  </strong>{" "}
                  işçilik garantisi ve fatura, hem kalite hem hak arama
                  güvencesidir.
                </span>
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-foreground">
                    7/24 ulaşılabilirliği test edin:
                  </strong>{" "}
                  acil arızalar saat seçmez; nöbetçi hattı olan firmayı
                  arayın.
                </span>
              </li>
            </ul>
          </section>

          {/* Acil durum */}
          <section
            aria-labelledby="acil-durum"
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 md:p-8"
          >
            <h2
              id="acil-durum"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              Acil durumda ilk dakikalar
            </h2>
            <ul className="mt-4 space-y-2.5 leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Sigorta sürekli atıyorsa:
                </strong>{" "}
                panoya tekrar tekrar dokunmayın; üst üste atma, kaçak veya
                kısa devre işaretidir.
              </li>
              <li>
                <strong className="text-foreground">
                  Yanma kokusu veya kıvılcım varsa:
                </strong>{" "}
                ana sigortayı indirin ve hemen arayın - bu durumlar öncelikli
                müdahale gerektirir.
              </li>
              <li>
                <strong className="text-foreground">
                  Elektrik tamamen yoksa:
                </strong>{" "}
                önce daire sigortasını kontrol edin; daire sigortası
                düzgünse binanın ortak sigortasına bakmak gerekebilir.
              </li>
            </ul>
            <Button asChild className="mt-5 w-full">
              <a href={telUrl} aria-label={`Acil hattı: ${settings.phone}`}>
                <Phone className="size-4" aria-hidden="true" />
                Acil Elektrikçi: {settings.phone}
              </a>
            </Button>
          </section>

          {/* Adımlar */}
          <section aria-labelledby="nasil-cagiririm">
            <h2
              id="nasil-cagiririm"
              className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
            >
              En yakın elektrikçi nasıl çağırılır? 4 adım
            </h2>
            <ol className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
              {[
                "Arayın ya da WhatsApp'tan yazın: adres ve arıza özetini iletin.",
                "Telefonda tahmini varış süresi ve fiyat aralığını alın.",
                "Aynı gün keşif: usta yerinde sorunu görür, net fiyat verir.",
                "Onayınızla işçilik; garanti belgeli, faturalı teslim.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* SSS */}
          <section aria-labelledby="sss-bolumu">
            <SectionHeading
              eyebrow="Sıkça Sorulan Sorular"
              title="Merak Edilenler"
              description="En yakın elektrikçi hizmetiyle ilgili sık sorulan soruların kısa cevapları."
            />
            <div className="mt-6 max-w-3xl">
              <FaqAccordion faqs={FAQS} />
            </div>
          </section>
        </div>

        <div className="mt-14">
          <Badge variant="secondary" className="text-xs">
            <MapPin className="mr-1.5 size-3" aria-hidden="true" />
            Sultangazi merkezli - İstanbul'un 39 ilçesine aynı gün hizmet
          </Badge>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
