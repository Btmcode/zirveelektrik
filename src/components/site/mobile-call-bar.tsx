"use client";

import { MessageCircle, Phone } from "lucide-react";

interface MobileCallBarProps {
  phone: string;
  telUrl: string;
  waUrl: string;
}

/** Mobil alt sabit çağrı çubuğu (DESIGN.md §5) - yalnızca < md görünen. */
export function MobileCallBar({ phone, telUrl, waUrl }: MobileCallBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-background p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden">
      <a
        href={telUrl}
        aria-label={`Hemen ara: ${phone}`}
        className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Phone className="size-4" aria-hidden="true" />
        Hemen Ara
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile arıza bildir"
        className="flex h-11 items-center justify-center gap-2 rounded-md bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}
