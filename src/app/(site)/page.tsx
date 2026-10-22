import type { Metadata } from "next";
import { Hero } from "@/components/site/home/hero";
import { StatsBand } from "@/components/site/stats-band";
import { ServicesSection } from "@/components/site/home/services-section";
import { HowWeWork } from "@/components/site/home/how-we-work";
import { DistrictsSection } from "@/components/site/home/districts-section";
import { TestimonialsSection } from "@/components/site/home/testimonials-section";
import { FaqSection } from "@/components/site/home/faq-section";
import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { faqSchema, localBusinessSchema, webSiteSchema } from "@/lib/schema";
import { getSettings } from "@/lib/settings";
import {
  getActiveFaqs,
  getApprovedTestimonials,
  getAllDistricts,
  getAllServices,
} from "@/lib/queries";
import { DEFAULT_META } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: DEFAULT_META.title },
    description: DEFAULT_META.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, faqs, testimonials, districts, services] = await Promise.all([
    getSettings(),
    getActiveFaqs(),
    getApprovedTestimonials(),
    getAllDistricts(),
    getAllServices(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema({
            phone: settings.phone,
            reviews: testimonials.map((t) => ({
              author: t.name,
              content: t.content,
              rating: t.rating,
            })),
            serviceNames: services.map((s) => s.title),
            districtNames: districts.map((d) => d.name),
          }),
          webSiteSchema(),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      <Hero />
      <StatsBand />
      <ServicesSection />
      <HowWeWork />
      <DistrictsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
