"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobil menü, Radix Sheet yerine statik ID'li özel bir dialog olarak yazıldı.
 *
 * Neden: Radix Dialog kimliklerini React useId ile üretir; geliştirme modunda
 * HMR sonrası eski sunucu HTML'i ile yeni useId değerleri uyuşmaz ve
 * "aria-controls" hydration hatası oluşur. Statik ID ("mobil-menu") kullanarak
 * bu hata sınıfı header'da tamamen ortadan kaldırıldı. Menü yalnızca kullanıcı
 * tıkladığında render edilir; sunucu ve istemci ilk render'da aynı çıkışı
 * üretir, dolayısıyla hydration her zaman birebir eşleşir.
 *
 * Erişilebilirlik: aria-expanded/aria-controls, role="dialog" + aria-modal,
 * ESC ile kapatma, odak yönetimi (açılınca panel, kapanınca tetikleyici),
 * arka plan kaydırma kilidi.
 */

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/bolgeler", label: "Bölgeler" },
  { href: "/blog", label: "Blog" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
] as const;

const MOBILE_MENU_ID = "mobil-menu";

interface HeaderProps {
  phone: string;
  workingHours: string;
  telUrl: string;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Gerçek marka logosu (dağ + Z + şimşek amblemi ve ZİRVE ELEKTRİK yazısı)
 * /logo.png olarak sunulur; aynı dosya schema.org Organization.logo referansıdır.
 */
function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-ring"
      aria-label="Zirve Elektrik - ana sayfa"
    >
      <Image
        src="/logo.png"
        alt="Zirve Elektrik - İstanbul 7/24 acil elektrikçi"
        width={96}
        height={96}
        priority
        className="h-10 w-10 object-contain sm:h-11 sm:w-11 md:h-12 md:w-12"
      />
    </Link>
  );
}

export function Header({ phone, workingHours, telUrl }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeMenu();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header>
      {/* Üst bilgi barı */}
      <div className="bg-zinc-950 text-zinc-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="flex min-w-0 items-center gap-1.5">
            <Clock className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{workingHours}</span>
          </p>
          <a
            href={telUrl}
            className="flex shrink-0 items-center gap-1.5 font-bold tabular-nums transition-colors hover:text-primary"
            aria-label={`Telefonla ara: ${phone}`}
          >
            <Phone className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>{phone}</span>
          </a>
        </div>
      </div>

      {/* Ana bar - sticky */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Ana menü" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    active
                      ? "bg-accent font-semibold text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button asChild size="lg">
                <a href={telUrl} aria-label={`Hemen ara: ${phone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Hemen Ara
                </a>
              </Button>
            </div>

            {/* Mobil menü tetikleyici - statik ID'li dialog'u kontrol eder */}
            <div className="md:hidden">
              <Button
                ref={triggerRef}
                variant="outline"
                size="icon"
                type="button"
                aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={menuOpen}
                aria-controls={MOBILE_MENU_ID}
                onClick={() => setMenuOpen((value) => !value)}
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil menü - yalnızca açıkken render edilir (hydration güvenli) */}
      {menuOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <div
            ref={panelRef}
            id={MOBILE_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-[70] flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-background shadow-xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt=""
                  width={64}
                  height={64}
                  className="size-9 object-contain"
                />
                <span className="text-base font-bold tracking-tight">Zirve Elektrik</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="Menüyü kapat"
                onClick={closeMenu}
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>

            <nav aria-label="Mobil menü" className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                      active
                        ? "bg-accent font-semibold text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 px-4 pb-6">
              <Button asChild size="lg" className="w-full">
                <a href={telUrl} aria-label={`Hemen ara: ${phone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  {phone}
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {workingHours}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
