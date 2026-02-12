import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
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
