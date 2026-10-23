import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { createSessionToken, isAllowedOrigin, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { jsonError, unexpectedError } from "../_guard";

/**
 * Zamanlama saldırısı karşı önlemi: geçersiz e-posta için de bcrypt maliyeti
 * ödenir. Aksi halde "kullanıcı yok" yolu belirgin hızlı döner ve saldırgan
 * yanıt süresinden geçerli admin e-postasını keşfeder.
 * Modül yüklenirken bir kez üretilir; değeri hiçbir gerçek hesapla eşleşmez.
 */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
  "zirve-dummy-" + Math.random().toString(36).slice(2),
  12
);

/**
 * POST /api/admin/login
 * - Origin/CSRF kontrolü (403)
 * - IP başına rate limit: 15 dakikada 5 deneme (429)
 * - Zod doğrulama (400)
 * - bcrypt.compare ile şifre doğrulama (401 - genel mesaj)
 * - Başarıda httpOnly JWT cookie + lastLoginAt güncellemesi
 * Güvenlik: şifre/hash asla log'lanmaz, hata mesajları genel tutulur.
 */
export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return jsonError("Geçersiz istek kaynağı", 403);
    }

    const ip = getClientIp(request);
    const rl = await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Çok fazla başarısız deneme. ${rl.retryAfterSec} saniye sonra tekrar deneyin.` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Geçersiz istek gövdesi", 400);
    }

    const { email, password } = loginSchema.parse(body);

    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user) {
      // Zamanlama dengelemesi: gerçek kullanıcı yolu ile benzer maliyet.
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
      return jsonError("E-posta veya şifre hatalı", 401);
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return jsonError("E-posta veya şifre hatalı", 401);
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await setSessionCookie(token);

    await db.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    return unexpectedError(error);
  }
}
