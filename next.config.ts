import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "bcryptjs"],
  async rewrites() {
    return [
      {
        // Redirect legacy /uploads/ paths to the dynamic /api/images/ serving route
        source: "/uploads/:path*",
        destination: "/api/images/:path*",
      },
    ];
  },
};

export default nextConfig;
