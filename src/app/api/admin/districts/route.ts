import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearCacheByPrefix } from "@/lib/cache";
import { districtUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET  /api/admin/districts - tüm ilçeler (yönetim listesi).
 * POST /api/admin/districts - yeni ilçe.
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const districts = await db.district.findMany({
      orderBy: [{ side: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ districts });
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

    const data = districtUpsertSchema.parse(body);

    const district = await db.district.create({ data });
    clearCacheByPrefix("dist");
    return NextResponse.json({ district }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return jsonError("Bu slug kullanılıyor", 400);
    }
    return zodErrorResponse(error);
  }
}
