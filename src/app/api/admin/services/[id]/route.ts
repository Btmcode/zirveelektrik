import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { serviceUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH  /api/admin/services/[id] - hizmet güncelleme.
 * DELETE /api/admin/services/[id] - hizmet silme.
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

    const data = serviceUpsertSchema.parse(body);

    const existing = await db.service.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Hizmet bulunamadı", 404);
    }

    const service = await db.service.update({ where: { id }, data });
    clearCacheByPrefix("svc");
    return NextResponse.json({ service });
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

    const existing = await db.service.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Hizmet bulunamadı", 404);
    }

    await db.service.delete({ where: { id } });
    clearCacheByPrefix("svc");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
