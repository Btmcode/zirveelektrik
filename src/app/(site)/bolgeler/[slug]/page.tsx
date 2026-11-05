import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Clock3,
  ListChecks,
  MapPin,
  Send,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { MarkdownContent } from "@/components/site/markdown";
import { CtaBanner } from "@/components/site/cta-banner";
import { ContactCtaCard } from "@/components/site/contact-cta-card";
import { ReviewsStrip } from "@/components/site/reviews-strip";
import {
  districtServiceSchema,
  faqSchema,
  localBusinessSchema,
} from "@/lib/schema";
import {
  getAllServices,
  getApprovedTestimonials,
  getDistrictBySlug,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import streetsData from "@/data/istanbul-sokaklar.json";

export const dynamic = "force-dynamic";

const STREETS = streetsData as Record<string, string[]>;
/** Her mahallede ilk N sokak gösterilir; kalanı özet cümlede sayılır. */
const MAX_STREET_CHIPS = 12;

interface DistrictDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DistrictDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const district = await getDistrictBySlug(slug);
  if (!district) {
    return { title: "Bölge Bulunamadı", robots: { index: false, follow: false } };
  }
  return {
    // Admin metaTitle marka içeriyorsa şablonla çiftlenmesin → absolute
    title: district.metaTitle
      ? { absolute: district.metaTitle }
      : `${district.name} Elektrikçi - 7/24 Acil Servis`,
    description:
      district.metaDescription ||
      `${district.name} ve tüm mahallelerinde 7/24 acil elektrikçi hizmeti. Yerinde arıza tespiti, net fiyat teklifi, garantili işçilik. Zirve Elektrik aynı gün servis.`,
    alternates: { canonical: `/bolgeler/${district.slug}` },
  };
}

