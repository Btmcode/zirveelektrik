import "server-only";
import { db } from "@/lib/db";

/**
 * Halka açık sayfalar için veri erişim katmanı.
 * Tüm okumalar hata yakalayarak güvenli boş değerlere düşer;
 * DB erişilemezse sayfa çökmez.
 */

export async function getFeaturedServices(limit = 6) {
  try {
    return await db.service.findMany({
      where: { active: true, featured: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getAllServices() {
  try {
    return await db.service.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await db.service.findFirst({ where: { slug, active: true } });
  } catch {
    return null;
  }
}

export async function getAllDistricts() {
  try {
    return await db.district.findMany({
      where: { active: true },
      orderBy: [{ side: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getDistrictBySlug(slug: string) {
  try {
    return await db.district.findFirst({ where: { slug, active: true } });
  } catch {
    return null;
  }
}

export async function getPublishedPosts(limit?: number) {
  try {
    return await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await db.blogPost.findFirst({ where: { slug, published: true } });
  } catch {
    return null;
  }
}

export async function getActiveFaqs() {
  try {
    return await db.faq.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getApprovedTestimonials(limit?: number) {
  try {
    return await db.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
  } catch {
    return [];
  }
}

export async function getDistrictNames() {
  try {
    return await db.district.findMany({
      where: { active: true },
      select: { name: true, slug: true, side: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getServiceTitles() {
  try {
    return await db.service.findMany({
      where: { active: true },
      select: { title: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
