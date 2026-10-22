import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalList } from "@/components/site/legal-shell";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
    description:
      "Zirve Elektrik kişisel verilerinizi KVKK №6698 ve ilgili mevzuata uygun şekilde işler. Veri işleme amaçları, haklarınız ve başvuru yolları hakkında bilgilendirme.",
    alternates: { canonical: "/gizlilik-politikasi" },
  };
}

const LAST_UPDATED = "22.10.2026";

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <LegalShell
      title="Gizlilik Politikası ve KVKK Aydınlatma Metni"
      path="/gizlilik-politikasi"
      eyebrow="KVKK №6698 Aydınlatma Yükümlülüğü"
      lastUpdated={LAST_UPDATED}
      intro={
        "Zirve Elektrik olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili mevzuat kapsamında veri sorumlusu sıfatıyla hareket etmekte, bu sayfada kişisel verilerinizin hangi amaçlarla işlendiğini, kimlerle paylaşılabileceğini ve kanuni haklarınızı şeffaf biçimde açıklamaktayız."
      }
      sections={[
        {
          id: "veri-sorumlusu",
          title: "Veri Sorumlusu",
          body: (
            <>
              <p>
                6698 sayılı KVKK uyarınca kişisel verileriniz, aşağıda bilgileri
                yer alan veri sorumlusu tarafından işlenmektedir:
              </p>
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
                <p className="mt-1">Web sitesi: {SITE.domain}</p>
              </div>
            </>
          ),
        },
        {
          id: "islenen-veriler",
          title: "İşlenen Kişisel Veriler",
          body: (
            <>
              <p>
                Web sitemiz üzerinden arıza talebi oluşturduğunuzda veya bizimle
                iletişime geçtiğinizde aşağıdaki kişisel veriler işlenmektedir:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>Kimlik ve iletişim verileri:</strong> Ad soyad,
                    telefon numarası
                  </>,
                  <>
                    <strong>Lokasyon ve hizmet verileri:</strong> Servis adresi
                    (mahalle, sokak, bina/daire), seçtiğiniz hizmet türü
                  </>,
                  <>
                    <strong>Talep içerik verileri:</strong> Arıza açıklamanız,
                    talep takip kodunuz, talep tarihi-saati
                  </>,
                  <>
                    <strong>Otomatik teknolojik veriler:</strong> İstek
                    gönderen IP adresi, sistem log kayıtları (yalnızca güvenlik
                    ve kötüye kullanım önleme amaçlıdır)
                  </>,
                ]}
              />
              <p>
                Sitemizde online ödeme, üyelik sistemi veya e-ticaret modülü{" "}
                <strong>bulunmamaktadır</strong>; kimlik belge numarası, banka
                kartı bilgisi gibi özel nitelikli veriler talep edilmemekte ve
                işlenmemektedir.
              </p>
            </>
          ),
        },
        {
          id: "isleme-amaclari",
          title: "İşleme Amaçları ve Hukuki Sebepler",
          body: (
            <>
              <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
              <LegalList
                items={[
                  <>
                    Arıza talebinizin kayıt altına alınması, size dönüş
                    yapılması ve randevu planlanması —{" "}
                    <em>
                      hukuki sebep: sözleşmenin kurulması ve ifası için veri
                      işlemenin gerekli olması (KVKK m.5/2-c)
                    </em>
                  </>,
                  <>
                    Talebinize usta görevlendirilmesi, hizmetin sunulması ve
                    işçilik garantisi kapsamında geri dönüş yapılması —{" "}
                    <em>
                      hukuki sebep: sözleşmenin kurulması ve ifası (KVKK
                      m.5/2-c)
                    </em>
                  </>,
                  <>
                    Web sitesinin güvenliğinin sağlanması, spam ve kötüye
                    kullanıma karşı korunma —{" "}
                    <em>hukuki sebep: meşru menfaat (KVKK m.5/2-f)</em>
                  </>,
                  <>
                    Yasal yükümlülüklerin (vergi, ticaret mevzuatı vb.)
                    yerine getirilmesi —{" "}
                    <em>
                      hukuki sebep: veri sorumlusunun hukuki yükümlülüğü (KVKK
                      m.5/2-ç)
                    </em>
                  </>,
                ]}
              />
              <p>
                Kişisel verileriniz, yukarıdaki amaçların dışında{" "}
                <strong>
                  ticari elektronik ileti (reklam, kampanya) gönderimi için
                  kullanılmamaktadır.
                </strong>{" "}
                Böyle bir gönderim, ileride yapılması hâlinde yalnızca ayrıca ve
                özgürce vermiş olacağınız açık rızanızla mümkün olacaktır.
              </p>
            </>
          ),
        },
        {
          id: "aktarim",
          title: "Kişisel Verilerin Aktarılması",
          body: (
            <>
              <p>
                Kişisel verileriniz{" "}
                <strong>
                  üçüncü kişilere ticari amaçla satılmamakta veya
                  paylaşılmamaktadır.
                </strong>{" "}
                Yalnızca aşağıdaki sınırlı hâllerde aktarılabilir:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>Görevli ustalarımıza:</strong> Talebinize uygun
                    servisin sağlanabilmesi için ad soyad, adres ve telefon
                    bilgisi görevlendirilen usta ile paylaşılır.
                  </>,
                  <>
                    <strong>Altyapı sağlayıcılarına (veri işleyen):</strong> Web
                    sitesinin barındırılması amacıyla kullanılan yurt dışı
                    sunucu hizmeti (Vercel Inc.) kapsamında teknik veriler
                    işlenebilir; bu sağlayıcı adına veri işleyen sıfatıyla
                    hareket etmekte, verileri kendi amaçları doğrultusunda
                    kullanamamaktadır.
                  </>,
                  <>
                    <strong>Kamu mercilerine:</strong> Yasal bir talep veya
                    hukuki yükümlülük hâlinde, ilgili kanunda öngörülen
                    mercilerle (mahkeme, idare vb.) sınırlı olarak paylaşılır.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: "saklama",
          title: "Saklama Süreleri ve İmha",
          body: (
            <>
              <p>
                Kişisel verileriniz, işleme amaçları için gerekli olan süre
                boyunca ve ilgili mevzuatta öngörülen zamanaşımı sürelerine
                uygun şekilde saklanır:
              </p>
              <LegalList
                items={[
                  <>
                    <strong>Arıza talep kayıtları:</strong> Hizmetin sunulması
                    ve işçilik garantisi takibi için talep tarihinden itibaren
                    en fazla 2 yıl, sonrasında silinir veya anonimleştirilir.
                  </>,
                  <>
                    <strong>Sistem log kayıtları:</strong> Güvenlik amaçlı
                    olarak en fazla 1 yıl saklanır.
                  </>,
                  <>
                    <strong>Fatura ve resmî belgeler:</strong> Vergi Usul
                    Kanunu ve ilgili mevzuat gereği 10 yıl saklanır.
                  </>,
                ]}
              />
              <p>
                Saklama süresi dolan veriler KVKK mevzuatına uygun olarak
                silinir, yok edilir veya anonim hâle getirilir.
              </p>
            </>
          ),
        },
        {
          id: "guvenlik",
          title: "Veri Güvenliği Önlemleri",
          body: (
            <LegalList
              items={[
                "Sitemize tüm trafiği HTTPS/TLS ile şifrelenerek yapılır; form verileriniz aktarım sırasında şifrelenir.",
                "Talep formu, spam ve otomatik saldırılara karşı hız sınırlama (rate limiting) ile korunur.",
                "Yönetim paneline erişim güçlü parola ve oturum yönetimiyle sınırlıdır; veritabanına erişim yetkisi kısıtlıdır.",
                "Kişisel verilere erişebilen personel sayısı minimumda tutulur ve veriler yalnızca işleme amacıyla sınırlı kullanılır.",
              ]}
            />
          ),
        },
        {
          id: "haklariniz",
          title: "KVKK m.11 Kapsamındaki Haklarınız",
          body: (
            <>
              <p>
                KVKK m.11 uyarınca veri sorumlusuna başvurarak aşağıdaki
                hakları kullanabilirsiniz:
              </p>
              <LegalList
                items={[
                  "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                  "İşlenmişse buna ilişkin bilgi talep etme",
                  "İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme",
                  "Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme",
                  "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
                  "KVKK m.7'de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
                  "Bu işlemlerin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
                  "Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
                  "Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
                ]}
              />
            </>
          ),
        },
        {
          id: "basvuru",
          title: "Başvuru Yolları",
          body: (
            <>
              <p>
                Yukarıdaki haklarınızı kullanmak için kimliğinizi tespit edici
                bilgilerle birlikte aşağıdaki kanallardan başvuruda
                bulunabilirsiniz:
              </p>
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <p>
                  <strong>E-posta:</strong>{" "}
                  <a
                    href={`mailto:${settings.email}?subject=KVKK%20Ba%C5%9Fvuru`}
                    className="text-primary hover:underline"
                  >
                    {settings.email}
                  </a>{" "}
                  (konu: “KVKK Kapsamında Bilgi Talebi”)
                </p>
                <p className="mt-2">
                  <strong>Adres:</strong> {settings.address} (iş yerimize elden
                  veya iadeli taahhütlü posta ile)
                </p>
              </div>
              <p>
                Talebiniz, bize ulaştığı tarihten itibaren en geç 30 gün içinde
                ücretsiz olarak yanıtlanır. İşlemin ayrıca bir maliyet
                gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından
                belirlenen tarifedeki ücretler uygulanabilir.
              </p>
            </>
          ),
        },
        {
          id: "guncellemeler",
          title: "Politika Güncellemeleri",
          body: (
            <>
              <p>
                Bu Gizlilik Politikası, yasal düzenlemelere veya veri işleme
                süreçlerimize bağlı olarak güncellenebilir. Güncel sürüm her
                zaman bu sayfada yayımlanır; önemli değişikliklerde güncelleme
                tarihi yenilenir.
              </p>
              <p>
                Çerez kullanımına ilişkin detaylar için{" "}
                <Link
                  href="/cerez-politikasi"
                  className="font-medium text-primary hover:underline"
                >
                  Çerez Politikası
                </Link>{" "}
                sayfasını inceleyebilirsiniz.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
