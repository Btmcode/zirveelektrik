"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import type { TocHeading } from "@/lib/content-utils";

/**
 * Masaüstü yapışkan içindekiler menüsü (scroll-spy).
 * Aktif başlık, viewport'un üst 140px bandını geçen SON başlığa göre
 * vurgulanır; rAF ile kısıtlanmış pasif scroll dinleyicisi kullanılır
 * (ana iş parçacığını bloklamaz).
 */
export function TocNav({ items }: { items: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const offset = 140;
      let current = "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = item.id;
      }
      setActiveId(current || items[0]?.id || "");
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="İçindekiler"
      className="rounded-xl border bg-card p-4 text-sm"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <ListTree className="size-3.5 text-primary" aria-hidden="true" />
        İçindekiler
      </p>
      <ol className="mt-3 space-y-1">
        {items.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "block rounded-md px-2 py-1.5 leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
