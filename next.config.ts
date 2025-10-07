import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  //  Next.js , nodemon 
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      //webpack 
      config.watchOptions = {
        ignored: ['**/*'], 
      };
    }
    return config;
  },
  eslint: {
    // ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
