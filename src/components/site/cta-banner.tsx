import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, telHref } from "@/lib/settings";

interface CtaBannerProps {
  title?: string;
  description?: string;
}

/** Koyu CTA bandı - telefonla hızlı ulaşım (DESIGN.md §5). */
export async function CtaBanner({
  title = "Elektrik Arızanız mı Var?",
  description = "Telefonla arayın, arızanızı anlatın; ustalarımız en kısa sürede adresinize gelsin. Yerinde tespit, net teklif, garantili çözüm.",
}: CtaBannerProps) {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);

  return (
    <section aria-label="Hızlı iletişim" className="bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-center sm:px-6 md:flex-row md:text-left md:py-12 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-zinc-300 md:text-base">{description}</p>
        </div>
        <div className="shrink-0">
          <Button asChild size="lg" className="text-base">
            <a href={telUrl} aria-label={`Hemen ara: ${settings.phone}`}>
              <Phone className="size-5" aria-hidden="true" />
              {settings.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
