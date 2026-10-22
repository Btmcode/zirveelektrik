import Link from "next/link";
import { Home, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, telHref } from "@/lib/settings";

/**
 * Site genelinde markalı 404 sayfası.
 * Middleware, oturumsuz /admin isteklerini de bu sayfaya rewrite eder;
 * böylece panelin varlığı dışarıya sızmaz.
 */
export default async function NotFound() {
  const settings = await getSettings().catch(() => null);
  const telUrl = settings ? telHref(settings.phone) : "#";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background p-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Zap className="size-7 text-primary" aria-hidden="true" />
      </div>

      <p className="text-sm font-semibold tracking-widest text-primary">404</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilir
        ya da elektrik arızanız için bizi doğrudan arayabilirsiniz.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href="/" aria-label="Anasayfaya dön">
            <Home aria-hidden="true" />
            Anasayfaya Dön
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a href={telUrl} aria-label={settings ? `Hemen ara: ${settings.phone}` : "Hemen ara"}>
            <Phone aria-hidden="true" />
            Hemen Ara
          </a>
        </Button>
      </div>
    </div>
  );
}
