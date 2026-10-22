import { NextResponse } from "next/server";
import { clearSessionCookie, isAllowedOrigin } from "@/lib/auth";
import { jsonError } from "../_guard";

/**
 * POST /api/admin/logout - oturum cookie'sini temizler.
 */
export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return jsonError("Geçersiz istek kaynağı", 403);
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("Bir hata oluştu", 500);
  }
}
