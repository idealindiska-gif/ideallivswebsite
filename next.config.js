const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // SEO: Enforce no trailing slashes (prevents duplicate URLs)
    trailingSlash: false,
    skipTrailingSlashRedirect: false,

    // Optimize bundle
    compiler: {
        // Remove console.log in production, keep error/warn for debugging
        removeConsole: process.env.NODE_ENV === 'production'
            ? { exclude: ['error', 'warn'] }
            : false,
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', 'date-fns'],
    },

    // Modern browser targets - reduces legacy JavaScript and polyfills
    transpilePackages: [],

    // Target modern browsers to reduce bundle size


    modularizeImports: {
        'lucide-react': {
            transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        },
    },

    images: {
        unoptimized: true, // Disable Vercel image optimization to avoid 402 errors
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crm.ideallivs.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'ideallivs.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'www.ideallivs.com',
                pathname: '/wp-content/uploads/**',
            },
        ],
    },
    async rewrites() {
        return [
            // Main sitemap index
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
            // Sub-sitemaps
            {
                source: '/sitemap-pages.xml',
                destination: '/api/sitemap/pages',
            },
            {
                source: '/sitemap-delivery.xml',
                destination: '/api/sitemap/delivery',
            },
            {
                source: '/sitemap-posts.xml',
                destination: '/api/sitemap/posts',
            },
            {
                source: '/sitemap-post-categories.xml',
                destination: '/api/sitemap/post-categories',
            },
            {
                source: '/sitemap-product-categories.xml',
                destination: '/api/sitemap/product-categories',
            },
            {
                source: '/sitemap-product-brands.xml',
                destination: '/api/sitemap/product-brands',
            },
            {
                source: '/sitemap-images.xml',
                destination: '/api/sitemap/images',
            },
            // Paginated product sitemaps
            {
                source: '/sitemap-products-:page.xml',
                destination: '/api/sitemap/products/:page',
            },
            // Swedish sitemap index
            {
                source: '/sv/sitemap.xml',
                destination: '/api/sitemap/sv',
            },
            // Swedish sub-sitemaps (all under /sv/ to match URL structure)
            {
                source: '/sv/sitemap-pages.xml',
                destination: '/api/sitemap/sv-pages',
            },
            {
                source: '/sv/sitemap-products-:page.xml',
                destination: '/api/sitemap/sv-products/:page',
            },
            {
                source: '/sv/sitemap-delivery.xml',
                destination: '/api/sitemap/sv-delivery',
            },
            {
                source: '/sv/sitemap-product-categories.xml',
                destination: '/api/sitemap/sv-product-categories',
            },
            {
                source: '/sv/sitemap-product-brands.xml',
                destination: '/api/sitemap/sv-product-brands',
            },
            {
                source: '/sv/sitemap-posts.xml',
                destination: '/api/sitemap/sv-posts',
            },
            // Norwegian sitemap index
            {
                source: '/no/sitemap.xml',
                destination: '/api/sitemap/no',
            },
            // Norwegian sub-sitemaps
            {
                source: '/no/sitemap-pages.xml',
                destination: '/api/sitemap/no-pages',
            },
            {
                source: '/no/sitemap-products-:page.xml',
                destination: '/api/sitemap/no-products/:page',
            },
            {
                source: '/no/sitemap-delivery.xml',
                destination: '/api/sitemap/no-delivery',
            },
            {
                source: '/no/sitemap-product-categories.xml',
                destination: '/api/sitemap/no-product-categories',
            },
            {
                source: '/no/sitemap-product-brands.xml',
                destination: '/api/sitemap/no-product-brands',
            },
            {
                source: '/no/sitemap-posts.xml',
                destination: '/api/sitemap/no-posts',
            },
            // Danish sitemap index
            {
                source: '/da/sitemap.xml',
                destination: '/api/sitemap/da',
            },
            // Danish sub-sitemaps
            {
                source: '/da/sitemap-pages.xml',
                destination: '/api/sitemap/da-pages',
            },
            {
                source: '/da/sitemap-products-:page.xml',
                destination: '/api/sitemap/da-products/:page',
            },
            {
                source: '/da/sitemap-delivery.xml',
                destination: '/api/sitemap/da-delivery',
            },
            {
                source: '/da/sitemap-product-categories.xml',
                destination: '/api/sitemap/da-product-categories',
            },
            {
                source: '/da/sitemap-product-brands.xml',
                destination: '/api/sitemap/da-product-brands',
            },
            {
                source: '/da/sitemap-posts.xml',
                destination: '/api/sitemap/da-posts',
            },
        ];
    },
};

module.exports = withNextIntl(nextConfig);
