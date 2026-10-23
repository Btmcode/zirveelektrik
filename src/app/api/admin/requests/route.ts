import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { REQUEST_STATUS_ORDER } from "@/lib/site";
import { requireAdmin, unexpectedError } from "../_guard";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

/**
 * GET /api/admin/requests?status=&q=&page=&pageSize=
 * Talep listesi: status filtresi + q araması (isim/telefon/kod/ilçe),
 * sayfa bazlı erişim (varsayılan 20, en fazla 100 kayıt/sayfa) + toplam sayısı.
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") ?? "";
    const q = (searchParams.get("q") ?? "").trim().slice(0, 100);

    const pageRaw = Number(searchParams.get("page") ?? "1");
    const pageSizeRaw = Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE));
    const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
    const pageSize =
      Number.isFinite(pageSizeRaw) && pageSizeRaw >= 1
        ? Math.min(Math.floor(pageSizeRaw), MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE;

    const where: Prisma.ServiceRequestWhereInput = {};

    if (statusParam && (REQUEST_STATUS_ORDER as readonly string[]).includes(statusParam)) {
      where.status = statusParam;
    }

    if (q) {
      // mode: "insensitive" — Türkçe ad/ilçe aramasında büyük-küçük uyumsuzluğu
      // sonuç kaybına yol açmasın (Postgres varsayılanı case-sensitive).
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { code: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, requests] = await Promise.all([
      db.serviceRequest.count({ where }),
      db.serviceRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
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
      }),
    ]);

    return NextResponse.json({
      requests,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    return unexpectedError(error);
  }
}
