import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const noindex = process.env.NEXT_PUBLIC_NOINDEX === "true";
// Canonical production host (e.g. "nextgenroofing.work"), derived from the configured site URL.
const siteHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").host; } catch { return ""; }
})();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  poweredByHeader: false,
  // Low-memory hosts (e.g. Render free tier, 512 MB): NEXT_BUILD_CPUS=1 builds with a single worker.
  ...(process.env.NEXT_BUILD_CPUS ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS), workerThreads: false } } : {}),
  reactStrictMode: true,
  images: {
    // Memory (Render 512 MB): on-demand AVIF encoding (libaom) drove the server to ~850 MB RSS under a
    // cold-cache burst and the memory was never returned. WebP-only keeps the peak around ~300 MB.
    // Next encodes AVIF at quality×50/80 to match WebP at the same quality; measured SSIM confirms WebP
    // at the same requested quality is equal or better than the AVIF previously served (no visual downgrade).
    formats: ["image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    qualities: [60, 70, 75, 80],
  },
  // SEO host canonicalization: www → apex (single canonical host; harmless if the host already redirects).
  async redirects() {
    if (!siteHost || siteHost.startsWith("www.") || basePath) return [];
    return [
      { source: "/:path*", has: [{ type: "host", value: `www\\.${escapeRe(siteHost)}` }], destination: `https://${siteHost}/:path*`, permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: noindex ? [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }] : securityHeaders },
      // Render's default *.onrender.com address serves the same site: keep it out of search indexes.
      { source: "/:path*", has: [{ type: "host", value: ".*\\.onrender\\.com" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
