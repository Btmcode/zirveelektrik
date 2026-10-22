/* eslint-disable react-hooks/static-components -- Lucide ikonu ICON_MAP allow-list'inden çözülür; bileşen tanımı değildir */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import {
  MarkdownContent,
  createHeadingIdState,
} from "@/components/site/markdown";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaBanner } from "@/components/site/cta-banner";
import { ContactCtaCard } from "@/components/site/contact-cta-card";
import { ServiceInlineCta } from "@/components/site/service-inline-cta";
import { ReviewsStrip } from "@/components/site/reviews-strip";
import { getIcon } from "@/components/site/icon-map";
import { faqSchema, serviceSchema } from "@/lib/schema";
import {
  getAllDistricts,
  getAllServices,
  getServiceBySlug,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Hizmete özgü SSS (AEO): sorular soru biçimli başlıklar, cevaplar 40-60
 * kelimelik doğrudan yanıt formatında. FAQPage zengin sonucu Google'da
 * Mayıs 2026'da kaldırıldı; ancak soru-cevap içeriği hem kullanıcı sorularını
 * karşılar hem de AI motorları tarafından alıntılanabilir.
 */
function buildServiceFaqs(service: {
  title: string;
  priceNote?: string | null;
}): { question: string; answer: string }[] {
  const priceAnswer =
    service.priceNote && service.priceNote.trim().length > 0
      ? `${service.priceNote} Arıza tespitinden sonra sunulan teklif onaylanmazsa dahi yalnızca tespit hizmet bedeli tahsil edilir; sürpriz ek ücret çıkarılmaz.`
      : "Keşif ve tespit sonrasında net fiyat teklifi verilir; teklif onaylanmadan işleme başlanmaz. Teklif onaylanmazsa yalnızca tespit hizmet bedeli tahsil edilir, sürpriz ek ücret çıkarılmaz.";

  return [
    {
      question: `${service.title} için keşif ücreti alıyor musunuz?`,
      answer: priceAnswer,
    },
    {
      question: `${service.title} için aynı gün hizmet veriyor musunuz?`,
      answer: `Evet. ${service.title} taleplerinde telefonunuz ustalarımıza aynı gün iletilir; İstanbul'un tüm ilçelerine 7/24 servis düzenliyoruz. Acil durumlarda en yakın ustayı yönlendiriyor, randevu saatini telefonla birlikte belirliyoruz.`,
    },
    {
      question: `${service.title} işleriniz garanti kapsamında mı?`,
      answer: `Evet. ${service.title} kapsamındaki işçilik ve kullanılan malzemeler garanti kapsamındadır; garanti süresi ve şartları iş öncesi teklifte yazılı olarak belirtilir. İş sonrası olası bir sorunda aynı ekip yeniden değerlendirme yapar.`,
    },
    {
      question: `${service.title} için ödemeyi nasıl yapabilirim?`,
      answer: `Ödemeyi iş tamamlandıktan sonra nakit ya da havale/EFT ile yapabilirsiniz. Başlangıçta ön ödeme talep edilmez; öncelikle tespit yapılır, teklif onaylanır, iş bitince ödeme alınır. Talep ederseniz işe ait fatura veya makbuz düzenlenir.`,
    },
    {
      question: `${service.title} hizmetini hangi ilçelerde veriyorsunuz?`,
      answer: `İstanbul'un Avrupa ve Anadolu yakasındaki 39 ilçenin tamamında ${service.title.toLocaleLowerCase("tr-TR")} hizmeti veriyoruz. Aradığınızda adresinizi söylemeniz yeterli; en yakın ustamız size yönlendirilir. İlçe bazlı ayrıntılar için hizmet bölgeleri sayfamıza göz atabilirsiniz.`,
    },
    {
      question: `Acil durumlarda ${service.title.toLocaleLowerCase("tr-TR")} için ne kadar sürede geliyorsunuz?`,
      answer: `Acil arızalarda en yakın müsait ustamız yönlendirilir; varış süresi adresinize ve trafiğe göre değişir. Arama sırasında size tahmini bir süre söylenir. Yoğun saatlerde süre uzayabileceği için sorunu fark ettiğiniz an aramanızı öneririz.`,
    },
  ];
}

/**
 * Hizmet sayfası ilçe bağlantıları: iç link ağını güçlendirir.
 * Slug'tan üretilen deterministik döndürmeyle her hizmet sayfası farklı
 * ilçe alt kümesi gösterir (şablon tekrarı yerine çeşitlilik).
 */
function pickDistricts<T extends { slug: string }>(
  districts: T[],
  slug: string,
  count: number
): T[] {
  if (districts.length === 0) return [];
  const hash = slug
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const offset = hash % districts.length;
  const rotated = [
    ...districts.slice(offset),
    ...districts.slice(0, offset),
  ];
  return rotated.slice(0, Math.min(count, districts.length));
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return { title: "Hizmet Bulunamadı", robots: { index: false, follow: false } };
  }
  return {
    // Admin metaTitle marka içeriyorsa şablonla çiftlenmesin → absolute
    title: service.metaTitle
      ? { absolute: service.metaTitle }
      : service.title,
    description: service.metaDescription || service.excerpt,
    alternates: { canonical: `/hizmetler/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, allServices, districts] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices(),
    getAllDistricts(),
  ]);

  if (!service) notFound();

  const Icon = getIcon(service.icon);
  const otherServices = allServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 5);
  const serviceFaqs = buildServiceFaqs(service);
  const linkedDistricts = pickDistricts(districts, service.slug, 12);

  // İçeriği H2 sınırlarından ikiye böl: ortada dönüşüm CTA'sı gösterir
  const sections = service.content.split(/(?=\n## )/);
  const canSplit = sections.length >= 4;
  const splitIndex = Math.ceil(sections.length / 2);
  const firstHalf = canSplit ? sections.slice(0, splitIndex).join("") : null;
  const secondHalf = canSplit ? sections.slice(splitIndex).join("") : null;
  // İki parça aynı başlık id sayaç durumunu paylaşır (deterministik anchor)
  const headingIdState = createHeadingIdState();

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            slug: service.slug,
            title: service.title,
            excerpt: service.excerpt,
          }),
          faqSchema(serviceFaqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Hizmetler", url: "/hizmetler" },
          { name: service.title, url: `/hizmetler/${service.slug}` },
        ]}
      />

      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Ana içerik */}
          <div className="lg:col-span-2">
            <header>
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-7 text-primary" aria-hidden="true" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                  {service.title}
                </h1>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {service.excerpt}
              </p>
            </header>

            <div className="mt-8">
              {canSplit && firstHalf && secondHalf ? (
                <>
                  <MarkdownContent content={firstHalf} idState={headingIdState} />
                  <ServiceInlineCta serviceTitle={service.title} />
                  <MarkdownContent content={secondHalf} idState={headingIdState} />
                </>
              ) : (
                <>
                  <MarkdownContent content={service.content} idState={headingIdState} />
                  <ServiceInlineCta serviceTitle={service.title} />
                </>
              )}
            </div>

            {/* AEO: hizmete özgü soru-cevap bölümü */}
            <section className="mt-10" aria-label="Sık sorulan sorular">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {service.title} Hakkında Sık Sorulan Sorular
              </h2>
              <div className="mt-4">
                <FaqAccordion
                  faqs={serviceFaqs.map((faq, index) => ({
                    id: `hizmet-sss-${index}`,
                    question: faq.question,
                    answer: faq.answer,
                  }))}
                />
              </div>
            </section>

            {service.priceNote ? (
              <aside
                aria-label="Fiyat bilgisi"
                className="mt-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-accent p-5"
              >
                <Wallet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Fiyat Bilgisi
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {service.priceNote}
                  </p>
                </div>
              </aside>
            ) : null}

            {/* Bağlamsal ilçe bağlantıları: hizmet ↔ bölge iç link ağı */}
            {linkedDistricts.length > 0 ? (
              <section aria-label="Hizmet bölgeleri" className="mt-10">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  İstanbul&apos;un Tüm İlçelerinde {service.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Bu hizmeti İstanbul&apos;un 39 ilçesinde veriyoruz. Başlıca
                  bölgelerimizden bazıları:
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {linkedDistricts.map((district) => (
                    <li key={district.id}>
                      <Link
                        href={`/bolgeler/${district.slug}`}
                        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {district.name} Elektrikçi
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  İlçenizi listede göremediniz mi?{" "}
                  <Link
                    href="/bolgeler"
                    className="font-medium text-primary hover:underline"
                  >
                    Tüm hizmet bölgelerimize
                  </Link>{" "}
                  göz atabilirsiniz.
                </p>
              </section>
            ) : null}

            <ReviewsStrip />
          </div>

          {/* Yan kolon */}
          <aside className="space-y-6">
            <ContactCtaCard />
            {otherServices.length > 0 ? (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground">
                  Diğer Hizmetler
                </h2>
                <ul className="mt-3">
                  {otherServices.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/hizmetler/${item.slug}`}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {item.title}
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
        title={`${service.title} için Hemen Arayın`}
        description="Ustalarımız İstanbul'un her ilçesinde 7/24 görev başında. Arayın, arızanızı anlatın; en kısa sürede adresinizde olalım."
      />
    </>
  );
}
