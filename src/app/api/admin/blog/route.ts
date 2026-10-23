import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { blogUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET  /api/admin/blog - tüm yazılar (yönetim listesi).
 * POST /api/admin/blog - yeni yazı; published ise publishedAt = now().
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    return unexpectedError(error);
  }
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Geçersiz istek gövdesi", 400);
    }

    const data = blogUpsertSchema.parse(body);

    const post = await db.blogPost.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
      },
    });
    clearCacheByPrefix("post");
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return jsonError("Bu slug kullanılıyor", 400);
    }
    return zodErrorResponse(error);
  }
}
