import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { REQUEST_STATUS_ORDER } from "@/lib/site";
import { requireAdmin, unexpectedError } from "../_guard";

/**
 * GET /api/admin/requests?status=&q=
 * Talep listesi: status filtresi + q araması (isim/telefon/kod/ilçe), en yeni 200 kayıt.
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") ?? "";
    const q = (searchParams.get("q") ?? "").trim().slice(0, 100);

    const where: Prisma.ServiceRequestWhereInput = {};

    if (statusParam && (REQUEST_STATUS_ORDER as readonly string[]).includes(statusParam)) {
      where.status = statusParam;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { phone: { contains: q } },
        { code: { contains: q } },
        { district: { contains: q } },
      ];
    }

    const requests = await db.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
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
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    return unexpectedError(error);
  }
}
