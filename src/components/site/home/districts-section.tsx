import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { DistrictLink } from "@/components/site/district-link";
import { getAllDistricts } from "@/lib/queries";

/** Ana sayfa - hizmet bölgeleri (tüm ilçeler) bölümü. */
export async function DistrictsSection() {
  const districts = await getAllDistricts();
  if (districts.length === 0) return null;

  return (
    <section aria-label="Hizmet bölgeleri" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hizmet Bölgeleri"
          title="İstanbul'un 39 İlçesinde Servisteğiz"
          description="Avrupa ve Anadolu Yakası'nın tamamında 7/24 acil elektrikçi hizmeti veriyoruz. İlçenize tıklayın, bölgenize özel detaylara ulaşın."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {districts.map((district) => (
            <DistrictLink key={district.id} district={district} />
          ))}
        </div>
        <div className="mt-8 text-center md:mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/bolgeler">
              Tüm Bölgeleri İncele
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
