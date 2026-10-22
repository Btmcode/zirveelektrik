"use client";

import { ADMIN_LOGIN_PATH } from "@/lib/admin-path";

/**
 * Admin istemci fetch sarmalayıcısı.
 * - 401 → oturum bitmiş: gizli giriş yoluna yönlendirir.
 * - 4xx/5xx → sunucudan gelen genel hata mesajını fırlatır.
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401) {
    window.location.href = ADMIN_LOGIN_PATH;
    throw new Error("Oturum sona erdi, lütfen tekrar giriş yapın");
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Bir hata oluştu");
  }

  return data as T;
}
