import { NextResponse, after } from "next/server";
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { isAllowedOrigin } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { serviceRequestSchema } from "@/lib/validation";
import { notifyOwnerOfRequest } from "@/lib/whatsapp-notify";

export const dynamic = "force-dynamic";

/** ZR-XXXXXX biçiminde kısa takip kodu üretir (kriptografik rastgelelik). */
function generateCode(): string {
  return `ZR-${randomInt(100000, 1000000)}`;
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = generateCode();
    const exists = await db.serviceRequest.findUnique({
      where: { code: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  // 5 denemede çakışma çıkması son derece düşük ihtimaldir
  return generateCode();
}

export async function POST(request: Request) {
  try {
    // 0) Gövde boyutu sınırı: anormal büyük istekleri erken reddet.
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > 32 * 1024) {
      return NextResponse.json(
        { ok: false, error: "İstek gövdesi çok büyük." },
        { status: 413 }
      );
    }

    // 1) CSRF/Origin kontrolü
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz istek kaynağı." },
        { status: 403 }
      );
    }

    // 2) Rate limit: IP başına saatte 5 talep (PostgreSQL tabanlı dağıtık sayaç)
    const limit = await rateLimit(`req:${getClientIp(request)}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Çok fazla talep gönderildi. Lütfen bir süre sonra tekrar deneyin veya bizi telefonla arayın.",
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
      );
    }

    // 3) Gövdeyi güvenli şekilde ayrıştır
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    // 4) Zod doğrulama (allow-list + uzunluk + format)
    const parsed = serviceRequestSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        (fieldErrors[key] ??= []).push(issue.message);
      }
      return NextResponse.json(
        { ok: false, error: "Lütfen form alanlarını kontrol edin.", errors: fieldErrors },
        { status: 400 }
      );
    }

    // 5) Honeypot / hız kontrolü: bot istekleri sessizce "başarılı" sayılır
    //    (kayıt OLUŞTURULMAZ). Böylece bot başarılı sandığı için denemeye
    //    devam etmez; gerçek kullanıcı etkilenmez.
    const elapsed = parsed.data.formTs ? Date.now() - parsed.data.formTs : -1;
    if (parsed.data.website || (elapsed >= 0 && elapsed < 3000)) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // 6) Kayıt - benzersiz takip kodu ile
    const code = await generateUniqueCode();
    // Savunma katmanı: istemci mahalleyi adrese eklemeyi atladıysa sunucu
    // tamamlar ("X Mahallesi, ..."). Zaten başındaysa (formun birleşik
    // gönderimi) dokunulmaz; WhatsApp kartı ve harita linki tam adres alır.
    const mahalle = parsed.data.mahalle?.trim();
    const address =
      mahalle && !parsed.data.address.toLowerCase().startsWith(mahalle.toLowerCase())
        ? `${mahalle} Mahallesi, ${parsed.data.address}`
        : parsed.data.address;
    const created = await db.serviceRequest.create({
      data: {
        code,
        name: parsed.data.name,
        phone: parsed.data.phone,
        address,
        district: parsed.data.district,
        serviceType: parsed.data.serviceType || null,
        message: parsed.data.message,
        status: "NEW",
        source: "WEBSITE",
      },
    });

    // 7) WhatsApp otomatik bildirim: formun "alındı" yanıtı beklemeden, yanıt
    //    SONRASINA planlanır (after()). Vercel serverless'ta fonksiyon, gönderim
    //    bitene kadar canlı tutulur; hata olursa yalnızca log'lanır (non-fatal).
    after(async () => {
      const notification = await notifyOwnerOfRequest({
        code: created.code,
        name: created.name,
        phone: created.phone,
        address: created.address,
        district: created.district,
        serviceType: created.serviceType,
        message: created.message,
        createdAt: created.createdAt,
      });
      if (notification.status === "failed") {
        console.warn(
          `[api/requests] ${created.code} WhatsApp bildirimi başarısız (${notification.error ?? "?"}); manuel düşürme açık`
        );
      }
    });

    return NextResponse.json(
      { ok: true, code: created.code },
      { status: 201 }
    );
  } catch (error) {
    // İç hata detayları istemciye sızmaz
    console.error("[api/requests] Talep kaydedilemedi:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Talebiniz şu anda kaydedilemedi. Lütfen telefonla iletişime geçin.",
      },
      { status: 500 }
    );
  }
}
