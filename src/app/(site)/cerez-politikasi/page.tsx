import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalList } from "@/components/site/legal-shell";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Çerez (Cookie) Politikası",
    description:
      "Zirve Elektrik web sitesinin hangi çerezleri kullandığını, bunların amaçlarını ve tarayıcınızdan çerez ayarlarınızı nasıl yönetebileceğinizi açıklıyoruz.",
    alternates: { canonical: "/cerez-politikasi" },
  };
}

const LAST_UPDATED = "22.10.2026";

export default function CookiePolicyPage() {
  return (
    <LegalShell
      title="Çerez (Cookie) Politikası"
      path="/cerez-politikasi"
      eyebrow="Çerez Kullanımı Hakkında Bilgilendirme"
      lastUpdated={LAST_UPDATED}
      intro="Bu Çerez Politikası, zirveelektrik.net web sitesini ziyaret ettiğinizde cihazınıza yerleştirilen çerezlerin türlerini, kullanım amaçlarını ve çerez ayarlarınızı nasıl yönetebileceğinizi açıklar. 6698 sayılı KVKK ve Kişisel Verileri Koruma Kurulu'nun çerez kullanımına ilişkin esasları uyarınca hazırlanmıştır."
      sections={[
        {
          id: "cerez-nedir",
          title: "Çerez Nedir?",
          body: (
            <>
              <p>
                Çerezler (cookie), ziyaret ettiğiniz web siteleri tarafından
                tarayıcınıza kaydedilen, boyut olarak son derece küçük metin
                dosyalarıdır. Çerezler sayesinde web sitesi daha verimli
                çalışır, tercihleriniz hatırlanır ve site güvenliği
                desteklenir.
              </p>
              <p>
                Çerezler “oturum çerezi” (tarayıcıyı kapattığınızda silinir) ve
                “kalıcı çerez” (belirli bir süreye kadar cihazınızda kalır)
                olarak ikiye ayrılır.
              </p>
            </>
          ),
        },
        {
          id: "kullandigimiz-cerezler",
          title: "Kullandığımız Çerezler",
          body: (
            <>
              <p>
                Sitemizde <strong>yalnızca zorunlu (teknik) çerezler</strong>{" "}
                kullanılmaktadır. Reklam, hedefleme veya profil oluşturma
                amaçlı çerez <strong>kullanılmamaktadır.</strong>
              </p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <caption className="sr-only">
                    Zirve Elektrik web sitesinde kullanılan çerezlerin listesi
                  </caption>
                  <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Çerez Adı
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Türü
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Amacı
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Süresi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">
                        zr_admin_session
                      </td>
                      <td className="px-4 py-3">Zorunlu</td>
                      <td className="px-4 py-3">
                        Yönetim paneli oturum güvenliği (yalnızca yetkili
                        yöneticiler için; ziyaretçilere verilmez)
                      </td>
                      <td className="px-4 py-3">Oturum</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Zorunlu çerezler, kişisel veri işleme için açık rıza
                aranmaksızın KVKK m.5/2-f (meşru menfaat) kapsamında
                kullanılabilir; ancak dilediğiniz zaman tarayıcı ayarlarınızdan
                bunları da engelleyebilirsiniz.
              </p>
            </>
          ),
        },
        {
          id: "ucuncu-taraf",
          title: "Üçüncü Taraf Çerezleri ve Gömülü İçerikler",
          body: (
            <>
              <p>
                <strong>İletişim</strong> sayfamızda, iş yerimizin konumunu
                göstermek için Google Haritalar haritası gömülü olarak
                kullanılmaktadır. Haritayı yüklediğinizde, Google çerezleri
                yerleştirebilir ve bazı verileri kendi sunucularına
                aktarabilir. Bu çerezler Google tarafından yönetilir ve
                Google'ın gizlilik kurallarına tabidir:
              </p>
              <LegalList
                items={[
                  <>
                    Google Gizlilik Politikası:{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-primary hover:underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </>,
                  <>
                    Harita harici bir bağlantıdan yüklenir; Google'a gönderilen
                    veriler, haritayı görüntülediğiniz anda ve tarayıcı
                    ayarlarınıza bağlıdır.
                  </>,
                ]}
              />
              <p>
                Sitemizde analitik (ör. Google Analytics), reklam
                ağları veya sosyal medya izleme pikselleri{" "}
                <strong>bulunmamaktadır.</strong>
              </p>
            </>
          ),
        },
        {
          id: "cerezleri-yonetme",
          title: "Çerezleri Yönetme ve Silme",
          body: (
            <>
              <p>
                Tarayıcılarınızın ayarlarından çerezleri dilediğiniz zaman
                engelleyebilir, silebilir veya yalnızca belirli sitelere izin
                verebilirsiniz. Yaygın tarayıcılar için çerez ayarları:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik →
                    Çerezler ve diğer site verileri
                  </>,
                  <>
                    <strong>Safari:</strong> Ayarlar → Gizlilik → Çerezleri
                    engelle
                  </>,
                  <>
                    <strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik →
                    Çerezler ve Site Verileri
                  </>,
                  <>
                    <strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri
                  </>,
                ]}
              />
              <p>
                Çerezleri tamamen engellemeniz hâlinde siteyi gezmeye ve arıza
                talebi formunu doldurmaya devam edebilirsiniz; yalnızca yönetim
                paneli oturum açma işlevi etkilenir.
              </p>
            </>
          ),
        },
        {
          id: "gelecek-degisiklikler",
          title: "Gelecekteki Değişiklikler ve Güncellemeler",
          body: (
            <>
              <p>
                İlerleyen dönemde sitemize analitik ölçümleme veya reklam
                ölçümleme araçları eklenmesi hâlinde, bu araçların
                oluşturacağı zorunlu olmayan çerezler için{" "}
                <strong>ziyaretçilerden önceden açık rıza alınacak</strong> ve
                siteye çerez onayı (consent) arayüzü eklenecektir. Bu politika
                da güncellenerek yeniden yayımlanacaktır.
              </p>
              <p>
                Kişisel verilerinizin işlenmesine ilişkin genel bilgilendirme
                için{" "}
                <Link
                  href="/gizlilik-politikasi"
                  className="font-medium text-primary hover:underline"
                >
                  Gizlilik Politikası ve KVKK Aydınlatma Metni
                </Link>{" "}
                sayfasına göz atabilirsiniz.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
