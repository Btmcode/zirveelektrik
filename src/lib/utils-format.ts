import { REQUEST_STATUS, type RequestStatus } from "@/lib/site";

/** tr-TR tarih formatı */
export function formatDateTr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTimeTr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function statusLabel(status: string): string {
  return REQUEST_STATUS[status as RequestStatus] ?? status;
}

/** Talep durumuna göre Badge varyantı */
export function statusBadgeVariant(status: string): string {
  switch (status) {
    case "NEW":
      return "bg-amber-100 text-amber-900 border-amber-300";
    case "CONTACTED":
      return "bg-sky-100 text-sky-900 border-sky-300";
    case "SCHEDULED":
      return "bg-violet-100 text-violet-900 border-violet-300";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-900 border-emerald-300";
    case "CANCELLED":
      return "bg-zinc-100 text-zinc-600 border-zinc-300";
    default:
      return "bg-zinc-100 text-zinc-600 border-zinc-300";
  }
}

export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function excerptFrom(text: string, len = 160): string {
  const clean = text.replace(/[#*`>[\]()]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > len ? `${clean.slice(0, len - 1)}...` : clean;
}
