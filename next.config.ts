import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site, built to /out for Cloudflare Pages.
  output: "export",
  // There is no server to resize images, so photos are served exactly as uploaded.
  images: { unoptimized: true },
};

export default nextConfig;
