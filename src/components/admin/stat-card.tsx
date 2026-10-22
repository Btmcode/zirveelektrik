"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Dashboard istatistik kartı.
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Icon className="size-6 text-amber-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
          {hint ? <p className="truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
