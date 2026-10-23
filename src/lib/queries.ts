import "server-only";
import { db } from "@/lib/db";
import { cached } from "@/lib/cache";

/**
 * Halka açık sayfalar için veri erişim katmanı.
 * Tüm okumalar hata yakalayarak güvenli boş değerlere düşer;
 * DB erişilemezse sayfa çökmez.
 *
 * Sıcak okumalar cached() ile TTL bellekte tutulur (Faz 2 performans):
 * - Listeler/slug aramaları 3 dk TTL — yönetim paneli değişikliklerinde
 *   ilgili önek bustlanır (bkz. api/admin/* route'ları), en kötü durumda
 *   3 dk içinde tazelenir.
 */

/* TTL sabitleri */
const TTL_LIST = 3 * 60 * 1000; // liste okumaları
const TTL_SLUG = 3 * 60 * 1000; // tekil slug okumaları
const TTL_POSTS = 2 * 60 * 1000; // blog akışı (daha sık güncellenebilir)

export async function getFeaturedServices(limit = 6) {
  try {
    return await cached(`svc:featured:${limit}`, TTL_LIST, () =>
      db.service.findMany({
        where: { active: true, featured: true },
        orderBy: { sortOrder: "asc" },
        take: limit,
      })
    );
  } catch {
    return [];
  }
}

export async function getAllServices() {
  try {
    return await cached("svc:all", TTL_LIST, () =>
      db.service.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      })
    );
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await cached(`svc:slug:${slug}`, TTL_SLUG, () =>
      db.service.findFirst({ where: { slug, active: true } })
    );
  } catch {
    return null;
  }
}

export async function getAllDistricts() {
  try {
    return await cached("dist:all", TTL_LIST, () =>
      db.district.findMany({
        where: { active: true },
        orderBy: [{ side: "asc" }, { name: "asc" }],
      })
    );
  } catch {
    return [];
  }
}

export async function getDistrictBySlug(slug: string) {
  try {
    return await cached(`dist:slug:${slug}`, TTL_SLUG, () =>
      db.district.findFirst({ where: { slug, active: true } })
    );
  } catch {
    return null;
  }
}

export async function getPublishedPosts(limit?: number) {
  try {
    return await cached(`post:pub:${limit ?? "all"}`, TTL_POSTS, () =>
      db.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        ...(limit ? { take: limit } : {}),
      })
    );
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await cached(`post:slug:${slug}`, TTL_SLUG, () =>
      db.blogPost.findFirst({ where: { slug, published: true } })
    );
  } catch {
    return null;
  }
}

export async function getActiveFaqs() {
  try {
    return await cached("faq:all", TTL_LIST, () =>
      db.faq.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      })
    );
  } catch {
    return [];
  }
}

export async function getApprovedTestimonials(limit?: number) {
  try {
    return await cached(`testi:approved:${limit ?? "all"}`, TTL_LIST, () =>
      db.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        ...(limit ? { take: limit } : {}),
      })
    );
  } catch {
    return [];
  }
}

export async function getDistrictNames() {
  try {
    return await cached("dist:names", TTL_LIST, () =>
      db.district.findMany({
        where: { active: true },
        select: { name: true, slug: true, side: true },
        orderBy: { name: "asc" },
      })
    );
  } catch {
    return [];
  }
}

export async function getServiceTitles() {
  try {
    return await cached("svc:titles", TTL_LIST, () =>
      db.service.findMany({
        where: { active: true },
        select: { title: true },
        orderBy: { sortOrder: "asc" },
      })
    );
  } catch {
    return [];
  }
}
