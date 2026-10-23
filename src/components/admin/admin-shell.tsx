"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Plug,
  FileText,
  MapPin,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { apiFetch } from "@/components/admin/api-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const MENU: MenuItem[] = [
  { href: "/admin", label: "Kontrol Paneli", icon: LayoutDashboard },
  { href: "/admin/talepler", label: "Talepler", icon: Inbox },
  { href: "/admin/hizmetler", label: "Hizmetler", icon: Plug },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/bolgeler", label: "Bölgeler", icon: MapPin },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: Star },
  { href: "/admin/sss", label: "SSS", icon: HelpCircle },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Kontrol Paneli", description: "Talepler ve site içeriği genel görünümü" },
  "/admin/talepler": { title: "Talepler", description: "Gelen servis taleplerini yönetin" },
  "/admin/hizmetler": { title: "Hizmetler", description: "Hizmet sayfalarını yönetin" },
  "/admin/blog": { title: "Blog", description: "Blog yazılarını yönetin" },
  "/admin/bolgeler": { title: "Hizmet Bölgeleri", description: "İlçe sayfalarını yönetin" },
  "/admin/yorumlar": { title: "Müşteri Yorumları", description: "Yorumları onaylayın ve düzenleyin" },
  "/admin/sss": { title: "Sık Sorulan Sorular", description: "SSS kayıtlarını yönetin" },
  "/admin/ayarlar": { title: "Ayarlar", description: "Site iletişim bilgileri ve hesap" },
};

function resolveHeader(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key));
  return match ? match[1] : { title: "Yönetim Paneli", description: "" };
}

export function AdminShell({
  user,
  pendingCount,
  children,
}: {
  user: AdminUser;
  pendingCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const header = resolveHeader(pathname);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await apiFetch("/api/admin/logout", { method: "POST" });
      // Gizli giriş yolu istemciye verilmez (client bundle'ında taşınmaz);
      // tam sayfa geçişiyle ana sayfaya dön, tüm istemci durumu sıfırlansın.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Çıkış yapılamadı");
      setLoggingOut(false);
    }
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Image
              src="/logo.png"
              alt=""
              width={64}
              height={64}
              className="size-8 shrink-0 object-contain"
            />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-bold leading-tight">Zirve Elektrik</p>
              <p className="truncate text-xs text-muted-foreground">Yönetim Paneli</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {MENU.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.href === "/admin/talepler" && pendingCount > 0 ? (
                      <SidebarMenuBadge>
                        <span className="rounded-md bg-amber-100 px-1.5 text-amber-900">
                          {pendingCount}
                        </span>
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 rounded-lg bg-card px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-900">
              {user.name.trim().charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium leading-tight">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger aria-label="Menüyü aç/kapat" />
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">{header.title}</h2>
            {header.description ? (
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {header.description}
              </p>
            ) : null}
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              <span className="hidden sm:inline">Siteyi Gör</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Çıkış yap"
          >
            {loggingOut ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <LogOut aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Çıkış</span>
          </Button>
        </header>
        <main className={cn("flex-1 p-4 md:p-6")}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
