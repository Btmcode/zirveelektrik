import { Clock, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSettings, telHref, waHref } from "@/lib/settings";

interface ContactCtaCardProps {
  title?: string;
  description?: string;
}

/** Yan kolon iletişim CTA kartı - hizmet ve ilçe detay sayfalarında kullanılır. */
export async function ContactCtaCard({
  title = "Hemen Arayın",
  description = "Arızanızı telefonla anlatın; ustalarımız en kısa sürede adresinize gelsin. Tespit sonrası net fiyat teklifi alırsınız.",
}: ContactCtaCardProps) {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const waUrl = waHref(
    settings.whatsapp,
    "Merhaba, elektrik arıza talebi oluşturmak istiyorum."
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-5 space-y-3">
        <Button asChild size="lg" className="w-full">
          <a href={telUrl} aria-label={`Hemen ara: ${settings.phone}`}>
            <Phone className="size-4" aria-hidden="true" />
            {settings.phone}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full text-green-700 hover:text-green-800"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile arıza bildir"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp ile Yaz
          </a>
        </Button>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        {settings.workingHours}
      </p>
    </Card>
  );
}
