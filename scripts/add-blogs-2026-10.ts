/**
 * SEO/GEO/AEO odaklı 5 yeni blog yazısı ekler ve 6 mevcut blogun
 * kapak görselini benzersiz yeni görsellerle günceller.
 *
 * Çalıştırma (sandbox'ta stale env varsa önce unset):
 *   unset DATABASE_URL DATABASE_POSTGRES_URL DATABASE_PRISMA_DATABASE_URL
 *   bun run scripts/add-blogs-2026-10.ts
 */
import { PrismaClient } from "@prisma/client";

const rawUrl = process.env.DATABASE_URL;
const datasourceUrl = rawUrl ? rawUrl.replace(/^postgres:\/\//, "postgresql://") : undefined;
const prisma = new PrismaClient({ datasourceUrl });

const DAY = 24 * 60 * 60 * 1000;
const publishedAt = (daysAgo: number) => new Date(Date.now() - daysAgo * DAY);

interface NewPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  daysAgo: number;
}

const posts: NewPost[] = [
  {
    slug: "elektrikci-nasil-secilir-guvenilir-elektrikci-10-kriter",
    title: "Elektrikçi Nasıl Seçilir? Güvenilir Elektrikçi İçin 10 Kriter",
    excerpt:
      "Güvenilir bir elektrikçi seçmek hem cebinizi hem güvenliğinizi korur. Bu rehberde elektrikçi seçerken dikkat etmeniz gereken 10 kriteri, fiyat araştırmasından garanti belgesine kadar sıralıyoruz.",
    coverImage: "/images/blog/elektrikci-secimi.png",
    tags: "elektrikçi seçimi, güvenilir elektrikçi, yetkili elektrikçi, istanbul elektrikçi",
    metaTitle: "Elektrikçi Nasıl Seçilir? Güvenilir Elektrikçi İçin 10 Kriter",
    metaDescription:
      "Elektrikçi nasıl seçilir? Referans, garanti, fiyat şeffaflığı ve sertifikasyon gibi 10 kriterle güvenilir İstanbul elektrikçisini ayırt etmeyi öğrenin.",
    daysAgo: 0,
    content: `Güvenilir bir elektrikçi seçmenin en hızlı yolu şudur: **fiyatı arama aşamasında net söyleyen, işi garanti belgesiyle teslim eden ve iletişim bilgileri şeffaf bir servisi** tercih edin. Elektrik işi hem maliyet hem de can güvenliği açısından risk taşır; yanlış seçim yaparsanız küçük bir priz değişimi bile pahalı bir arıza serisine dönüşebilir.

Bu rehberde, İstanbul genelinde on binlerce daire tesisatına hizmet vermiş bir ekibin deneyimiyle, elektrikçi seçerken kullanabileceğiniz 10 somut kriteri paylaşıyoruz.

## Elektrikçi Seçerken Dikkat Edilmesi Gereken 10 Kriter

### 1. Fiyatı telefonla ve net bir şekilde söylüyor mu?

Güvenilir elektrikçi, arama sırasında keşif bedeli, çağrı bedeli ve saat ücreti gibi kalemleri açıkça belirtir. "Gelince konuşuruz" diyen bir servis, kapıdan sonra çıkartacağınız faturayı şimdiden size söylememiş olur. [Elektrikçi keşif ve tespit ücretlerinin nasıl hesaplandığını](/blog/elektrikci-keşif-tespit-ucreti-nasil-hesaplanir) önceden bilmek, pazarlık gücünüzü artırır.

### 2. Keşif ücreti varsa, bu ücret önceden bildiriliyor mu?

Arıza tespiti çoğu zaman ücrete tabidir ve bu normaldir. Sorun, ücretin kapıya gelindikten sonra söylenmesidir. Şeffaf servisler keşif ücretini arama aşamasında söyler; işi yaptırsanız da yaptırmasanız da bu ücretin ne kadar olduğunu bilirsiniz.

### 3. İşini garanti belgesiyle teslim ediyor mu?

Değiştirilen sigorta, çekilen hat veya yenilenen pano için en az 3-12 ay işçilik garantisi isteyin. Garanti vermeyen elektrikçi, işinin kalitesine güvenmiyor olabilir. Yazılı garanti, aynı arıza tekrarladığında tekrar ücret ödemenizi engeller.

### 4. Fatura ve fiş veriyor mu?

Fatura yalnızca vergi kaydı değil, aynı zamanda garanti kapsamının kanıtıdır. KDV dahil net fiyat isteyin; "faturasız daha ucuz" teklifi, garanti ve sorumluluktan vazgeçmek demektir.

### 5. Telefonunuz açıyor mu ve gecikme süresini söylüyor mu?

Acil arızalarda ulaşılabilirlik hayati önem taşır. İyi bir [7/24 acil elektrikçi servisi](/blog/gece-elektrikcisi-hafta-sonu-acil-servis), tahmini varış süresini net söyler ve o süreye uyar. "30 dakikadayız" deyip 3 saatte gelen bir servis, zaman yönetimi kadar güvenilirlik konusunda da soru işareti üretir.

### 6. Malzeme markasını ve kalitesini açıklıyor mu?

Aynı iş için kullanılan sigorta, kablo veya priz markası fiyatı ve ömrü doğrudan etkiler. TSE belgeli malzeme kullanan ve markayı size söyleyen elektrikçi, işinin arkasında durur. Kalitesiz malzeme, kısa vadede ucuz ama uzun vadede pahalıdır.

### 7. Arızayı önce açıklıyor, sonra fiyat veriyor mu?

İyi elektrikçi, arızanın nedenini teknik olarak anlatır ve çözüm seçeneklerini sıralar. Sadece "bozuk, şunu değiştiricez" diyen ve gerekçesiz fiyat veren kişilere dikkat edin. [Sigortanın neden attığı](/blog/sigorta-surekli-atiyor-neden-ve-cozumleri) gibi her arızanın birden fazla olası nedeni vardır; doğru teşhis, doğru fiyatın ön koşuludur.

### 8. Referansları ve çevrimiçi yorumları kontrol edin

Google Haritalar yorumları, işletmenin gerçek müşterilerle çalışıp çalışmadığını gösterir. Yorumlarda "fiyat söylediği gibi mi", "arıza tekrarladı mı" gibi başlıklara özellikle bakın. Aile ve arkadaş referansları da hâlâ en güvenilir kaynaklardan biridir.

### 9. Bölgenizde düzenli hizmet veriyor mu?

İstanbul gibi dev bir şehirde trafiği hesaplayamayan bir servis, söz verdiği saatte gelemez. Bölgenize yakın, o ilçede düzenli iş yapan bir elektrikçi hem daha hızlı hem genellikle daha ekonomiktir. [İstanbul'daki 39 ilçenin tamamında](/bolgeler) hizmet veren yerel bir ağ, acil durumlarda belirleyici fark yaratır.

### 10. Mevzuatı ve güvenlik standartlarını biliyor mu?

Topraklama, kaçak akım rölesi ve pano düzeni gibi konularda güncel mevzuatı bilen bir elektrikçi, işi "çalışıyor" değil "güvenli ve yönetmeliğe uygun" olarak teslim eder. Özellikle [topraklama zorunluluğu](/blog/topraklama-zorunlu-mu-neden-onemli) ve [kaçak akım rölesi kurulumu](/blog/kacak-akim-rolesi-nedir-ne-ise-yarar) gibi konularda soru sorun; cevaplar net ve emin olmalı.

## Ucuz Elektrikçi Tuzağına Dikkat

Piyasada ortalamanın çok altında fiyat veren, ancak işi belgesiz ve garantisiz teslim eden servisler yaygındır. Bu tekliflerin tipik sonu şudur:

- Aynı arıza 1-2 ay içinde tekrarlar ve toplam maliyeti ikiye katlar
- Hatalı bağlantı ısınma, kıvılcım ve [yangın riskine](/blog/elektrik-yangini-nasil-onlenir) yol açar
- Sigortasız iş nedeniyle hasar durumunda hak kaybı yaşanır

**Doğru fiyat, en ucuz fiyat değil; işin kalitesine, malzemeye ve garantiye göre adil olan fiyattır.**

## Elektrikçi Araştırırken Hızlı Kontrol Listesi

1. Fiyat kalemleri telefonla söylendi mi?
2. Keşif ücreti önceden bildirildi mi?
3. Garanti süresi net mi?
4. Fatura verilecek mi?
5. Varış süresi söylendi mi?
6. Malzeme markası açıklığa kavuştu mu?
7. Arıza nedeni teknik olarak anlatıldı mı?
8. Çevrimiçi yorumlar tutarlı mı?
9. Servis bölgenizde mi?
10. Mevzuat bilgisi sorularınıza tatmin edici mi?

Bu 10 sorunun en az 9'una "evet" aldığınız servisi gönül rahatlığıyla seçebilirsiniz.

## Sık Sorulan Sorular

### Elektrikçi çağırmadan önce ne yapmalıyım?

Sigorta kutusunu kontrol edin, hangi sigortanın attığına bakın ve arızayı mümkün olduğunca tarif edin: "mutfakta priz kullanınca atıyor" gibi net bir bilgi, hem telefonda fiyat tahmini almanızı hem de keşif süresinin kısalmasını sağlar.

### Acil elektrikçi fiyatları normal elektrikçiden pahalı mı?

Gece, hafta sonu ve resmî tatillerde çalışma çağrı bedeli genellikle gündüzden yüksektir; bu sektörel standarttır. Önemli olan, ücretin arama aşamasında açıkça söylenmesidir. Detaylı tablomuzu [acil elektrikçi fiyatları rehberinde](/blog/acil-elektrikci-fiyatlari-istanbul) bulabilirsiniz.

### Elektrikçinin işini garanti etmesi yasal olarak zorunlu mu?

Güvenlik ve mesleki alışkanlık açısından beklentidir; yazılı garanti talep etmek her zaman hakkınızdır. Garanti vermeyi reddeden servise karşı alternatif aramaktan çekinmeyin.

### İstanbul'da hangi ilçelerde hizmet veriyorsunuz?

İstanbul'un Avrupa ve Anadolu Yakası'ndaki 39 ilçenin tamamında 7/24 hizmet veriyoruz. Bölgenizdeki ortalama varış süresini öğrenmek için bizi arayabilirsiniz.`,
  },
  {
    slug: "elektrik-arizasi-kim-oder-kiraci-ev-sahibi",
    title: "Elektrik Arızası Kim Öder? Kiracı ve Ev Sahibi Sorumluluk Rehberi",
    excerpt:
      "Daire içindeki elektrik arızasının masrafı kimin? Kiracı mı, ev sahibi mi, site yönetimi mi yoksa dağıtım şirketi mi öder? Türk Borçlar Kanunu ve Kat Mülkiyeti Kanunu çerçevesinde net cevaplar.",
    coverImage: "/images/blog/kiraci-ev-sahibi.png",
    tags: "elektrik arızası kim öder, kiracı ev sahibi sorumluluğu, daire içi tesisat, ortak tesisat",
    metaTitle: "Elektrik Arızası Kim Öder? Kiracı ve Ev Sahibi Rehberi",
    metaDescription:
      "Elektrik arızası kimin sorumluluğunda? Kiracı, ev sahibi, site yönetimi ve dağıtım şirketi sorumluluk sınırlarını hukuki çerçevesiyle açıkça anlattık.",
    daysAgo: 1,
    content: `Elektrik arızası masraflarının sorumluluğu **arızanın nerede olduğuna göre belirlenir**: sayaçtan daireye kadar daire içi tesisat ev sahibinin, küçük tüketim ve bakım onarımları kiracının, bina ortak hatları kat maliklerinin, sayaç öncesi şebeke ise dağıtım şirketinin sorumluluğundadır.

Bu ayrım, kiralık dairelerde en sık anlaşmazlık konularından biridir. Bu rehberde sorumluluk sınırlarını hukuki dayanaklarıyla, örneklerle ve tek tek arıza senaryolarıyla açıklıyoruz.

## Sorumluluğu Belirleyen 4 Temel Bölge

Elektrik altyapısını dört bölgeye ayırdığınızda sorumluluk netleşir:

- **1. Bölge – Şebeke (sayaç öncesi):** Sokaktan bina sayacına kadar olan hatlar dağıtım şirketi sorumluluğundadır. Bu bölgedeki arıza (kesinti, sayaç hatası, şebeke voltaj sorunu) tüketici tarafından ücretlendirilemez.
- **2. Bölge – Bina ortak tesisatı:** Merkezi pano, kat hattı, ortak aydınlatma ve bina ana kablosu Kat Mülkiyeti Kanunu'na göre ortak tesisattır; masraf kat maliklerince gider payı üzerinden karşılanır. Kiracı bu kaleme doğrudan ücret ödemez.
- **3. Bölge – Daire içi tesisat (sayaç sonrası):** Dairenin sigorta kutusu, duvar içi kablolar, priz ve anahtar hatları ev sahibinin ana onarım sorumluluğundadır. Tesisatın yenilenmesi, [panonun yenilenmesi](/blog/elektrik-panosu-yenileme) ve [topraklama hattı kurulumu](/blog/topraklama-zorunlu-mu-neden-onemli) bu kapsamdadır.
- **4. Bölge – Küçük bakım ve tüketim:** Ampul değişimi, şalter kapatma/açma, kırık priz kapağı gibi küçük onarımlar Türk Borçlar Kanunu'na göre kiracının günlük kullanım sorumluluğundadır.

## Kiracının Sorumluluğu Nelerdir?

Kiracı, daireyi teslim aldığı şekilde kullanmak ve küçük onarımları üstlenmekle yükümlüdür. Elektrik açısından kiracının ödemesi gerekenler:

- Ampul, spot ve floresan değişimi
- Priz kapağı, anahtar tuşu gibi küçük aksesuar onarımları
- Kullanım hatasından doğan arızalar (aşırı yüklenen priz, su teması sonucu bozulan girişim gibi)
- Daire sigortasının attığı durumda aşırı yüklenmeye neden olan cihaz kullanımının düzeltilmesi

Önemli bir ayrıntı: **kiracı, arızanın giderilmesi için ev sahibini derhal haberdar etmekle yükümlüdür.** Bildirilmeyen ve ilerleyen arızalarda (örneğin ısınan prizin [yangına dönüşmesi](/blog/elektrik-yangini-nasil-onlenir)) kusur payı kiracıya geçebilir.

## Ev Sahibinin Sorumluluğu Nelerdir?

Ev sahibi, kiralananın kullanıma elverişli olmasından sorumludur. Elektrikte bu şunları kapsar:

- Daire içi kablo tesisatının eskiyip yenilenmesi gerektiği durumlarda tesisat yenileme masrafı
- Sigorta kutusu, kaçak akım rölesi ve pano bileşenlerinin değişimi
- Sürekli tekrarlayan arızaların kalıcı çözümü (örneğin her hafta atılan sigortanın [kaçak tespitiyle](/blog/elektrik-kacagi-tespiti-nasil-yapilir) kökünden çözülmesi)
- Eski binalarda yönetmelik gereği zorunlu güvenlik ekipmanlarının kurulumu

Pratik kural şudur: **arıza daireyi teslim ettiğiniz andaki tesisattan kaynaklanıyorsa ev sahibi, kiracının kullanım biçiminden kaynaklanıyorsa kiracı öder.**

## Sık Görülen Senaryolar ve Kim Öder Cevapları

- **Sigorta sürekli atıyor:** Sebebi daire içi tesisat veya kaçak akımsa ev sahibi; daireye bağlanan fazla cihaz yüküysen kiracı tesisleri düzeltir. Ayrıntılı çözüm rehberimiz [sigorta sürekli atıyor](/blog/sigorta-surekli-atiyor-neden-ve-cozumleri) yazımızda.
- **Evin bir kısmında elektrik yok:** Genellikle faz kopması veya kutu içi bağlantı arızasıdır; daire içi olduğundan ev sahibi sorumludur. Detaylar [evin yarısında elektrik yok](/blog/evin-yarisinda-elektrik-yok-cozumu) yazımızda.
- **Komşu daireyle birlikte elektrik gitti:** Kat veya bina hattı söz konusudur; masraf ortak tesisat kapsamında kat maliklerine dağılır.
- **Sokakta kesinti var:** Dağıtım şirketi sorumluluğudur; elektrikçiden ücret talep edilemez.
- **Isınan priz ve kıvılcım:** Acil müdahale gerekir; onarım daire içi tesisattan ev sahibine, kullanım hatası kiracıdaysa kiracıya ödedirilir. Arıza büyümeden [priz arızası](/hizmetler/priz-anahtar-arizalari) hizmetiyle müdahale edin.

## Kira Sözleşmesindeki "Elektrik Arızaları Kiracıya Aittir" Maddesi Geçerli mi?

Sözleşmelerle Türk Borçlar Kanunu'nun emredici hükümleri tamamen devredilemez. Kiracıya, kanunun kendisine verdiği yükümlülüklerin üstünde sorumluluk yükleyen maddeler yargı uygulamalarında geçersiz sayılabilir. Yani sözleşmede "bütün elektrik arızaları kiracıya aittir" yazsa bile, tesisatın esaslı onarımı ev sahibinde kalır. Buna rağmen maddi sorumlulukları netleştiren adil bir madde, ileride çıkacak anlaşmazlıkları önler.

## Anlaşmazlık Yaşamamak İçin 5 Somut Tavsiye

1. **Kira başlangıcında tesisat durumu tespit tutanağıyla kaydedin:** eski pano, atılan sigorta gibi mevcut sorunları yazılı not edin.
2. **Elektrikçi raporu isteyin:** arıza kaynağına dair teknik rapor, kimin ödeyeceğine dair objektif kanıttır.
3. **Fatura ve fiş saklayın:** ödemeler iade talep edilebilmesi için belgelendirilmeli.
4. **Bildirimi yazılı yapın:** WhatsApp mesajı bile kanıt olarak değerlidir.
5. **Küçük onarım eşikini sözleşmede netleştirin:** "belirli bir tutara kadar küçük onarımlar kiracıya aittir" gibi açık bir madde hukuka uygun biçimde kararlaştırılabilir.

## Sık Sorulan Sorular

### Sayacın yanındaki ana sigorta bozuldu, kim öder?

Sayacın hemen sonrasındaki ana sigorta ve kutu genellikle daireye ait tesisat sayılır; ev sahibi karşılar. Sayacın kendisindeki veya öncesindeki arızada dağıtım şirketi yetkilidir.

### Kiracı elektrikçi çağırabilir mi?

Acil ve güvenliği ilgilendiren durumlarda evet; masrafı ev sahibinin sorumluluk alanına giren arızalardaysa faturayla talep edebilir. Mümkünse önce bildirim, sonra müdahale sırası uygundur.

### Site yönetimi elektrik arızasında ne kadar sorumlu?

Yalnızca ortak tesisat için sorumludur: bina ana panosu, kat hattı ve ortak aydınlatma. Daire içi arızalara müdahale ve masraf yönetiminin kapsamı dışındadır.

### Elektrikçi arıza raporu hukuki delil olur mu?

Elektrikçinin yazılı arıza tespit raporu, tahkimat ve mahkeme süreçlerinde uzman raporunu destekleyen değerli bir delildir. Rapor üzerinde tarih, arıza kaynağı ve imza bulunmalıdır.

İstanbul'un her ilçesinde, kiracı ve ev sahiplerinin masraflarını netleştiren yazılı arıza raporuyla 7/24 hizmet veriyoruz. Arıza sorumluluğunu netleştirmek için bize ulaşın.`,
  },
  {
    slug: "kacak-akim-rolesi-nedir-ne-ise-yarar",
    title: "Kaçak Akım Rölesi Nedir, Ne İşe Yarar? Zorunluluk ve Kurulum",
    excerpt:
      "Kaçak akım rölesi (FİPR) nedir, ne işe yarar, neden 30 mA'dir ve zorunlu mu? Bu hayat kurtaran cihazın çalışma prensibini, test yöntemini ve kurulum detaylarını uzman diliyle anlattık.",
    coverImage: "/images/blog/kacak-akim-rolesi.png",
    tags: "kaçak akım rölesi, FİPR, kaçak akım rölesi zorunlu mu, elektrik güvenliği",
    metaTitle: "Kaçak Akım Rölesi Nedir, Ne İşe Yarar? Zorunluluk Rehberi",
    metaDescription:
      "Kaçak akım rölesi nedir ve ne işe yarar? 30 mA hassasiyeti, çalışma prensibi, test tuşu kullanımı, zorunluluk durumu ve kurulum maliyetleri bu rehberde.",
    daysAgo: 2,
    content: `Kaçak akım rölesi, elektrikte **insanın hayatını koruyan tek otomatik cihazdır**: tesisattan toprağa doğru bir kaçak meydana geldiğinde — yani akım bir insan vücudundan veya hatalı bir cihazdan geçmeye başladığında — saniyenin onda birinden kısa sürede elektriği keser. Standart hassasiyeti **30 mA (miliamper)**'dir; bu değer, insan kalbine tehlike verecek akımların eşiğinin altındadır.

Elektrik sigortası (otomatik sigorta) kabloları aşırı yükten korur; kaçak akım rölesi ise insanı elektrik çarpmasından ve tesisatı yangından korur. İkisi birbirinin yerine geçmez, birlikte çalışmak zorundadır.

## Kaçak Akım Rölesi Nasıl Çalışır?

Cihazın prensibi basit ve zekidir:

1. Normal koşullarda daireden çıkan akım ile dönen akım eşittir.
2. Elektriğin bir kısmı toprağa kaçıyorsa (örneğin bozuk bir çamaşır makinesi gövdesinden) gelen ve giden akım arasında fark oluşur.
3. Röle bu fark 30 mA'yı aştığı anda devreyi keser; kesme süresi standartlara göre 0,3 saniyenin altındadır.

Bu süre, çarpan bir insanın kalp ritmini bozmaya yetmez. Elektrik tarihinin en etkili güvenlik icatlarından biridir.

## Kaçak Akım Rölesi Zorunlu mu?

Evet. Türkiye'de Elektrik İç Tesisleri Yönetmeliği ve ilgili standartlar uyarınca **yeni yapılacak konutlarda kaçak akım rölesi zorunludur**. Koruma kuralları şöyle özetlenebilir:

- Yeni daire ve binalarda pano girişinde kaçak akım rölesi bulunmalıdır
- Islak hacimler (banyo, mutfak) ve dış mekân prizleri ekstra korunma gerektirir
- Eski binalarda yenileme ve tadilat dönemlerinde röle kurulumu standart hale gelmiştir

Evinizde röle olup olmadığını anlamak için [panonuzu açıp](/blog/elektrik-panosu-yenileme) "T" veya "TEST" yazan tuşu olan cihazı arayın. Bulamıyorsanız, daireniz muhtemelen korumasızdır.

## Kaçak Akım Rölesi Olmadan Ne Olur?

Korumasız dairede kısa devre dışındaki çoğu tehlikeli durum sigortayı atmaz:

- Islak el ile dokunulan bozuk prizden geçen akım sigortayı atmayabilir; röle olmayan dairede bu doğrudan hayat riskidir
- Gövdesi kaçıran beyaz eşya, dokunan kişiyi çarpabilir
- İzolasyonu yıpranmış hatlar, uzun süre örtük kaçakla [yangına zemin hazırlar](/blog/elektrik-yangini-nasil-onlenir)
- Örtük kaçaklar, [elektrik faturasını yükseltir](/blog/elektrik-faturasi-neden-yuksek)

Yani röle sadece insan koruması değil, aynı zamanda yangın ve fatura korumasıdır.

## FİPR ve Öğlemeli Röle Farkı Nedir?

Piyasada iki temel tip bulunur:

- **FİPR (faz ötörmeli kaçak akım rölesi):** besleme voltajına bağlı çalışır. Sıfır iletkeni kopukluğu gibi durumlarda fonksiyon kaybedebilir; eski dairelerde görülür.
- **Öğlemeli (akım trafolu) röle:** besleme voltajından bağımsız, kendi ölçüm devresiyle çalışır. Güvenilirliği yüksektir; günümüzde konutlarda tercih edilen ve yönetmeliklerde esas alınan tiptir.

Yeni kurulumlarda öğlemeli tip, 30 mA hassasiyet ve uygun akım kapasitesi (tipik olarak 25-40 A) ile seçilir. Bu ayrımın doğru yapılması uzmanlık gerektirir; [sigorta ve pano arızaları](/hizmetler/elektrik-sigorta-pano-arizalari) hizmetimizde röle seçimi ve kurulumu yapılmaktadır.

## Kaçak Akım Rölesi Nasıl Test Edilir?

Röleler mekanik cihazdır ve dönemsel test ister. Ayda bir kez yapılacak 10 saniyelik test yeterlidir:

1. Röle üzerindeki **TEST** tuşuna basın.
2. Röle derhal düşmeli, daire elektrikten kesilmelidir.
3. Düşmüyorsa röle arızalı demektir; derhal değiştirilmelidir.
4. Test sonrası kolu yukarı kaldırarak elektriği geri getirin.

Ayrıca şu durumlar, röle durumunu okumanıza yardımcı olur:

- **Hiç atmiyor ve TEST ile de düşmüyor:** cihaz arızalı, değişim gerekli
- **Sık atıyor:** tesisatta gerçek kaçak var; [kaçak tespiti](/hizmetler/elektrik-kacak-tespiti) yapılmalı
- **Cihaz takınca atıyor:** o cihazın gövde izolasyonu bozuk olabilir
- **Yıldırımlı havada atıyor:** aşırı gerilim koruma modülüyle birlikte değerlendirilmeli

## Kurulumda Dikkat Edilecek Teknik Noktalar

- Röle, pano girişinde ana sigortadan sonra tüm daireyi koruyacak biçimde konumlandırılır
- Banyo ve mutfak hattı gibi kritik hatlar ayrı röleyle korunabilir
- Sıfır iletkenin doğru bağlanması şarttır; yanlış bağlanmış röle ya hiç atmaz ya da sürekli atar
- Topraklamasız tesisatta röle koruması kısmi kalır; [topraklama hattı](/hizmetler/topraklama-hatti) ile birlikte kurulmalıdır
- Kurulum sonrası akım kaçak testi ile 30 mA eşiği doğrulanmalıdır

## Sık Sorulan Sorular

### Kaçak akım rölesi elektrik çarpmasını tamamen önler mi?

30 mA / 0,3 s değerleri hayatı koruyacak seviyededir ve elektrik çarpması ölümlerinin büyük kısmını engeller. Yine de röle, tesisat kurallarına ve topraklamaya tam uyumun yerini tutmaz; üçlü koruma (röle + topraklama + doğru tesisat) esastır.

### Kaçak akım rölesi neden sık sık atıyor?

Tesisatta gerçek bir kaçak, nemli ortamdan kaynaklanan akım sızıntısı veya arızalı bir cihaz olabilir. Röleyi devre dışı bırakmak asla çözüm değildir ve son derece tehlikelidir. Kaçağın kaynağı [kaçak tespiti yöntemleriyle](/blog/elektrik-kacagi-tespiti-nasil-yapilir) bulunmalıdır.

### Röle kurulumu ne kadar sürer?

Standart bir konut panosunda 1-2 saat içinde kurulur; pano yetersiz veya çok eskiyse pano yenileme ile birlikte değerlendirilir. Kurulum sonrası tüm hatlar test edilir.

### Evinizde kaçak akım rölesi var mı, nasıl anlarım?

Panonuzu açın; üzerinde TEST tuşu olan ve tüm sigortaları besleyen geniş cihaz röledir. Panonuz sadece tek sıra otomatik sigorta içeriyorsa röle büyük olasılıkla yoktur. Emin olamıyorsanız kısa bir tespit randevusu isteyebilirsiniz.

Kaçak akım rölesi kurulumu, değişimi ve tesisat kaçak testi için İstanbul'un tamamında 7/24 hizmet veriyoruz. Panonuzu değerlendirmek için bize ulaşın.`,
  },
  {
    slug: "elektrik-yangini-nasil-onlenir",
    title: "Elektrik Yangını Nasıl Önlenir? Nedenleri ve Hayati Önlemler",
    excerpt:
      "Elektrik yangınları ev yangınlarının önde gelen nedenlerinden biri. Priz yangınından pano alevlenmesine kadar nedenleri, önleme kontrol listesini ve yangın anında hayati davranış kurallarını sıraladık.",
    coverImage: "/images/blog/elektrik-yangini.png",
    tags: "elektrik yangını, elektrik yangını nasıl söndürülür, yangın güvenliği, priz yangını",
    metaTitle: "Elektrik Yangını Nasıl Önlenir? Nedenleri ve Hayati Önlemler",
    metaDescription:
      "Elektrik yangını nasıl önlenir? Isınan priz, aşırı yüklü prizler ve eski tesisat gibi nedenler, 12 maddelik önleme listesi ve yangın anında yapılması gerekenler.",
    daysAgo: 3,
    content: `Elektrik yangını, **ısıyan bir bağlantı, kaçıran bir hat veya aşırı yüklenmiş bir prizin** tutuşmasıyla başlar ve ev yangınlarının önde gelen nedenlerinden biridir. Önlemenin yolu üç kelimedir: **ısıtan noktayı fark etmek, yükü dengelemek, tesisatı denetlemek.** Yangın çıktıysa ise su kullanılmaz; elektrik kesilir ve kuru tozlu veya CO2 söndürücüyle müdahale edilir.

İstanbul gibi yoğun ve eski konut stoğu bulunan bir şehirde, elektrik kaynaklı itfaiye müdahalelerinin önemli bir bölümü priz, pano ve uzatma kablosu kaynaklıdır. İyi haber: bu yangınların büyük çoğunluğu basit kontrollerle önlenebilir.

## Elektrik Yangınına Neden Olan 7 Temel Faktör

### 1. Aşırı yüklenmiş prizler

Tek prize bağlanan çoklu priz uzatmaları, özellikle ısıtıcı, klima ve kombi gibi yüksek güçlü cihazlarla birleştirildiğinde kabloların taşıyamayacağı yük oluşur. Kablo ısınır, izolasyon erir ve temas noktasında alevlenme başlar.

### 2. Gevşek ve oksitlenmiş bağlantılar

Zamanla gevşeyen klemens ve oksitlenen terminaller, direnç oluşturur ve sürekli ısınır. Pano içindeki gevşek bir bağlantı, aylarca sessizce ısınıp [pano yangınına](/blog/elektrik-panosu-yenileme) dönüşebilir.

### 3. Eski ve yıpranmış tesisat

Dekorun altında kalan kablolar unutulur. 25-30 yılı aşan tesisatlarda izolasyon kurur, hatlar günümüz yüklerini taşımaz. Tesisat yaşını kontrol etmek için [tesisat ömrü rehberimize](/blog/elektrik-tesisati-kac-yil-dayanir-yenileme-rehberi) bakın.

### 4. Isınan priz ve anahtarlar

Dokunulduğunda ılık değil, sıcak gelen bir priz kısa süre içinde tutuşabilir. Isınan priz genellikle gevşek bağlantı veya ark (kıvılcım) belirtisidir; bu konuyu [priz neden isınır](/blog/priz-neden-isiniyor-kivilcim-cikiyor) rehberimizde ayrıntılı anlattık.

### 5. Kaçak akım ve korumasız devreler

Kaçak akım rölesi olmayan dairelerde örtük kaçaklar yıllarca fark edilmeden ısı üretir. Röle, hem can koruması hem de yangın korumasıdır; ayrıntıları [kaçak akım rölesi rehberinde](/blog/kacak-akim-rolesi-nedir-ne-ise-yarar) bulabilirsiniz.

### 6. Yanlış sigorta kullanımı

Atan sigortayı tel ile bağlamak, daha yüksek amperli sigorta takmak veya sigortayı hiç atmayacak biçimde etkisiz hale getirmek, tesisatı korumasız bırakan ölümcül hatalardır. Sigorta atıyorsa sorun [kaçağın tespitiyle](/blog/sigorta-surekli-atiyor-neden-ve-cozumleri) çözülmelidir.

### 7. Yanıcı ortama yakın elektrik cihazları

Perde, kilim, karton kutu üzerinde bırakılan şarj aletleri ve ısıtıcılar, en sık görülen başlangıç noktalarındandır.

## Elektrik Yangını Nasıl Önlenir? 12 Maddelik Kontrol Listesi

1. Isıtıcı, klima ve kombiyi asla çoklu priz uzatmasına bağlamayın; doğrudan duvar prizine takın
2. Uzatma kablolarını yere serili halde, kilim ve halı altından geçirmeyin
3. Dokununca sıcak gelen priz veya anahtar olduğu an kullanımı durdurun ve elektrikçi çağırın
4. Yatarken ve evden çıkarken kullanılmayan yüksek güçlü cihazların fişini çekin
5. Telefon ve cihaz şarjlarını yatak üzerinde, yorgan/perde arasından uzakta bırakmayın
6. Sigorta kutusuna tel bağlama ve yüksek amper taklidi yapmayın; atan sigortanın nedenini çözdürün
7. Evinizde kaçak akım rölesi yoksa kurulum yaptırın
8. 25 yaşından eski tesisat varsa genel kontrol ve gerekiyorsa yenileme planlayın
9. Panonuzda ısınma, yanık kokusu veya uğultu fark ederseniz elektrik kesin ve acil servis çağırın
10. Banyoda uygunsuz priz, dış mekânda korumasız priz gibi riskli uygulamalardan kaçının
11. Su ısıtıcı gibi yüksek akımlı küçük cihazları aynı çoklu prize yığmayın
12. Yılda bir kez elektrikçiyle genel tesisat kontrolü yaptırın; özellikle pano bağlantıları sıkılmalıdır

Bu listenin ilk 6 maddesi hiçbir maliyet gerektirmez; yalnızca farkındalıktır.

## Yangın Çıktı Anında Ne Yapılmalı?

- **İlk adım elektriği kesmektir:** pano veya tesisat ana şalterinden dairenin elektriğini kesin. Bu, alevin beslenmesini durdurur.
- **Asla su dökmeyin:** şebeke elektriği kesilmiş olsa bile su, alevi yayabilir ve sizi çarpabilir. Elektrik yangını, sınıfı itibariyle su ile söndürülmez.
- **Kuru tozlu veya CO2 yangın tüpü kullanın:** evlere uygun olan bu tipler, elektrikli yangınları güvenle söndürür.
- **Alevi bağırsak, bez, battaniye gibi malzemelerle boğulmaya çalışmayın:** yanlış malzeme tutuşabilir.
- **Kontrol edemiyorsanız derhal 112'yi arayın ve binayı boşaltın:** duman, alevden daha hızlı öldürür.
- **Çıkarken kapıyı kapatın:** kapalı kapı, alevin yayılmasını yavaşlatır.

## Elektrik Yangını Riskini En Çok Nerede Görülür?

- Mutfaklar: çoklu prizler, ısıtıcı cihazlar ve su teması bir aradadır
- Banyolar: prizsiz olması gereken alanlarda uygunsuz priz kullanımı
- Salon ve yatak odaları: uzatma kabloları ve şarj cihazları
- Balkon ve teraslar: hava koşullarına açık uygunsuz hatlar
- Bina girişleri ve merdiven altları: ortak pano çevresindeki yığınlamalar

Eski bina yoğun bölgelerde (örneğin Fatih, Gaziosmanpaşa, Üsküdar'ın iç kesimleri gibi) tesisat yaşı, riski belirgin biçimde artırır. [İlçe bölge sayfamızdan](/bolgeler) bölgenize uygun servise ulaşabilirsiniz.

## Sık Sorulan Sorular

### Elektrik yangınına su dökülür mü?

Hayır. Elektrik yangınına su dökmek hem çarpma riski oluşturur hem de alevi yayabilir. Önce elektrik kesilmeli, ardından kuru tozlu veya CO2 tüpü kullanılmalıdır.

### Priz neden kendiliğinden tutuşur?

Gevşek bağlantı, ark (kıvılcım) veya aşırı yüklenme priz içinde sürekli ısınmaya neden olur. Isınma, plastik gövdeyi tutuşturacak seviyeye ulaşabilir. Isınan prizi beklemeden [arıza tespiti](/hizmetler/elektrik-ariza-tespiti) ile kontrol ettirin.

### Elektrik yangını söndürücü hangi tipte olmalı?

Ev ve ofislerde kuru tozlu (ABC) veya CO2 tüpleri uygundur. Su basınçlı tüpler elektrik yangınında kullanılmaz. Tüpün basıncını yılda bir kez kontrol edin.

### Hangi kokular yangın öncüsüdür?

Balık gibi keskin yanık kokusu, plastik yanması kokusu ve açıklanamayan ısınma kokuları, ısınan bağlantı ve izolasyonun tipik öncülleridir. Kokunun kaynağını bulamıyorsanız elektriği kesip uzman çağırın.

Elektrik yangını riskini kaynağında ortadan kaldırmak için İstanbul'un tamamında 7/24 arıza tespit ve tesisat yenileme hizmeti veriyoruz. Panonuzu ve tesisatınızı bugün kontrol ettirin.`,
  },
  {
    slug: "elektrik-tesisati-kac-yil-dayanir-yenileme-rehberi",
    title: "Elektrik Tesisatı Kaç Yıl Dayanır? Yenileme Zamanı Geldi mi?",
    excerpt:
      "Elektrik tesisatı ortalama 25-40 yıl dayanır. Tesisatınızın yaşını, yenileme zamanının 9 işaretini, süreç ve maliyet faktörlerini bu rehberde detaylıca anlattık.",
    coverImage: "/images/blog/tesisat-yenileme.png",
    tags: "elektrik tesisatı kaç yıl dayanır, elektrik tesisatı yenileme, tesisat yenileme maliyeti",
    metaTitle: "Elektrik Tesisatı Kaç Yıl Dayanır? Yenileme Zamanı Rehberi",
    metaDescription:
      "Elektrik tesisatı kaç yıl dayanır? Kablo tipine göre ömür, yenileme zamanının 9 belirtisi, süreç, maliyeti etkileyen faktörler ve güvenlik standartları bu rehberde.",
    daysAgo: 4,
    content: `Elektrik tesisatı, **kablo tipine ve bakım durumuna göre ortalama 25-40 yıl dayanır.** Bakır hatlı ve düzgün monte edilmiş bir tesisat 40 yıla kadar sağlıklı çalışabilir; alüminyum hatlı veya kalitesiz malzemeyle çekilmiş tesisat ise 20-25 yılda yenileme sınırına gelir. Binanızın yaşını bilmek yeterli değildir; tesisatın durumu, çekildiği dönemin standardını gösterir.

Bu rehberde tesisat ömrünü etkileyen faktörleri, yenileme zamanının 9 belirtisini ve sürecin nasıl işlediğini paylaşıyoruz.

## Tesisatın Ömrünü Belirleyen 4 Faktör

### 1. Kablo tipi

Türkiye'de 1960-1980 arası binaların bir kısmında alüminyum iletken kullanılmıştır. Alüminyum, bakıra göre daha hızlı yıpranır ve bağlantı noktalarında ısınma eğilimi gösterir; bu binalarda yenileme süresi belirgin olarak kısadır. Günümüzde bakır iletken, yönetmeliklere uygun kesitlerle standarttır.

### 2. İzolasyon kalitesi ve yıpranması

Kablonun ömrü aslında izolasyonunun ömrüdür. Isınma, nem ve fare kemirmesi izolasyonu zamanla zayıflatır. İzolasyonu kuruyan hatlar, örtük [elektrik kaçağına](/blog/elektrik-kacagi-tespiti-nasil-yapilir) ve [yangın riskine](/blog/elektrik-yangini-nasil-onlenir) dönüşür.

### 3. Yük profili

Çekildiği dönemde bir dairenin yükü ampullerden ibaretken, bugün klima, kombi, çamaşır-bulaşık makinesi ve kurutucu aynı anda çalışır. Eski tesisatın ince kesitleri bu yükü taşımakta zorlanır; bu da ısınma ve sigorta sorunları üretir.

### 4. Montaj ve bakım kalitesi

Boru içinde değil sıva altına doğrudan çekilen hatlar, gevşek bırakılan bağlantılar ve hatalı pano montajı, tesisatın ömrünü yarıya indirebilir. Düzenli bakım görmüş panolar ömrü uzatır.

## Yenileme Zamanının 9 Belirtisi

Şu işaretlerden biri veya birkaçı varsa tesisatınız değerlendirmeye alınmalıdır:

1. **Sigortalar sık atıyor:** özellikle farklı odalarda ve farklı cihazlarda tekrarlanıyorsa
2. **Prizler ve anahtarlar ısınıyor:** dokunuşta belirgin sıcaklık normal değildir
3. **Duvarlarda yanık veya kararma izi:** priz ve anahtar çevresinde özellikle
4. **Balık gibi keskin yanık kokusu:** izolasyon ısınmasının tipik kokusu
5. **Işıklar titreşiyor veya kırpıyor:** gevşek bağlantı ve yük yetersizliği belirtisi
6. **Tek topraklı veya topraklamasız prizler:** eski tesisatın göstergesi
7. **Pano eskiliği:** [eski tip sigorta kutusu](/blog/elektrik-panosu-yenileme), kaçak akım rölesi yokluğu
8. **Beyaz eşyalarda elektrik çarpması:** çamaşır makinesi gövdesine dokunma hissi, topraklama eksikliğinin klasik işaretidir
9. **Faturada açıklanamayan artış:** örtük kaçak ve eski hatların yaygın sonucu

Bu belirtilerin dördü veya daha fazlası mevcutsa, tesisat büyük olasılıkla yenileme aşamasındadır.

## Tesisat Yenileme Süreci Nasıl İşler?

Profesyonel bir yenileme şu adımlarla yürür:

1. **Keşif ve tespit:** hatlar, pano ve priz dağılımı incelenir; ihtiyaç listesi ve net fiyat sunulur
2. **Proje ve hat planı:** oda bazında priz, anahtar ve aydınlatma noktaları belirlenir
3. **Eski hatların sökülmesi ve boru düzeni:** sıva açılan hatlar [kablo ve hat çekimi](/hizmetler/kablo-hat-cekimi) standardına uygun boru içinde yenilenir
4. **Pano ve koruma kurulumu:** kaçak akım rölesi, doğru amperde otomatik sigortalar ve gerekiyorsa [topraklama hattı](/hizmetler/topraklama-hatti) kurulur
5. **Test ve teslim:** hatlar test edilir, topraklama sürekliliği ölçülür ve iş garanti belgesiyle teslim edilir

Daire büyüklüğüne göre yenileme 1-3 gün sürer; tadilatla birlikte yapılacaksa tadilat takvimiyle uyumlanır.

## Maliyeti Etkileyen Faktörler

Tesisat yenileme fiyatı daire başına tek kalem değildir; şu faktörler toplamı belirler:

- Daire metrekare ve oda sayısı
- Sıva altı mı, sıva üstü (görünür boru) mi çekileceği
- Pano yenilemenin dahil olup olmaması
- Topraklama durumunun ve ihtiyacın boyutu
- Tadilatla eşzamanlılık (boş dairede iş, dolu daireye göre daha hızlı ve ekonomiktir)
- Kullanılacak kablo ve malzeme sınıfı

Keşif öncesi sabit fiyat söylemek dürüst bir yaklaşım değildir; bunun yerine [keşif ücreti nasıl hesaplanır](/blog/elektrikci-keşif-tespit-ucreti-nasil-hesaplanir) rehberimizdeki kalemlerle net teklif isteyin.

## Yenileme Zorunlu mu, İsteğe Bağlı mı?

Yönetmelikler açısından eski tesisatın yenilenmesi için genel bir zorunluluk yoktur; ancak şu durumlarda yenileme fiilen zorunlu hale gelir:

- Büyük tadilat yapıldığında tesisatın güncel standartlara uyarlanması beklenir
- Bina ortak hatları yenilenirken daire girişlerinin uyumlu yapılması gerekir
- Sigortasız, topraklamasız ve rölesiz tesisat; güvenlik ve sigorta kapsam açısından risk üretir

Ayrıca kiracılı dairelerde ev sahibi, evin kullanıma elverişliliği için eski ve sorunlu tesisatı yenilemekle sorumludur; sorumluluk dengesini [elektrik arızası kim öder](/blog/elektrik-arizasi-kim-oder-kiraci-ev-sahibi) rehberimizde açıkladık.

## Sık Sorulan Sorular

### Tesisat yaşını nasıl öğrenebilirim?

Bina yapım yılı en güçlü göstergedir; buna ek olarak pano tipi, prizlerin topraklaması ve kablo renk düzeni dönemi gösterir. Kısa bir tespit randevusuyla net yaşı belirlenebilir.

### Kısmi yenileme yeterli olur mu?

Sorunlu hatların ve panonun yenilenmesiyle önemli rahatlama sağlanır; bütçe planlıysa önce pano + kritik hatlar (mutfak, banyo, klima hattı) tercih edilir. Yine de tüm tesisatın durumuna göre tam yenileme önerilir.

### Sıva üstü tesisat güvenli bir alternatif mi?

Doğru malzeme ve montajla evet; tadilat imkânı olmayan dairelerde görünümlü boru düzeni hızlı ve ekonomik çözümdür. Estetik planlama ile göze battmayan bir düzen kurulabilir.

### Yenileme sırasında evde kalmak mümkün mü?

Çoğu proje için evet; akşam elektriğin kısmen açılabilmesi planlanır. Yine de çalışma günleri süresince alternatif yaşam planı konforu artırır.

Tesisatınızın yaşını ve güvenlik durumunu öğrenmek için İstanbul'un tamamında keşif hizmeti veriyoruz. Dairenize özel net teklif için bugün bize ulaşın.`,
  },
];

