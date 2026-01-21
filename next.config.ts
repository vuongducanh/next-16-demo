import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  experimental: {
    browserDebugInfoInTerminal: true, // Only works in development mode
  },
};

export default nextConfig;
