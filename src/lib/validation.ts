import { z } from "zod";

/**
 * Girdi doğrulama şemaları (SCW kuralı: tüm kullanıcı girdisi güvenilmezdir).
 * Zod ile allow-list + uzunluk + format kontrolü uygulanır.
 */

const PHONE_REGEX = /^[0-9\s()+-]{10,20}$/;
const NAME_REGEX = /^[\p{L}\p{M}\s.'-]{2,80}$/u;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad Soyad en az 2 karakter olmalı")
    .max(80)
    .regex(NAME_REGEX, "Geçersiz ad soyad"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Geçerli bir telefon numarası giriniz")
    .transform((v) => v.replace(/[^\d+]/g, "")),
  address: z.string().trim().min(10, "Adres en az 10 karakter olmalı").max(500),
  district: z.string().trim().min(2, "İlçe seçiniz").max(60),
  serviceType: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(10, "Arızayı kısaca anlatın (en az 10 karakter)").max(2000),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta giriniz").max(120).toLowerCase(),
  password: z.string().min(8, "Şifre en az 8 karakter").max(128),
});

export const requestUpdateSchema = z.object({
  status: z
    .enum(["NEW", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"])
    .optional(),
  notes: z.string().trim().max(2000).optional(),
});

// ---------- Admin içerik şemaları ----------

export const serviceUpsertSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().regex(SLUG_REGEX, "Geçersiz slug (küçük harf, tire)").max(120),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(30),
  icon: z.string().trim().max(50).default("Zap"),
  priceNote: z.string().trim().max(200).optional().default(""),
  imageUrl: z.string().trim().max(300).optional().default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999).default(0),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(160).optional().default(""),
});

export const blogUpsertSchema = z.object({
  title: z.string().trim().min(5).max(150),
  slug: z.string().trim().regex(SLUG_REGEX, "Geçersiz slug").max(150),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(30),
  coverImage: z.string().trim().max(300).optional().default(""),
  author: z.string().trim().max(80).default("Zirve Elektrik Editör"),
  tags: z.string().trim().max(300).default(""),
  published: z.boolean().default(false),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(160).optional().default(""),
});

export const districtUpsertSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().regex(SLUG_REGEX).max(60),
  content: z.string().trim().min(30),
  neighborhoods: z.string().trim().max(2000).default(""),
  side: z.enum(["AVRUPA", "ANADOLU"]).default("AVRUPA"),
  active: z.boolean().default(true),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(160).optional().default(""),
});

export const testimonialUpsertSchema = z.object({
  name: z.string().trim().min(2).max(80),
  district: z.string().trim().max(60).default(""),
  content: z.string().trim().min(10).max(600),
  rating: z.number().int().min(1).max(5).default(5),
  approved: z.boolean().default(false),
});

export const faqUpsertSchema = z.object({
  question: z.string().trim().min(5).max(200),
  answer: z.string().trim().min(10).max(1500),
  category: z.enum(["GENEL", "FIYAT", "HIZMET", "GARANTI"]).default("GENEL"),
  sortOrder: z.number().int().min(0).max(999).default(0),
  active: z.boolean().default(true),
});

export const settingsPatchSchema = z.object({
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  email: z.string().trim().email().max(120).optional(),
  address: z.string().trim().max(200).optional(),
  workingHours: z.string().trim().max(100).optional(),
});
