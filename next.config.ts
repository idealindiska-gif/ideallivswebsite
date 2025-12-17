import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: Allows production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Note: This should be false for production. Only enable if you need to bypass TypeScript errors temporarily
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // Ideal Indiska LIVS WordPress domain
      {
        protocol: "https",
        hostname: "ideallivs.com",
        port: "",
        pathname: "/**",
      },
      // Backend WordPress domain (primary)
      {
        protocol: "https",
        hostname: "backend.royalbr.se",
        port: "",
        pathname: "/**",
      },
      // Frontend domain (for any local images)
      {
        protocol: "https",
        hostname: "royalbr.se",
        port: "",
        pathname: "/**",
      },
      // Wildcard for any other subdomains
      {
        protocol: "https",
        hostname: "*.royalbr.se",
        port: "",
        pathname: "/**",
      },
    ],
    // Image formats - AVIF first (best compression), then WebP, then original
    formats: ['image/avif', 'image/webp'],
    // Allow all sizes for WooCommerce product images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Default quality (75 is good balance between size and quality)
    // For production: high quality, optimized formats
    // For development: unoptimized for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
    // Minimum cache time for optimized images (60 seconds)
    minimumCacheTTL: 60,
  },
  // Enable production optimizations
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Admin redirect
      {
        source: "/admin",
        destination: "https://ideallivs.com/wp-admin",
        permanent: true,
      },
      // Product URLs: /shop/:slug → /product/:slug
      {
        source: "/shop/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      // Product category URLs: /shop/category/:slug → /product-category/:slug
      {
        source: "/shop/category/:slug*",
        destination: "/product-category/:slug*",
        permanent: true,
      },
      // Blog category URLs: /posts/categories/:slug → /category/:slug
      {
        source: "/posts/categories/:slug",
        destination: "/category/:slug",
        permanent: true,
      },
      // Support nested categories
      {
        source: "/shop/:parent/:child",
        destination: "/product-category/:parent/:child",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
