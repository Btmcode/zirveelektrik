import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { MarkdownContent } from "@/components/site/markdown";
import { CtaBanner } from "@/components/site/cta-banner";
import { ContactCtaCard } from "@/components/site/contact-cta-card";
import { localBusinessSchema } from "@/lib/schema";
import { getAllServices, getDistrictBySlug } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

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
  const [district, services, settings] = await Promise.all([
    getDistrictBySlug(slug),
    getAllServices(),
    getSettings(),
  ]);

  if (!district) notFound();

  const neighborhoods = district.neighborhoods
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd data={localBusinessSchema({ phone: settings.phone })} />
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
                {district.side === "ANADOLU" ? "Anadolu Yakası" : "Avrupa Yakası"}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {district.name} Elektrikçi - 7/24 Acil Servis
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Zirve Elektrik olarak {district.name} ilçesinin tüm
                mahallelerinde 7/24 acil elektrikçi ve arıza tespiti hizmeti
                veriyoruz. Aynı gün servis, yerinde tespit, net fiyat teklifi ve
                garantili işçilik.
              </p>
            </header>

            <div className="mt-8">
              <MarkdownContent content={district.content} />
            </div>

            {neighborhoods.length > 0 ? (
              <section aria-label={`${district.name} mahalleleri`} className="mt-10">
                <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {district.name} Mahallelerinde Servis
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aşağıdaki mahalle ve çevresinde aynı gün servis veriyoruz;
                  mahalleniz listede yoksa yine de arayın.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {neighborhoods.map((neighborhood) => (
                    <li key={neighborhood}>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {neighborhood}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
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
