/**
 * Google Ads arama terimleri raporu analizinden türetilen SEO/AEO içerik paketi:
 * - 2 yeni blog yazısı (klima elektrik bağlantısı, avize montajı) — rapordaki
 *   en çok aranan soru kalıplarını hedefler.
 * - 4 yeni SSS (elektrik kesintisi + klima + avize) — AEO doğrudan cevap kalıbı.
 *
 * Idempotent: bloglar slug ile upsert edilir; FAQ'lar soru metni eşleşmiyorsa eklenir.
 *
 * Çalıştırma:
 *   DATABASE_URL="<prod>" bun run scripts/add-ads-seo-content.ts
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
  faq: string; // "Soru :: Yanıt" satırları
  daysAgo: number;
}

const posts: NewPost[] = [
  {
    slug: "klima-elektrik-baglantisi-nasil-yapilir-sigortasi-kac-amper",
    title: "Klima Elektrik Bağlantısı Nasıl Yapılır? Sigorta ve Amper Rehberi",
    excerpt:
      "Klima elektrik bağlantısı neden ayrı hat ister? 12.000-24.000 BTU klimalar kaç amper çeker, sigorta ve kablo kesiti nasıl seçilir? Ustaların gözünden adım adım klima elektrik tesisatı rehberi.",
    coverImage: "/images/blog/klima-elektrik-baglantisi.png",
    tags: "klima elektrik bağlantısı, klima sigortası, klima amper, klima elektrik tesisatı, klima montaj",
    metaTitle: "Klima Elektrik Bağlantısı Nasıl Yapılır? Kaç Amper Sigorta?",
    metaDescription:
      "Klima elektrik bağlantısı nasıl yapılır? 12.000, 18.000 ve 24.000 BTU klima kaç amper çeker, klima sigortası ve kablo kesiti nasıl seçilir? Ayrı hat gerekliliği ve güvenlik kuralları bu rehberde.",
    daysAgo: 1,
    faq: [
      "18.000 BTU klima kaç amper çeker? :: 18.000 BTU'luk tipik bir split klima çalışma anında yaklaşık 7-9 amper çeker; kalkış (ilk çalıştırma) anında bu değer kısa süreliğine daha yüksek olabilir. Bu yüzden 18.000 BTU klima için genellikle 16 amper sigorta ve 2,5 mm² bakır kablo önerilir. Üreticinin kılavuzundaki elektrik değerleri esas alınmalıdır.",
      "Klima için kaç mm² kablo kullanılır? :: 12.000 BTU'ya kadar klimalar için tipik olarak 2,5 mm², 18.000 ve 24.000 BTU klimalar için 2,5-4 mm² bakır kablo kullanılır. Hat uzunluğu arttıkça kesit büyütülür. Klima hattı komşu prizlerle paylaşılmamalı, doğrudan panodan ayrı bir sigortayla beslenmelidir.",
      "Klima sigortası nereye takılır? :: Klima sigortası, daire elektrik panosunda klimalara özel bir grup sigortası olarak takılır. Kaçak akım rölesi koruması zorunludur. Klima hattı, bulaşık makinesi veya ısıtıcı gibi yüksek çekimli cihazlarla aynı sigortayı paylaşmamalıdır.",
      "Klima elektrik bağlantısı kendim yapabilir miyim? :: Hayır, önerilmez. Klima hattı panodan ayrı grup çekimi, kaçak akım rölesi bağlantısı ve cihaz tarafındaki elektrik klemensleri uzmanlık gerektirir. Hatalı bağlantı klima elektronik kartını yakabilir ve yangın riski oluşturabilir. Tesisat tarafını elektrikçi, cihaz montajını yetkili servis yapmalıdır.",
    ].join("\n"),
    content: `Klima elektrik bağlantısının en doğru hali şudur: **klimalar pano'dan ayrı bir grup sigortayla, kaçak akım rölesi korumalı ve üreticinin önerdiği kablo kesitinde kendi hattıyla beslenmelidir**. Klima, priz hattına "üstten çakma" yaparak bağlanmamalıdır; bu hem sigorta atmasına hem de klima elektronik kartının zarar görmesine yol açar.

Bu rehberde, klima montajı öncesi bilmeniz gereken amper hesabını, sigorta seçimini, kablo kesitini ve bağlantı adımlarını ustalarımızın saha deneyimiyle anlatıyoruz.

## Klima neden ayrı elektrik hattı ister?

Split klima, kompresörüyle anlık yüksek akım çeken bir cihazdır. Kalkış anında akım, çalışma akımının üzerine fırlar. Bu akım, dolap lambası gibi düşük çekimli cihazların bulunduğu priz hattında gerilim düşümü ve sürekli sigorta atması olarak kendini gösterir. Ayrıca klimalar uzun saatler kesintisiz çalıştığı için hattın termal olarak rahat olması gerekir.

Bu yüzden elektrik projesinde klimalar **ayrı grup** olarak çizilir: pano'da kendi sigortası, kendi kablosu ve kaçak akım rölesi koruması olur. [Elektrik tesisatı yenileme işlerinde](/hizmetler/elektrik-tesisati-tadilat) klima hatları da bu kurala göre çekilir.

## Klima kaç amper çeker?

Aşağıdaki tablo tipik split klimalar için yaklaşık çalışma akımlarını ve yaygın sigorta önerilerini özetler. Üretici kılavuzundaki değerler her zaman esas alınır; tablo kaba planlama içindir.

| Klima kapasitesi | Çalışma akımı (yaklaşık) | Tipik sigorta önerisi |
| --- | --- | --- |
| 9.000 BTU | 4-5 A | 10 A |
| 12.000 BTU | 5-6 A | 10-16 A |
| 18.000 BTU | 7-9 A | 16 A |
| 24.000 BTU | 10-13 A | 16-20 A |

İki nokta kritik:

1. **Kalkış akımı:** Kompressör ilk çalışmada kısa süre daha fazla akım çeker. Sigorta, çalışma akımının biraz üzerinde ama aşırı yüksek olmayan bir değerle seçilir; "sigorta atmasın diye 25 amper takayım" yaklaşımı hattı korumasız bırakır ve yangın riski yaratır.
2. **Isınmanın gerçek kaynağı:** Sigorta sürekli atıyorsa sorun çoğunlukla akım büyüklüğü değil, nemli/kasıntılı bir hat veya kaçak akımdır. Bu durumda [kaçak tespiti](/hizmetler/elektrik-kacak-tespiti) yaptırmak gerekir.

## Kablo kesiti nasıl seçilir?

Tipik daire klimalarında **2,5 mm² bakır kablo** standart tercihtir. 24.000 BTU ve üzeri klimalarda veya hat uzunluğu 15-20 metreyi aştığında **4 mm²**'ye çıkmak gerilim düşümünü azaltır. Alüminyum kablo klimalarda kullanılmamalıdır; klemens noktalarında ısınma yapar.

Kablo rotasında iki kural var: klima hattı other yüksek çekimli hatlarla kademelendirilmemeli ve klima cihazının montaj noktasına kadar sürekli (aralıksız) gitmelidir.

## Bağlantı adımları (ustanın yaptıkları)

1. **Panoda ayrı grup açılır:** Klimalara özel bir sigorta ve kaçak akım rölesi hattı pano'da ayrılır.
2. **Hat çekilir:** Montaj noktasına (genellikle cihazın sağ alt köşesindeki elektrik bağlantı girişine) sürekli kablo çekilir.
3. **Klemensler sıkılır:** Cihaz tarafında L-N-PE uçları doğru klemenslere bağlanır; gevşek klemens, en sık gördüğümüz yanık kokusu kaynağıdır.
4. **Topraklama doğrulanır:** PE iletkeni gerçek toprağa bağlı olmalıdır; "sahte toprak" klima kartında arıza yapar. Topraklama hakkında detaylar [topraklama rehberimizde](/blog/topraklama-zorunlu-mu-neden-onemli) var.
5. **Test edilir:** Hat enerjilendirilip çalıştırılır; kaçak akım rölesi tetiklenmiyorsa bağlantı sağlamdır.

## Sık yapılan hatalar

- **Priz hattına bağlama:** Klima ilk sıcak dalgada sigortayı defalarca attırır.
- **Fazla büyük sigorta:** Hattı korumasız bırakır; kablo ısınıp izolasyonu bozulur.
- **Gevşek klemens:** Yanık koku ve kart arızasının bir numaralı sebebi.
- **Kaçak akım rölesiz hat:** Yaşamsal güvenlik için zorunludur.

## Ne zaman elektrikçi çağırmalısınız?

Tadilat sırasında panoya yeni grup açılacaksa, 18.000 BTU üzeri klima takılacaksa veya sigorta sorunları varsa işi elektrikçiye bırakın. Tesisat tarafını biz hazırladıktan sonra cihaz montajını yetkili klima servisi yapar; ikisi birbirine girmeden [klima elektrik hattı çekimi](/hizmetler/klima-elektrik-hatti) tamamlanır. İstanbul içinde ücretsiz keşif ve net fiyatla aynı gün hizmet veriyoruz.`,
  },
  {
    slug: "avize-montaji-nasil-yapilir-guvenli-montaj-rehberi",
    title: "Avize Nasıl Takılır? Güvenli Avize Montajı Rehberi",
    excerpt:
      "Avize nasıl takılır, askı aparatı ne işe yarar, alçıpan tavanda montaj nasıl yapılır? Adım adım güvenli avize montajı rehberi: sigorta kapatma, klemens bağlantısı, ağırlık hesabı ve usta gerektiren durumlar.",
    coverImage: "/images/blog/avize-montaji.png",
    tags: "avize montajı, avize nasıl takılır, avize askı aparatı, spot montaj, aydınlatma montaj",
    metaTitle: "Avize Nasıl Takılır? Güvenli Avize Montajı Adımları",
    metaDescription:
      "Avize montajı nasıl yapılır? Sigorta kapatmadan askı aparatına, klemens bağlantısından alçıpan tavana göre ağırlık hesabına kadar güvenli avize montajı rehberi ve usta gerektiren durumlar.",
    daysAgo: 0,
    faq: [
      "Avize montajı için usta çağırmak gerekir mi? :: Basit ve hafif (2-3 kg altı) bir avizeyi, sigortayı kapatarak ve doğru klemens bağlantısıyla kendiniz takabilirsiniz. Ağır avizeler, yüksek tavanlar, alçıpan tavanlar ve tavan askı aparatının yeniden açılması gereken işler usta işidir. Ayrıca eski binalarda tavan kutusunda faz-nötr karışması sık görülür; yanlış bağlantı avizeyi bozabilir.",
      "Avize askı aparatı nedir, ne işe yarar? :: Askı aparatı, tavan kutusuna sabitlenen ve avizenin ağırlığını tavana aktaran metal tasarımdır. Avize ağırlığı 3 kg'ı aşan montajlarda aparat şarttır; kablo ağırlığını taşıyamaz. Hareketli (oynar başlıklı) aparatlar avizeyi düzleştirme imkânı da verir.",
      "Alçıpan tavana avize nasıl asılır? :: Alçıpan tavan tek başına ağır avizeyi taşımaz. Hafif spotlar için özel alçıpan dübelleri yeterlidir; ağır avizelerde tavan kertilir, asma tavanın üzerindeki beton plakaya özel dübel veya ankraj ile montaj yapılır. Asma tavan ıslahı ve kertik işi usta gerektirir.",
      "Avize montajında sigorta kapatılmalı mı? :: Kesinlikle evet. Avize montajı öncesi ilgili aydınlatma grubunun sigortası indirilmeli ve elektronik test kalemiyle hat enerjisiz doğrulanmalıdır. Şalter kapalıyken bile fazın geldiği bakım hataları yaşanabildiği için test kalemi kontrolü şarttır.",
    ].join("\n"),
    content: `Avize montajının kısa cevabı şudur: **sigortayı kapatın, tavan kutusundan gelen hatları klemensle güvenle bağlayın ve avizenin ağırlığını kabloya değil askı aparatına yükleyin**. Kalan her şey bu üç kuralın detayıdır. Bu rehberde, yüzlerce dairede [aydınlatma ve avize montajı](/hizmetler/aydinlatma-avize-montaji) yapmış ekibimizin adım adım montaj akışını ve en sık gördüğümüz hataları paylaşıyoruz.

## Montaj öncesi: üç güvenlik kuralı

1. **Sigortayı indirin:** Sadece ışığı kapatmak yetmez; aydınlatma grubunun sigortasını pano'dan indirin.
2. **Test kalemiyle doğrulayın:** Tavan kutusundaki uçlara test kalemiyle dokunun; hat gerçekten enerjisiz mi görün.
3. **Merdiveni güvenli kurun:** Elektrik işi kazalarının önemli bir kısmı montaj değil düşmedir; merdiven sabit bir zeminde olsun.

## Adım adım avize montajı

1. **Eski armatürü indirin:** Tavan kutusu kapağını açın; klemensleri gevşetip eski armatürü alın.
2. **Hatları tanıyın:** Faz (genellikle kahverengi/siyah), nötr (mavi) ve toprak (sarı-yeşil) uçları belirleyin. Eski binalarda renk düzeni farklı olabilir; emin değilseniz test kalemi kullanın.
3. **Askı aparatını sabitleyin:** Avize ağırlığı 3 kg'ı aşıyorsa, ağırlığı taşıyacak askı aparatını tavan kutusuna sabitleyin. Askı aparatı ağırlığı tavana aktarır; kablo ağırlığını taşımaz. Kablo gerilirse klemens gevşer ve ısınır.
4. **Klemens bağlantısını yapın:** Faz-nötr-toprak uçlarını avizenin uçlarıyla eşleştirip klemenslere sımsıkı bağlayın. Bükme + teyp yöntemi yerine klemens kullanın; gevşek bükülmüş bağlantı ısınır ve yanık koku yapar.
5. **Avizeyi asın:** Avizeyi aparata oturtun, düşme emniyetini (vida veya kilitleme) takın.
6. **Sınav edin:** Sigortayı kaldırıp çalıştırın; kıvılcım, koku veya titrek ışık varsa sigortayı hemen indirin.

## Tavan tipine göre farklar

- **Beton (asmolen) tavan:** Plastik-metal dübel ile direkt montaj yapılır; en sorunsuz yüzey budur.
- **Alçıpan (asma) tavan:** Alçıpan tek başına ağır avizeyi taşımaz. Hafif spotlar için alçıpan dübeli yeterlidir; ağır avize için asma tavan kertilip üstteki beton plakaya ankraj yapılır.
- **Germe tavan (pleksi/PVC):** Avize montajı tavan ustanızla koordinasyon ister; ısı yayan armatürler germe tavanda özel termal halka ister.

## Ağırlık hesabı: basit ama kritik

Avize kutusundaki kilogram bilgisini okuyun. 3 kg altı hafif avizeler tavan kutusu vidalarıyla taşınır; 3-10 kg arası askı aparatı şarttır; 10 kg üstü ağır avizelerde aparat + beton ankraj ve gerekirse iki noktadan taşıma yapılır. Kristal avizeler bu sınıftadır.

## Usta gerektiren durumlar

- Tavan askı aparatı yoksa veya eski montaj kapatılmışsa
- Alçıpan veya germe tavan varsa
- Avize 10 kg'dan ağırsa veya yüksek tavan (merdiven+platform) gerekiyorsa
- Tavan kutusunda faz-nötr karışması, ısınma veya yanık koku varsa
- Spot veya lineer aydınlatma projesinde birden fazla nokta çalışılacaksa

İstanbul içinde avize, spot ve lineer aydınlatma montajında ücretsiz keşif, net fiyat ve garanti belgeli işçilikle aynı gün hizmet veriyoruz; montaj sonrası titreme, ısınma veya kıvılcım gibi sorunlarda aynı ekip ücretsiz kontrol yapar.`,
  },
];

const FAQS: { question: string; answer: string; category: "GENEL" | "FIYAT" | "HIZMET" | "GARANTI" }[] = [
  {
    question: "Elektrik kesintisinde kimi aramalıyım?",
    answer:
      "Komşuların elektriği de yoksa kesinti tesis dışıdır ve ilçenize hizmet veren dağıtım şirketinin görevidir; tüm Türkiye'de ortak arıza ihbar hattı 186'yı arayabilirsiniz. Anadolu Yakası ve Adalar'da Ayedaş, Avrupa Yakası'nın kuzeyinde CK Boğaziçi, güneyinde BedaŞ hizmet verir. Elektrik sadece sizin dairenizde yoksa sorun tesisatınızdadır; o zaman elektrikçi gerekir.",
    category: "GENEL",
  },
  {
    question: "Elektrik ne zaman gelir, bunu kim bildirir?",
    answer:
      "Tesis dışı kesintilerin süresini dağıtım şirketi bildirir; 186 hattını arayarak veya dağıtım şirketinizin resmi web sitesi ve mobil uygulamasından kesinti kaydı oluşturup tahmini süre öğrenebilirsiniz. Elektrikçiler tesis dışı kesintilere müdahale edemez; ancak komşularda elektrik varken sizde yoksa bu kesinti değil tesisat arızasıdır ve biz devreye gireriz.",
    category: "GENEL",
  },
  {
    question: "Klima elektrik bağlantısı için usta gerekli mi?",
    answer:
      "Evet, klima hattı panodan ayrı grup olarak çekilmeli ve kaçak akım rölesiyle korunmalıdır; bu iş uzmanlık gerektirir. Hatalı bağlantı klima elektronik kartını yakabilir ve yangın riski oluşturur. Tesisat tarafını biz hazırlar, cihaz montajını yetkili klima servisi yapar; böylece klima garanti kapsamı da korunur.",
    category: "HIZMET",
  },
  {
    question: "Avize montajını kendim yapabilir miyim?",
    answer:
      "2-3 kilogramın altındaki hafif avizeleri, sigortayı kapatarak ve klemens bağlantısını doğru yaparak kendiniz takabilirsiniz. Ağır avizeler, alçıpan veya germe tavanlar, yüksek tavanlar ve askı aparatı gerektiren montajlar usta işidir. Ayrıca tavan kutusunda faz-nötr karışması varsa yanlış bağlantı avizeyi bozar; emin değilseniz usta çağırın.",
    category: "HIZMET",
  },
];

async function main() {
  console.log("=== Blog yazıları ekleniyor/upsert ediliyor ===");
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
      faq: p.faq,
    };
    const post = await prisma.blogPost.upsert({
      where: { slug: p.slug },
      create: data,
      update: data,
    });
    console.log(`✔ ${post.slug} (yayında: ${post.published})`);
  }

  console.log("=== SSS ekleniyor (tekrar kontrolü: soru metni) ===");
  const existing = await prisma.faq.findMany({ select: { question: true } });
  const existingSet = new Set(existing.map((f) => f.question));
  let maxOrder = await prisma.faq.aggregate({ _max: { sortOrder: true } });
  let order = (maxOrder._max.sortOrder ?? 0) + 1;
  for (const f of FAQS) {
    if (existingSet.has(f.question)) {
      console.log(`= Zaten var, atlandı: ${f.question}`);
      continue;
    }
    await prisma.faq.create({
      data: { question: f.question, answer: f.answer, category: f.category, sortOrder: order },
    });
    console.log(`✔ Eklendi: ${f.question}`);
    order++;
  }

  const blogTotal = await prisma.blogPost.count({ where: { published: true } });
  const faqTotal = await prisma.faq.count({ where: { active: true } });
  console.log(`=== Özet: yayında blog=${blogTotal}, aktif SSS=${faqTotal} ===`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("HATA:", e);
  process.exit(1);
});
