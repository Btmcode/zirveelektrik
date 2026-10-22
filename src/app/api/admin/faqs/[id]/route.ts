import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { faqUpsertSchema } from "@/lib/validation";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH  /api/admin/faqs/[id] - SSS güncelleme.
 * DELETE /api/admin/faqs/[id] - SSS silme.
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

    const data = faqUpsertSchema.parse(body);

    const existing = await db.faq.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("SSS kaydı bulunamadı", 404);
    }

    const faq = await db.faq.update({ where: { id }, data });
    return NextResponse.json({ faq });
  } catch (error) {
    return zodErrorResponse(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { id } = await ctx.params;

    const existing = await db.faq.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("SSS kaydı bulunamadı", 404);
    }

    await db.faq.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
