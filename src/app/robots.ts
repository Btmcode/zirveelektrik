import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * GEO (Generative Engine Optimization) stratejisi:
 * AI arama motorlarının (ChatGPT Search, Perplexity, Claude, Google AI
 * Overviews, Apple Intelligence) taramasını BİLİNÇLİ olarak destekliyoruz;
 * bu botlar için ayrı kurallar tanımlanır ve ileride istenirse tek gruptan
 * kapatılabilir. Yalnızca halka açık içerik paylaşılır; /api/ her grupta
 * kapalıdır. Admin yolları bilinçli olarak HİÇBİR kuralda geçmez (varlığı
 * ifşa edilmez; oturumsuz isteklere zaten 404 + noindex döner).
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI eğitim tarayıcısı
  "OAI-SearchBot", // ChatGPT Search dizini
  "ChatGPT-User", // ChatGPT kullanıcı-istekli tarama
  "ClaudeBot", // Anthropic
  "PerplexityBot", // Perplexity arama
  "Google-Extended", // Gemini/AI Overviews için içerik kullanımı
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "CCBot", // Common Crawl (birçok LLM'in kaynağı)
  "Amazonbot", // Alexa/AWS tarayıcısı
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Klasik arama motorları + bilinmeyen botlar
        userAgent: "*",
        allow: "/",
        // Not: /admin yolları robots.txt'de belirtilmez; oturumsuz isteklere
        // (tarayıcı botları dahil) zaten 404 döner ve noindex başlığı gönderilir.
        // robots.txt'de adının geçmesi panelin varlığını ifşa ederdi.
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
