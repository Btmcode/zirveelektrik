import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession, isAllowedOrigin, type SessionPayload } from "@/lib/auth";

/**
 * Admin API ortak güvenlik katmanı (SCW ilkeleri):
 * 1) Origin/CSRF kontrolü → 403
 * 2) Oturum kontrolü → 401
 * 3) Zod doğrulama → 400 (çağıran taraf parse eder)
 * Hata mesajları geneldir; stack/PII sızdırılmaz.
 */

export type AdminGuardResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse };

export async function requireAdmin(request: Request): Promise<AdminGuardResult> {
  if (!isAllowedOrigin(request)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Geçersiz istek kaynağı" }, { status: 403 }),
    };
  }
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Zod hatasını kullanıcıya zararsız ilk mesajla 400'e çevirir. */
export function zodErrorResponse(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const first = error.issues[0]?.message ?? "Geçersiz veri";
    return jsonError(first, 400);
  }
  return jsonError("Bir hata oluştu", 500);
}

/** Prisma unique constraint (P2002) → slug çakışması. */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/** Bilinmeyen hataları genelleştirir; iç detay yalnızca sunucu log'una gider. */
export function unexpectedError(error: unknown): NextResponse {
  console.error("[admin-api] unexpected error:", error instanceof Error ? error.name : "unknown");
  return jsonError("Bir hata oluştu", 500);
}
