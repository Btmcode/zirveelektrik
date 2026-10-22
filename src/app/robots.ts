import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Not: /admin yolları robots.txt'de belirtilmez; oturumsuz isteklere
        // (tarayıcı botları dahil) zaten 404 döner ve noindex başlığı gönderilir.
        // robots.txt'de adının geçmesi panelin varlığını ifşa ederdi.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
