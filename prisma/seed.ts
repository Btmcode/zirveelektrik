/**
 * Zirve Elektrik - Veritabanı seed script'i
 * Kullanım: bun prisma/seed.ts
 *
 * GÜVENLİK NOTU:
 * - Admin şifresi bcrypt ile hash'lenir, düz metin saklanmaz.
 * - Şifre ADMIN_PASSWORD env değişkeninden okunur; yoksa seed bilinçli olarak durur.
 * - İlk girişten sonra admin panelinden şifre değiştirilmelidir (üyelik işlemleri).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Prisma Postgres'e doğrudan bağlantı. Vercel entegrasyonu "postgres://"
// şeması verebilir; Prisma yalnızca "postgresql://" kabul eder → normalize et.
const rawUrl = process.env.DATABASE_URL;
const datasourceUrl = rawUrl ? rawUrl.replace(/^postgres:\/\//, "postgresql://") : undefined;
const prisma = new PrismaClient({ datasourceUrl });

// ---------- Yardımcılar ----------
const g = (parts: TemplateStringsArray, ...vals: unknown[]) =>
  parts.reduce((acc, p, i) => acc + p + (i < vals.length ? String(vals[i]) : ""), "");

// ---------- Hizmetler ----------
interface ServiceSeed {
  slug: string;
  title: string;
  excerpt: string;
  icon: string;
  priceNote?: string;
  featured?: boolean;
  sortOrder: number;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

const SERVICES: ServiceSeed[] = [
  {
    slug: "elektrik-ariza-tespiti",
    title: "Elektrik Arıza Tespiti",
    excerpt:
      "Elektrik arızasının kaynağını profesyonel cihazlarla dakikalar içinde tespit ediyoruz. Tespit sonrası net fiyat teklifi veriyoruz.",
    icon: "SearchCheck",
    featured: true,
    sortOrder: 1,
    priceNote: "Yerinde tespit + fiyat teklifi",
    metaTitle: "Elektrik Arıza Tespiti İstanbul | Zirve Elektrik",
    metaDescription:
      "İstanbul'da elektrik arıza tespiti: profesyonel cihazla yerinde tespit, net fiyat teklifi, 7/24 servis. Zirve Elektrik'i arayın.",
    content: g`Elektrik arızaları çoğu zaman gözle görülemeyen noktalarda ortaya çıkar. **Zirve Elektrik**, İstanbul genelinde elektrik arıza tespitini profesyonel ölçüm cihazları ve deneyimli ustalarıyla yapar. Arızanın kaynağını bulmadan onarım yapmayız; böylece tekrar eden arızaları ve gereksiz maliyetleri ortadan kaldırırız.

## Arıza Tespiti Sürecimiz

1. **Telefonla ön değerlendirme:** Arızayı telefonla dinler, olası nedenleri ve aciliyeti belirleriz.
2. **Yerinde inceleme:** Adresinize gelir, sigorta kutusundan prizlere kadar tüm hattı ölçüm cihazlarıyla kontrol ederiz.
3. **Tespit raporu:** Arızanın kaynağını, kapsamını ve çözüm seçeneklerini size açık dille anlatırız.
4. **Net teklif:** Onarım yaptırsanız da yapmasanız da tespit hizmeti için belirli bir hizmet bedeli alırız; onarım yapılacaksa fiyatı önceden netleştiririz.

## Hangi Arızaları Tespit Ediyoruz?

- Sigorta sürekli atıyor (kısa devre, kaçak, aşırı yük)
- Evin bir kısmında elektrik yok (faz kopması, pano arızası)
- Priz veya anahtar çalışmıyor, ısınıyor, kıvılcım çıkarıyor
- Ampuller sık patlıyor, ışık titriyor
- Elektrik faturası anormal yükseldi (kaçak akım şüphesi)
- Kablo yanık kokusu, ısınma, kararma

## Neden Profesyonel Tespit Şart?

Yanlış tespit, yanlış onarıma ve maddi kayba yol açar. Zirve Elektrik ustaları kaçak akım testi, devre ölçümü ve termal kontrolle arızayı kesin olarak bulur. **Tüm tespit ve onarım işlerimiz garanti kapsamındadır.**

İstanbul'un her ilçesinde aynı gün servis veriyoruz. Acil arızalarınız için 7/24 numaramızdan bize ulaşabilirsiniz.`,
  },
  {
    slug: "elektrik-sigorta-pano-arizalari",
    title: "Elektrik Sigortası ve Pano Arızaları",
    excerpt:
      "Sigorta sürekli atıyor, pano eski veya yetersiz mi? Sigorta değişimi, pano yenileme ve kaçak akım rölesi montajı yapıyoruz.",
    icon: "CircuitBoard",
    featured: true,
    sortOrder: 2,
    priceNote: "Pano yenileme + sigorta değişimi",
    metaTitle: "Elektrik Sigorta ve Pano Arızası Onarımı | Zirve Elektrik",
    metaDescription:
      "Sigorta atıyor mu? İstanbul'da sigorta değişimi, elektrik panosu yenileme, kaçak akım rölesi montajı için Zirve Elektrik 7/24 yanınızda.",
    content: g`Sürekli atlayan sigorta, evinizin elektrik tesisatı size bir şey anlatmaya çalışıyordur: ya aşırı yük var, ya kaçak akım, ya da kısa devre. Zirve Elektrik olarak sigorta ve pano arızalarını kökünden çözüyoruz.

## Sigorta Neden Atar?

- **Kısa devre:** Hasarlı priz, kablolama hatası veya cihaz arızası faz ve nötrü birleştirir.
- **Kaçak akım:** Yıpranmış izolasyon, nem veya hatalı topraklama nedeniyle akım toprağa sızar; kaçak akım rölesi (30 mA) anında devreyi keser.
- **Aşırı yük:** Tek hatta klima, kombi, ütü gibi yüksek güçlü cihazları bağlamak sigortanın kapasitesini aşar.
- **Eskimiş sigorta kutusu:** Erimiş vidalı sigortalar ve eski panolar modern yükleri kaldıramaz.

## Sunduğumuz Çözümler

- Sigorta (otomat) değişimi ve doğru amper hesabı
- Kaçak akım koruma rölesi montajı (yasal zorunluluk)
- Elektrik panosu yenileme ve düzenleme (etiketleme, kablo gruplandırma)
- 3 fazlı pano kurulumu ve yük dengeleme
- Panoya ek hat ekleme (klima, kombi, fırın, EV şarj hattı)

## Pano Yenileme Ne Zaman Gerekir?

Vidalı sigorta kullanılıyorsa, panoda kaçak akım rölesi yoksa, kablolar kararmış veya pano kapısı kapanmıyorsa pano yenileme zamanı gelmiştir. Yeni pano, hem güvenlik hem de dairede gelecekte yapılacak tadilatlara hazırlık açısından kritiktir.

**Zirve Elektrik**, panonuzu aynı gün söküp yerine kurar, tüm devreleri etiketler ve işini garanti eder. İstanbul genelinde sigorta ve pano hizmeti için bizi arayın.`,
  },
  {
    slug: "elektrik-kacak-tespiti",
    title: "Elektrik Kaçağı Tespiti",
    excerpt:
      "Fatura şişiyor, sigorta atıyor mu? Cihazlı kaçak tespiti ile kaçağın yerini kırıp dökmeden buluyoruz.",
    icon: "Activity",
    featured: true,
    sortOrder: 3,
    priceNote: "Cihazlı tespit, kırım gerektirmez",
    metaTitle: "Elektrik Kaçağı Tespiti İstanbul (Cihazlı) | Zirve Elektrik",
    metaDescription:
      "Elektrik kaçağı faturanızı şişiriyor mu? İstanbul'da cihazlı kaçak tespiti, kaçak akım onarımı için Zirve Elektrik'e danışın. Aynı gün servis.",
    content: g`Elektrik kaçağı, hem can güvenliği hem de fatura açısından ciddiye alınması gereken bir sorundur. Kaçak tespiti yapılmadan uygulanan "çözümler" geçicidir. Zirve Elektrik, **kaçağın yerini ölçüm cihazlarıyla nokta atışı bulur**; gereksiz kırım ve döküme girmez.

## Elektrik Kaçağı Belirtileri

- Elektrik faturasının sebepsiz yükselmesi
- Sigortaların, özellikle kaçak akım rölesinin sürekli atması
- Duvarlarda, prizlerde ısınma veya kararma
- Elektrik çarpması hissi (musluk, beyaz eşya gövdesi, radyatör)
- Islak bölgelerde (banyo, mutfak) atalet izleri

## Kaçak Tespiti Nasıl Yapılır?

1. Ana sigorta kapatılır, tesisat izole edilir.
2. Megger (izolasyon) testi ile hat direnci ölçülür; kaçak olan devre belirlenir.
3. Kaçak akım duyargaları ve termal kamera ile kaçağın duvar içindeki noktası bulunur.
4. Yalnızca kaçak noktaya müdahale edilir; kablo değişimi gerekiyorsa en kısa hat üzerinden yeni kablo çekilir.

## Kaçak Onarılmazsa Ne Olur?

Kaçak akım yangın riski taşır, şebekedeki diğer tesisatları da yıpratır ve faturanızı sürekli şişirir. Elektrik kaçakları ayrıca dairedeki elektrik çarpma riskini artırır - özellikle çocuklu aileler için kritiktir.

İstanbul genelinde aynı gün kaçak tespiti için Zirve Elektrik'i arayın. **Tespit sonrası fiyat teklifimizi sunarız; onarım yaptırsanız da yapmasanız da tespit hizmet bedeli işlemi şeffaf ve önceden bildirilmiştir.**`,
  },
  {
    slug: "elektrik-tesisati-tadilat",
    title: "Elektrik Tesisatı ve Tadilat İşleri",
    excerpt:
      "Yeni daire, tadilat, ek oda? Anahtar teslim elektrik tesisatı: hat çekimi, pano, priz ve aydınlatma planlaması.",
    icon: "Cable",
    featured: true,
    sortOrder: 4,
    priceNote: "Metrekare/priz bazlı net teklif",
    metaTitle: "Elektrik Tesisatı ve Tadilat | Zirve Elektrik İstanbul",
    metaDescription:
      "İstanbul'da elektrik tesisatı çekimi, tadilat elektrik işleri, pano ve priz planlaması. Anahtar teslim tesisat için Zirve Elektrik.",
    content: g`Sağlam bir elektrik tesisatı, binanın ömrü boyunca güvenliğinizi sağlar. Zirve Elektrik, İstanbul'da yeni daire, tadilat ve yenileme işlerinde **proje bazlı elektrik tesisatı** kurar; her hat, her priz hesaplanarak döşenir.

## Tesisat Hizmetlerimiz

- **Yeni tesisat çekimi:** Tadilat veya kaba inşa evrelerinde tüm hatların (aydınlatma, priz, klima, kombi, ankastre) döşenmesi
- **Tesisat yenileme:** Alüminyum kablolama veya yıpranmış hatların bakır tesisatla değişimi
- **Ek hatlar:** Klima, kombi, ankastre fırın, çamaşır/bulaşık makinesi, EV şarj ünitesi için ayrı devre
- **Pano entegrasyonu:** Tüm devrelerin sigorta ve kaçak akım rölesine bağlanması, etiketlenmesi
- **Priz ve anahtar yerleşimi:** TSE ve kullanım alışkanlıklarına göre ergonomik planlama

## Tesisat Standartlarımız

Tüm tesisat işlerimizde çift izoleli bakır kablo, doğru kesit hesabı (2,5 mm² priz hattı, 1,5 mm² aydınlatma vb.), topraklamaya bağlanmış prizler ve kaçak akım koruması uygularız. İş bitiminde her devreyi test eder, etiketli pano şeması teslim ederiz.

## Tadilatta Neden Elektrikçiyi Başından Dahil Etmelisiniz?

Duvarlar sıvanıp fayanslar döşendikten sonra yapılan eklemeler hem maliyeti hem dağınıklığı artırır. Zirve Elektrik tadilatın başında gelir, priz/anahtar/aydınlatma noktalarını birlikte planlar, kaba tesisatı zamanında bitirir.

İstanbul'un tüm ilçelerinde elektrik tesisatı ve tadilat işi için teklif isteyin - **yerinde ücretsiz keşif, net fiyat garantisi.**`,
  },
  {
    slug: "aydinlatma-avize-montaji",
    title: "Aydınlatma, Avize ve Spot Montajı",
    excerpt:
      "Avize, spot, LED aydınlatma, aplik montajı ve arızalı armatür değişimi. Elektrik bağlantıları güvenle yapılır.",
    icon: "Lightbulb",
    featured: true,
    sortOrder: 5,
    priceNote: "Montaj başına sabit fiyat",
    metaTitle: "Avize ve Spot Aydınlatma Montajı İstanbul | Zirve Elektrik",
    metaDescription:
      "Avize montajı, spot aydınlatma, LED şerit, aplik montajı İstanbul'da Zirve Elektrik'te. Güvenli bağlantı, aynı gün servis.",
    content: g`Aydınlatma, mekânın karakterini belirleyen hem estetik hem teknik bir iştir. Yanlış bağlanan bir avize, düşen bir spot veya hatalı bir trafo kısa süre içinde daha büyük arızalara yol açar. Zirve Elektrik, İstanbul'da tüm aydınlatma işlerini güvenli ve temiz şekilde tamamlar.

## Aydınlatma Hizmetlerimiz

- **Avize montajı:** Tavan tipi (askılı, ankastre, sarkıt) avizelerin güvenli tespiti ve bağlantısı
- **Spot ve downlight montajı:** Alçıpan veya germe tavan için spot delimi, yerleşimi, trafolu bağlantı
- **LED şerit ve profil aydınlatma:** Mutfak tezgâhı altı, TV ünitesi, salon dolap içi aydınlatma
- **Aplik ve duvar armatürü montajı:** Yatak odası, koridor, merdiven aydınlatması
- **Dekoratif aydınlatma planlaması:** Dimmer, akıllı ampul ve sahne aydınlatması entegrasyonu
- **Armatür değişimi:** Titreyen, çalışmayan, trafo arızalı armatürlerin onarımı veya yenilenmesi

## Montajda Dikkat Ettiğimiz Güvenlik Detayları

Avize askı aparatının tavana sağlam ankraj edilmesi, bağlantı uçlarının uygun klemenslerle izole edilmesi, LED trafolarının doğru güç seçilmesi ve tesisatın topraklaması kontrol edilir. Ağır avizelerde ek taşıyıcı kullanılır.

## Sürekli Patlayan Ampul Sorunu

Aynı avizedeki ampuller sık patlıyorsa sorun ampulde değil tesisat olabilir: gevşek nötr bağlantısı, yüksek hat gerilimi veya uyumsuz trafo sık ampul patlamasının yaygın nedenleridir. Ustamız kök nedeni bulur.

İstanbul'da avize ve spot montajı için aynı gün randevu alın - montaj işlerimiz **garanti kapsamındadır**.`,
  },
  {
    slug: "priz-anahtar-arizalari",
    title: "Priz ve Anahtar Arızaları",
    excerpt:
      "Çalışmayan, ısınan, kıvılcım çıkaran priz ve anahtarların değişimi ve hat onarımı. Topraklı priz montajı.",
    icon: "Plug",
    featured: false,
    sortOrder: 6,
    priceNote: "Ünite başına hızlı değişim",
    metaTitle: "Priz ve Anahtar Tamiri / Değişimi İstanbul | Zirve Elektrik",
    metaDescription:
      "Priz çalışmıyor, anahtar bozuk mu? İstanbul'da priz değişimi, topraklı priz montajı, anahtar tamiri için Zirve Elektrik 7/24 hizmetinizde.",
    content: g`Priz ve anahtarlar, tesisatın en sık kullanılan ve en çok yıpranan noktalarıdır. Küçük görünen bir priz arızası; ısınma, kıvılcım ve yangın riskine dönüşebilir. Zirve Elektrik tüm priz ve anahtar arızalarını aynı gün çözer.

## Sık Karşılaştığımız Priz/Anahtar Sorunları

- **Prize takılan cihaz çalışmıyor:** Hat kesilmiş, kablo ucu gevşemiş veya priz arızalı olabilir.
- **Priz ısınıyor, eriyor:** Gevşek bağlantı veya aşırı yük direnci artırır; acil değişim gerekir.
- **Prizden kıvılcım ve çıtırtı:** Ark oluşumu - yangın tehlikesi işaretidir.
- **Anahtar bastığında ışık gelmiyor:** Anahtar mekanizması veya ampul hattı arızalı olabilir.
- **Anahtar ters çalışıyor (yukarı aç):** Yanlış montaj; faz hattının doğru bağlanması gerekir.

## Sunduğumuz Çözümler

- Arızalı priz/anahtar değişimi (kaliteli, TSE belgeli ürünler)
- Topraklı priz montajı (banyo, mutfak, beyaz eşya noktaları için kritik)
- USB'li ve akıllı priz montajı
- Yerden priz çekimi (TV ünitesi, çalışma masası)
- Hat arızası tespiti ve kablo uçlarının yeniden bağlanması

## Banyo ve Mutfakta Topraklı Priz Zorunluluğu

Islak hacimlerdeki prizler hem topraklı hem uygun IP koruma sınıfında olmalıdır. Banyoda priz konumu, su kaynaklarına mesafe kuralına göre belirlenir. Zirve Elektrik montajlarda bu kuralları eksiksiz uygular.

Priz ve anahtar işleriniz için İstanbul genelinde hızlı servis - **aramanızdan sonra aynı gün kapınızdayız.**`,
  },
  {
    slug: "topraklama-hatti",
    title: "Topraklama Hattı Kurulumu",
    excerpt:
      "Topraklama yangın ve elektrik çarpmasına karşı en önemli güvenlik hattıdır. Bina ve daire bazlı topraklama kurulumu.",
    icon: "ShieldCheck",
    featured: false,
    sortOrder: 7,
    priceNote: "Bina/daire ölçüsüne göre teklif",
    metaTitle: "Topraklama Kurulumu İstanbul | Zirve Elektrik",
    metaDescription:
      "Topraklama neden önemli? İstanbul'da daire ve bina bazlı topraklama hattı kurulumu, topraklama ölçümü için Zirve Elektrik.",
    content: g`Topraklama, elektrik sisteminin sessiz kahramanıdır: düzgün çalışmadığında fark edilmez, eksik olduğunda ise hayat kurtarır. Zirve Elektrik, İstanbul'da daire ve bina ölçeğinde topraklama hattı kurar ve mevcut tesisatın topraklamasını ölçümle doğrular.

## Topraklama Neden Hayati?

Topraklama, arızalı bir cihazın gövdesine sızan akımı güvenle toprağa ileterek insanları elektrik çarpmasından korur. Kaçak akım rölesi ile birlikte çalıştığında devreyi milisaniyeler içinde keser. Çamaşır makinesi, buzdolabı, kombi gibi metal gövdeli cihazlar topraklamasız çalıştırılmamalıdır.

## Hizmetlerimiz

- **Daire bazlı topraklama:** Priz ve cihaz topraklamalarının panodaki toprak barasına bağlanması
- **Bina bazlı topraklama tesisatı:** Toprak elektrodu döşemesi (çoğu bina için yasal zorunluluk), ana topraklama barası ve hat çekimi
- **Topraklama ölçümü:** Toprak elektrodu yayılma direnci ölçümü ve raporlama
- **Topraklama yenileme:** Paslanmış, kopmuş veya yanlış (nötr-toprak birleşik) hatların düzeltilmesi

## Yanlış Topraklama Tehlikesi

En sık gördüğümüz hata, nötr hattın topraklama olarak kullanılmasıdır. Bu durum cihaz gövdelerinde gerilime ve elektrik çarpmasına neden olur. Ayrıca musluk, radyatör gibi metal yüzeylerde "karıncalanma" hissi genellikle topraklama hatasının işaretidir.

## Mevzuat

Yeni binalarda ve işyerlerinde topraklama tesisatı kanunen zorunludur. İşyeri ruhsatı, yangın sigortası ve elektrik abonelik işlemlerinde topraklama raporu istenebilir. Zirve Elektrik, mevzuata uygun kurulum ve ölçüm raporu sunar.

İstanbul'da topraklama kurulumu ve ölçümü için bizi arayın.`,
  },
  {
    slug: "klima-elektrik-hatti",
    title: "Klima Elektrik Hattı Çekimi",
    excerpt:
      "Klimaya ayrı devre ve sigorta hattı çekimi. Aşırı ısınan ortak hatlar yerine güvenli ayrı hat.",
    icon: "AirVent",
    featured: false,
    sortOrder: 8,
    priceNote: "Mesafeye göre net teklif",
    metaTitle: "Klima Elektrik Hattı Çekimi İstanbul | Zirve Elektrik",
    metaDescription:
      "Klima için ayrı elektrik hattı ve sigorta çekimi. İstanbul'da klima elektrik tesisatı için Zirve Elektrik'e ulaşın.",
    content: g`Klima, evin en çok güç tüketen cihazlarından biridir ve kendi sigortasını hak eder. Klimayı prizden veya ortak hattan beslemek; sigorta atmalara, kablo ısınmasına ve klimanın verimli çalışmamasına neden olur. Zirve Elektrik, İstanbul'da klima için doğru kesitte ayrı hat çekiyor.

## Klimaya Neden Ayrı Hat Gerekir?

- **Aşırı yük:** Klima çalıştığında aynı hattaki diğer cihazlarla birlikte sigortayı aştığında hat ısınır.
- **Gerilim düşümü:** Uzun ve ince kablolar klimanın kompresörüne yetersiz gerilim götürür; cihaz ömrü kısalır.
- **Güvenlik:** Klimanın kablo kesiti ve sigortası üretici talimatlarına göre hesaplanmalıdır (genelde 2,5 mm² kablo ve ayrı otomat).

## Hizmet Kapsamımız

1. Klimanın gücüne göre kablo kesiti ve sigorta hesabı
2. İç üniteden panoya kadar en uygun güzergâhtan hat çekimi (gerekirse kamera/tavan içi)
3. Panoya ayrı otomat (ve gerekiyorsa kaçak akım rölesi) ekleme
4. Dış ünite besleme hattının tamamlanması
5. Test: hat gerilimi, akım ve çalışma kontrolü

## Ev Klimaya Uygun mu?

Evin elektrik tesisatının yaşlı, alüminyum kablolamalı olduğu yapılarda klima hattı çekilmeden önce pano kapasitesi değerlendirilir. Gerekirse pano yenileme öneririz; böylece klima ve tüm ev güvenli çalışır.

İstanbul genelinde klima elektrik hattı çekimi ve tüm klima elektrik arızaları için Zirve Elektrik'i arayın.`,
  },
  {
    slug: "zil-diafon-arizalari",
    title: "Zil ve Diafon Arızaları",
    excerpt:
      "Çalışmayan zil, görüntülü/görüntüsüz diafon arızaları. Apartman içi ve daire içi sistem tamiri.",
    icon: "BellRing",
    featured: false,
    sortOrder: 9,
    priceNote: "Arıza cinsine göre teklif",
    metaTitle: "Zil ve Diafon Tamiri İstanbul | Zirve Elektrik",
    metaDescription:
      "Zil çalışmıyor, diafon bozuk mu? İstanbul'da zil ve diafon arıza tamiri, montajı için Zirve Elektrik'i arayın. Hızlı servis.",
    content: g`Zil ve diafon sistemleri, binanın günlük kullanımında en çok fark edilen aksaklıklardır. Zirve Elektrik; daire içi zillerden apartman görüntülü diafon sistemlerine kadar tüm arızaları tespit eder ve onarır.

## Zil Arızalarında Neyi Kontrol Ediyoruz?

- Daire içi zil/çan ve trafosu
- Zil düğmesi (balkon/kapı) kontak arızası
- Zil hattındaki kopukluk (kapı dikmesi, duvar içinde)
- Panodaki zil sigortası

## Diafon Arızaları ve Çözümleri

- **Görüntülü diafon ekranı çalışmıyor:** Monitör beslemesi, daire içi aparat veya hattın haberleşme kablosu kontrol edilir.
- **Kapıya gelince zil çalmıyor ama diafon çalışıyor:** Bina kapısı modülü ve çağrı hattı incelenir.
- **Kapı kilidi açılmıyor:** Elektronik kilit, buton ve kablaj test edilir.
- **Statik/parazit sesli diafon:** Haberleşme hattındaki gevşek uçlar yeniden terminale bağlanır.

## Yeni Sistem Kurulumu

Eski kablolulu sistemleri yeniliyoruz: görüntülü diafon seti tedariki ve montajı, daireler arası hat çekimi, bina kapısı modülü kurulumu. Apartman yönetimleri için toplu teklif sunuyoruz.

İstanbul'da zil ve diafon arızası için aynı gün servis - arayın, ustamız yola çıksın.`,
  },
  {
    slug: "ofis-isyeri-elektrik",
    title: "Ofis ve İşyeri Elektrik Tesisatı",
    excerpt:
      "Ofis tadilatı, mağaza ve işyerleri için elektrik tesisatı, aydınlatma, ağ kablolaması ve pano kurulumu.",
    icon: "Building2",
    featured: false,
    sortOrder: 10,
    priceNote: "Projeye göre teklif, sözleşmeli servis",
    metaTitle: "Ofis ve İşyeri Elektrikçisi İstanbul | Zirve Elektrik",
    metaDescription:
      "Ofis tadilatı elektrik tesisatı, mağaza aydınlatması, işyeri pano kurulumu İstanbul'da Zirve Elektrik ile güvenle yapılır.",
    content: g`İşyerlerinde elektrik tesisatı; üretkenlik, güvenlik ve mevzuat açısından ev tesisatından daha katı standartlar ister. Zirve Elektrik, İstanbul'da ofisler, mağazalar, klinikler ve atölyeler için elektrik tesisatı kurar ve bakımını üstlenir.

## İşyeri Elektrik Hizmetlerimiz

- **Ofis tadilatı elektrik işleri:** Açık/kapalı plan ofislere priz, veri ve aydınlatma tesisatı; kablaj tray sistemi kurulumu
- **Mağaza ve vitrin aydınlatması:** Spot raflandırma, dekoratif ve görev aydınlatması
- **Pano kurulumu:** İşyeri yüküne uygun ana pano, 3 fazlı sistemler, ölçü panosu
- **Ağ ve veri kablolaması:** Cat6 kablo çekimi, patch panel, priz yerleşimi
- **Topraklama ve mevzuat raporu:** İşyeri ruhsatı ve sigorta işlemleri için topraklama ölçüm raporu
- **Düzenli bakım anlaşması:** Arıza beklemeden periyodik kontrol, öncelikli servis

## Neden Zirve Elektrik?

İşyerlerinde kesinti, kayıp ciro demektir. Acil çağrılarda aynı gün müdahale ediyor; tadilatlarda iş saatleri dışında çalışabiliyoruz. Tüm işler faturalı ve garantilidir.

İstanbul'da ofis ve işyeri elektrik tesisatı için bizi arayın; yerinde keşif ve net teklif sunalım.`,
  },
  {
    slug: "kablo-hat-cekimi",
    title: "Kablo ve Hat Çekimi",
    excerpt:
      "İnternet, TV, telefon, kamera ve güç hatları. Duvar içi, tray ve kabel kanalı ile temiz hat çekimi.",
    icon: "Network",
    featured: false,
    sortOrder: 11,
    priceNote: "Metre bazlı şeffaf fiyat",
    metaTitle: "Kablo Çekimi ve Hat Döşeme İstanbul | Zirve Elektrik",
    metaDescription:
      "İnternet, TV, telefon ve güç kablosu çekimi İstanbul'da Zirve Elektrik'te. Duvar içi hat çekimi, kabel kanalı montajı.",
    content: g`Doğru çekilmiş bir hat yıllarca sorun çıkarmaz; yanlış çekilen hat ise her tadilatın baş ağrısıdır. Zirve Elektrik, İstanbul'da güç, veri ve haberleşme hatlarını temiz, düzenli ve ölçülebilir biçimde döşer.

## Hat Çekim Hizmetlerimiz

- **İnternet/ağ kablosu (Cat6/Cat6A):** Modem-router konumlandırma, duvar içi RJ45 priz, patch panel
- **TV ve uydu kablosu:** Anten hattı, dağıtıcı (splitter) düzenlemesi, koaksiyel hat yenileme
- **Telefon hattı ve santral kablolaması:** Küçük işletmeler için iç hatlar
- **Güvenlik kamerası kablolaması:** Güç + veri hattı çekimi (PoE dahil)
- **Güç hatları:** Priz, klima, kombi, ankastre cihaz için ek hat çekimi
- **Kabel kanalı ve tray:** Duvar kırımı istenmeyen yerlerde estetik PVC/alüminyum kanal sistemleri

## Temiz İş Garantisi

Hat çekiminde güzergâh planlanır, delik noktaları sizinle birlikte belirlenir. İş bitiminde delik tozları temizlenir, kanallar kaplanır; kaba sıva onarımı için öneride bulunuruz.

## Çift Duvar, Beton ve Kamera Ölçümü

Beton duvarlarda diamond delim, alçıpanda boşluk tespiti yapılır. Gerekirse tesisat kamerasıyla mevcut hat güzergâhı görüntülenir; hasar minimuma indirilir.

İstanbul'da kablo ve hat çekimi için aynı gün keşif randevusu alın.`,
  },
  {
    slug: "elektrikli-arac-sarj-istasyonu",
    title: "Elektrikli Araç Şarj Ünitesi Kurulumu",
    excerpt:
      "Otoparkınıza EV şarj ünitesi: güç hesabı, ayrı hat, pano uyumu ve montaj. Otopark çözümleri.",
    icon: "BatteryCharging",
    featured: false,
    sortOrder: 12,
    priceNote: "Ünite ve mesafeye göre teklif",
    metaTitle: "Elektrikli Araç Şarj İstasyonu Kurulumu | Zirve Elektrik",
    metaDescription:
      "EV şarj ünitesi montajı İstanbul'da Zirve Elektrik'te. Otopark şarj istasyonu, güç hesabı ve pano entegrasyonu.",
    content: g`Elektrikli araç sayısı hızla artıyor; en büyük ihtiyaç ise güvenli ve doğru kurulmuş şarj altyapısı. Zirve Elektrik, İstanbul'da site otoparkları, müstakil garajlar ve işyerleri için EV şarj ünitesi kurulumu yapıyor.

## Kurulum Süreci

1. **Keşif ve güç hesabı:** Abonelik tipi (tek faz / 3 faz), amper ve pano kapasitesi ölçülür.
2. **Pano uyumu:** Gerekirse panoya ek otomat ve kaçak akım rölesi eklenir; kapasite yetersizse pano yenileme önerilir.
3. **Hat çekimi:** Otoparka kadar doğru kesitte kablo döşenir (yapı içi tesisat kurallarına uygun).
4. **Ünite montajı:** Duvar tipi şarj ünitesi sabitlenir, bağlantıları yapılır.
5. **Test ve devreye alma:** Şarj testi, RCCB/RCD koruma kontrolü, kullanım eğitimi.

## Site Otoparklarında Ortak Çözüm

Site yönetimlerine ortak sayaçlı, paylaşımlı şarj altyapısı kuruyoruz: her kullanıcı kendi tüketimini öder, yönetim tek abonelikle yönetir. Toplu keşif ve proje teklifi sunuyoruz.

## Güvenlik Neden Önemli?

EV şarjı, saatlerce süren yüksek akım yükü demektir. Uygun kesitte olmayan kablo, topraklamasız montaj veya kaçak akım koruması olmadan kurulan ünite yangın riski taşır. Tüm kurulumlarımız ilgili standartlara göre yapılır ve garanti edilir.

İstanbul'da elektrikli araç şarj ünitesi kurulumu için keşif randevusu alın.`,
  },
];

// ---------- İstanbul ilçeleri ----------
interface DistrictSeed {
  name: string;
  side: "AVRUPA" | "ANADOLU";
  neighborhoods: string[];
}

const DISTRICTS: DistrictSeed[] = [
  { name: "Adalar", side: "ANADOLU", neighborhoods: ["Büyükada", "Heybeliada", "Burgazada", "Kınalıada"] },
  { name: "Arnavutköy", side: "AVRUPA", neighborhoods: ["Hadımköy", "Taşoluk", "Boğazköy", "Durusu"] },
  { name: "Ataşehir", side: "ANADOLU", neighborhoods: ["Atatürk", "Barbaros", "Mustafa Kemal", "Fikirtepe"] },
  { name: "Avcılar", side: "AVRUPA", neighborhoods: ["Üniversite", "Merkez", "Firuzköy", "Yeşilkent"] },
  { name: "Bağcılar", side: "AVRUPA", neighborhoods: ["Bağlar", "Güneşli", "Demirkapı", "Kirazlı", "100. Yıl"] },
  { name: "Bahçelievler", side: "AVRUPA", neighborhoods: ["Merkez", "Şirinevler", "Bahçelievler", "Siyavuşpaşa"] },
  { name: "Bakırköy", side: "AVRUPA", neighborhoods: ["Ataköy", "Zuhuratbaba", "İncirli", "Cevizlik", "Kartaltepe"] },
  { name: "Başakşehir", side: "AVRUPA", neighborhoods: ["Kayabaşı", "Başak", "Şamlar", "Ziya Gökalp", "Bahçeşehir 2. Kısım"] },
  { name: "Bayrampaşa", side: "AVRUPA", neighborhoods: ["Terazidere", "Vatan", "Orta", "Yıldırım"] },
  { name: "Beşiktaş", side: "AVRUPA", neighborhoods: ["Levent", "Etiler", "Bebek", "Gayrettepe", "Ulus", "Ortaköy"] },
  { name: "Beykoz", side: "ANADOLU", neighborhoods: ["Yalıköy", "Paşabahçe", "Anadoluhisarı", "Cihannüma", "Göllü"] },
  { name: "Beylikdüzü", side: "AVRUPA", neighborhoods: ["Yakuplu", "Cumhuriyet", "Adnan Kahveci", "Gürpınar", "Kavaklı"] },
  { name: "Beyoğlu", side: "AVRUPA", neighborhoods: ["Cihangir", "Galata", "Taksim", "Kasımpaşa", "Şişhane", "Pangaltı"] },
  { name: "Büyükçekmece", side: "AVRUPA", neighborhoods: ["Mimar Sinan", "Erikli", "Kumburgaz", "Bathilya", "Muratçeşme"] },
  { name: "Çatalca", side: "AVRUPA", neighborhoods: ["Merkez", "Ferhatpaşa", "Kabakça", "Yalıköy"] },
  { name: "Çekmeköy", side: "ANADOLU", neighborhoods: ["Ömerli", "Hamidiye", "Mimarsinan", "Soğuksu"] },
  { name: "Eyüpsultan", side: "AVRUPA", neighborhoods: ["Merkez", "Alibeyköy", "Çırçır", "Yeşilpınar", "Göktürk"] },
  { name: "Fatih", side: "AVRUPA", neighborhoods: ["Aksaray", "Balat", "Çapa", "Kocamustafapaşa", "Fındıkzade", "Saraçhane"] },
  { name: "Gaziosmanpaşa", side: "AVRUPA", neighborhoods: ["Merkez", "Karadeniz", "Yıldıztabya", "Fevzi Çakmak"] },
  { name: "Güngören", side: "AVRUPA", neighborhoods: ["Mareşal Çakmak", "Hazar", "Gençosman", "Abdurrahman Nafiz Gürman"] },
  { name: "Kadıköy", side: "ANADOLU", neighborhoods: ["Fenerbahçe", "Koşuyolu", "Kozyatağı", "Göztepe", "Bostancı", "Caferağa", "Hasanpaşa"] },
  { name: "Kağıthane", side: "AVRUPA", neighborhoods: ["Gültepe", "Çağlayan", "Seyrantepe", "Harmantepe", "Ortabayır"] },
  { name: "Kartal", side: "ANADOLU", neighborhoods: ["Yakacık", "Atalar", "Cevizli", "Soğanlık", "Uğur Mumcu"] },
  { name: "Küçükçekmece", side: "AVRUPA", neighborhoods: ["Halkalı", "Kanarya", "Gültepe", "Atakent", "A. Kemal Deniz"] },
  { name: "Maltepe", side: "ANADOLU", neighborhoods: ["Cevizli", "Gülensu", "Küçükyalı", "Altıntepe", "Bağlarbaşı"] },
  { name: "Pendik", side: "ANADOLU", neighborhoods: ["Kaynarca", "Güzelyalı", "Batı", "Sapan Bağları", "Kurtköy"] },
  { name: "Sancaktepe", side: "ANADOLU", neighborhoods: ["Emek", "Sarıgazi", "Veysel Karani", "Meclis", "Ferhatpaşa"] },
  { name: "Sarıyer", side: "AVRUPA", neighborhoods: ["Maslak", "İstinye", "Tarabya", "Yeniköy", "Zekeriyaköy", "Emirgan"] },
  { name: "Silivri", side: "AVRUPA", neighborhoods: ["Merkez", "Alipaşa", "Değirmenköy", "Selimpaşa"] },
  { name: "Sultanbeyli", side: "ANADOLU", neighborhoods: ["Merkez", "Fatih", "Mecidiye", "Ahmet Yesevi", "Turgut Reis"] },
  { name: "Sultangazi", side: "AVRUPA", neighborhoods: ["Eski Habipler", "Cebeci", "Habibler", "Gazi", "Salavatı Islam", "50. Yıl", "Yayla", "Esentepe"] },
  { name: "Şile", side: "ANADOLU", neighborhoods: ["Merkez", "Ağva", "Yeşilvadi", "Kabakoz"] },
  { name: "Şişli", side: "AVRUPA", neighborhoods: ["Mecidiyeköy", "Nişantaşı", "Bomonti", "Kuştepe", "Fulya", "Teşvikiye"] },
  { name: "Tuzla", side: "ANADOLU", neighborhoods: ["Aydınlı", "İçmeler", "Postane", "Tepeören", "Orhanlı"] },
  { name: "Ümraniye", side: "ANADOLU", neighborhoods: ["Atakent", "İnkılap", "Tekstilkent", "Parseller", "Hekimbaşı", "Dudullu"] },
  { name: "Üsküdar", side: "ANADOLU", neighborhoods: ["Kuzguncuk", "Acıbadem", "Ünalan", "Beylerbeyi", "Çengelköy", "Altunizade"] },
  { name: "Zeytinburnu", side: "AVRUPA", neighborhoods: ["Merkezefendi", "Veliefendi", "Seyitnizam", "Gökalp", "Beştelsiz"] },
  { name: "Esenler", side: "AVRUPA", neighborhoods: ["Mavi Evler", "Yavuz Selim", "Tuna", "Nene Hatun"] },
  { name: "Esenyurt", side: "AVRUPA", neighborhoods: ["Cumhuriyet", "Pınar", "Saadetdere", "Mehmet Akif", "Sanayi Mahallesi"] },
];

function districtContent(d: DistrictSeed): string {
  const nb = d.neighborhoods.join(", ");
  return g`Zirve Elektrik, ${d.name} ilçesinde 7/24 elektrik arıza tespiti ve onarım hizmeti verir. ${d.name}${d.side === "AVRUPA" ? " Avrupa" : " Anadolu"} Yakası'nın deneyimli elektrikçisi olarak, aramanızdan sonra aynı gün adresinizde oluruz.

## ${d.name}'da Verdiğimiz Elektrik Hizmetleri

- Elektrik arıza tespiti ve onarımı (sigorta atması, elektrik yok, kısa devre)
- Elektrik kaçağı tespiti ve giderilmesi
- Elektrik panosu yenileme, sigorta ve kaçak akım rölesi değişimi
- Priz ve anahtar tamiri, topraklı priz montajı
- Avize, spot ve LED aydınlatma montajı
- Elektrik tesisatı çekimi ve tadilat elektrik işleri
- Klima elektrik hattı, zil-diafon tamiri

## ${d.name} Nöbetçi Elektrikçi Hizmeti

Elektrik arızası saati seçmez. Gece yarısı atlayan sigorta, hafta sonu gelen kaçaak akım alarmı, tatil günü bozulan priz... Ne zaman ararsanız arayın, ${d.name} içinde en kısa sürede adresinizdeyiz. **Tespit sonrası net fiyat teklifi veririz; onarım yaptırsanız da yaptırmasanız da belirtilen tespit hizmet bedelini şeffaf biçimde alırız.**

## ${d.name}'da Hizmet Verdiğimiz Semt ve Mahalleler

${nb} ve çevresindeki tüm mahalle ve sitelerde elektrikçi hizmeti sunuyoruz.

## Neden Zirve Elektrik?

- ${d.name} ve tüm İstanbul'da 7/24 acil servis
- Profesyonel ölçüm cihazlarıyla kesin arıza tespiti
- İş başı öncesi net fiyat, sürpriz ücret yok
- Yapılan işlere garanti
- Deneyimli, sertifikalı usta kadrosu

${d.name} ve çevresinde elektrikçi arıyorsanız hemen arayın: ustamız yola çıksın.`;
}

// ---------- Blog yazıları (AEO odaklı: soru başlıkları + net cevaplar) ----------
interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  cover: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

const BLOG_POSTS: BlogSeed[] = [
  {
    slug: "sigorta-surekli-atiyor-neden-ve-cozumleri",
    title: "Sigorta Sürekli Atıyor: 7 Nedeni ve Kalıcı Çözümleri",
    excerpt:
      "Elektrik sigortası sürekli atıyorsa panik yapmayın. Kaçak akım, kısa devre, aşırı yük gibi 7 yaygın nedeni ve kalıcı çözümlerini uzman elektrikçilerimiz anlatıyor.",
    tags: ["sigorta arızası", "kaçak akım", "elektrik arızası"],
    cover: "/images/blog/sigorta-atiyor.jpg",
    metaTitle: "Sigorta Sürekli Atıyor: 7 Neden ve Çözüm | Zirve Elektrik",
    metaDescription:
      "Sigorta neden sürekli atar? Kaçak akım, kısa devre, aşırı yük gibi 7 nedeni ve çözümlerini İstanbul'un 7/24 elektrikçisi Zirve Elektrik anlatıyor.",
    content: g`**Kısa cevap:** Sigorta, tesisatı bir tehlikeden korumak için atar. En yaygın nedenler; kaçak akım, kısa devre, aşırı yük ve eskimiş sigorta/pano bileşenleridir. Sigortayı tekrar tekrar kaldırmak sorunu çözmez; kaynağı bulunmalıdır.

## 1. Kaçak Akım (En Sık Neden)

Kaçak akım rölesi (özellikle 30 mA'lik cihazlar), akımın toprağa sızdığını algıladığında anında devreyi keser. Evinizde ıslak hacim varsa (banyo, mutfak) ve röle sık sık atıyorsa, tesisatınızda kaçak olabilir.

**Çözüm:** Kaçak tespiti cihazla yapılır. Kaçağın hangi devrede olduğu belirlenir, o hat izole edilir ve onarılır.

## 2. Kısa Devre

Faz ve nötrün doğrudan temas etmesidir. Hasarlı priz, sıkışan kablo veya arızalı cihaz neden olur. Sigorta atar atmaz tekrar kalkmıyorsa kısa devre olasılığı yüksektir.

**Çözüm:** Önce prize takılı tüm cihazlar sökülür. Sigorta yine atıyorsa sorun tesisattadır; ustamız hattı bölerek arızalı noktayı bulur.

## 3. Aşırı Yük

Tek hatta çok cihaz (klima + ütü + fırın) bağlandığında akım sigorta değerini aşar. Genellikle cihaz sayısı arttıkça ortaya çıkar.

**Çözüm:** Yük dağıtımı yapılır; gerekirse klima/fırın gibi cihazlar için ayrı hat ve sigorta çekilir.

## 4. Eskimiş veya Eriyen Sigorta/Pano

Vidalı sigortalar, erimiş otomat uçları ve eski panolar modern yükleri kaldıramaz.

**Çözüm:** Pano yenileme: kaliteli otomatlar + kaçak akım rölesi + doğru kesitte kablolar.

## 5. Su ve Nem

Balkon prizi, ıslak mutfak tezgâhı altı veya su sızan duvar içindeki hattı etkiler.

**Çözüm:** Islak hacim prizleri IP korumalı üretime taşınır, kaçaak onarılır.

## 6. Arızalı Beyaz Eşya veya Cihaz

Buzdolabı, çamaşır makinesi gibi cihazların içindeki kaçak, devreyi tetikler.

**Çözüm:** Cihaz tek tek test edilir; arızalı cihaz tespit edilir, onarıma gönderilir.

## 7. Yanlış Sigorta Değeri

Devreye uygun olmayan düşük amperlik sigorta normal yükü bile keser.

**Çözüm:** Ustamız hat kesitine göre doğru amperi belirler.

## Ne Zaman Elektrikçi Aramalısınız?

Sigorta günde birden fazla atıyorsa, kaldırdıktan hemen sonra tekrar atıyorsa veya priz/kablo ısınıyorsa vakit kaybetmeyin. **Zirve Elektrik, İstanbul genelinde aynı gün servis verir; tespit sonrası net teklif sunar.**`,
  },
  {
    slug: "elektrik-kacagi-tespiti-nasil-yapilir",
    title: "Elektrik Kaçağı Tespiti Nasıl Yapılır? (Adım Adım Rehber)",
    excerpt:
      "Elektrik kaçağı nedir, belirtileri nelerdir ve cihazla tespit nasıl yapılır? Faturanızı şişiren kaçağı bulma sürecini tüm detaylarıyla açıklıyoruz.",
    tags: ["elektrik kaçağı", "kaçak tespiti", "elektrik faturası"],
    cover: "/images/blog/kacak-tespiti.jpg",
    metaTitle: "Elektrik Kaçağı Tespiti Nasıl Yapılır? | Zirve Elektrik",
    metaDescription:
      "Elektrik kaçağı tespiti nasıl yapılır? Belirtiler, cihazlı tespit süreci, fatura etkisi ve maliyetler. İstanbul'da cihazlı kaçaak tespiti için Zirve Elektrik.",
    content: g`**Kısa cevap:** Elektrik kaçağı tespiti, ana sigortadan itibaren hatların izole edilip izolasyon (megger) testi ve kaçak akım ölçümüyle yapılır. Kaçağın bulunduğu devre tespit edilir, sonra kaçak noktası duyargalarla nokta atışı bulunur.

## Elektrik Kaçağı Nedir?

Tesisattaki akımın, normal dönüş yolunu (nötr) kullanmadan toprağa veya başka iletime sızmasıdır. Kablo izolasyonunun yıpranması, nem, su sızıntısı veya hatalı montaj neden olur.

## Kaçağın 5 Belirtisi

1. **Fatura şişmesi:** Kullanım alışkanlığınız değişmediyse ve fatura arttıysa, kaçak en olası nedenlerden biridir.
2. **Kaçak akım rölesinin atması:** Röle, kaçak gördüğü an devreyi keser.
3. **Isınan duvar/priz:** Kaçaak olan bölgede ısınma ve kararma olur.
4. **Elektrik çarpması hissi:** Musluk, radyatör, beyaz eşya gövdesinde karıncalanma.
5. **Şebeke sesi/tırtır:** Duvar içi kaçağın ileri durumlarında duyulabilir.

## Cihazlı Tespit Süreci (Kırım Gerektirmez)

1. **İzolasyon:** Ana sigorta açılır, tüm devreler ayrılır.
2. **Megger testi:** Her hattın izolasyon direnci ölçülür. Düşük direnç = kaçaak hat.
3. **Devre bölme:** Kaçaak hat bölünür, kaçağın hangi kablo segmentinde olduğu daraltılır.
4. **Nokta tespiti:** Kaçak akım duyargaları ve termal kamera ile kesin nokta bulunur.
5. **Onarım:** Yalnızca kaçaak noktaya müdahale edilir; kablo değişimi veya bağlantı yenileme yapılır.

## Kaçağın Maliyeti: Düzeltilmezse Ne Olur?

- Sürekli yükselen elektrik faturası (ayılarca binlerce lira fark)
- Yangın riski: yıpranan izolasyon artık her ısıtma-korne döngüsünde zayıflar
- Elektrik çarpması riski: özellikle ıslak hacimlerde
- Komşu daireleri de etkileyen panosel sorunlar

## Ne Zaman Profesyonel Destek Alınmalı?

Faturada açıklanamayan artış, sürekli atan röle veya elektrik çarpması hissi varsa beklemeyin. **Zirve Elektrik, İstanbul genelinde cihazlı kaçaak tespiti yapıyor; kaçağın yerini kırıp dökmeden buluyor.** Tespit sonrası onarım teklifi sunar, karar tamamen sizindir.`,
  },
  {
    slug: "evin-yarisinda-elektrik-yok-cozumu",
    title: "Evin Yarısında Elektrik Yok: Nedenleri ve Çözümü",
    excerpt:
      "Evin bir kısmında ışık ve prizler çalışmıyor mu? Faz kopması, pano arızası veya hattaki kopukluk olabilir. Kök nedenleri ve çözüm adımlarını anlatıyoruz.",
    tags: ["elektrik yok", "faz kopması", "elektrik arızası"],
    cover: "/images/blog/evin-yarisinda-elektrik-yok.jpg",
    metaTitle: "Evin Yarısında Elektrik Yok: Nedenler ve Çözüm | Zirve Elektrik",
    metaDescription:
      "Evde bir bölümde elektrik yok mu? Faz kopması, pano arızası, hattaki kopukluk gibi nedenleri ve çözümleri Zirve Elektrik uzmanlarından öğrenin.",
    content: g`**Kısa cevap:** Evin bir kısmının elektriklenmemesi genellikle panodaki bir otomatin (sigortanın) atmasından, faz hattındaki kopukluktan veya o bölgeyi besleyen kablonun arızalanmasından kaynaklanır. Önce panoyu kontrol edin: atılmış bir otomat varsa kaldırın; tekrar atıyorsa profesyonel destek alın.

## Önce Bunları Kontrol Edin

1. **Pano:** Atılmış (aşağıda duran) otomat veya kaçak akım rölesi var mı?
2. **Komşular:** Sadece sizde mi, binada mı kesinti var? (Şebeke kesintisi olabilir.)
3. **Büyük cihazlar:** Son prize takılan bir cihaz (klima, fırın) hatayı tetiklemiş olabilir; sökülüp deneyin.

## Elektrik Gelmiyorsa: 4 Ana Neden

### 1. Atılmış Sigorta / Kaçak Akım Rölesi

En yaygın neden. Röle veya otomat atıldığında, bağlı olduğu tüm bölge elektriklenmez. Tekrar atıyorsa devrede kaçaak veya kısa devre vardır.

### 2. Faz Kopması (Yarım Kesinti)

Şebeke veya bina tesisatındaki faz hattının bir kısmının kopması tipik olarak "evin yarısında elektrik yok" görünümü verir. Nötr hattı kopmuşsa lambalar titrer, cihazlar anormal davranır.

### 3. Pano İçinde Gevşek/Yanan Bağlantı

Zamanla gevşeyen terminal bağlantıları ısınır, erir ve hattı keser. Panoyu açan usta kararmış uçları görür.

### 4. Duvar İçi Kablo Arızası

Deline duvar çakılması, sıva işleri veya eskime kabloyu kesebilir. Bu durumda hat tespit cihazıyla kesin nokta bulunur ve kablo değişir.

## Kaçınmanız Gereken Hatalar

- Sigortayı tel/saç ile "onarmak" - yangın riski
- Panoyu kendi kendine açıp karıştırmak - çarpmna riski
- Arızayı "bekleyerek geçirmek" - hasarı büyütür

## Zirve Elektrik Çözümü

Ustamız panoyu, hat gerilimlerini ve devreleri ölçer; arızayı kesin olarak bulur. **İstanbul'un tüm ilçelerinde aynı gün servis; tespit sonrası net fiyat teklifi.** Acil durumlar için 7/24 hattımızı arayın.`,
  },
  {
    slug: "elektrikci-keşif-tespit-ucreti-nasil-hesaplanir",
    title: "Elektrikçi Keşif ve Tespit Ücreti Nasıl Hesaplanır? (2025 Rehberi)",
    excerpt:
      "Elektrikçi keşif ücreti ne kadar, arıza tespiti için neden ücret alınır? Şeffaf fiyatlandırma mantığını, teklif sürecini ve tasarruf ipuçlarını açıklıyoruz.",
    tags: ["elektrikçi fiyatları", "keşif ücreti", "arıza tespiti"],
    cover: "/images/blog/kesif-ucreti.jpg",
    metaTitle: "Elektrikçi Keşif ve Tespit Ücreti Rehberi 2025 | Zirve Elektrik",
    metaDescription:
      "Elektrikçi keşif ücreti nasıl belirlenir? Arıza tespiti için neden ücret alınır, fiyatlar neye göre değişir? Zirve Elektrik şeffaf rehber.",
    content: g`**Kısa cevap:** Keşif/tespit ücreti; ustanın adresine gitme, ölçüm cihazlarıyla arızayı inceleme ve net teklif sunma emeğinin karşılığıdır. Yol süresi, arızanın cinsi ve gündüz/gece farkı gibi faktörlere göre değişir. Zirve Elektrik'te bu bedel telefonda önceden söylenir; sürpriz yoktur.

## Keşif Ücreti Neden Alınır?

Elektrik arızaları göründüğü yerden değildir: sigorta atmasının kaynağı banyo prizi olabileceği gibi duvar içi 20 metre ötedeki bir bağlantı da olabilir. Usta adresinize gelmeden "ne kadar tutar" diyemez - bu yüzden önce tespit yapılır. Tespit, uzmanlık ve ekipman gerektiren gerçek bir hizmettir.

**Onarım yaptırsanız da yaptırmasanız da tespit hizmet bedeli alınır.** Bu yaklaşım hem ustaya emeğinin karşılığını sağlar hem de müşteriye baskılı satış yapma ihtiyacını ortadan kaldırır.

## Fiyatı Belirleyen 5 Faktör

1. **Zaman dilimi:** Gece, hafta sonu ve resmî tatillerde acil servis tarifesi farklıdır.
2. **Mesafe:** İlçeye göre yol süresi.
3. **Arızanın kapsamı:** Priz değişimi ile pano yenileme aynı emek değildir.
4. **Kırım/döküm gereksinimi:** Duvar içi işler ek işçilik ister.
5. **Malzeme:** Kaliteli, TSE belgeli malzeme tercih edilirse maliyet ona göre hesaplanır.

## İyi Bir Keşifte Şunları Almalısınız

- Arızanın kaynağına dair net açıklama
- Yazılı veya sözlü, madde madde fiyat teklifi
- İşin süresi ve garanti bilgisi

## Tasarruf İçin 4 İpucu

1. Arızayı telefonla net tarif edin (ne oldu, ne zaman başladı) - ustanın doğru ekipmanla gelmesini sağlar.
2. Teklifi birden çok kaleme bölün; sadece gerekli işi onaylayın.
3. Tadilat işlerinde elektrikçiyi baştan dahil edin; sonradan yapılan eklemeler pahalıya gelir.
4. Gece/hafta sonu acil olmayan işleri gündüze planlayın.

## Zirve Elektrik'in Şeffaf Fiyat Politikası

Telefonda tahmini bilgi, yerinde tespit, **onarım öncesi net fiyat onayı**. Tespit bedelini iş yaptırsanız dahi dürüstçe uyguladığımızı bilmeniz için açıkça belirtiyoruz: sürpriz fatura yok, madde madde teklif var. **İstanbul genelinde keşif ve tespit için bizi arayın.**`,
  },
  {
    slug: "priz-neden-isiniyor-kivilcim-cikiyor",
    title: "Priz Neden Isınır ve Kıvılcım Çıkarır? Acil Yapılması Gerekenler",
    excerpt:
      "Isınan, eriyen veya kıvılcım çıkaran priz, yangın tehlikesinin ilk sinyalidir. Nedenleri, acil müdahale adımları ve kalıcı çözümü anlatıyoruz.",
    tags: ["priz arızası", "yangın güvenliği", "elektrik güvenliği"],
    cover: "/images/blog/priz-isiniyor.jpg",
    metaTitle: "Priz Neden Isınır ve Kıvılcım Çıkarır? | Zirve Elektrik",
    metaDescription:
      "Isınan, eriyen, kıvılcım çıkaran priz neden olur, ne yapılmalı? Yangın riskini önleyen çözümler. İstanbul'da acil priz tamiri için Zirve Elektrik.",
    content: g`**Kısa cevap:** Priz, temas direnci (gevşek bağlantı) veya aşırı yük nedeniyle ısınır ve kıvılcım çıkarır. Bu durum yangın tehlikesi sinyalidir: prizin sigortası panodan kapatılmalı ve priz acil olarak değiştirilmelidir.

## Priz Neden Isınır?

### 1. Gevşek Kablo Bağlantısı (En Yaygın)

Prizin terminalindeki kablo ucu zamanla gevşer. Gevşek temas, direnç yaratır ve ısı üretir. Isınan prizde genellikle plakada sararma görülür.

### 2. Aşırı Yük

Prize aynı anda birden fazla yüksek güçlü cihaz (combimaster? kombi, ısıtıcı, fırın) bağlamak akımı aşırı yükseltir.

### 3. Arızalı/Değerli Olmayan Ürün

Piyasadaki düşük kaliteli prizler; temas noktaları zayıf olan yapısıyla ısınmaya yatkındır.

### 4. Kablo Kesitinin Yetersizliği

Eski tesisatlarda ince kesitli kablolar yüksek akımı taşımaz; kablonun kendisi ısınır ve prize yansır.

## Acil Yapılacaklar

1. Prizdeki tüm cihazları sökün.
2. Panodan o prizin bağlı olduğu otomatı kapatın.
3. Prizi kullanmayın; üzerine örtü malzemesi koymayın.
4. Elektrikçiyi arayın.

## Kalıcı Çözüm

- Priz tamamen değiştirilir (TSE belgeli ürün).
- Kablo uçları yeniden temizlenip uygun klemensle bağlanır.
- Hattın kesiti ve yükü kontrol edilir; gerekiyorsa ayrı hat çekilir.
- Topraklama kontrolü yapılır.

## Önleyici Öneriler

- Yoğun kullanılan prizleri yılda bir kez kontrol ettirin.
- Uzatma kablolarını yüksek güçlü cihazlarda kalıcı çözüm olarak kullanmayın.
- Prizde renk değişimi, çıtırtı, koku fark ederseniz hemen ustaya bildirin.

**Zirve Elektrik, İstanbul genelinde priz ve anahtar arızalarına aynı gün müdahale eder. Isınan prizi görmezden gelmeyin - bir telefon yeter.**`,
  },
  {
    slug: "topraklama-zorunlu-mu-neden-onemli",
    title: "Topraklama Zorunlu mu? Neden Hayati Bir Güvenlik Hattı?",
    excerpt:
      "Topraklama yasal zorunluluk mudur, eksikse ne olur? Bina ve daire bazlı topraklama kurulumunu, ölçümünü ve maliyet mantığını açıklıyoruz.",
    tags: ["topraklama", "elektrik güvenliği", "mevzuat"],
    cover: "/images/blog/topraklama.jpg",
    metaTitle: "Topraklama Zorunlu mu? Güvenlik Rehberi | Zirve Elektrik",
    metaDescription:
      "Topraklama yasal zorunluluk mu, neden önemli? Bina ve daire topraklaması, ölçüm raporu ve kurulum bilgileri. İstanbul'da Zirve Elektrik.",
    content: g`**Kısa cevap:** Evet - yeni binalarda ve işyerlerinde topraklama tesisatı mevzuat gereği zorunludur. Topraklama, arızalı cihazın gövdesine sızan akımı toprağa ileterek elektrik çarpmasını önler; kaçak akım rölesiyle birlikte çalışır.

## Topraklama Nasıl Çalışır?

Normalde elektrik, fazdan cihaza ve nötrden geri döner. Cihazda izolasyon arızası olduğunda akım, metal gövdeye sızabilir. Topraklamasız bir cihazda bu akım siz dokunduğunuzda sizin vücudunuzdan akar; topraklamalı cihazda ise en direnci az yolu (toprak hattını) seçer ve kaçak akım rölesi devreyi milisaniyeler içinde keser.

## Yasal Durum

- **Yeni binalar:** Yapı kullanma izni sürecinde topraklama tesisatı zorunludur.
- **İşyerleri:** Ruhsat, yangın sigortası ve iş güvenliği denetimlerinde topraklama ölçüm raporu istenir.
- **Elektrik abonelikleri:** Bazı işyeri türlerinde topraklama belgesi talep edilir.

## Topraklamasız Tesisatın Riskleri

- Çamaşır makinesi, buzdolabı, kombi gibi cihazların gövdesinde gerilim
- Elektrik çarpması riski (özellikle ıslak hacimlerde)
- Musluk ve radyatörlerde karıncalanma hissi
- Elektronik cihazlarda arıza ve veri kaybı

## Topraklama Kurulumu Nasıl Yapılır?

1. **Ölçüm:** Mevcut tesisatın toprak hattı devamlılığı ve elektrot direnci ölçülür.
2. **Elektrot döşeme:** Bina bazlı sistemde toprak elektrodu uygun derinliğe yerleştirilir.
3. **Bara bağlantısı:** Ana topraklama barası oluşturulur; tüm toprak hatları buraya bağlanır.
4. **Daire içi bağlantı:** Priz ve cihaz topraklamaları bara bağlanır; nötr ile karıştırılmaz.
5. **Rapor:** Ölçüm sonucu raporlanır.

## Zirve Elektrik'ten Topraklama Hizmeti

İstanbul'da bina ve daire bazlı topraklama kurulumu, ölçüm ve raporlama yapıyoruz. **Topraklama ölçümü ve kurulum için bizi arayın; tesisatınızı güvene alın.**`,
  },
  {
    slug: "evde-elektrik-guvenligi-onlemleri",
    title: "Evde Elektrik Güvenliği: 12 Hayati Önlem",
    excerpt:
      "Elektrik kazalarının çoğu basit önlemlerle önlenebilir. Evde elektrik güvenliği için uzmanlarimizin önerdiği 12 pratik önlemi derledik.",
    tags: ["elektrik güvenliği", "yangın önleme", "ev güvenliği"],
    cover: "/images/blog/elektrik-guvenligi.jpg",
    metaTitle: "Evde Elektrik Güvenliği: 12 Önlem | Zirve Elektrik",
    metaDescription:
      "Evde elektrik güvenliği için 12 hayati önlem: kaçak akım rölesi, topraklama, priz kullanımı ve daha fazlası. Zirve Elektrik uzman rehberi.",
    content: g`Elektrikle ilgili ev kazalarının çoğu; eski tesisat, bilinçsiz kullanım ve küçük görülen uyarı işaretleri nedeniyle olur. İşte Zirve Elektrik ustalarının sahadan derlediği **12 pratik güvenlik önlemi**:

## Temel Kurulum Önlemleri

1. **Kaçak akım rölesi taktırın:** 30 mA'lik röle, insan hayatını koruyan en kritik ekipmandır. Panonuzda yoksa ilk gün taktırın.
2. **Topraklamayı ölçtürün:** Özellikle ıslak hacim prizlerinde toprak hattı hayattır.
3. **Panoyu yenileyin:** Vidalı sigorta dönemi kapandı; kaliteli otomatlar + etiketli devreler şart.
4. **Doğru kesit kablo kullanın:** Klima, kombi gibi cihazlara ince kesit hat çekmeyin.

## Günlük Kullanım Önlemleri

5. **Prizlere yük bindirmeyin:** Ütü + ısıtıcı + su ısıtıcısı aynı prizde - klasik yangın senaryosu.
6. **Uzatma kablolarını kalıcı çözüm yapmayın:** Yüksek güçlü cihazlar için ayrı hat çekin.
7. **Islak elle elektrikle oynamayın:** Banyo/mutfakta nemli ellerle priz kullanmayın.
8. **Kabloyu kapıdan/pencereden sıkıştırmayın:** Zamanla izolasyonu bozulur.

## Uyarı İşaretlerini Ciddiye Alın

9. **Koku:** Yanık/yakıcı koku alırsanız panoyu kapatın, ustayı arayın.
10. **Isınma:** Isınan priz, fiş veya duvar - hemen kontrol ettirin.
11. **Çıtırtı/kıvılcım:** Anahtar veya prizden gelen çıtırtı ark demektir.
12. **Sık atlayan sigorta:** Kapatmaya değil, nedenini bulmaya odaklanın.

## Yılda Bir Kontrol Alışkanlığı

Tesisat kontrolü, araba bakımı gibidir: sorun büyümeden yakalar. Zirve Elektrik, İstanbul genelinde **periyodik tesisat kontrolü** hizmeti sunar; pano, topraklama ve kritik hatları ölçümlü olarak denetler.

Güvenliğiniz için bir telefon ayırın: İstanbul'un her noktasında hizmetinizdeyiz.`,
  },
  {
    slug: "elektrik-faturasi-neden-yuksek",
    title: "Elektrik Faturası Neden Yüksek Geliyor? 8 Olası Neden",
    excerpt:
      "Kullanımınız değişmedi ama fatura arttı mı? Gizli kaçak, eski cihazlar, doğru olmayan sayaç gibi 8 nedeni ve her biri için çözüm önerisini açıklıyoruz.",
    tags: ["elektrik faturası", "kaçak akım", "enerji tasarrufu"],
    cover: "/images/blog/fatura-yuksek.jpg",
    metaTitle: "Elektrik Faturası Neden Yüksek? 8 Neden ve Çözüm | Zirve Elektrik",
    metaDescription:
      "Elektrik faturası neden yüksek? Kaçak akım, eski cihazlar, sayaç sorunları gibi 8 neden ve çözümleri. İstanbul'da tespit için Zirve Elektrik.",
    content: g`**Kısa cevap:** Kullanım alışkanlığınız değişmediyse faturayı şişiren en olası teknik nedenler; gizli elektrik kaçağı, eski/yüksek tüketimli cihazlar, sürekli bekleme modunda kalan cihazlar ve nadiren sayaç hatasıdır.

## 8 Olası Neden ve Çözümü

### 1. Gizli Elektrik Kaçağı

Duvar içi yıpranmış kablo, toprağa akım sızdırır. Fatura kaçaksız döneme göre %20-50 artabilir.

**Nasıl anlarsınız:** Sayaç, evdeki tüm sigortalar kapalıyken dönmeye/devam ederse kaçak şüphesi güçlüdür. Cihazlı tespit şart.

### 2. Eski Buzdolabı ve Beyaz Eşya

10+ yaşındaki buzdolapları, yeni A+++ sınıfına göre çok daha fazla tüketir.

**Çözüm:** Eski cihazları yenileme planına koyun.

### 3. Bekleme Modu (Standby) Tüketimi

TV, decoder, bilgisayar, şarj aletleri... Bekleme modundaki cihazlar yılda önemli bir tüketim toplar.

**Çözüm:** Grup prizler ve anahtarlı priz kullanın.

### 4. Isıtma Sistemleri

Elektrikli ısıtıcılar, ısı pompasız klima kullanımı kış aylarında faturayı katlar.

**Çözüm:** Verimli sistem değerlendirin; klima ısıtma kullanımında eko mod kullanın.

### 5. Sayaç ve Abonelik Hatası

Yanlış sayaç okuması, eski sayaç hataları, abonelik bilgisi hatası olabilir.

**Çözüm:** Son 3 faturayı karşılaştırın; abonelik dağıtım bilgisi kontrolü isteyin.

### 6. Komşu Hattına Bağlantı (Nadiren)

Tadilatlarda yanlış bağlanan hat, komşunun tüketimini sizin hesabınıza yazabilir.

**Çözüm:** Cihazlı hat kontrolü ile tüm devreler izlenir.

### 7. Su Isıtıcısı / Termosifon Arızası

Sürekli çalışana geçen termostat, ciddi tüketim üretir.

**Çözüm:** Termostat ve emniyet grupları kontrol ettirilir.

### 8. Zamanlayıcısız Elektrikli Su Isıtıcıları

Sürekli açık kalan cihazlar gereksiz tüketim yapar.

**Çözüm:** Zamanlayıcı taktırın.

## Kaçak Şüphesinde İlk Adım

1. Tüm sigortaları kapatın.
2. Sayacın hâlâ dönüp dönmediğine bakın.
3. Dönüyorsa kaçaak tespiti yaptırın.

**Zirve Elektrik, İstanbul'da cihazlı kaçaak tespiti yapar; faturanızı şişiren kaynağı bulur. Tespit sonrası onarım teklifi sunar.**`,
  },
  {
    slug: "acil-elektrikci-fiyatlari-istanbul",
    title: "Acil Elektrikçi Fiyatları İstanbul (2026): Saat Ücreti, Çağrı Bedeli ve Keşif",
    excerpt:
      "İstanbul'da acil elektrikçi ne kadar tutar? Saat ücreti, çağrı bedeli, keşif ücreti ve gece tarifeleri arasındaki farkları, doğru fiyat teklifi almanın püf noktalarını anlatıyoruz.",
    tags: ["elektrikçi fiyatları", "keşif ücreti", "acil elektrikçi", "istanbul"],
    cover: "/images/blog/kesif-ucreti.jpg",
    metaTitle: "Acil Elektrikçi Fiyatları İstanbul 2026 | Zirve Elektrik",
    metaDescription:
      "İstanbul'da acil elektrikçi fiyatları ne kadar? Saat ücreti, çağrı bedeli ve keşif ücreti farkları, 2026 güncel fiyat aralıkları ve doğru teklif alma rehberi.",
    content: g`**Kısa cevap:** İstanbul'da elektrikçi fiyatları 2026'da işin türüne göre değişir: basit priz/anahtar işlerinde işçilik birkaç yüz liradan başlar, pano ve tesisat işleri ise daha üzeredir. Ayrıca arıza tespitine giden elektrikçi, onarım yaptırsanız da yaptırmasanız da bir tespit (keşif) hizmet bedeli alabilir. Net fiyat ancak yerinde tespit sonrasında verilebilir.

## Elektrikçi Fiyatını Belirleyen 4 Faktör

1. **İşin türü ve süresi:** Priz değişimi ile pano yenileme aynı fiyat kategorisinde değildir.
2. **Gün ve saat:** Gece, hafta sonu ve resmî tatillerde acil servis tarifesi gündüze göre yüksektir.
3. **Malzeme:** Kablolar, sigortalar, pano bileşenleri fatura ile ayrı gösterilir.
4. **Bölge:** Ustanın merkeze uzaklığı ve İstanbul trafiği yansıyabilir.

## 2026 Ortalama Fiyat Aralıkları (İstanbul)

Aşağıdaki aralıklar pazar ortalamasıdır; işe ve ustaya göre değişebilir.

| İş | Ortalama Aralık (2026) |
| --- | --- |
| Priz / anahtar değişimi | 300 - 800 TL + malzeme |
| Avize / spot montajı | 400 - 1.200 TL + malzeme |
| Arıza tespiti (keşif) | 500 - 1.500 TL |
| Kaçaak tespiti (cihazlı) | 1.500 - 4.000 TL |
| Sigorta / pano bileşen değişimi | 1.000 - 3.500 TL + malzeme |
| Pano yenileme | 8.000 TL ve üzeri |

Gece ve hafta sonu tarifesi gündüz işçiliğinin genellikle 1,5 - 2 katıdır.

## Çağrı Bedeli, Keşif Ücreti ve İşçilik Farkı Nedir?

- **Çağrı bedeli:** Ustanın adresinize gelmesi için alınan sabit ücrettir.
- **Keşif (tespit) ücreti:** Cihazlı inceleme ve arızanın bulunması karşılığı alınan ücrettir. Bu bir hizmettir; onarımı yaptırsanız da yaptırmasanız da emek karşılığı tahsil edilir.
- **İşçilik:** Onarımın kendisi için ayrıca teklif edilir.

Şeffaf firmalar bu üç kalemi telefonda ve yazılı teklifte net ayrıştırır.

## Doğru Fiyat Teklifi Nasıl Alınır?

1. Arızayı telefonda net anlatın (ne zaman başladı, hangi odada, ne yapıyor).
2. "Kaç para?" değil, "keşif bedeliniz ne kadar, teklif bağlayıcı mı?" diye sorun.
3. Yazılı teklif isteyin; malzeme ve işçilik ayrı gösterilsin.
4. Faturayı isteyin; garanti belgesi olmadan işi teslim almayın.

## Ucuza Kaçan İşin Bedeli

Piyasada "en ucuz elektrikçi" diye dolaşan bazı ekipler, tespitsiz yola çıkar ve sorunu tahminle "onarır". Sonuç: aynı arıza birkaç hafta içinde geri gelir. Elektrikte yanlış onarım yangın riski demektir; keşif bedeli ödeyip doğru tespit almak, uzun vadede daima daha ucuzdur.

**Zirve Elektrik, İstanbul'un 39 ilçesinde 7/24 hizmet verir. Tespit sonrası net fiyat teklifi sunar; teklif onaylanmazsa yalnızca tespit hizmet bedeli alınır. Güncel fiyat için hemen arayın.**`,
  },
  {
    slug: "gece-elektrikcisi-hafta-sonu-acil-servis",
    title: "Gece Elektrikçisi ve Hafta Sonu Acil Servis: Fiyatlar ve Bilmeniz Gerekenler",
    excerpt:
      "Gece yarısı elektrik mi gitti, hafta sonu sigorta mı atıyor? 7/24 acil elektrikçi servisinin nasıl çalıştığını, gece tarifelerini ve güvenli bir bekleyiş için yapmanız gerekenleri anlatıyoruz.",
    tags: ["gece elektrikçi", "7/24 acil servis", "hafta sonu elektrikçi"],
    cover: "/images/blog/evin-yarisinda-elektrik-yok.jpg",
    metaTitle: "Gece Elektrikçisi ve Hafta Sonu Acil Servis | Zirve Elektrik",
    metaDescription:
      "İstanbul'da gece ve hafta sonu elektrikçi servisi nasıl çalışır? Acil tarifeler, öncelik sırası, güvenli bekleyiş ve 7/24 acil elektrikçi çağırma rehberi.",
    content: g`**Kısa cevap:** Gece ve hafta sonu elektrik arızaları "beklenebilir" kategorisinde değildir: buzdolabı, ısıtma, güvenlik ve su sistemleri elektriksiz kalırsa hasar büyür. İstanbul'da 7/24 çalışan acil elektrikçi servisi gece tarifesiyle çalışır; gündüz fiyatının genellikle 1,5 - 2 katı alınır ve arızanın türüne göre öncelik sırası belirlenir.

## Hangi Durumlar Acil Sayılır?

- **Yarım evin elektrikinin gitmesi:** Faz kopması veya pano arızası olabilir; beklemek risklidir.
- **Yanan / ısınan priz veya pano:** Yangın tehlikesi; sigortayı indirin ve hemen arayın.
- **Yanma kokusu, çıtırtı sesi:** Tesisatta ısınma var demektir; gece de olsa müdahale gerekir.
- **Bina genel kesintisi:** Komşularınızda da elektrik yoksa sorun dairededir; kaynağı birlikte bulunmalıdır.
- **Su pompası, kombi ve güvenlik sistemlerinin elektriksiz kalması:** Konfor değil, zorunluluk.

## Gece Servisi Nasıl Çalışır?

1. Telefonu açan usta arızayı dinler ve acil olup olmadığını değerlendirir.
2. Acilse en yakın müsait usta adresinize yönlendirilir.
3. Gece tarifesi ve tespit bedeli telefonda önceden bildirilir.
4. Tespit yapılır, net teklif verilir; onayınız olmadan işleme başlanmaz.

Bu sıralama, gece saatlerinde hem sizi hem ustayı korur: beklenti netleşir, pazarlık gerginliği yaşanmaz.

## Gece Fiyatı Neden Farklıdır?

Gece tarifesi yalnızca "ek ücret" değildir; ustanın gündüz dinlenme saatlerinden fedakârlık ettiği, gece malzeme tedarikinin zorlaştığı ve tek kişiye düşen talep yoğunluğunun arttığı bir dilimdir. Dürüst firmalar bu oranı telefonla açıkça söyler; geceye "gündüz fiyatı" sözü verip yerinde fark çıkaranlardan uzak durun.

## Elektrik Gelene Kadar Güvenli Bekleyiş

- Sigorta panelini açıp hangi hatların atladığına not alın; fotoğraf çekin.
- Yanma kokusu varsa panodaki sigortaları indirin ve binadan ayrılmayı düşünün.
- Islak ellerle pano ve prizlere dokunmayın.
- Mum yerine şarjlı fener kullanın; açık alev yangın riski taşır.
- Buzdolabını mümkünse kapalı tutun; kapısı az açılan dolap 4-6 saat soğuğunu korur.

## Hafta Sonu ve Resmî Tatiller

Hafta sonu tarifesi geceye yakın, tatillerden biraz daha uygundur. Yoğunluk ise tam tersidir: cumartesi akşamı ve pazar akşamı talep zirve yapar. Bu nedenle aradığınızda "1-2 saat içinde" bilgisi alırsanız adresinizi ve arıza türünü net iletin; ekip planlamasını buna göre yapar.

**Zirve Elektrik, İstanbul genelinde gece, hafta sonu ve resmî tatiller dahil 7/24 acil elektrikçi hizmeti verir. Tarifemizi telefonda açıkça söyleriz; tespit sonrası net teklif sunarız. Acil durumda hemen arayın.**`,
  },
  {
    slug: "elektrik-panosu-yenileme",
    title: "Elektrik Panosu Yenileme: Süreç, Maliyet ve Dikkat Edilmesi Gerekenler",
    excerpt:
      "Eski bir sigorta panosu hem güvenlik hem fatura açısından risk taşır. Pano yenileme sürecini, 2026 maliyetlerini, kaçak akım rölesi ve topraklama şartlarını uzman gözüyle anlatıyoruz.",
    tags: ["pano yenileme", "sigorta kutusu", "elektrik güvenliği"],
    cover: "/images/blog/elektrik-guvenligi.jpg",
    metaTitle: "Elektrik Panosu Yenileme: Süreç ve Maliyet 2026 | Zirve Elektrik",
    metaDescription:
      "Elektrik panosu ne zaman yenilenir? Pano yenileme süreci, 2026 maliyet aralıkları, kaçak akım rölesi ve topraklama şartlarıyla adım adım rehber.",
    content: g`**Kısa cevap:** Elektrik panosu, evin sigorta ve koruma bileşenlerinin merkezidir. Panonuz eski tip (seramik veya huni sigorta), sık sigorta atıyorsa, ısınıyorsa ya da kaçak akım rölesi yoksa yenilenmelidir. İstanbul'da pano yenileme 2026'da daire ölçeğinde genellikle 8.000 TL ve üzeri başlar; fiyat, pano kapasitesi ve devre sayısına göre artar.

## Panonuzun Yenilenmesi Gerektiğini Gösteren İşaretler

- Seramik veya huni sigortaların hâlâ kullanılıyor olması
- Kaçak akım rölesinin bulunmaması veya sık atması
- Panoda yanma izi, erime kokusu veya ısınan bileşenler
- Sigortaların bilinmeyen nedenlerle sık atması
- Yeni cihaz (kombi, klima, fırın) için boş devre olmaması
- Islak hacimlere (banyo, mutfak) giden hatlarda koruma bulunmaması

## Yenileme Süreci Adım Adım

1. **Yerinde tespit:** Mevcut panonun durumu, hat sayısı ve yük hesabı yapılır.
2. **Proje ve teklif:** Devre listesi, sigorta planı ve net fiyat yazılı verilir.
3. **Malzeme seçimi:** TSE belgeli pano, sigorta ve kaçak akım rölesi tercih edilir.
4. **Uygulama:** Hatlar etiketlenir, devreler ayrılır (priz, aydınlatma, kombi, ocak...).
5. **Test ve teslim:** Röle testi, topraklama ölçümü ve etiketli pano ile teslim edilir.

## Maliyeti Belirleyen Kalemler

| Kalem | Etkisi |
| --- | --- |
| Pano kapasitesi (devre sayısı) | Arttıkça maliyet artar |
| Kaçak akım rölesi sayısı | Her ıslak hacim için ayrı koruma idealdir |
| Kablo yenileme ihtiyacı | Eski tesisatta kapsam büyür |
| Kompanzasyon / kat paylaşımı | Apartman panolarında ek işçilik |

Daire panosunda 2026 için pratik bütçe 8.000 - 25.000 TL aralığındadır; apartman ana panosu işleri projeye göre fiyatlanır.

## Kaçak Akım Rölesi Neden Şart?

30 mA kaçak akım rölesi, elektrik çarpmasına karşı ilk savunma hattıdır. Yeni düzenlemelerde ıslak hacim ve dış hatlarda zorunludur. Pano yenilemede röle yoksa proje tamamlanmış sayılmaz.

## Yasal ve Sigorta Boyutu

Eski ve hatalı pano, ev sigortası poliçelerinde tazminat itirazlarında zayıf noktadır. Yeni pano ve düzenli bakım, hem güvenlik hem sigorta süreci açısından güçlü delildir. Site yönetimlerinde ana pano yenileme kararı, yönetim planına göre alınır ve ortak gider olarak paylaştırılabilir.

**Zirve Elektrik, İstanbul'un tüm ilçelerinde pano tespiti ve yenileme işi yapar: yerinde tespit, yazılı teklif, TSE belgeli malzeme ve garanti. Pano şüpheniz varsa hemen arayın.**`,
  },
];

// ---------- SSS ----------
const FAQS = [
  {
    question: "Zirve Elektrik hangi bölgelerde hizmet veriyor?",
    answer:
      "İstanbul'un tüm 39 ilçesinde 7/24 elektrik hizmeti veriyoruz. Avrupa ve Anadolu Yakası'nın tamamına aynı gün servis sağlıyoruz. Ayrıntılı ilçe listesi için Hizmet Bölgeleri sayfamızı inceleyebilirsiniz.",
  },
  {
    question: "Arıza tespiti için neden ücret alıyorsunuz?",
    answer:
      "Arıza tespiti, ölçüm cihazları ve uzmanlık gerektiren gerçek bir hizmettir. Ustamız adresinize gelip arızayı kesin olarak bulur; onarım yaptırsanız da yapmasanız da bu hizmet için belirli bir tespit bedeli alırız. Bu bedel telefonda önceden bildirilir, sürpriz ücret olmaz.",
  },
  {
    question: "Ne kadar sürede geliyorsunuz?",
    answer:
      "Acil arızalarda İstanbul içinde genellikle 30-90 dakika içinde adresinizdeyiz. Yoğunluk ve ilçeye göre süre değişebilir; aradığınızda tahmini varış süresini net söylüyoruz.",
  },
  {
    question: "Gece ve hafta sonu hizmet veriyor musunuz?",
    answer:
      "Evet, Zirve Elektrik 7 gün 24 saat nöbetçi elektrikçi hizmeti verir. Gece ve tatil servislerinde farklı tarifeye tabi olduğunuzu önceden bildiririz.",
  },
  {
    question: "Yaptığınız işlere garanti veriyor musunuz?",
    answer:
      "Evet. Yaptığımız tüm işçilik garanti kapsamındadır. Garanti süresi işin cinsine göre değişir; iş bitiminde size bildirilir. Aynı arıza garanti süresi içinde tekrarlarsa ücretsiz müdahale ederiz.",
  },
  {
    question: "Fiyat teklifini nasıl veriyorsunuz?",
    answer:
      "Yerinde tespit sonrası, işi madde madde anlatır ve onarım öncesi net fiyat teklifi sunarız. Onayınız olmadan işe başlamayız. Kaba tahmin isterseniz telefonda ön bilgi veririz.",
  },
  {
    question: "Sigorta sürekli atıyor, ne yapmalıyım?",
    answer:
      "Sigortayı tekrar tekrar kaldırmak çözüm değildir; kısa devre, kaçaak akım veya aşırı yük var demektir. Panodaki otomatı kontrol edin, tekrar atıyorsa elektrikçi çağırın. Cihazlı tespitle kaynağı bulup onarıyoruz.",
  },
  {
    question: "Elektrik kaçağı evde nasıl anlaşılır?",
    answer:
      "Faturada açıklanamayan artış, kaçak akım rölesinin sık atması, ısınan priz/duvar ve musluklarda elektrik çarpması hissi en önemli belirtilerdir. Tüm sigortalar kapalıyken sayaç dönüyorsa kaçak olasılığı yüksektir; cihazlı tespit yaptırın.",
  },
  {
    question: "Ödeme nasıl yapılıyor?",
    answer:
      "Nakit, kredi kartı ve havale/EFT ile ödeme yapabilirsiniz. İş bitiminde fatura/düşük fatura belgesi verilir. Kurumsal müşterilerimiz için vadeli fatura seçenekleri mevcuttur.",
  },
  {
    question: "Apartman ve site yönetimleri için toplu iş yapıyor musunuz?",
    answer:
      "Evet. Bina topraklaması, ortak alan aydınlatması, diafon sistemleri, pano yenileme ve periyodik bakım için site yönetimlerine özel teklif ve bakım anlaşması sunuyoruz.",
  },
];

// ---------- Yorumlar ----------
const TESTIMONIALS = [
  {
    name: "Elif K.",
    district: "Kadıköy",
    content:
      "Akşam 21.30'da sigortalar atılıyor, ev karanlıkta. Zirve Elektrik'i aradım, 40 dakikada geldiler. Kaçaak tespitini cihazla yaptılar, sorunun banyo prizinde olduğunu söylediler. Dürüst fiyat, temiz iş. Artık elektrikçim belli.",
    rating: 5,
  },
  {
    name: "Murat T.",
    district: "Şişli",
    content:
      "Ofisimizin panosu eskiydi, sürekli sorun çıkartıyordu. Pano yenileme işini bir günde tamamladılar, tüm devreleri etiketleyip test ettiler. Keşifte verdikleri fiyatla fatura arasında fark yok. Şeffaf çalışıyorlar.",
    rating: 5,
  },
  {
    name: "Ayşe D.",
    district: "Beylikdüzü",
    content:
      "Yeni aldığımız dairede elektrik faturası şüpheli derecede yüksekti. Kaçaak tespiti yaptılar, duvar içinde kopan bir hat buldular. Kırmadan tespit etmeleri inanılmazdı. Kesinlikle tavsiye ederim.",
    rating: 5,
  },
  {
    name: "Cem Ö.",
    district: "Ümraniye",
    content:
      "Salon spotları sürekli patlıyordu. Usta tesisattaki gerilim sorunu olduğunu anladı, trafo ve bağlantıları yeniledi. 3 aydır hiç sorun çıkmadı. İşçilik garantisi veriyor olmaları güven verdi.",
    rating: 5,
  },
  {
    name: "Zeynep A.",
    district: "Bakırköy",
    content:
      "Avize montajı için aradım, aynı gün geldiler. Ağır avize için ek askı aparatı önerdiler, çok profesyonel davrandılar. İş sonrası temizlik de yaptılar. Hızlı ve özenli hizmet.",
    rating: 4,
  },
  {
    name: "Halim B.",
    district: "Pendik",
    content:
      "Elektrikli araç aldım, otoparkıma şarj ünitesi kurdular. Güç hesabından hat çekimine kadar her şeyi anlayarak anlattılar. Pano gücümüzün yeterli olduğunu doğruladılar. Sorunsuz çalışıyor.",
    rating: 5,
  },
];

// ---------- Settings ----------
const SETTINGS: Record<string, string> = {
  phone: "+90 537 720 13 45",
  whatsapp: "+90 537 720 13 45",
  email: "zirveeneeji@gmail.com",
  address: "Eski Habipler Mah. Sümbüller Sk. A Blok No: 17-21A İç Kapı No: 11, Sultangazi / İstanbul",
  workingHours: "7/24 Acil Servis",
};

async function main() {
  console.log("🌱 Zirve Elektrik seed başlıyor...");

  // 1) Admin kullanıcı
  // Güvenlik: gerçek şifre asla repoya girmez; ADMIN_EMAIL / ADMIN_PASSWORD
  // .env dosyasından (gitignore'lu) okunur. Değişkenler eksikse seed bilinçli olarak durur.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Seed için ADMIN_EMAIL ve ADMIN_PASSWORD .env içinde tanımlı olmalıdır."
    );
  }
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash, name: "Site Yöneticisi", role: "ADMIN" },
    });
    console.log(`✅ Admin oluşturuldu: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin zaten var: ${adminEmail}`);
  }

  // 2) Ayarlar
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log("✅ Ayarlar hazır");

  // 3) Hizmetler
  for (const s of SERVICES) {
    const exists = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (exists) continue;
    await prisma.service.create({
      data: {
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        content: s.content,
        icon: s.icon,
        priceNote: s.priceNote ?? "",
        featured: s.featured ?? false,
        active: true,
        sortOrder: s.sortOrder,
        metaTitle: s.metaTitle ?? "",
        metaDescription: s.metaDescription ?? "",
      },
    });
  }
  console.log(`✅ ${SERVICES.length} hizmet hazır`);

  // 4) İlçeler
  for (const d of DISTRICTS) {
    const slug = d.name
      .toLowerCase()
      .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o")
      .replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const exists = await prisma.district.findUnique({ where: { slug } });
    if (exists) continue;
    await prisma.district.create({
      data: {
        name: d.name,
        slug,
        side: d.side,
        neighborhoods: d.neighborhoods.join("\n"),
        content: districtContent(d),
        active: true,
        metaTitle: `${d.name} Elektrikçi | 7/24 Acil Elektrik Hizmeti - Zirve Elektrik`,
        metaDescription: `${d.name}'da 7/24 elektrikçi hizmeti. Arıza tespiti, sigorta, pano, kaçaak tespiti ve tüm elektrik işlerinde aynı gün servis. Zirve Elektrik.`,
      },
    });
  }
  console.log(`✅ ${DISTRICTS.length} ilçe hazır`);

  // 5) Blog
  let publishedAt = new Date();
  for (const p of BLOG_POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await prisma.blogPost.create({
      data: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.cover,
        tags: p.tags.join(", "),
        published: true,
        publishedAt: new Date(publishedAt),
        metaTitle: p.metaTitle ?? "",
        metaDescription: p.metaDescription ?? "",
      },
    });
    publishedAt = new Date(publishedAt.getTime() - 4 * 24 * 60 * 60 * 1000); // her yazı 4 gün arayla
  }
  console.log(`✅ ${BLOG_POSTS.length} blog yazısı hazır`);

  // 6) SSS
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    for (let i = 0; i < FAQS.length; i++) {
      await prisma.faq.create({ data: { ...FAQS[i], sortOrder: i + 1, active: true } });
    }
    console.log(`✅ ${FAQS.length} SSS hazır`);
  }

  // 7) Yorumlar
  const tCount = await prisma.testimonial.count();
  if (tCount === 0) {
    for (const t of TESTIMONIALS) {
      await prisma.testimonial.create({ data: { ...t, approved: true } });
    }
    console.log(`✅ ${TESTIMONIALS.length} yorum hazır`);
  }

  // 8) Örnek talepler (dashboard demo)
  const reqCount = await prisma.serviceRequest.count();
  if (reqCount === 0) {
    await prisma.serviceRequest.createMany({
      data: [
        {
          code: "ZR-100001",
          name: "Demo Müşteri 1",
          phone: "+905551110011",
          address: "Caferağa Mah. Deneme Sok. No:5 D:3",
          district: "Kadıköy",
          serviceType: "Elektrik Arıza Tespiti",
          message: "Mutfak prizleri çalışmıyor, sigorta sık atıyor.",
          status: "NEW",
        },
        {
          code: "ZR-100002",
          name: "Demo Müşteri 2",
          phone: "+905551110012",
          address: "Fulya Mah. Örnek Cad. No:12",
          district: "Şişli",
          serviceType: "Elektrik Sigortası ve Pano Arızaları",
          message: "Pano eski, yenileme istiyoruz.",
          status: "CONTACTED",
        },
        {
          code: "ZR-100003",
          name: "Demo Müşteri 3",
          phone: "+905551110013",
          address: "Kaynarca Mah. Test Sok. No:8",
          district: "Pendik",
          serviceType: "Aydınlatma, Avize ve Spot Montajı",
          message: "Salon spot montajı için randevu talebi.",
          status: "SCHEDULED",
        },
      ],
    });
    console.log("✅ Örnek talepler hazır");
  }

  console.log("🎉 Seed tamamlandı!");
  console.log(`👉 Admin girişi: ${adminEmail} / (ADMIN_PASSWORD env veya varsayılan)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
