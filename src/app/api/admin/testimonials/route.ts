import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { testimonialUpsertSchema } from "@/lib/validation";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET  /api/admin/testimonials - tüm yorumlar (yönetim listesi).
 * POST /api/admin/testimonials - yeni yorum (varsayılan onaysız).
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const testimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ testimonials });
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

    const data = testimonialUpsertSchema.parse(body);

    const testimonial = await db.testimonial.create({ data });
    clearCacheByPrefix("testi");
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    return zodErrorResponse(error);
  }
}
