/**
 * Faz 2: /sss sayfası içerik zenginleştirme.
 * 6 yeni sık sorulan soru (FIYAT 2, HIZMET 2, GENEL 1, GARANTI 1).
 * Idempotent: aynı soru metni tekrar eklenmez (question eşleşmesi).
 *
 * Çalıştırma (sandbox'ta önce env unset):
 *   unset DATABASE_URL DIRECT_URL POSTGRES_URL DATABASE_URL_UNPOOLED DATABASE_URL_NO_SSL
 *   bun run scripts/seed-faz2-faqs.ts
 */
import { PrismaClient } from "@prisma/client";

const POSTS: {
  question: string;
  answer: string;
  category: "GENEL" | "FIYAT" | "HIZMET" | "GARANTI";
}[] = [
  {
    question: "Elektrikçi fiyatları neye göre belirleniyor?",
    answer:
      "Fiyat; işin türüne, gereken malzemeye ve iş süresine göre belirlenir. Ustamız yerinde tespit yapar, işe başlamadan önce size net fiyat teklifi verir. Teklifi onaylamadan hiçbir işleme başlanmaz; onaylamazsanız yalnızca tespit hizmet bedeli ödersiniz. Böylece iş sonunda sürpriz ek ücret riski doğmaz.",
    category: "FIYAT",
  },
  {
    question: "Ödemeyi nasıl yapabilirim, ön ödeme isteniyor mu?",
    answer:
      "Ödemeyi iş tamamlandıktan sonra nakit ya da havale/EFT ile yapabilirsiniz. İşe başlangıçta ön ödeme talep edilmez; sıralama daima tespit → teklif onayı → iş → ödeme şeklindedir. Talep etmeniz hâlinde işe ait fatura veya makbuz düzenlenir.",
    category: "FIYAT",
  },
  {
    question: "Acil elektrik arızasında ne kadar sürede geliyorsunuz?",
    answer:
      "Acil arızalarda en yakın müsait ustamız yönlendirilir. Varış süresi adresinize ve İstanbul trafiğine göre değişir; arama sırasında size tahmini bir süre söylenir. Yoğun saatlerde süre uzayabileceği için sorunu fark ettiğiniz an aramanızı öneririz.",
    category: "HIZMET",
  },
  {
    question: "Hangi ilçelerde elektrikçi hizmeti veriyorsunuz?",
    answer:
      "İstanbul'un Avrupa ve Anadolu yakasındaki 39 ilçenin tamamında hizmet veriyoruz; ilçe listesine sitemizdeki Hizmet Bölgeleri sayfasından ulaşabilirsiniz. Aradığınızda adresinizi söylemeniz yeterli, en yakın ustayı size yönlendiriyoruz.",
    category: "HIZMET",
  },
  {
    question: "Elektrikçi çağırmadan önce telefonla sorunumu anlatabilir miyim?",
    answer:
      "Evet, bizi arayabilirsiniz. Ustalarımız sorununuzu telefonla dinler; sigortayı yeniden kaldırmak gibi basit çözümler bazen telefonda anlatılabiliyor. Telefonda çözülemeyen durumlarda yerinde tespit gerekir ve en yakın usta buna göre planlanır.",
    category: "GENEL",
  },
  {
    question: "Yapılan elektrik işinin garantisi var mı?",
    answer:
      "Evet. İşçilik ve kullanılan malzemeler garanti kapsamındadır; garanti süresi ve şartları işe başlamadan önce verilen teklifte yazılı olarak belirtilir. Garanti süresi içinde aynı sorun tekrarlarsa aynı ekip ek ücret olmadan yeniden değerlendirme yapar.",
    category: "GARANTI",
  },
];

async function main() {
  const db = new PrismaClient();
  try {
    const existing = await db.faq.findMany({
      select: { question: true, sortOrder: true },
    });
    const existingQuestions = new Set(existing.map((f) => f.question));
    const maxSort =
      existing.length > 0 ? Math.max(...existing.map((f) => f.sortOrder)) : 0;

    let created = 0;
    let skipped = 0;
    for (const [index, faq] of POSTS.entries()) {
      if (existingQuestions.has(faq.question)) {
        skipped++;
        continue;
      }
      await db.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          sortOrder: maxSort + 1 + index,
          active: true,
        },
      });
      created++;
    }

    const total = await db.faq.count({ where: { active: true } });
    console.log(
      `SSS seed tamam: ${created} eklendi, ${skipped} zaten vardı, toplam aktif SSS: ${total}`
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error("SSS seed hatası:", error);
  process.exit(1);
});
