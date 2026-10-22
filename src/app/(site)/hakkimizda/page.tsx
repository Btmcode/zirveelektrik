import type { Metadata } from "next";
import Image from "next/image";
import { Award, ShieldCheck, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { StatsBand } from "@/components/site/stats-band";
import { HowWeWork } from "@/components/site/home/how-we-work";
import { CtaBanner } from "@/components/site/cta-banner";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Güven",
    text: "2005'ten beri İstanbul'un dört yanında kapı kapı güven inşa ediyoruz. Ustalarımız eğitimli, belgeli ve adresinize gelmeden önce kendini tanıtır.",
  },
  {
    icon: Wallet,
    title: "Şeffaflık",
    text: "Tespit hizmet bedelini ustalar yola çıkmadan önce bildirir, işçilik fiyatını onayınız olmadan uygulamaya koymayız. Sürpriz fatura asla çıkmaz.",
  },
  {
    icon: Award,
    title: "Garanti",
    text: "Tamamladığımız her işin işçiliği garantilidir. Aynı sorun kısa sürede tekrarlarsa ücretsiz döner, kalıcı çözüm üretiriz.",
  },
] as const;

/** Sahadan gerçek kareler - Zirve Elektrik markalı ekip ve araçlarımız. */
const BRAND_PHOTOS = [
  {
    src: "/images/marka/pano-bakim.jpg",
    alt: "Zirve Elektrik ustası markalı formasıyla apartman sayaç panosunu kontrol ediyor",
    caption: "Sayaç ve pano bakımı",
  },
  {
    src: "/images/marka/gece-servis.jpg",
    alt: "Gece vakti Zirve Elektrik ustası sokak lambası tamiri yaparken; arkada Sultangazi'deki dükkânımızın tabelası",
    caption: "Gece 03:00'te de sahadayız",
  },
  {
    src: "/images/marka/kablo-isciligi.jpg",
    alt: "Zirve Elektrik ustası kablo ucunu pense ile hazırlarken; göğsünde Zirve Elektrik logosu",
    caption: "Garantili kablo işçiliği",
  },
  {
    src: "/images/marka/servis-araci.jpg",
    alt: "Zirve Elektrik servis aracı apartman önünde park halinde; usta sırtında kablo makarası taşıyor",
    caption: "İstanbul'un her noktasına servis",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hakkımızda - 2005'ten Beri İstanbul'un Elektrikçisi",
    description:
      "Zirve Elektrik; 2005'ten beri İstanbul genelinde 7/24 elektrik arıza tespiti ve onarım hizmeti veriyor. İş modelimiz, değerlerimiz ve ekibimiz hakkında bilgi alın.",
    alternates: { canonical: "/hakkimizda" },
  };
}

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Hakkımızda", url: "/hakkimizda" }]} />

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Hakkımızda
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {SITE.foundedYear} Yılından Beri İstanbul'un Güvenilir Elektrikçisi
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Zirve Elektrik; {SITE.foundedYear} yılında İstanbul Sultangazi'de
            küçük bir atölye olarak kuruldu. Bugün 20'den fazla ustası ve kendi
            araç filosuyla Avrupa Yakası'ndan Anadolu Yakası'na, İstanbul'un 39
            ilçesinde 7/24 elektrik arıza tespiti ve onarım hizmeti veriyor.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <section aria-label="Hikayemiz">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Hikayemiz
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Bir mum işliğiyle başlayan yolculuğumuz, &ldquo;elektrikçilik
                güven işidir&rdquo; ilkesine dayanır. Kurulduğumuz günden beri
                müşterilerimizin büyük çoğunluğunu komşu tavsiyesiyle kazanıyoruz;
                bizi en çok mutlu eden de bu.
              </p>
              <p>
                İstanbul gibi dev bir şehirde arıza beklemez. Bu yüzden
                ekiplerimizi ilçelere yaydık; gece 03:00'te arayan Beylikdüzü'ne
                de, sabahtan beri sigortası atan Kadıköy'e de aynı hızda
                ulaşıyoruz. Her aracımızda arıza tespiti ve onarım için gereken
                tam ekipman bulunur; &ldquo;parçayı yarın getiririm&rdquo;
                derdini yaşamak istemiyoruz.
              </p>
              <p>
                Elektrik konusunda korkuyu değil, netliği tercih ederiz: ne
                yapıyoruz, ne kadar sürecek, ne kadara mal olacak - hepsini
                baştan söylüyoruz. Onayınız olmadan tek vida sökmüyoruz.
              </p>
            </div>
          </section>

          <section aria-label="İş modelimiz">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              İş Modelimiz
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Çalışma şeklimiz basit ve şeffaftır: Müşteri telefonla arar,
                arızayı anlatır. Ustalarımız adrese gelir ve arızayı yerinde
                tespit eder. Tespit sonucunda net bir fiyat teklifi sunarız.
              </p>
              <p>
                Müşterimiz teklifi yaptırsa da yaptırmasa da, yerinde tespit
                hizmeti için belirlenen keşif bedelini önceden bilir; bu bedel
                ustalar yola çıkmadan söylenir ve hiçbir koşulda değişmez.
                Teklifi onaylayan müşterimiz için iş aynı gün, garantili
                işçilikle tamamlanır.
              </p>
              <p>
                Bu model, bize &ldquo;pahalıya geldi&rdquo; pişmanlığı
                yaşatmamayı sağlıyor: karar her zaman müşterimizin, fiyat her
                zaman önceden bellidir.
              </p>
            </div>
          </section>
        </div>
      </article>

      {/* Sahadan kareler - markalı ekip ve araçlarımız */}
      <section
        aria-label="Zirve Elektrik ekibinden kareler"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Sahadan Kareler
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Markalı ekibimiz ve araçlarımızla İstanbul'un 39 ilçesinde çalışıyoruz;
          kapınıza gelen ustayı ilk bakışta tanırsınız.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {BRAND_PHOTOS.map((photo, index) => (
            <figure key={photo.src} className="group">
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border shadow-sm">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  priority={index === 0}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Değerlerimiz */}
      <section aria-label="Değerlerimiz" className="bg-muted/60 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Değerlerimiz
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Her işte aynı üç ilke: güven, şeffaflık ve garanti.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 md:gap-6">
            {VALUES.map((value) => (
              <Card key={value.title} className="h-full p-6">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="size-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <StatsBand />
      <HowWeWork />
      <CtaBanner
        title="Tanışmayı Bize Bırakmayın, Bir Arayın"
        description="Hakkımızda okumak güzel ama işimiz konuşunca daha iyi anlaşılır. Arayın, ustalarımızı ve fiyat anlayışımızı siz de deneyimleyin."
      />
    </>
  );
}
