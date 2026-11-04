/**
 * İstanbul mahalle verisi seed script'i.
 *
 * `mahalle-istanbul.json` dosyasındaki ilçe → mahalle listelerini,
 * District tablosundaki eşleşen ilçelerin `neighborhoods` alanına
 * (satır bazlı metin) yazar. Kaynak: Wikipedia "İstanbul'un mahalleleri"
 * (İçişleri Bakanlığı envanteri, Aralık 2023) + PTT tabanlı açık veri
 * birleştirilerek 964 mahalle.
 *
 * Çalıştırma (DATABASE_URL açıkça verilmeli):
 *   DATABASE_URL="postgres://..." bun run prisma/seed-mahalle.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface MahalleMap {
  [districtName: string]: string[];
}

async function main(): Promise<void> {
  const raw = readFileSync(join(__dirname, "mahalle-istanbul.json"), "utf-8");
  const data = JSON.parse(raw) as MahalleMap;

  const districts = await db.district.findMany({
    select: { id: true, name: true, active: true },
  });

  const byName = new Map(districts.map((d) => [d.name, d]));
  let updated = 0;
  const missing: string[] = [];

  for (const [name, neighborhoods] of Object.entries(data)) {
    const district = byName.get(name);
    if (!district) {
      missing.push(name);
      continue;
    }
    const text = neighborhoods.join("\n");
    await db.district.update({
      where: { id: district.id },
      data: { neighborhoods: text },
    });
    updated++;
    console.log(`✓ ${name}: ${neighborhoods.length} mahalle`);
  }

  console.log(`\nGüncellenen ilçe: ${updated}`);
  if (missing.length > 0) {
    console.warn(`⚠ Eşleşmeyen (DB'de yok): ${missing.join(", ")}`);
  }
}

const db = new PrismaClient();

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