// 6 mevcut blogun benzersiz yeni kapak görselleri
const coverUpdates: Array<{ slug: string; coverImage: string }> = [
  { slug: "elektrik-faturasi-neden-yuksek", coverImage: "/images/blog/fatura-yuksek.png" },
  { slug: "topraklama-zorunlu-mu-neden-onemli", coverImage: "/images/blog/topraklama.png" },
  { slug: "evde-elektrik-guvenligi-onlemleri", coverImage: "/images/blog/elektrik-guvenligi.png" },
  { slug: "acil-elektrikci-fiyatlari-istanbul", coverImage: "/images/blog/acil-elektrikci.png" },
  { slug: "gece-elektrikcisi-hafta-sonu-acil-servis", coverImage: "/images/blog/gece-elektrikcisi.png" },
  { slug: "elektrik-panosu-yenileme", coverImage: "/images/blog/elektrik-panosu.png" },
];

async function main() {
  console.log("=== Yeni blog yazıları ekleniyor ===");
  for (const p of posts) {
    const data = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      tags: p.tags,
      published: true,
      publishedAt: publishedAt(p.daysAgo),
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
    };
    const post = await prisma.blogPost.upsert({
      where: { slug: p.slug },
      create: data,
      update: data,
    });
    console.log(`✔ ${post.slug} (yayında: ${post.published}, tarih: ${post.publishedAt?.toISOString()})`);
  }

  console.log("=== Mevcut blog kapak görselleri güncelleniyor ===");
  for (const u of coverUpdates) {
    await prisma.blogPost.update({ where: { slug: u.slug }, data: { coverImage: u.coverImage } });
    console.log(`✔ ${u.slug} → ${u.coverImage}`);
  }

  // Doğrulama: tüm blogların kapak görseli benzersiz mi?
  const all = await prisma.blogPost.findMany({ select: { slug: true, coverImage: true } });
  const seen = new Map<string, string>();
  let dup = 0;
  for (const b of all) {
    const img = b.coverImage ?? "(yok)";
    const prev = seen.get(img);
    if (prev) {
      console.log(`✖ TEKRAR: ${img} → ${prev} ve ${b.slug}`);
      dup++;
    }
    seen.set(img, b.slug);
  }
  console.log(`Toplam blog: ${all.length} | Kapak görseli tekrarı: ${dup}`);
  await prisma.$disconnect();
  process.exit(dup > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("HATA:", e);
  process.exit(1);
});
