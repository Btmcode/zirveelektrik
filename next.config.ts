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
  // Not: Sandbox önizleme paneli iframe'de çalıştığı için geliştirme aşamasında
  // X-Frame-Options / frame-ancestors bilinçli olarak eklenmedi (SCW kuralı:
  // iframe embedding varsa geliştirmede gevşetilir). Prodde eklenebilir.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
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
