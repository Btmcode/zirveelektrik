"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * "Başa dön" yüzen düğmesi - uzun blog yazılarında görünür olur.
 * Mobilde alt çağrı çubuğunun (MobileCallBar) üstünde konumlanır.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setVisible(window.scrollY > 600);
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-50 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-ring md:bottom-6 md:right-6"
      aria-label="Sayfa başına dön"
      title="Başa dön"
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
