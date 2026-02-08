import { MetadataRoute } from 'next';
import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { getProductBrands } from '@/lib/woocommerce/brands';

const SITE_URL = 'https://www.ideallivs.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemap: MetadataRoute.Sitemap = [];

    // Static pages
    const staticPages = [
        { url: '', priority: 1.0, changeFrequency: 'daily' as const },
        { url: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
        { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
        { url: '/deals', priority: 0.9, changeFrequency: 'daily' as const },
        { url: '/brands', priority: 0.8, changeFrequency: 'weekly' as const },
        { url: '/delivery-information', priority: 0.6, changeFrequency: 'monthly' as const },
        { url: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
        { url: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
        { url: '/terms-conditions', priority: 0.5, changeFrequency: 'yearly' as const },
        { url: '/refund-return', priority: 0.5, changeFrequency: 'yearly' as const },
    ];

    staticPages.forEach(({ url, priority, changeFrequency }) => {
        sitemap.push({
            url: `${SITE_URL}${url}`,
            lastModified: new Date(),
            changeFrequency,
            priority,
        });
    });

    try {
        // Fetch all categories
        const categories = await getProductCategories();

        // Add category pages
        categories.forEach((category) => {
            sitemap.push({
                url: `${SITE_URL}/product-category/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            });
        });

        // Add important filter combinations for categories
        // Only add filters for main categories (parent = 0) to avoid too many URLs
        const mainCategories = categories.filter(cat => cat.parent === 0);

        mainCategories.forEach((category) => {
            // On Sale filter
            sitemap.push({
                url: `${SITE_URL}/product-category/${category.slug}?on_sale=true`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            });

            // In Stock filter
            sitemap.push({
                url: `${SITE_URL}/product-category/${category.slug}?stock_status=instock`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.6,
            });
        });

        // Fetch all brands
        const brands = await getProductBrands({ hide_empty: true });

        // Add brand pages
        brands.forEach((brand) => {
            sitemap.push({
                url: `${SITE_URL}/brand/${brand.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });

            // Add brand + on sale combination
            sitemap.push({
                url: `${SITE_URL}/brand/${brand.slug}?on_sale=true`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.6,
            });
        });

        // Add shop filters (most important combinations)
        const shopFilters = [
            { path: '/shop?on_sale=true', priority: 0.9 },
            { path: '/shop?stock_status=instock', priority: 0.7 },
            { path: '/shop?featured=true', priority: 0.8 },
            { path: '/shop?orderby=price&amp;order=asc', priority: 0.6 },
            { path: '/shop?orderby=date&amp;order=desc', priority: 0.7 },
        ];

        shopFilters.forEach(({ path, priority }) => {
            sitemap.push({
                url: `${SITE_URL}${path}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority,
            });
        });

        // Fetch ALL products in batches (you have 1200+ products)
        const allProducts = [];
        let currentPage = 1;
        let hasMoreProducts = true;

        while (hasMoreProducts) {
            try {
                const { data: products, totalPages } = await getProducts({
                    per_page: 100,
                    page: currentPage,
                    orderby: 'date',
                    order: 'desc',
                });

                allProducts.push(...products);

                if (currentPage >= totalPages) {
                    hasMoreProducts = false;
                } else {
                    currentPage++;
                }
            } catch (error) {
                console.error(`Error fetching products page ${currentPage}:`, error);
                hasMoreProducts = false;
            }
        }

        console.log(`Sitemap: Fetched ${allProducts.length} total products`);

        // Add all product pages
        allProducts.forEach((product) => {
            sitemap.push({
                url: `${SITE_URL}/product/${product.slug}`,
                lastModified: new Date(product.date_modified || product.date_created),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        });

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    return sitemap;
}

// Revalidate every hour
export const revalidate = 3600;
