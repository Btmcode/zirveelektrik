import type { NextConfig } from "next";

const securityHeaders = [
  // MIME sniffing engelleme (SCW kuralı)
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// Clickjacking koruması (frame-ancestors + X-Frame-Options): yalnızca PRODUCTION'da.
// Geliştirmede sandbox önizleme paneli iframe ile çalıştığı için bilinçli olarak
// eklenmez (bkz. Task 9 notu); canlıya çıkarken aktif olur.
if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  });
  securityHeaders.push({ key: "X-Frame-Options", value: "DENY" });
}

const nextConfig: NextConfig = {
  // Not: output: "standalone" yalnızca kendi sunucusunda barındırma içindir;
  // Vercel kendi build pipeline'ını kullandığı için kaldırıldı.
  // Tip denetimi aktif: src tsc --noEmit temiz; tip hataları build'i durdursun.
  typescript: {
    ignoreBuildErrors: false,
  },
  // X-Powered-By başlığını kaldır: teknoloji parmak izi sızdırma.
  poweredByHeader: false,
  reactStrictMode: false,
  images: {
    // Yerel görseller güncellendiğinde optimizer'ın 4 saat boyunca bayat
    // varyant sunmasını engeller (dev'de fotoğraf değişimi sık yaşanır).
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
