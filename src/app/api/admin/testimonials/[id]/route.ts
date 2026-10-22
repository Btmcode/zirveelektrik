import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonialUpsertSchema } from "@/lib/validation";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH  /api/admin/testimonials/[id] - yorum güncelleme (onay dahil).
 * DELETE /api/admin/testimonials/[id] - yorum silme.
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

    const data = testimonialUpsertSchema.parse(body);

    const existing = await db.testimonial.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Yorum bulunamadı", 404);
    }

    const testimonial = await db.testimonial.update({ where: { id }, data });
    return NextResponse.json({ testimonial });
  } catch (error) {
    return zodErrorResponse(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { id } = await ctx.params;

    const existing = await db.testimonial.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Yorum bulunamadı", 404);
    }

    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
