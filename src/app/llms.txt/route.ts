import { getAllDistricts, getAllServices, getActiveFaqs, getPublishedPosts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import streetsData from "@/data/istanbul-sokaklar.json";

export const dynamic = "force-dynamic";

const STREETS = streetsData as Record<string, string[]>;

/**
 * GET /llms.txt — GEO (Generative Engine Optimization) standardı (llmstxt.org).
 * Büyük dil modellerine (ChatGPT, Perplexity, Claude, Gemini, AI Overviews)
 * sitenin makine-okunur özetini ve en önemli sayfa haritasını sunar.
 *
 * Kural: yalnızca halka açık içerik; admin/API yolları asla geçmez.
 * Hizmet/ilçe/SSS listeleri DB'den dinamik üretilir; DB erişilemezse
 * queries katmanı boş dizi döndürdüğü için dosya yine geçerli kalır.
 */
export async function GET() {
  const [settings, services, districts, faqs, posts] = await Promise.all([
    getSettings(),
    getAllServices(),
    getAllDistricts(),
    getActiveFaqs(),
    getPublishedPosts(20),
  ]);

  // Gerçek kapsam istatistikleri: mahalle adları District tablosundan,
  // sokak kayıtları UAVT dökümünden — AI motorları için doğrulanabilir sayılar.
  const districtRows = districts.map((d) => ({
    ...d,
    neighborhoodList: (d.neighborhoods ?? "")
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean),
  }));
  const totalNeighborhoods = districtRows.reduce(
    (sum, d) => sum + d.neighborhoodList.length,
    0
  );
  const districtPrefixes = new Set(districtRows.map((d) => `${d.name}|`));
  const totalStreets = Object.entries(STREETS).reduce(
    (sum, [key, list]) =>
      districtPrefixes.has(key.slice(0, key.indexOf("|") + 1))
        ? sum + list.length
        : sum,
    0
  );

  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");

  lines.push("## Hakkında");
  lines.push("");
  lines.push(
    `- ${SITE.legalName}, ${SITE.city} genelinde ${SITE.workingHours} elektrikçi hizmeti verir (${SITE.foundedYear} yılından beri).`
  );
  lines.push(
    `- Hizmet bölgesi: İstanbul'un ${districts.length} ilçesi (${totalNeighborhoods} mahalle, kayıtlı ${totalStreets} sokak/cadde — UAVT dökümü; ilçe başına kapsam: /bolgeler/{ilçe-slug}).`
  );
  lines.push(`- Adres: ${settings.address}`);
  lines.push(`- Telefon: ${settings.phone} (7/24 çağrıya açık)`);
  lines.push(`- WhatsApp: ${settings.whatsapp}`);
  lines.push(`- E-posta: ${settings.email}`);
  lines.push(`- Çalışma saatleri: ${settings.workingHours}`);
  lines.push(
    `- Acil talep formu: ${SITE.url}/iletisim — talepler takip koduyla (ZR-XXXXXX) üretilir.`
  );
  lines.push("");

  lines.push("## Ana Sayfalar");
  lines.push("");
  lines.push(`- [Ana Sayfa](${SITE.url}/): ${SITE.shortDescription}`);
  lines.push(`- [Hizmetler](${SITE.url}/hizmetler): Tüm elektrik hizmetleri listesi`);
  lines.push(`- [Bölgeler](${SITE.url}/bolgeler): İstanbul ilçe bazlı hizmet sayfaları`);
  lines.push(`- [En Yakın Elektrikçi](${SITE.url}/en-yakin-elektrikci): Yakınlık/erişim rehberi`);
  lines.push(`- [Sık Sorulan Sorular](${SITE.url}/sss): Fiyat, süreç ve garanti soruları`);
  lines.push(`- [Blog](${SITE.url}/blog): Elektrik rehberleri ve AEO/GEO makaleleri`);
  lines.push(`- [İletişim](${SITE.url}/iletisim): Telefon, WhatsApp, form ve harita`);
  lines.push("");

  if (services.length > 0) {
    lines.push("## Hizmetler");
    lines.push("");
    for (const s of services) {
      const excerpt = (s.excerpt ?? "").split("\n")[0].slice(0, 140);
      lines.push(`- [${s.title}](${SITE.url}/hizmetler/${s.slug}): ${excerpt}`);
    }
    lines.push("");
  }

  if (districts.length > 0) {
    lines.push("## Hizmet Bölgeleri (İstanbul İlçeleri)");
    lines.push("");
    const chunks: string[] = [];
    for (const d of districtRows) {
      const nh = d.neighborhoodList.length;
      chunks.push(
        `[${d.name}](${SITE.url}/bolgeler/${d.slug})${nh > 0 ? ` (${nh} mahalle)` : ""}`
      );
    }
    lines.push(chunks.join(", ") + ".");
    lines.push("");
  }

  if (posts.length > 0) {
    lines.push("## Blog Yazıları");
    lines.push("");
    for (const p of posts) {
      const summary = (p.excerpt ?? "").split("\n")[0].slice(0, 120);
      lines.push(`- [${p.title}](${SITE.url}/blog/${p.slug})${summary ? `: ${summary}` : ""}`);
    }
    lines.push("");
  }

  if (faqs.length > 0) {
    lines.push("## Sık Sorulan Sorular");
    lines.push("");
    for (const f of faqs.slice(0, 12)) {
      lines.push(`- ${f.question}`);
    }
    lines.push(`- Tam liste: ${SITE.url}/sss`);
    lines.push("");
  }

  lines.push("## Yasal");
  lines.push("");
  lines.push(`- [Gizlilik Politikası](${SITE.url}/gizlilik-politikasi)`);
  lines.push(`- [Çerez Politikası](${SITE.url}/cerez-politikasi)`);
  lines.push(`- [Kullanım Koşulları](${SITE.url}/kullanim-kosullari)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // LLM tarayıcıları sık uğrar; 1 saat CDN önbelleği yeterli.
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
