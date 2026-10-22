import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaBanner } from "@/components/site/cta-banner";
import { faqSchema } from "@/lib/schema";
import { getActiveFaqs } from "@/lib/queries";
import type { Faq } from "@prisma/client";

export const dynamic = "force-dynamic";

const CATEGORY_GROUPS = [
  { key: "GENEL", label: "Genel Sorular" },
  { key: "HIZMET", label: "Hizmetler" },
  { key: "FIYAT", label: "Fiyatlandırma" },
  { key: "GARANTI", label: "Garanti" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sık Sorulan Sorular (SSS)",
    description:
      "Zirve Elektrik hizmetleri, arıza tespit bedeli, fiyatlandırma ve garanti hakkında sık sorulan soruların yanıtları. İstanbul 7/24 acil elektrikçi.",
    alternates: { canonical: "/sss" },
  };
}

export default async function FaqPage() {
  const faqs = await getActiveFaqs();

  return (
    <>
      {faqs.length > 0 ? <JsonLd data={faqSchema(faqs)} /> : null}
      <Breadcrumbs items={[{ name: "SSS", url: "/sss" }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            SSS
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Sık Sorulan Sorular
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Elektrikçi hizmetlerimiz, süreçlerimiz ve fiyatlandırmamız hakkında en
            çok sorulanları kategorilere göre derledik.
          </p>
        </header>

        {faqs.length === 0 ? (
          <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            Sorular şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin veya
            bizi telefonla arayın.
          </p>
        ) : (
          <div className="mx-auto mt-10 max-w-3xl space-y-10">
            {CATEGORY_GROUPS.map((group) => {
              const groupFaqs = faqs.filter((faq: Faq) => faq.category === group.key);
              if (groupFaqs.length === 0) return null;
              return (
                <section
                  key={group.key}
                  aria-label={group.label}
                  className="rounded-xl border border-border bg-card p-4 sm:p-6"
                >
                  <h2 className="mb-2 text-lg font-bold tracking-tight text-foreground">
                    {group.label}
                  </h2>
                  <FaqAccordion faqs={groupFaqs} />
                </section>
              );
            })}
          </div>
        )}
      </div>

      <CtaBanner
        title="Sorunuz Listede Yok mu?"
        description="Bize doğrudan sorun - telefonla arayın, ustalarımız teknik sorularınızı da yanıtlar."
      />
    </>
  );
}
