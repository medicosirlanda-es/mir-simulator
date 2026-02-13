import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.thinkific.com",
      },
      {
        protocol: "https",
        hostname: "mironline.es",
      },
    ],
  },
};

export default nextConfig;
