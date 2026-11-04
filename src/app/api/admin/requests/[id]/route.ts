import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requestUpdateSchema } from "@/lib/validation";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH /api/admin/requests/[id] - durum ve not güncelleme.
 * markNotified: true → WhatsApp bildirim zamanı (notifiedAt) şimdi olarak işaretlenir
 * (yönetici "WhatsApp'a Düşür" kartını kendi telefonundan gönderdiğinde çağrılır).
 * DELETE /api/admin/requests/[id] - talebi kalıcı siler.
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

    const { status, notes, markNotified } = requestUpdateSchema.parse(body);

    const patch: { status?: string; notes?: string; notifiedAt?: Date } = {};
    if (status !== undefined) patch.status = status;
    if (notes !== undefined) patch.notes = notes;
    if (markNotified) patch.notifiedAt = new Date();

    const existing = await db.serviceRequest.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Talep bulunamadı", 404);
    }

    const updated = await db.serviceRequest.update({
      where: { id },
      data: patch,
      select: {
        id: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        district: true,
        serviceType: true,
        message: true,
        status: true,
        notes: true,
        source: true,
        notifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ request: updated });
  } catch (error) {
    return zodErrorResponse(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { id } = await ctx.params;

    const existing = await db.serviceRequest.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Talep bulunamadı", 404);
    }

    await db.serviceRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
