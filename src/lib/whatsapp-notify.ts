import "server-only";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import {
  normalizeWaDigits,
  renderRequestCard,
  type RequestCardData,
} from "@/lib/whatsapp-card";

/**
 * WhatsApp otomatik bildirim servisi (sunucu tarafı).
 *
 * Sağlayıcı zinciri (env'e göre otomatik seçilir):
 *  1) WhatsApp Cloud API (resmî Meta)  → WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID
 *  2) CallMeBot (ücretsiz, resmî olmayan) → WHATSAPP_CALLMEBOT_APIKEY
 *
 * Hiçbiri tanımlı değilse bildirim SESSİZCE atlanır (form akışı etkilenmez);
 * yönetim panelindeki "WhatsApp'a Düşür" tek tıkla wa.me kartı açar.
 *
 * Sahip (owner) numarası: WHATSAPP_OWNER_NUMBER env'i; tanımsızsa SITE sabiti
 * (+90 537 720 13 45) kullanılır. Numara zaten sitede herkese açık olduğu için
 * gizlilik hassasiyeti yoktur.
 */

const FETCH_TIMEOUT_MS = 8000;

export type WaProvider = "cloud-api" | "callmebot";

export function getOwnerWaDigits(): string {
  const raw = process.env.WHATSAPP_OWNER_NUMBER?.trim();
  if (raw) {
    const normalized = normalizeWaDigits(raw);
    if (normalized) return normalized;
  }
  return (SITE.whatsappHref || "+905377201345").replace(/\D/g, "");
}

/** Aktif sağlayıcıyı env'e göre belirler. */
export function detectProvider(): WaProvider | null {
  if (
    process.env.WHATSAPP_TOKEN?.trim() &&
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  ) {
    return "cloud-api";
  }
  if (process.env.WHATSAPP_CALLMEBOT_APIKEY?.trim()) {
    return "callmebot";
  }
  return null;
}

async function sendViaCloudApi(
  toDigits: string,
  text: string,
  token: string,
  phoneNumberId: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toDigits,
      type: "text",
      text: { preview_url: false, body: text },
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    console.error("[wa-notify] Cloud API hatası:", res.status, bodyText.slice(0, 200));
    return { ok: false, error: `cloud-api:${res.status}` };
  }
  return { ok: true };
}

async function sendViaCallMeBot(
  toDigits: string,
  text: string,
  apiKey: string
): Promise<{ ok: boolean; error?: string }> {
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent("+" + toDigits)}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    console.error("[wa-notify] CallMeBot hatası:", res.status);
    return { ok: false, error: `callmebot:${res.status}` };
  }
  return { ok: true };
}

/** Metni sahip numarasına gönderir; env yoksa skipped döner. */
export async function sendWhatsAppToOwner(
  text: string
): Promise<{ status: "sent" | "skipped" | "failed"; provider?: WaProvider; error?: string }> {
  const provider = detectProvider();
  if (!provider) return { status: "skipped" };
  const digits = getOwnerWaDigits();

  try {
    if (provider === "cloud-api") {
      const r = await sendViaCloudApi(
        digits,
        text,
        process.env.WHATSAPP_TOKEN!.trim(),
        process.env.WHATSAPP_PHONE_NUMBER_ID!.trim()
      );
      return r.ok ? { status: "sent", provider } : { status: "failed", provider, error: r.error };
    }
    const r = await sendViaCallMeBot(
      digits,
      text,
      process.env.WHATSAPP_CALLMEBOT_APIKEY!.trim()
    );
    return r.ok ? { status: "sent", provider } : { status: "failed", provider, error: r.error };
  } catch (error) {
    console.error("[wa-notify] Gönderim istisnası:", error);
    return { status: "failed", provider, error: "network" };
  }
}

/**
 * Yeni talebi sahibin WhatsApp'ına kart metniyle düşürür ve başarıda
 * notifiedAt'i kaydeder. Çağıran taraf try/catch ile sarmalamalıdır;
 * bu fonksiyon asla form yanıtını etkilemez (throws yok).
 */
export async function notifyOwnerOfRequest(
  request: RequestCardData
): Promise<{ status: "sent" | "skipped" | "failed"; provider?: WaProvider; error?: string }> {
  try {
    // Admin panosunda kaydedilmiş özel şablon varsa onu kullan; yoksa yerleşik kart.
    // getSettings hatalarda defaults'a düşer; şablon okunamazsa akış etkilenmez.
    const settings = await getSettings();
    const text = renderRequestCard(request, settings.waTemplate);
    const result = await sendWhatsAppToOwner(text);
    if (result.status === "sent") {
      await db.serviceRequest.update({
        where: { code: request.code },
        data: { notifiedAt: new Date() },
      });
    }
    return result;
  } catch (error) {
    // Bildirim hatası iş akışını bozmaz; yalnızca log'lanır.
    console.error("[wa-notify] notifyOwnerOfRequest başarısız:", error);
    return { status: "failed", error: "exception" };
  }
}
