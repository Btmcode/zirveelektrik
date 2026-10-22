import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SITE, DEFAULT_META } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: DEFAULT_META.title,
    template: DEFAULT_META.titleTemplate,
  },
  description: DEFAULT_META.description,
  keywords: [...DEFAULT_META.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE.url,
    siteName: SITE.name,
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Zirve Elektrik - İstanbul 7/24 Acil Elektrikçi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    images: ["/og.jpg"],
  },
  formatDetection: { telephone: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
