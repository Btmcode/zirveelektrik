import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileCallBar } from "@/components/site/mobile-call-bar";
import { CookieConsent } from "@/components/site/cookie-consent";
import { getSettings, telHref, waHref } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const telUrl = telHref(settings.phone);
  const waUrl = waHref(
    settings.whatsapp,
    "Merhaba, elektrik arıza talebi oluşturmak istiyorum."
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#ana-icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        İçeriğe geç
      </a>
      <Header
        phone={settings.phone}
        workingHours={settings.workingHours}
        telUrl={telUrl}
      />
      <main id="ana-icerik" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCallBar phone={settings.phone} telUrl={telUrl} waUrl={waUrl} />
      <CookieConsent />
    </div>
  );
}