export default async function DistrictDetailPage({
  params,
}: DistrictDetailPageProps) {
  const { slug } = await params;
  const [district, services, settings, testimonials] = await Promise.all([
    getDistrictBySlug(slug),
    getAllServices(),
    getSettings(),
    getApprovedTestimonials(),
  ]);

  if (!district) notFound();

  const neighborhoods = district.neighborhoods
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  // Mahalle bazlı sokak kapsamı (UAVT dökümü) — GEO/AEO için doğrulanabilir
  // istatistik: "X mahalle, Y sokak" iddiası gerçek veriye dayanır.
  const neighborhoodRows = neighborhoods.map((name) => {
    const streets = STREETS[`${district.name}|${name}`] ?? [];
    return { name, streets };
  });
  const coveredStreets = neighborhoodRows.reduce(
    (sum, row) => sum + row.streets.length,
    0
  );
  const sideLabel =
    district.side === "ANADOLU" ? "Anadolu Yakası" : "Avrupa Yakası";

  // İlçe SSS: sorular veri tabanlı üretilir; yanıt motorları (AEO) soru-başlık
  // + kısa doğrudan yanıt biçimini alıntılamayı sever.
  const districtFaqs = [
    {
      question: `${district.name}'de 7/24 acil elektrikçi hizmeti var mı?`,
      answer: `Evet. Zirve Elektrik, ${district.name} ilçesinin ${neighborhoods.length} mahallesinde gece, hafta sonu ve resmî tatiller dahil 7/24 acil servis verir. Acil durumda ${SITE.phone} numarasından nöbetçi ustaya doğrudan ulaşılır.`,
    },
    {
      question: `${district.name}'in hangi mahallelerine hizmet veriyorsunuz?`,
      answer: `${district.name}'in ${neighborhoods.length} mahallesinin tamamında hizmet veriyoruz${
        neighborhoodRows.length > 0
          ? `; cadde düzeyinde kayıtlı ${coveredStreets} sokak kapsamındayız`
          : ""
      }. Başlıca mahalleler: ${neighborhoods
        .slice(0, 10)
        .join(", ")}. Mahalleniz listede yoksa yine de arayın; aynı gün servis planlanır.`,
    },
    {
      question: `${district.name}'de elektrikçi çağırmak ne kadar?`,
      answer: `Keşif ve arıza tespiti ${district.name}'de yerinde yapılır; fiyat, arızanın kapsamı netleştikte teklif edilir. Sigorta değişimi, kaçak tespiti ve pano yenileme gibi yaygın işlerin 2026 fiyat aralıkları için acil elektrikçi fiyatları rehberimize bakabilirsiniz.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={localBusinessSchema({
          phone: settings.phone,
          reviews: testimonials.map((testimonial) => ({
            author: testimonial.name,
            content: testimonial.content,
            rating: testimonial.rating,
          })),
        })}
      />
      <JsonLd
        data={districtServiceSchema({
          districtSlug: district.slug,
          districtName: district.name,
          neighborhoods,
          serviceNames: services.slice(0, 10).map((s) => s.title),
        })}
      />
      <JsonLd data={faqSchema(districtFaqs)} />
      <Breadcrumbs
        items={[
          { name: "Bölgeler", url: "/bolgeler" },
          { name: `${district.name} Elektrikçi`, url: `/bolgeler/${district.slug}` },
        ]}
      />

      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Ana içerik */}
          <div className="lg:col-span-2">
            <header>
              <p className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
                <MapPin className="size-4" aria-hidden="true" />
                {sideLabel}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {district.name} Elektrikçi - 7/24 Acil Servis
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Zirve Elektrik olarak {district.name} ilçesinin{" "}
                {neighborhoods.length} mahallesinde — mahalle bazında{" "}
                {coveredStreets > 0 ? `kayıtlı ${coveredStreets} sokağında` : "tüm sokaklarında"} —
                7/24 acil elektrikçi ve arıza tespiti hizmeti veriyoruz. Aynı
                gün servis, yerinde tespit, net fiyat teklifi ve garantili
                işçilik.
              </p>
            </header>

            {/* Hızlı bilgiler: AEO için doğrudan alıntılanabilir gerçekler */}
            <section
              aria-label={`${district.name} hizmet özeti`}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                { icon: Zap, label: "Hizmet kapsamı", value: `${neighborhoods.length} mahalle` },
                {
                  icon: ListChecks,
                  label: "Sokak/cadde",
                  value: coveredStreets > 0 ? `${coveredStreets} kayıt` : "Tüm sokaklar",
                },
                { icon: Clock3, label: "Servis saati", value: "7/24 nöbetçi" },
                {
                  icon: MapPin,
                  label: "Yaka",
                  value: sideLabel.replace(" Yakası", ""),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border bg-card p-3.5 text-center sm:text-left"
                >
                  <Icon
                    className="mx-auto size-4 text-primary sm:mx-0"
                    aria-hidden="true"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </section>

            <div className="mt-8">
              <MarkdownContent content={district.content} />
            </div>

            {neighborhoodRows.length > 0 ? (
              <section aria-label={`${district.name} mahalleleri`} className="mt-10">
                <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {district.name} Mahallelerinde Servis
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Mahallenizi açın; kayıtlı sokak/cadde kapsamını ve o mahalle
                  için hazır arıza bildirim formunu göreceksiniz. Mahalleniz
                  listede yoksa yine de arayın — aynı gün servis planlanır.
                </p>

                <ul className="mt-4 space-y-2">
                  {neighborhoodRows.map((row) => (
                    <li key={row.name}>
                      <details className="group rounded-xl border bg-card transition-colors open:bg-accent/30">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                          <span>
                            {row.name}
                            <span className="ml-2 font-normal text-muted-foreground">
                              ({row.streets.length} sokak/cadde)
                            </span>
                          </span>
                          <ChevronRight
                            className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="border-t border-dashed px-4 py-3">
                          {/* AEO doğrudan yanıt: soru-başlık sonrası kısa cevap */}
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {row.name}&apos;de elektrikçi:
                            </span>{" "}
                            Evet — Zirve Elektrik {row.name} dahil{" "}
                            {district.name}&apos;in {neighborhoods.length}{" "}
                            mahallesinde 7/24 acil servis verir
                            {row.streets.length > 0
                              ? `; bu mahallede kayıtlı ${row.streets.length} sokak/cadde kapsamındayız`
                              : ""}
                            .
                          </p>
                          {row.streets.length > 0 ? (
                            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${row.name} sokakları`}>
                              {row.streets.slice(0, MAX_STREET_CHIPS).map((street) => (
                                <li key={street}>
                                  <Badge
                                    variant="secondary"
                                    className="text-[11px] font-normal"
                                  >
                                    {street}
                                  </Badge>
                                </li>
                              ))}
                              {row.streets.length > MAX_STREET_CHIPS ? (
                                <li className="self-center text-[11px] text-muted-foreground">
                                  ve {row.streets.length - MAX_STREET_CHIPS} sokak
                                  daha…
                                </li>
                              ) : null}
                            </ul>
                          ) : null}
                          <Link
                            href={`/iletisim?ilce=${encodeURIComponent(district.name)}&mahalle=${encodeURIComponent(row.name)}`}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                          >
                            <Send className="size-3.5" aria-hidden="true" />
                            {row.name}&apos;de arıza bildir
                            <span className="sr-only">
                              (form {district.name} ve {row.name} bilgileriyle
                              hazır gelir)
                            </span>
                          </Link>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* İlçe SSS: görünür soru-cevap + FAQPage yapısal verisi */}
            <section aria-label={`${district.name} sık sorulan sorular`} className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {district.name} Hakkında Sık Sorulanlar
              </h2>
              <div className="mt-4 space-y-3">
                {districtFaqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground md:text-base">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                      {faq.question.includes("ne kadar") ? (
                        <>
                          {" "}
                          <Link
                            href="/blog/acil-elektrikci-fiyatlari-istanbul"
                            className="font-medium text-primary hover:underline"
                          >
                            Acil elektrikçi fiyatları rehberi →
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <ReviewsStrip />
          </div>

          {/* Yan kolon */}
          <aside className="space-y-6">
            <ContactCtaCard
              title={`${district.name}'de Hemen Arayın`}
              description={`${district.name} ve çevresinde ustalarımız 7/24 görev başında. Arayın, adresinizi söyleyin; en yakın ekibimiz yola çıksın.`}
            />
            {services.length > 0 ? (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground">
                  Hizmetlerimiz
                </h2>
                <ul className="mt-3">
                  {services.slice(0, 8).map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/hizmetler/${service.slug}`}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {service.title}
                        <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </aside>
        </div>
      </article>

      <CtaBanner
        title={`${district.name} Elektrikçisi Kapınızda`}
        description="Sigorta attı mı, elektrik mi kaçtı, pano mu arızalandı? Tek telefon yeterli - 7/24 hizmetinizdeyiz."
      />
    </>
  );
}
