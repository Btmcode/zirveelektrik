"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SSS akordeonu - ana sayfa, SSS ve iletişim sayfasında ortak kullanım.
 *
 * Radix Accordion yerine statik ID'li özel akordeon yazıldı: Radix kimlikleri
 * React useId ile üretir ve geliştirme modunda HMR sonrası hydration
 * uyumsuzluğuna yol açar. Buradaki ID'ler ("faq-soru-3" gibi) deterministiktir,
 * sunucu ve istemci çıktısı her zaman birebir aynıdır.
 *
 * SEO/AEO: Sorular h3 başlığı olarak işaretlenir ve cevaplar kapalıyken de
 * DOM'da bulunur; arama motorları ve yanıt motorları tüm içeriği görür.
 */

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full border-b border-border">
      {faqs.map((faq, index) => {
        const open = openId === faq.id;
        const buttonId = `faq-soru-${index}`;
        const regionId = `faq-cevap-${index}`;

        return (
          <div key={faq.id} className="border-b border-border last:border-b-0">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
              >
                {faq.question}
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180 text-primary"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={regionId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
