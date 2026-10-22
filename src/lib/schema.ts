import { SITE, DEFAULT_META } from "@/lib/site";

/** Schema.org yardımcıları - SEO/AEO/GEO yapısal veri şemaları */

interface ReviewInput {
  author: string;
  content: string;
  rating: number;
}

/**
 * Yerel işletme şeması (Electrician).
 * 2026 yerel SEO sinyalleri: kategori (Electrician), çalışma saatleri,
 * hizmet bölgesi varlıkları (39 ilçe), hizmet kataloğu, gerçek onaylı
 * müşteri yorumları (AggregateRating yalnızca yeterli yorum varsa eklenir).
 */
export function localBusinessSchema(opts?: {
  phone?: string;
  reviews?: ReviewInput[];
  serviceNames?: string[];
  districtNames?: string[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: "Zirve Elektrik İstanbul",
    url: SITE.url,
    telephone: opts?.phone ?? SITE.phone,
    email: SITE.email,
    description: SITE.description,
    image: `${SITE.url}/og.jpg`,
    logo: `${SITE.url}/logo.png`,
    priceRange: "₺₺",
    foundingDate: String(SITE.foundedYear),
    slogan: "İstanbul'un 7/24 acil elektrikçisi",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.addressLocality,
      addressRegion: SITE.addressRegion,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.1329,
      longitude: 28.8317,
    },
    areaServed: [
      {
        "@type": "City",
        name: "İstanbul",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Türkiye",
        },
      },
      ...(opts?.districtNames ?? []).map((name) => ({
        "@type": "Place",
        name: `${name}, İstanbul`,
      })),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: Object.values(SITE.social),
  };

  // Varlık sinyalleri: uzmanlık alanları + hizmet kataloğu (AI motorlarının
  // "İstanbul'da hangi elektrik hizmetleri var" sorusunu cevaplamasına yardım eder)
  if (opts?.serviceNames && opts.serviceNames.length > 0) {
    schema.knowsAbout = opts.serviceNames;
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Elektrik Hizmetleri",
      itemListElement: opts.serviceNames.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    };
  }

  // Yorum sinyalleri: yalnızca onaylı, gerçek DB yorumlarından üretilir
  const reviews = opts?.reviews ?? [];
  if (reviews.length >= 3) {
    const ratings = reviews.map((r) => r.rating).filter((n) => n >= 1 && n <= 5);
    if (ratings.length >= 3) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(avg.toFixed(1)),
        reviewCount: ratings.length,
        bestRating: 5,
        worstRating: 1,
      };
      schema.review = reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewBody: r.content,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      }));
    }
  }

  return schema;
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: DEFAULT_META.description,
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

export function serviceSchema(service: {
  slug: string;
  title: string;
  excerpt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.excerpt,
    url: `${SITE.url}/hizmetler/${service.slug}`,
    category: "Elektrikçi Hizmetleri",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "City", name: "İstanbul" },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: SITE.phone,
      serviceUrl: `${SITE.url}/iletisim`,
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt?: Date | null;
  updatedAt: Date;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: (post.publishedAt ?? post.updatedAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: post.author || SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };
}
