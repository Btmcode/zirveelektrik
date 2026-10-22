import type { ReactNode } from "react";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

/**
 * Yasal sayfalar (KVKK, Çerez, Kullanım Koşulları) için ortak iskelet.
 * Tutarsız görsel dili önler; içerik her sayfada kendi <section>'larıyla gelir.
 */

export interface LegalSection {
  id: string;
  title: string;
  /** Paragraf + liste + tablo benzeri serbest JSX içeriği */
  body: ReactNode;
}

interface LegalShellProps {
  /** Breadcumb ve h1 başlığı (örn. "Gizlilik Politikası") */
  title: string;
  /** Sayfanın kendi yolu (breadcrumb için, örn. "/gizlilik-politikasi") */
  path: string;
  /** Üst etiket (örn. "KVKK Aydınlatma Metni") */
  eyebrow: string;
  /** Sayfanın son güncellenme tarihi (gg.aa.yyyy) */
  lastUpdated: string;
  /** Giriş paragrafı (h1 altında, normal akışta) */
  intro: string;
  sections: LegalSection[];
}

export function LegalShell({
  title,
  path,
  eyebrow,
  lastUpdated,
  intro,
  sections,
}: LegalShellProps) {
  return (
    <>
      <Breadcrumbs items={[{ name: title, url: path }]} />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <header>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <ScrollText className="size-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Son güncelleme: {lastUpdated}
            </Badge>
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {intro}
          </p>
        </header>

        {/* İçindekiler - mobil ve masaüstünde hızlı atlama */}
        <nav
          aria-label="İçindekiler"
          className="mt-8 rounded-xl border bg-accent/40 p-5"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            İçindekiler
          </h2>
          <ol className="mt-3 grid list-decimal gap-1.5 pl-5 text-sm text-muted-foreground sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-baslik`}
              className="scroll-mt-24"
            >
              <h2
                id={`${section.id}-baslik`}
                className="text-lg font-bold tracking-tight text-foreground md:text-xl"
              >
                <span className="mr-2 tabular-nums text-primary">
                  {index + 1}.
                </span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

/** Yasal sayfalarda sık kullanılan madde işaretli liste. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
