import type { NextConfig } from "next";
import { segments } from "./src/i18n/routes";

const OTHER = ["en", "ar"] as const;
const keys = Object.keys(segments) as (keyof typeof segments)[];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Görseller R2 (özel alan adı) üzerinden servis edilir; yerelde /public/img.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    const out = [
      { source: "/tr", destination: "/", permanent: true },
      { source: "/tr/:path*", destination: "/:path*", permanent: true },
    ];
    // /en/haber/... gibi iç (Türkçe) segmentle gelinirse yerelleştirilmiş URL'ye yönlendir
    for (const l of OTHER)
      for (const k of keys)
        if ((segments[k].tr as string) !== segments[k].en)
          out.push({ source: `/${l}/${segments[k].tr}/:path*`, destination: `/${l}/${segments[k].en}/:path*`, permanent: true });
    return out;
  },
  async rewrites() {
    const before = [{ source: "/", destination: "/tr" }];
    for (const k of keys) before.push({ source: `/${segments[k].tr}/:path*`, destination: `/tr/${segments[k].tr}/:path*` });
    for (const l of OTHER)
      for (const k of keys)
        if ((segments[k].tr as string) !== segments[k].en)
          before.push({ source: `/${l}/${segments[k].en}/:path*`, destination: `/${l}/${segments[k].tr}/:path*` });
    return { beforeFiles: before, afterFiles: [], fallback: [] };
  },
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev()).catch(() => {});
}
