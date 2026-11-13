// Tek seferlik: TV Uydu Çanak Montajı hizmetini canlı DB'ye ekler.
// Not: prisma/seed.ts tam olarak ÇALIŞTIRILMAZ — oradaki ayarlar upsert'i
// admin'in özelleştirdiği değerleri seed varsayılanlarıyla ezebilir.
import { PrismaClient } from "@prisma/client";

const g = (parts: TemplateStringsArray, ...vals: unknown[]) =>
  parts.reduce((acc, p, i) => acc + p + (i < vals.length ? String(vals[i]) : ""), "");

const content = g`Çanak anten, rüzgâr, kablo eskimesi ve yanlış hizalama yüzünden zamanla sinyal kaybeder. Kanallar kayboluyor, görüntü bozuluyor veya TV hiç sinyal almıyorsa sorun genelde çanak hizası, LNB kablosu ya da bağlantı noktalarındadır. Zirve Elektrik, İstanbul'da çanak anten montajı, uydu ayarı ve TV duvar montajını aynı gün yapıyor.

## Çanak Anten Montajında Doğru Kurulum

- **Hizalama:** Çanak, Türkmet/Türksat uydusuna hassas biçimde yönlendirilir; sinyal kalitesi ölçümle netleştirilir.
- **LNB ve kablo:** Kaliteli LNB ve dış mekâna uygun koaksiyel kablo kullanılır; ek noktaları su geçirmez yapılır.
- **Sabitleme:** Çanak, rüzgâr yükünü taşıyacak şekilde çatı/duvara sağlam sabitlenir; montaj sonrası sarkma olmaz.
- **Çoklu çıkış:** Evde birden fazla TV varsa dağıtıcı (multiswitch/ splitter) ile doğru sinyal dağıtımı planlanır.

## Hizmet Kapsamımız

1. Çanak anten montajı (çatı, duvar, balkon uygun güzergâh)
2. Uydu ayarı ve sinyal ölçümü (Türksat/Türkmet)
3. TV duvar braketi montajı ve kablo gizleme
4. LNB, koaksiyel kablo ve dağıtıcı değişimi
5. Arıza tespiti: kanal kaybı, sinyal yok, görüntü bozulması, kablo eskimesi

## Sık Karşılaştığımız Uydu Arızaları

- **Sinyal yok / kanal bulunamıyor:** Çanak hizası kaymış veya LNB arızalı olabilir; yeniden hizalama ve LNB değişimi yapılır.
- **Yağmurda görüntü gidip geliyor:** Kablo ek noktaları su almış olabilir; ekler yenilenir.
- **Tek TV'de sorun:** Dağıtıcı veya kablo hattı arızalıdır; hat kontrol edilir.
- **Rüzgârda kayma:** Sabitleme yeniden yapılır, çanak destekleri güçlendirilir.

## Kapsam Notu

Televizyon arızaları (panel hasarı vs.) servis kapsamı dışındadır; biz anten tarafını (çanak, LNB, kablo, dağıtım ve TV duvar montajı) çözüyoruz.

İstanbul genelinde uydu çanak montajı ve tüm anten arızaları için Zirve Elektrik'i arayın.`;

const db = new PrismaClient({
  datasourceUrl: (() => {
    const raw = process.env.DATABASE_URL;
    const isPostgres =
      raw?.startsWith("postgresql://") || raw?.startsWith("postgres://");
    const candidate = raw && isPostgres
      ? raw
      : process.env.DATABASE_POSTGRES_URL ||
        process.env.DATABASE_PRISMA_DATABASE_URL ||
        raw;
    return candidate?.replace(/^postgres:\/\//, "postgresql://");
  })(),
  log: ["error", "warn"],
});

async function main() {
  const exists = await db.service.findUnique({
    where: { slug: "tv-uydu-canak-montaji" },
    select: { id: true },
  });
  if (exists) {
    console.log("Zaten mevcut — atlandı.");
    return;
  }
  const maxSort = await db.service.aggregate({ _max: { sortOrder: true } });
  await db.service.create({
    data: {
      slug: "tv-uydu-canak-montaji",
      title: "TV Uydu Çanak Montajı",
      excerpt:
        "Çanak anten montajı, uydu ayarı ve TV duvar montajı. Sinyal yok, kanal kaybı ve anten arızalarında aynı gün çözüm.",
      icon: "SatelliteDish",
      priceNote: "Mesafeye göre net teklif",
      featured: true,
      active: true,
      sortOrder: (maxSort._max.sortOrder ?? 13) + 1,
      metaTitle: "TV Uydu Çanak Anten Montajı İstanbul | Zirve Elektrik",
      metaDescription:
        "Uydu çanak anten montajı, uydu ayarı, TV duvar montajı ve sinyal arızası çözümü. İstanbul'da uyducu ve çanak anten ustası için Zirve Elektrik.",
      content,
    },
  });
  console.log("✅ TV Uydu Çanak Montajı hizmeti eklendi.");
}

main()
  .catch((e) => {
    console.error("HATA:", e.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
