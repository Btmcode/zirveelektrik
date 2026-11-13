/**
 * Blog içerik yardımcıları: okuma süresi ve içindekiler (TOC) başlık çıkarımı.
 * Markdown içeriği yalnızca okunur; hiçbir HTML decode edilmez (XSS güvenli).
 */

/** Türkçe karakterleri ASCII slug'a çevirir (markdown.tsx ile aynı fonksiyon). */
export function slugifyHeading(text: string): string {
  const map: Record<string, string> = {
    ı: "i",
    İ: "i",
    ş: "s",
    Ş: "s",
    ğ: "g",
    Ğ: "g",
    ü: "u",
    Ü: "u",
    ö: "o",
    Ö: "o",
    ç: "c",
    Ç: "c",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface TocHeading {
  id: string;
  text: string;
}

/**
 * Markdown içeriğinden H2 ("## ...") başlıklarını çeker.
 * Id üretimi markdown.tsx'teki h2 renderer ile aynı slugify'ı kullanır;
 * böylece TOC linkleri render edilen başlıklarla eşleşir.
 */
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();
  const regex = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    if (!text) continue;
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({ id: count === 0 ? base : `${base}-${count}`, text });
  }
  return headings;
}

/** Ortalama 200 kelime/dakika hızına göre okuma süresi (dk). */
export function calcReadingTime(content: string): number {
  return Math.max(1, Math.round(countWords(content) / 200));
}

/** Markdown işaretlerini temizleyerek ham kelime sayısı döndürür (Article.wordCount). */
export function countWords(content: string): number {
  return content
    .replace(/[#*_>`~\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export interface PostFaq {
  question: string;
  answer: string;
}

/**
 * Blog SSS alanı (AEO): admin "Soru :: Yanıt" biçiminde satır satır girer.
 * Yanıt motorları (Google AI Overviews, Perplexity, ChatGPT Search) soru-başlık
 * + kısa doğrudan yanıt bloklarını alıntılamayı tercih eder; bu bölüm hem
 * görünür içerik hem de FAQPage yapısal verisi olarak yayınlanır.
 * Guvenli ayrıştırma: boş satırlar/seperatorsuz satırlar atılır, uzunluklar kesilir.
 */
export function parsePostFaq(raw?: string | null): PostFaq[] {
  if (!raw) return [];
  const items: PostFaq[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const sep = trimmed.indexOf("::");
    if (sep <= 0) continue;
    const question = trimmed.slice(0, sep).trim().slice(0, 200);
    const answer = trimmed.slice(sep + 2).trim().slice(0, 1000);
    if (!question || !answer) continue;
    items.push({ question, answer });
    if (items.length >= 10) break;
  }
  return items;
}

/**
 * Liste sayfası araması için hafif arama gövdesi: başlık + özet + etiketler +
 * H2 başlıkları. Tam içerik istemciye taşınmaz (paket boyutu koruması).
 */
export function buildSearchBlob(input: {
  title: string;
  excerpt: string;
  tags: string;
  content: string;
}): string {
  const headings = extractHeadings(input.content)
    .map((h) => h.text)
    .join(" ");
  return [input.title, input.excerpt, input.tags, headings]
    .join(" ")
    .toLocaleLowerCase("tr");
}
