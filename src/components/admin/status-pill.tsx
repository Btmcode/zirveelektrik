"use client";

import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/utils-format";

/**
 * Talep durum pill'i - statusBadgeVariant renk sınıflarıyla.
 * (Badge bileşeni yerine düz span: tasarım sistemi no-restyle kuralına uyumlu.)
 */
export function StatusPill({ status, className }: { status: string; className?: string }) {
  const colorByStatus: Record<string, string> = {
    NEW: "bg-amber-100 text-amber-900 border-amber-300",
    CONTACTED: "bg-teal-100 text-teal-900 border-teal-300",
    SCHEDULED: "bg-violet-100 text-violet-900 border-violet-300",
    COMPLETED: "bg-emerald-100 text-emerald-900 border-emerald-300",
    CANCELLED: "bg-zinc-100 text-zinc-600 border-zinc-300",
  };
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        colorByStatus[status] ?? colorByStatus["CANCELLED"],
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
