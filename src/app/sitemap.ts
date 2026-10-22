import type { MetadataRoute } from "next";
import { getAllDistricts, getAllServices, getPublishedPosts } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Dinamik sitemap: statik rotalar + DB'den hizmetler, ilçeler ve blog yazıları.
 * DB erişilemezse statik rotalarla döner (queries katmanı zaten boş dizi döner).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/hizmetler`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/bolgeler`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/en-yakin-elektrikci`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/sss`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/hakkimizda`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE.url}/iletisim`, changeFrequency: "yearly", priority: 0.9 },
    // Yasal sayfalar - Türkiye mevzuatı (KVKK, çerez) uygunluğu
    { url: `${SITE.url}/gizlilik-politikasi`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cerez-politikasi`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/kullanim-kosullari`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [services, districts, posts] = await Promise.all([
      getAllServices(),
      getAllDistricts(),
      getPublishedPosts(),
    ]);

    return [
      ...staticRoutes,
      ...services.map((service) => ({
        url: `${SITE.url}/hizmetler/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...districts.map((district) => ({
        url: `${SITE.url}/bolgeler/${district.slug}`,
        lastModified: district.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...posts.map((post) => ({
        url: `${SITE.url}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
