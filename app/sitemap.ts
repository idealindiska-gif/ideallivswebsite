import { MetadataRoute } from 'next'
import { getProducts, getProductCategories } from '@/lib/woocommerce'
import { getAllBlogPosts } from '@/lib/blog'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ideallivs.com'

    // Static pages with priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/deals`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/brands`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/delivery-information`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/europe-delivery`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/delivery-goteborg-malmo`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-conditions`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/refund-return`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    try {
        // Fetch products (paginated to handle large catalogs)
        const productsPerPage = 100
        let allProducts: any[] = []
        let page = 1
        let hasMore = true

        while (hasMore && page <= 10) { // Limit to 1000 products max
            const productsRes = await getProducts({
                per_page: productsPerPage,
                page,
                status: 'publish'
            })

            if (productsRes.data && productsRes.data.length > 0) {
                allProducts = [...allProducts, ...productsRes.data]
                hasMore = productsRes.data.length === productsPerPage
                page++
            } else {
                hasMore = false
            }
        }

        const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(product.date_modified || product.date_created),
            changeFrequency: 'weekly' as const,
            priority: product.featured ? 0.8 : 0.7,
        }))

        // Fetch categories
        const categories = await getProductCategories({
            per_page: 100,
            hide_empty: true
        })

        const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
            url: `${baseUrl}/product-category/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: category.count > 20 ? 0.8 : 0.6,
        }))

        // Fetch blog posts
        let blogRoutes: MetadataRoute.Sitemap = []
        try {
            const blogPosts = await getAllBlogPosts()
            blogRoutes = blogPosts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }))
        } catch (error) {
            console.error('Error fetching blog posts for sitemap:', error)
        }

        return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return at least static routes if dynamic content fails
        return staticRoutes
    }
}
