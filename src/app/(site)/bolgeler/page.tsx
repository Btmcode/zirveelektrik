import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { DistrictLink } from "@/components/site/district-link";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllDistricts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hizmet Bölgelerimiz - İstanbul 39 İlçe",
    description:
      "Zirve Elektrik İstanbul'un Avrupa ve Anadolu Yakası'ndaki 39 ilçesinde 7/24 acil elektrikçi hizmeti veriyor. İlçenizi seçin, bölgenize özel bilgilere ulaşın.",
    alternates: { canonical: "/bolgeler" },
  };
}

function DistrictGroup({
  title,
  districts,
}: {
  title: string;
  districts: { id: string; slug: string; name: string }[];
}) {
  if (districts.length === 0) return null;
  return (
    <section aria-label={title} className="mb-12 last:mb-0">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {districts.map((district) => (
          <DistrictLink key={district.id} district={district} />
        ))}
      </div>
    </section>
  );
}

export default async function DistrictsPage() {
  const districts = await getAllDistricts();
  const avrupa = districts.filter((d) => d.side === "AVRUPA");
  const anadolu = districts.filter((d) => d.side === "ANADOLU");

  return (
    <>
      <Breadcrumbs items={[{ name: "Bölgeler", url: "/bolgeler" }]} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Hizmet Bölgeleri"
          title="İstanbul'un 39 İlçesinde 7/24 Servis"
          description="Avrupa Yakası'ndan Anadolu Yakası'na, Çatalca'dan Tuzla'ya kadar İstanbul'un tamamında acil elektrikçi hizmeti veriyoruz. İlçenizi seçin."
        />
        <DistrictGroup title="Avrupa Yakası" districts={avrupa} />
        <DistrictGroup title="Anadolu Yakası" districts={anadolu} />
      </div>
      <CtaBanner
        title="Bölgenizde Acil Elektrikçi mi Lazım?"
        description="Hangi ilçede olursanız olun, ustalarımız 7/24 görev başında. Arayın, adresinizi söyleyin; hemen yola çıkalım."
      />
    </>
  );
}
