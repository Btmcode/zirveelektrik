import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settingsPatchSchema } from "@/lib/validation";
import { invalidateSettingsCache } from "@/lib/settings";
import { jsonError, requireAdmin, unexpectedError, zodErrorResponse } from "../_guard";

/**
 * GET   /api/admin/settings - site iletişim ayarları.
 * PATCH /api/admin/settings - ayar güncelleme (upsert) + cache invalidation.
 */
const SETTING_KEYS = ["phone", "whatsapp", "email", "address", "workingHours"] as const;

export async function GET(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    const rows = await db.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

    return NextResponse.json({
      settings: {
        phone: map["phone"] ?? "",
        whatsapp: map["whatsapp"] ?? "",
        email: map["email"] ?? "",
        address: map["address"] ?? "",
        workingHours: map["workingHours"] ?? "",
      },
    });
  } catch (error) {
    return unexpectedError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) return guard.response;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Geçersiz istek gövdesi", 400);
    }

    const data = settingsPatchSchema.parse(body);

    for (const key of SETTING_KEYS) {
      const value = data[key];
      if (value === undefined) continue;
      await db.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }

    invalidateSettingsCache();

    const rows = await db.setting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

    return NextResponse.json({
      settings: {
        phone: map["phone"] ?? "",
        whatsapp: map["whatsapp"] ?? "",
        email: map["email"] ?? "",
        address: map["address"] ?? "",
        workingHours: map["workingHours"] ?? "",
      },
    });
  } catch (error) {
    return zodErrorResponse(error);
  }
}
