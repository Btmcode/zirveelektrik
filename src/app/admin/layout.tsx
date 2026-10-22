import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Yönetim Paneli | Zirve Elektrik" },
  robots: { index: false, follow: false },
};

/**
 * Admin kök layout. Toaster kök layout'ta (sonner) zaten var; oturum kontrolü
 * (dashboard) layout'undadır, login sayfası (auth) grubundan geçmez.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
