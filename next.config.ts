import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/samples/**" },
    ],
  },
  // Allow large file uploads in API routes
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // The labeler job registry composes runtime paths from process.cwd() into
  // the data/ subfolder. Turbopack's NFT walker over-traces that pattern and
  // pulls next.config.ts into the runtime list. Both the path scoping and the
  // bundle are fine; suppress just this advisory.
  turbopack: {
    ignoreIssue: [
      { path: "next.config.ts", title: "Encountered unexpected file in NFT list" },
    ],
  },
};

export default nextConfig;
