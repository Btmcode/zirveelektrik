import { MessageCircle, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, telHref, waHref } from "@/lib/settings";

/**
 * Blog yazısı içi dönüşüm kartı: okur makalenin yarısında
 * çözüm CTA'sıyla karşılaşır (hızlı dönüşüm hedefi).
 */
export async function ArticleCtaCard() {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const waUrl = waHref(
    settings.whatsapp,
    "Merhaba, blog yazınızı okudum ve evimde aynı sorun var. Yardım istiyorum."
  );

  return (
    <div className="my-8 rounded-xl border border-primary/30 bg-accent/60 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15"
          aria-hidden="true"
        >
          <Zap className="size-5 text-primary" />
        </span>
        <div className="flex-1">
          <p className="font-semibold tracking-tight text-foreground">
            Bu sorun şu an evinizde mi var?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Kendiniz çözmeye çalışmak zaman kaybı ve risk olabilir. Ustalarımız
            aynı gün adresinizde; tespit sonrası fiyat onayı sizde.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button asChild size="sm">
            <a href={telUrl} aria-label={`Hemen ara: ${settings.phone}`}>
              <Phone className="size-4" aria-hidden="true" />
              Hemen Ara
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile yaz"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
