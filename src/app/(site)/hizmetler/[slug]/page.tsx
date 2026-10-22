/* eslint-disable react-hooks/static-components -- Lucide ikonu ICON_MAP allow-list'inden çözülür; bileşen tanımı değildir */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { MarkdownContent } from "@/components/site/markdown";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaBanner } from "@/components/site/cta-banner";
import { ContactCtaCard } from "@/components/site/contact-cta-card";
import { getIcon } from "@/components/site/icon-map";
import { faqSchema, serviceSchema } from "@/lib/schema";
import {
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
  ];
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
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices(),
  ]);

  if (!service) notFound();

  const Icon = getIcon(service.icon);
  const otherServices = allServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 5);
  const serviceFaqs = buildServiceFaqs(service);

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
              <MarkdownContent content={service.content} />
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
