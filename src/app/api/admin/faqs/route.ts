import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { faqUpsertSchema } from "@/lib/validation";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET  /api/admin/faqs - tüm SSS (yönetim listesi).
 * POST /api/admin/faqs - yeni SSS kaydı.
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const faqs = await db.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ faqs });
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

    const data = faqUpsertSchema.parse(body);

    const faq = await db.faq.create({ data });
    clearCacheByPrefix("faq");
    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    return zodErrorResponse(error);
  }
}
