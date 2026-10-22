import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ServiceCard } from "@/components/site/service-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllServices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Elektrik Hizmetlerimiz",
    description:
      "Sigorta-pano arızaları, elektrik kaçak tespiti, tesisat tadilatı, aydınlatma, topraklama ve tüm elektrik hizmetlerimiz. İstanbul genelinde 7/24 aynı gün servis.",
    alternates: { canonical: "/hizmetler" },
  };
}

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <Breadcrumbs items={[{ name: "Hizmetler", url: "/hizmetler" }]} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Elektrik Hizmetlerimiz"
          description="İstanbul genelinde 7/24 verdiğimiz tüm elektrik hizmetleri. Aşağıdaki başlığa tıklayarak hizmete özel detaylara, fiyatlama yaklaşımımıza ve süreç bilgilerine ulaşabilirsiniz."
        />
        {services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            Hizmetler şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin veya
            bizi telefonla arayın.
          </p>
        )}
      </div>
      <CtaBanner />
    </>
  );
}
