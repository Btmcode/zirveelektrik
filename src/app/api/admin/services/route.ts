import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceUpsertSchema } from "@/lib/validation";
import { isUniqueConstraintError, jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET  /api/admin/services - tüm hizmetler (yönetim listesi).
 * POST /api/admin/services - yeni hizmet (zod + slug unique kontrolü).
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const services = await db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ services });
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

    const data = serviceUpsertSchema.parse(body);

    const service = await db.service.create({ data });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return jsonError("Bu slug kullanılıyor", 400);
    }
    return zodErrorResponse(error);
  }
}
