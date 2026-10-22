/**
 * Faz 1 içerik seed'i: 2 blog yazısı (upsert - idempotent).
 * Çalıştırma: unset DATABASE_URL DATABASE_POSTGRES_URL DATABASE_PRISMA_DATABASE_URL && bun scripts/seed-faz1.ts
 * Not: Ortam değişkenleri_unset edilmeli ki .env'deki gerçek Prisma Postgres bağlantısı okunsun.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const POST_1 = {
  slug: "sigorta-degisimi-fiyatlari-2026",
  title: "Sigorta Değişimi Fiyatları 2026: Elektrik Sigortası Kaç Para?",
  excerpt:
    "2026 İstanbul sigorta değişimi fiyatları: tek sigorta, kaçak akım rölesi ve pano işleri için güncel fiyat aralıkları, fiyatı belirleyen etkenler ve tasarruf önerileri.",
  metaTitle:
    "Sigorta Değişimi Fiyatları 2026 | Elektrik Sigortası Kaç Para? | Zirve Elektrik",
  metaDescription:
    "2026'da sigorta değişimi kaç para? İstanbul güncel fiyat aralıkları: tek sigorta, kaçak akım rölesi, pano yenileme. Fiyatı belirleyen 6 etken ve tasarruf önerileri.",
  coverImage: "/images/blog/sigorta-degisimi-fiyatlari-2026.png",
  tags: "elektrikçi fiyatları, sigorta kutusu, sigorta arızası, kaçak akım rölesi, elektrik güvenliği",
  content: `**Kısa cevap:** 2026 yılında İstanbul'da tek sigorta (şalter) değişimi işçilik dahil yaklaşık **750 – 1.500 TL**, kaçak akım rölesi değişimi **1.200 – 2.500 TL**, panodaki sigorta grubunun birlikte yenilenmesi **1.500 – 3.000 TL** aralığındadır. Komple pano yenileme işleri daire büyüklüğüne göre **4.000 TL'den başlar**. Bu rakamlar 2026 başı İstanbul ortalamasıdır; net fiyat, amper değerine, malzeme markasına ve pano durumuna göre yerinde keşif sonrası verilir.

## Sigorta değişimi 2026'da ne kadar?

Aşağıdaki aralıklar, işçilik ve standart sertifikalı malzeme dahil 2026 İstanbul ortalamasıdır:

- **Tek sigorta (şalter) değişimi:** 750 – 1.500 TL
- **Kaçak akım rölesi değişimi:** 1.200 – 2.500 TL
- **Sigorta grubu yenileme (3-6 modül):** 1.500 – 3.000 TL
- **Pano içi düzenleme ve etiketleme (bağımsız iş):** 500 – 1.200 TL
- **Komple pano yenileme:** 4.000 TL ve üzeri (daireye göre)

Aynı iş iki ustada farklı fiyatlanabilir; önemli olan fiyatın **ne kapsadığıdır**. Malzeme dahil mi, garanti var mı, fatura düzenlenecek mi? Bunlar baştan netleşmeli.

## Sigorta fiyatını ne belirler?

1. **Amper değeri:** 10A'lik priz hattı sigortası ile 40-63A'lik ana sigortanın fiyatı aynı değildir; amper yükseldikçe fiyat artar.
2. **Marka ve kalite:** Schneider, Legrand, Siemens gibi sertifikalı markalar, bilinmeyen ürünlerden %30-60 daha pahalı olabilir ama güvenlik farkı büyüktür.
3. **Pano tipi ve durumu:** Eski tip metal panoda çalışmak, modül yerleşimi ve kablo düzeni nedeniyle ek işçilik gerektirebilir.
4. **Saat ve gün:** Gece ve hafta sonu nöbetçi hizmetlerinde tarife farkı olabilir. Bu fark **iş öncesi telefonda** bildirilmelidir.
5. **İlçe ve mesafe:** Sultangazi merkezli bir ekip için Avrupa Yakası içi ulaşım kısa sürer; uzak ilçelere sevkıyatta küçük fark olabilir.
6. **Aciliyet:** Sigorta atıp geri kalkmıyorsa (tesisat enerjisiz) müdahale acildir ve önceliklidir.

## Sigorta sürekli atıyorsa sadece değiştirmek yeterli mi?

**Hayır.** Sigorta atmak bir arıza değil, **koruma davranışıdır**. Sigortanız sık atıyorsa altta yatan bir sebep vardır: aşırı yük, kısa devre veya kaçak akım. Sigortayı daha yüksek amperli bir ürünle değiştirmek sorunu gizler ve **yangın riski** doğurur; sigorta her zaman kablo kesitine uygun amperde olmalıdır.

Sık atma sebeplerini ve kalıcı çözümleri [Sigorta Sürekli Atıyor rehberimizde](/blog/sigorta-surekli-atiyor-neden-ve-cozumleri) ayrıntılı anlattık. Sürekli atma sorunu olan dairede önce [kaçak tespiti](/hizmetler/elektrik-kacak-tespiti), sonra sigorta değişimi yapılmalıdır.

## Kaçak akım rölesi zorunlu mu, fiyatı ne kadar?

30 mA'lik kaçak akım rölesi, yeni tesisatlarda ve elektrik aboneliği yenilemelerinde dağıtım şirketinin talep ettiği **zorunlu güvenlik bileşenidir**. Röle, insan vücudundan geçebilecek tehlikeli akımı algılayıp saniyenin çok altında keser; yani yalnızca mevzuat gereği değil, **hayat güvenliği** gereğidir.

2026'da röle değişimi (malzeme + işçilik) 1.200 – 2.500 TL aralığındadır. Panonuzda kaçak akım rölesi yoksa, ilk bakımınızda mutlaka ekletin.

## Gece veya hafta sonu sigorta değişimi fiyatı farklı mı?

Çoğu firmada evet; gece, hafta sonu ve resmî tatillerde küçük bir tarife farkı uygulanır. Dikkat edilmesi gereken nokta, bu farkın **iş başlamadan önce açıkça söylenmesidir**. Bizde kural şudur: telefonla aradığınızda ustanız varış ve keşif öncesi tahmini aralığı söyler, iş yeri keşfi sonrası **net fiyat** onayınız alınır; sonradan sürpriz ek ücret çıkmaz.

## Sigorta değişimi ne kadar sürer?

- **Tek sigorta:** 15 – 30 dakika
- **Kaçak akım rölesi dahil:** 30 – 60 dakika
- **Pano yenileme:** 2 – 5 saat (kablo sayısına göre)

Yani "sigorta değişimi" çoğu durumda aynı gün, hatta ilk saat içinde tamamlanan bir iştir. Gecikmenin tek gerekçesi, altta yatan farklı bir arızanın (kaçak, kısa devre) tespit edilmesidir.

## Sigorta değişiminde elektrikçiden ne istemelisiniz?

- **Fatura veya dekont:** Hem ispat hem garanti belgesidir.
- **İşçilik garantisi:** Değişen bileşen için en az 1 yıl garanti isteyin.
- **Doğru amper:** Kablo kesitinize uygun sigorta; "daha güçlüsü güvenlidir" cümlesi yanlıştır.
- **Pano etiketleme:** Hangi sigorta hangi hattı koruyor? Etiketli pano, sonraki arızada dakikalar kazandırır.
- **Marka bilgisi:** Takılan ürünün markası ve serisi faturada yazılı olmalı.

## Sık Sorulan Sorular

**2026'da sigorta değişimi kaç para?** Tek sigorta işçilik dahil 750 – 1.500 TL; kaçak akım rölesi 1.200 – 2.500 TL aralığındadır. Net fiyat keşif sonrası verilir.

**Sigorta değişimi için keşif ücreti alınıyor mu?** İstanbul içi keşif bizde ücretsizdir; ustamız gelmeden tahmini aralığı telefonda paylaşır.

**Sigortayı kendim değiştirebilir miyim?** Elektrik tesisatı üzerinde yapılacak işlemler can güvenliği riski taşır; panoya müdahaleyi yetkili elektrikçi yapmalıdır.

**Eski tip cam sigortadan otomatiğe geçmek ne kadar?** Pano içinde modül yerleşimi mümkünse grup yenileme fiyatına yakındır; panonun tamamen yenilenmesi gerekebilir.

---

Dairenizde sigorta atıyor, pano eskimiş veya kaçak akım rölesi eksikse ustalarımız İstanbul'un 39 ilçesinde aynı gün yerinde tespit yapar. [Bizi arayın](tel:+905377201345) ya da [iletisim formunu](/iletisim) doldurun; net fiyatı işe başlamadan önce söyleyelim.`,
};

const POST_2 = {
  slug: "deprem-sonrasi-elektrik-tesisati-kontrolu",
  title: "Deprem Sonrası Elektrik Tesisatı Kontrolü: Hayati Güvenlik Rehberi",
  excerpt:
    "Depremden sonra elektrik tesisatı neden kontrol edilir? İlk 24 saatte atılacak adımlar, tehlike belirtileri, kontrol süreci ve tesisat yenileme kararları için uzman rehberi.",
  metaTitle:
    "Deprem Sonrası Elektrik Tesisatı Kontrolü | Güvenlik Rehberi | Zirve Elektrik",
  metaDescription:
    "Depremden sonra elektrik tesisatı nasıl kontrol edilir? İlk 24 saat kuralı, yangın riski belirtileri, kaçak akım rölesi ve tesisat yenileme kararları için uzman rehberi.",
  coverImage: "/images/blog/deprem-sonrasi-elektrik-tesisati-kontrolu.png",
  tags: "elektrik güvenliği, ev güvenliği, yangın önleme, elektrik tesisatı yenileme, kaçak akım rölesi",
  content: `**Kısa cevap:** Sarsıntı, tesisatın görünmeyen noktalarında hasar bırakabilir: kablo ekleri gevşer, pano montajı oynar, duvar içindeki hatlar zorlanabilir. Bu hasarlar **kısa devre ve yangın riski** doğurur. Depremden sonra şüphe varsa ana sigortayı indirin, yanma kokusu veya kıvılcım gibi belirtilerde profesyonel kontrol isteyin; sarsıntı güçlüyse (4,5 ve üzeri) tesisatın uzman eliyle kontrol edilmesi önerilir.

## Depremden sonra elektrik tesisatı neden kontrol edilmeli?

Elektrik tesisatı, binanın "sinir sistemi" gibidir: duvar içinde görünmez ama en küçük yapısal hareket onu etkiler. Sarsıntı sırasında;

- kablo ekleri ve bağlantı vida yerleri **gevşeyebilir**,
- panodaki din rayı ve modüller **yerinden oynayabilir**,
- duvar içinden geçen hatlar, betonarme elemanlarda **ezilip kopabilir**,
- topraklama bağlantıları **zayıflayabilir**.

Gevşeyen bir ek noktası, zamanla ısınır ve **elektrik yangınının** en sık başlangıç noktasıdır. Bina dışında göze çarpan hasar olmasa bile, tesisatın kendisi hasarlı olabilir. Bu nedenle kontrol, "elektrik gelince sorun yok" algısının aksine bir güvenlik tedbiridir.

## Deprem sonrası ilk 24 saatte elektrik için ne yapmalı?

1. **Hasar şüphesi varsa ana şalteri indirin.** Duvarlarda yeni çatlak, pano çevresinde toz-döküntü veya tavanda sarkma varsa tesisatı enerjisiz bırakın.
2. **Koku ve kıvılcım taraması yapın.** Yanmış plastik kokusu, prizden veya duvardan ısı, kıvılcım görülüyorsa enerjiyi kesin ve hemen elektrikçi çağırın.
3. **Su ile temas eden tesisatı kesinlikle açmayın.** Islanan priz, pano veya kablo hatları kuruyana kadar enerjisiz kalmalı; açılış öncesi kontrol şarttır.
4. **Jeneratör ve uzatma kablosu disiplinine dikkat edin.** Elektrik yoksa ihtiyaç için tek cihaz, kalın kablo ve aşırı yükleme olmadan bağlanmalıdır.
5. **Gaz kokusu varsa elektrik anahtarına dokunmayın.** Kıvılcım, gaz sızıntısıyla birleştiğinde patlamaya yol açabilir; öncelik binadan güvenli ayrılmaktır.

## Hangi belirtiler acil elektrikçi çağırır?

Depremden sonra şu belirtilerden biri varsa beklemeyin:

- Yanmış plastik/plastik kavurma kokusu
- Priz veya anahtar çevresinde **ısınma**, duvarda renk değişimi
- Priz takarken veya açarken **kıvılcım**
- Daha önce çalışmayan bir hattın açılıp-kapanması, sigortanın sık atması
- Panoda cırt/cırt sesi veya cız sesi
- Çatlağın birebir kablo hattı üzerinde oluşması

Bu belirtiler pano ve hat düzeyinde [arıza tespiti](/hizmetler/elektrik-ariza-tespiti) gerektirir; tespit cihazla yapılır, göze göre tahmin yapılmaz.

## Deprem tesisatın hangi noktalarına zarar verir?

En hassas noktalar şunlardır:

- **Pano montajı ve din rayı:** Panonun duvara sabitliği, modüllerin raya oturuşu.
- **Kablo ekleri:** Kutu içinde yapılan bağlantılar; sarsıntıda en çok gevşeyen yer.
- **Kolon-kiriş kesişen hatlar:** Yapısal elemanlardan geçen kablolar ezilme riski taşır.
- **Topraklama bağlantıları:** Gevşeyen topraklama, kaçak akım rölesinin korumasını zayıflatır.
- **Tavan askıları ve avize bağlantıları:** Sarkma, görsel değil mekanik sorun işaretidir.

## Kaçak akım rölesi depremde hayat kurtarır mı?

Evet. Gevşeyen bir ek noktasından gövdeye sızan akım, 30 mA'lik **kaçak akım rölesi** tarafından anında algılanır ve hat kesilir; yani deprem sonrası oluşabilecek gizli kaçağa karşı bir güvenlik ağıdır. Panonuzda röle yoksa, deprem sonrası kontrol fırsatını [kaçak akım rölesi ekletmek](/hizmetler/elektrik-sigorta-pano-arizalari) için kullanın; malzeme ve işçilikle maliyeti düşüktür, koruması hayattır.

## Tesisat kontrolü nasıl yapılır, ne kadar sürer?

Profesyonel kontrol şu adımlardan oluşur:

1. **Pano incelemesi:** Montaj sağlığı, modül sıkılığı, bağlantı torku, sigorta-röle düzeni.
2. **Devre testleri:** Kaçak ve izolasyon ölçümü ile hatların ayrı ayrı kontrolü (megger/pens ampermetre).
3. **Priz ve anahtar noktaları:** Şüpheli noktalarda açılıp bağlantı kontrolü.
4. **Topraklama sürekliliği:** Toprak hattının prizlerden panoya kadar devamlılığı.
5. **Kısa rapor:** Hangi noktanın sağlam, hangisinin bakım/değişim gerektirdiği.

Dairede bu kontrol genellikle **30 – 60 dakika** sürer. Hasar bulunursa değişim ve [topraklama onarımı](/hizmetler/topraklama-hatti) aynı gün içinde planlanabilir.

## Elektrik tesisatı ne zaman komple yenilenmeli?

Bakır kablo tesisatın ortalama ömrü **20 – 30 yıldır**. Deprem kontrolünde şu bulgular varsa yenileme gündeme alınır:

- Alüminyum kablo kullanımı (eski yapılarda yaygın)
- Topraklamasız prizlerin çoğunlukta olması
- İzolasyon ölçümünde birden fazla hatta yayılmış zayıflık
- Art arda deprem sonrası tekrarlayan kaçak bulguları

Tesisat yenileme kâğıt üzerinde büyük bir iş gibi görünse de, daire içinde [kablo ve hat çekimi](/hizmetler/elektrik-tesisati-tadilat) planlı yürütüldüğünde birkaç güne sığar ve uzun yıllar güvenlik sağlar.

## Sık Sorulan Sorular

**Depremden sonra elektrik açılır mı, beklenir mi?** Göze çarpan hasar ve şüpheli belirti yoksa kullanılabilir; 4,5 ve üzeri sarsıntı sonrası uzman kontrolü önerilir.

**Tesisat kontrolü için keşif ücreti var mı?** İstanbul içi keşif bizde ücretsizdir; kontrol sonrası rapor ve gerekirse net fiyat verilir.

**Binamın ortak tesisatı için kim sorumludur?** Ana hatlar ve daire girişine kadar olan bölüm yönetim kapsamındadır; daire içi tesisat mal sahibinin sorumluluğundadır.

---

Bina sarsıntı yaşadıysa dairenizin tesisatını kontrol ettirmek 1 saatlik işle hayati riski ortadan kaldırır. Ustalarımız İstanbul'un 39 ilçesinde deprem sonrası tesisat kontrolü yapar: [bizi arayın](tel:+905377201345) veya [ariza bildirim formunu](/iletisim) doldurun.`,
};

const today = new Date();

for (const post of [POST_1, POST_2]) {
  const result = await db.blogPost.upsert({
    where: { slug: post.slug },
    create: {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      tags: post.tags,
      published: true,
      publishedAt: today,
    },
    update: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      tags: post.tags,
      published: true,
    },
  });
  console.log(`✓ upsert: ${result.slug} (${result.id})`);
}

const total = await db.blogPost.count({ where: { published: true } });
console.log(`Toplam yayınlanmış yazı: ${total}`);
await db.$disconnect();
