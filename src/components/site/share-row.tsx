"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareRowProps {
  /** Sayfa yolu (/blog/...); tam URL istemcide üretilir. */
  path: string;
  title: string;
}

/**
 * Yazı paylaşım eylemleri: bağlantı kopyala + WhatsApp'ta paylaş.
 * Kopyalama başarısı hem düğme içi onay hem toast ile bildirilir;
 * clipboard API desteklenmezse toast hata mesajı gösterilir (sessiz başarısızlık yok).
 */
export function ShareRow({ path, title }: ShareRowProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink(): Promise<void> {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Bağlantı kopyalandı", {
        description: "Yazının bağlantısını istediğiniz yere yapıştırabilirsiniz.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopyalanamadı", {
        description: "Tarayıcınız panoya erişmedi; bağlantıyı adres çubuğundan alabilirsiniz.",
      });
    }
  }

  /** Tam URL yalnızca tık anında kurulur (SSR'da window yok → hydration güvenli). */
  function openWhatsAppShare(): void {
    const url = `${window.location.origin}${path}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Yazıyı paylaş"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Paylaş
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void copyLink()}
        className="text-xs"
        aria-label="Bağlantıyı kopyala"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" aria-hidden="true" />
        ) : (
          <Link2 className="size-3.5" aria-hidden="true" />
        )}
        {copied ? "Kopyalandı" : "Bağlantı"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={openWhatsAppShare}
        className="text-xs"
        aria-label={`WhatsApp'ta paylaş: ${title}`}
      >
        <MessageCircle className="size-3.5" aria-hidden="true" />
        WhatsApp
      </Button>
    </div>
  );
}
