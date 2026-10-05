import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML per route, served by Cloudflare Pages. Forms live in /functions.
  output: "export",
  turbopack: { root: __dirname },
  images: { unoptimized: true }, // images are pre-built by scripts/build-images.mjs
};

export default nextConfig;
