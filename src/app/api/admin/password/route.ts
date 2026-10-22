import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAllowedOrigin } from "@/lib/auth";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * PATCH /api/admin/password - oturumlu adminin şifresini değiştirir.
 * Mevcut şifre bcrypt.compare ile doğrulanır; yeni şifre hash'lenerek saklanır.
 */
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gerekli").max(128),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı").max(128),
});

export async function PATCH(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Geçersiz istek gövdesi", 400);
    }

    const { currentPassword, newPassword } = passwordChangeSchema.parse(body);

    const user = await db.adminUser.findUnique({ where: { id: guard.session.sub } });
    if (!user) {
      return jsonError("Bir hata oluştu", 404);
    }

    const currentOk = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentOk) {
      return jsonError("Mevcut şifre hatalı", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return zodErrorResponse(error);
    }
    return unexpectedError(error);
  }
}
