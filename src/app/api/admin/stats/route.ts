import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, unexpectedError } from "../_guard";

/**
 * GET /api/admin/stats - dashboard özet istatistikleri.
 * Toplam/bugünkü talep, durum dağılımı, son 8 talep, içerik sayıları.
 */
export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalRequests,
      todayRequests,
      statusGroups,
      recentRequests,
      serviceCount,
      blogCount,
      districtCount,
      approvedTestimonialCount,
    ] = await Promise.all([
      db.serviceRequest.count(),
      db.serviceRequest.count({ where: { createdAt: { gte: startOfToday } } }),
      // Not: Accelerate extension altında groupBy çıktısı generic '{}' olarak
      // çıkar; satır yapısı bilindiği için açık tipleme ile daraltılır.
      db.serviceRequest
        .groupBy({ by: ["status"], _count: { _all: true } })
        .then(
          (rows) =>
            rows as Array<{ status: string; _count: { _all: number } }>
        ),
      db.serviceRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          code: true,
          name: true,
          phone: true,
          district: true,
          serviceType: true,
          status: true,
          createdAt: true,
        },
      }),
      db.service.count(),
      db.blogPost.count(),
      db.district.count(),
      db.testimonial.count({ where: { approved: true } }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const group of statusGroups) {
      byStatus[group.status] = group._count._all;
    }

    return NextResponse.json({
      totalRequests,
      todayRequests,
      byStatus,
      recentRequests,
      serviceCount,
      blogCount,
      districtCount,
      approvedTestimonialCount,
    });
  } catch (error) {
    return unexpectedError(error);
  }
}
