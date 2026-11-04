import { NextResponse } from "next/server";
import streetsData from "@/data/istanbul-sokaklar.json";

/**
 * Mahalle bazlı sokak/cadde listesi (kademeli adres seçimi).
 *
 * Veri kaynağı: NVI/UAVT Ulusal Adres Veri Tabanı (Nisan 2021 dökümü),
 * İstanbul filtresi; ilçe/mahalle adları site diline normalize edildi.
 * Dosya yalnızca sunucuda yüklenir (istemci paketine girmez).
 */

const STREETS = streetsData as Record<string, string[]>;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = (searchParams.get("ilce") ?? "").trim().slice(0, 60);
  const mahalle = (searchParams.get("mahalle") ?? "").trim().slice(0, 80);

  if (!district || !mahalle) {
    return NextResponse.json(
      { ok: false, error: "ilce ve mahalle parametreleri zorunludur." },
      { status: 400 }
    );
  }

  const streets = STREETS[`${district}|${mahalle}`] ?? [];
  return NextResponse.json(
    { ok: true, streets },
    // Sokak verisi statiktir; tarayıcı ve CDN bir gün cache'leyebilir.
    { headers: { "Cache-Control": "public, max-age=86400" } }
  );
}
