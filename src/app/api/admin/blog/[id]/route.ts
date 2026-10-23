import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { blogUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../../_guard";

/**
 * PATCH  /api/admin/blog/[id] - yazı güncelleme.
 * publish false→true geçişinde publishedAt boşsa şimdiye çekilir.
 * DELETE /api/admin/blog/[id] - yazı silme.
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

    const data = blogUpsertSchema.parse(body);

    const existing = await db.blogPost.findUnique({
      where: { id },
      select: { id: true, publishedAt: true },
    });
    if (!existing) {
      return jsonError("Yazı bulunamadı", 404);
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.published && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    clearCacheByPrefix("post");
    return NextResponse.json({ post });
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

    const existing = await db.blogPost.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return jsonError("Yazı bulunamadı", 404);
    }

    await db.blogPost.delete({ where: { id } });
    clearCacheByPrefix("post");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unexpectedError(error);
  }
}
