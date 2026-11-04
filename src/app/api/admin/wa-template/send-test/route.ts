import { NextResponse } from "next/server";
import { waTemplateTestSchema } from "@/lib/validation";
import { sendWhatsAppToOwner } from "@/lib/whatsapp-notify";
import { jsonError, requireAdmin, zodErrorResponse } from "../../_guard";

/**
 * POST /api/admin/wa-template/test
 * Şablon editöründeki hazır (token'ları dolu) kart metnini sahibin WhatsApp'ına
 * gönderir; yönetici şablonu kaydetmeden ÖNCE gerçek teslimatı doğrulayabilir.
 * Sağlayıcı env'de tanımlı değilse 503 döner (fail-closed, akış bozulmaz).
 */
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

    const { text } = waTemplateTestSchema.parse(body);

    const result = await sendWhatsAppToOwner(text);
    if (result.status === "skipped") {
      return jsonError(
        "Bildirim sağlayıcı tanımlı değil (WHATSAPP_CALLMEBOT_APIKEY veya Cloud API env eksik).",
        503
      );
    }
    if (result.status === "failed") {
      return jsonError(`Test mesajı gönderilemedi (${result.error ?? "bilinmeyen hata"}).`, 502);
    }
    return NextResponse.json({ status: result.status, provider: result.provider });
  } catch (error) {
    return zodErrorResponse(error);
  }
}
