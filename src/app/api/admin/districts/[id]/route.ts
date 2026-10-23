import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { districtUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH  /api/admin/districts/[id] - ilçe güncelleme.
 * DELETE /api/admin/districts/[id] - ilçe silme.
 */
type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { id } = await ctx.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Geçersiz istek gövdesi", 400);
    }

    const data = districtUpsertSchema.parse(body);

    const existing = await db.district.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("İlçe bulunamadı", 404);
    }

    const district = await db.district.update({ where: { id }, data });
    clearCacheByPrefix("dist");
    return NextResponse.json({ district });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return jsonError("Bu slug kullanılıyor", 400);
    }
    return zodErrorResponse(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { id } = await ctx.params;

    const existing = await db.district.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("İlçe bulunamadı", 404);
    }

    await db.district.delete({ where: { id } });
    clearCacheByPrefix("dist");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
