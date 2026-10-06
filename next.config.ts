import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML per route, served by Cloudflare Pages. Forms live in /functions.
  output: "export",
  turbopack: { root: __dirname },
  images: { unoptimized: true }, // images are pre-built by scripts/build-images.mjs
  // Two root layouts (app/(en) and app/es), so the 404 page is app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
