import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { getActiveFaqs } from "@/lib/queries";

/**
 * Ana sayfa - sık sorulan sorular bölümü.
 * Not: FAQPage JSON-LD sayfa seviyesinde (page.tsx) tam listeyle üretilir;
 * burada yalnızca görsel akordeon yer alır (çift şema engellemek için).
 */
export async function FaqSection() {
  const faqs = (await getActiveFaqs()).slice(0, 6);
  if (faqs.length === 0) return null;

  return (
    <section aria-label="Sık sorulan sorular" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="SSS"
          title="Sık Sorulan Sorular"
          description="Elektrikçi hizmetlerimiz, tespit bedeli ve çalışma şeklimiz hakkında en çok merak edilenler."
        />
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-4 sm:p-6">
          <FaqAccordion faqs={faqs} />
          <Link
            href="/sss"
            className="mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Tüm soruları görüntüle
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
