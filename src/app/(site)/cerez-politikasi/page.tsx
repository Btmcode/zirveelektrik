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

const LAST_UPDATED = "23.10.2026";

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
                Sitemizde <strong>zorunlu (teknik) çerezler</strong> her zaman
                kullanılır; zorunlu olmayan çerezler ise yalnızca çerez onay
                penceresinden verdiğiniz <strong>açık rızanız</strong>
                kapsamında devreye alınır. Reklam, hedefleme veya profil
                oluşturma amaçlı çerez <strong>kullanılmamaktadır.</strong>
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
                kullanılmaktadır. Bu harita, harici bir Google servisidir ve
                <strong> yalnızca fonksiyonel çerezlere izin vermeniz
                hâlinde ya da "Haritayı Yükle" seçeneğine tıklamanız
                hâlinde yüklenir.</strong> İzin vermediğiniz takdirde harita
                yüklenmez ve Google'a hiçbir veri gönderilmez; adres bilgisi
                metin olarak sayfada gösterilmeye devam eder. Haritayı
                yüklediğinizde ise Google çerezleri yerleştirebilir ve bazı
                verileri kendi sunucularına aktarabilir. Bu çerezler Google
                tarafından yönetilir ve Google'ın gizlilik kurallarına
                tabidir:
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
                  <>
                    "Yol Tarifi Al" bağlantısı yeni sekmede açılır; bu bağlantı
                    çerez yerleştirmez.
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
          id: "onay-sistemi",
          title: "Çerez Onay Sistemi ve Tercihlerinizi Yönetme",
          body: (
            <>
              <p>
                Sitemize ilk ziyaretinizde ekranın altında bir{" "}
                <strong>çerez tercih penceresi</strong> görüntülenir. Pencereden
                üç şekilde karar verebilirsiniz:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>"Tümüne İzin Ver":</strong> Tüm isteğe bağlı çerez
                    kategorilerine (fonksiyonel, ölçümleme, pazarlama) rıza
                    verirsiniz.
                  </>,
                  <>
                    <strong>"Yalnızca Zorunlu Çerezler":</strong> Yalnızca
                    sitenin çalışması için gerekli çerezler kullanılır.
                  </>,
                  <>
                    <strong>"Çerez Ayarları" (gelişmiş):</strong> Çerez
                    kategorilerini <strong>tek tek seçmenizi</strong> sağlar.
                    Zorunlu çerezler her zaman etkindir; diğer kategoriler
                    varsayılan olarak kapalıdır, dilediğinizi açıp{" "}
                    <strong>"Tercihleri Kaydet"</strong> ile onaylarsınız.
                  </>,
                ]}
              />
              <p>
                Ayarlar bölümünde dört kategori görebilirsiniz:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>Zorunlu Çerezler:</strong> Her zaman etkin,
                    kapatılamaz.
                  </>,
                  <>
                    <strong>Fonksiyonel Çerezler:</strong> Google Haritalar
                    gömmesi gibi içerikler için.
                  </>,
                  <>
                    <strong>Ölçümleme (Analitik):</strong> Anonim sayfa
                    ölçümlemesi (şu anda aktif araç yoktur).
                  </>,
                  <>
                    <strong>Pazarlama (Reklam):</strong> Reklam ölçümleme (şu
                    anda kullanılmamaktadır).
                  </>,
                ]}
              />
              <p>
                Tercihinizi daha sonra değiştirmek için sayfanın en altındaki{" "}
                <strong>"Çerez Ayarları"</strong> bağlantısını
                kullanabilirsiniz; pencere yeniden açılır ve seçiminizi
                güncelleyebilirsiniz. Bu, KVKK m.11 kapsamında rızanızı geri
                alma hakkınızın kullanımını sağlar.
              </p>
              <p>
                Tercihiniz <strong>yalnızca kendi cihazınızda</strong>{" "}
                (tarayıcı yerel deposunda) saklanır; sunucumuza gönderilmez ve
                kişisel veri olarak işlenmez. Zorunlu olmayan çerezler, rızanız
                onaylanmadan hiçbir şekilde yüklenmez veya okunmaz.
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
                oluşturacağı zorunlu olmayan çerezler yalnızca çerez onay
                penceresinden verdiğiniz <strong>açık rızanız kapsamında</strong>{" "}
                devreye alınır. Bu politika da güncellenerek yeniden
                yayımlanacaktır.
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
