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
  const words = content
    .replace(/[#*_>`~\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
