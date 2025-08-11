import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // 캐싱 문제 해결을 위한 설정
    if (!dev) {
      config.cache = false;
    }
    
    return config;
  },
};

// PWA 설정을 개발 환경에서만 비활성화
if (process.env.NODE_ENV === "production") {
  // @ts-ignore
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: false,
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
