import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalList } from "@/components/site/legal-shell";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Site Kullanım Koşulları",
    description:
      "zirveelektrik.net web sitesini kullanım koşulları: hizmet niteliği, fiyat bilgisi, fikri mülkiyet, sorumluluk sınırlamaları ve uygulanacak hukuk.",
    alternates: { canonical: "/kullanim-kosullari" },
  };
}

const LAST_UPDATED = "22.10.2026";

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Site Kullanım Koşulları"
      path="/kullanim-kosullari"
      eyebrow="Kullanım Şartları ve Yasal Uyarılar"
      lastUpdated={LAST_UPDATED}
      intro={`Bu Kullanım Koşulları, ${SITE.domain} web sitesini ziyaret etmenize ve sitedeki formları kullanmanıza ilişkin şartları düzenler. Siteyi kullanmakla bu koşulları kabul etmiş sayılırsınız.`}
      sections={[
        {
          id: "taraflar",
          title: "Taraflar ve Site Sahibi",
          body: (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="font-semibold text-foreground">{SITE.legalName}</p>
              <p className="mt-1">Adres: {settings.address}</p>
              <p className="mt-1">
                Telefon:{" "}
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="text-primary hover:underline"
                >
                  {settings.phone}
                </a>
              </p>
              <p className="mt-1">
                E-posta:{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="text-primary hover:underline"
                >
                  {settings.email}
                </a>
              </p>
            </div>
          ),
        },
        {
          id: "hizmetin-niteligi",
          title: "Hizmetin Niteliği",
          body: (
            <>
              <p>
                Bu web sitesi, elektrik arıza tespiti ve onarım hizmetlerine
                yönelik <strong>talep toplama ve bilgilendirme</strong>{" "}
                platformudur. Site üzerinden iletmeniz arıza bildirimleri,
                ekibimizce değerlendirilir ve tarafınıza dönüş yapılır.
              </p>
              <p>
                Site üzerinden bir talep göndermeniz,{" "}
                <strong>
                  kendiliğinden bir hizmet sözleşmesi kurmaz veya bize
                  herhangi bir iş yapma yükümlülüğü getirmez.
                </strong>{" "}
                Hizmet sözleşmesi; talebin değerlendirilmesi, fiyatın
                teklif edilmesi ve taraflarca mutabakat sağlanması ile kurulur.
              </p>
            </>
          ),
        },
        {
          id: "fiyat-bilgisi",
          title: "Fiyat ve Teklif Bilgileri",
          body: (
            <>
              <p>
                Sitede yer alan fiyat aralıkları, sektör ortalamalarına ilişkin{" "}
                <strong>tahmini ve bilgilendirme amaçlı</strong> değerlerdir.
                Kesin fiyat; arızanın niteliği, yerinde tespit ve yapılacak
                işlemlerin kapsamına göre ustalar tarafından bildirilir.
              </p>
              <LegalList
                items={[
                  "İşçilik fiyatı, ustalar yerinde tespit yaptıktan sonra ve onayınız alınmadan uygulamaya konmaz.",
                  "Malzeme bedelleri ayrıca değerlendirilir; malzeme tercihi sizinle birlikte kararlaştırılır.",
                  "Tahmini fiyat aralıkları, mahalle/ilçe, arıza zorluğu ve günün saatine göre değişiklik gösterebilir.",
                ]}
              />
            </>
          ),
        },
        {
          id: "guvenlik-uyarisi",
          title: "Elektrik Güvenliği Uyarısı",
          body: (
            <>
              <p>
                Elektrik tesisatı, can güvenliği gerektiren ve{" "}
                <strong>yetkisiz müdahalesi tehlikeli</strong> olan bir
                alandır. Sitedeki blog yazıları ve rehber içerikler yalnızca{" "}
                <strong>bilgilendirme amaçlıdır</strong>; herhangi bir yazıdaki
                adımın kendi başınıza uygulanması riskli olabilir.
              </p>
              <LegalList
                items={[
                  "Sigorta kutusuna, kablo bağlantılarına veya pano içine uzmanlık ve teçhizat olmadan müdahale etmeyiniz.",
                  "Sitedeki içerikler profesyonel eğitim ve saha deneyimi yerine geçmez.",
                  "Ciddi görünen her elektrik arızasında (yanık kokusu, kıvılcım, sürekli sigorta atması) müdahale yerine yetkili ustaları arayınız.",
                ]}
              />
            </>
          ),
        },
        {
          id: "kullanim-kurallari",
          title: "Site Kullanımında Uyulması Gerekenler",
          body: (
            <LegalList
              items={[
                "Formlara doğru ve gerçek bilgi girmekle yükümlüsünüz; başkası adına veya sahte bilgiyle talep göndermek yasaktır.",
                "Siteyi otomatik araçlarla aşırı istek gönderecek şekilde kullanmak, formu spam amacıyla doldurmak yasaktır (talepleriniz hız sınırlama ve log kayıtlarıyla izlenir).",
                "Sitenin güvenlik önlemlerini aşmaya, kaynak kodunu izinsiz otomatik araçlarla taramaya çalışmak yasaktır.",
                "Talep takip kodunuz kişiseldir; üçüncü kişilerle paylaşımınızdan doğabilecek durumların sorumluluğu size aittir.",
              ]}
            />
          ),
        },
        {
          id: "fikri-mulkiyet",
          title: "Fikri Mülkiyet Hakları",
          body: (
            <p>
              Site içeriği (metinler, görseller, logo, sayfa düzeni ve teknik
              altyapı) {SITE.legalName}'e aittir veya lisanslı olarak
              kullanılmaktadır. İçerikler, kaynak gösterilmeden ve izin
              alınmadan ticari amaçla kopyalanamaz, çoğaltılamaz veya
              dağıtılamaz. Kişisel kullanım ve kaynak gösterilerek yapılan
              atıflar serbesttir.
            </p>
          ),
        },
        {
          id: "dis-baglantilar",
          title: "Dış Bağlantılar",
          body: (
            <p>
              Sitede Google Haritalar, sosyal medya profilleri gibi üçüncü
              taraflara ait bağlantılar bulunabilir. Bu dış sitelerin
              içeriklerinden ve gizlilik uygulamalarından sorumlu değiliz;
              ilgili sitelerin kendi kullanım koşulları geçerlidir.
            </p>
          ),
        },
        {
          id: "sorumluluk-siniri",
          title: "Sorumluluk Sınırlaması",
          body: (
            <>
              <p>
                Sitedeki bilgileri “olduğu gibi” sunmaktayız; teknik işlemlerde
                süreklilik veya hata payı garantisi veremeyiz. Yasal
                sınırlamalar çerçevesinde:
              </p>
              <LegalList
                items={[
                  "Site erişimindeki geçici kesintiler, veri aktarım hataları veya tarayıcı uyumsuzluklarından doğan dolaylı zararlardan sorumlu tutulamaz.",
                  "Site içeriğindeki bilgi kullanımından doğacak risk, kullanıcıya aittir; elektrik işlerinde mutlaka yerinde tespit esastır.",
                  "Sunulan hizmetlerin kalitesi, işçilik garantisi ve doğabilecek uyuşmazlıklar, taraflar arasında kurulan hizmet sözleşmesine tabidir.",
                ]}
              />
            </>
          ),
        },
        {
          id: "uygulanacak-hukuk",
          title: "Uygulanacak Hukuk ve Yetkili Mahkemeler",
          body: (
            <p>
              Bu Kullanım Koşulları, Türkiye Cumhuriyeti hukukuna tabidir.
              Siteden doğacak uyuşmazlıklarda İstanbul Mahkemeleri ve İcra
              Daireleri yetkilidir. Kullanıcı tüketici sıfatını haiz ise,
              Tüketicinin Korunması Hakkında Kanun hükümleri saklıdır.
            </p>
          ),
        },
        {
          id: "iletisim-ve-guncelleme",
          title: "İletişim ve Güncellemeler",
          body: (
            <>
              <p>
                Kullanım Koşulları hakkında sorularınız için bize{" "}
                {settings.phone} numarasından veya {settings.email} adresinden
                ulaşabilirsiniz.
              </p>
              <p>
                Kişisel verilerinizin korunmasına ilişkin detaylar için{" "}
                <Link
                  href="/gizlilik-politikasi"
                  className="font-medium text-primary hover:underline"
                >
                  Gizlilik Politikası ve KVKK Aydınlatma Metni
                </Link>{" "}
                sayfasını, çerez kullanımımız için{" "}
                <Link
                  href="/cerez-politikasi"
                  className="font-medium text-primary hover:underline"
                >
                  Çerez Politikası
                </Link>{" "}
                sayfasını inceleyebilirsiniz. Bu koşulları güncelleme hakkımız
                saklıdır; güncel sürüm her zaman bu sayfada yayımlanır.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
