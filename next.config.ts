import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "app"),
      "@be": path.join(__dirname, "backend"),
      "@utils": path.join(__dirname, "utils"),
      "@libs": path.join(__dirname, "libs"),
    };
    return config;
  },
};

export default nextConfig;
