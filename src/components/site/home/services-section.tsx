import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { getFeaturedServices } from "@/lib/queries";

/** Ana sayfa - öne çıkan hizmetler bölümü. */
export async function ServicesSection() {
  const services = await getFeaturedServices(6);
  if (services.length === 0) return null;

  return (
    <section aria-label="Hizmetlerimiz" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Elektrik Hizmetlerimiz"
          description="Sigorta ve pano arızalarından elektrik kaçağı tespitine, aydınlatma montajından tesisat tadilatına - tüm elektrik ihtiyaçlarınız için tek adres."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="mt-8 text-center md:mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/hizmetler">
              Tüm Hizmetleri Gör
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
