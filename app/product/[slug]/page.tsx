import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { brandConfig } from '@/config/brand.config';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const product = await getProductBySlug(resolvedParams.slug);

        if (!product) {
            return {
                title: 'Product Not Found',
                robots: { index: false, follow: false },
            };
        }

        // Default fallback image if product has no images
        const defaultImage = {
            url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
            width: 1200,
            height: 630,
            alt: `${brandConfig.businessName} - Indian & Pakistani Groceries in Stockholm`,
        };

        // Enhanced description for AI Overview and search snippets
        const cleanDescription = product.short_description?.replace(/\<[^>]*>/g, '') || '';
        const enhancedDescription = cleanDescription.substring(0, 155) ||
            `Buy ${product.name} online at ${brandConfig.businessName}. Premium quality Indian & Pakistani groceries delivered in Stockholm. ${product.price ? `Only ${product.price} SEK.` : ''}`;

        const url = `${siteConfig.site_domain}/product/${resolvedParams.slug}`;

        return {
            title: `${product.name} | Buy Online | ${brandConfig.businessName}`,
            description: enhancedDescription,
            keywords: [
                product.name,
                ...(product.categories?.map(c => c.name) || []),
                ...brandConfig.seo.keywords,
            ],
            openGraph: {
                type: 'website',
                title: product.name,
                description: enhancedDescription,
                images: product.images && product.images.length > 0
                    ? product.images.map((img) => ({
                        url: img.src,
                        width: 800,
                        height: 800,
                        alt: img.alt || product.name,
                    }))
                    : [defaultImage],
                url: url,
                siteName: brandConfig.businessName,
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: enhancedDescription,
                images: product.images && product.images.length > 0
                    ? [product.images[0].src]
                    : [defaultImage.url],
            },
            alternates: {
                canonical: url,
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    } catch {
        return {
            title: 'Product Not Found',
            robots: { index: false, follow: false },
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    let product;

    try {
        product = await getProductBySlug(resolvedParams.slug);
    } catch (error) {
        notFound();
    }

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id);

    // Build breadcrumbs with new URL structure
    const breadcrumbs = [
        { label: 'Shop', href: '/shop' },
        ...(product.categories && product.categories.length > 0
            ? [{
                label: product.categories[0].name,
                href: `/product-category/${product.categories[0].slug}`
            }]
            : []),
        { label: product.name },
    ];

    return (
        <ProductTemplate
            product={product}
            breadcrumbs={breadcrumbs}
            relatedProducts={relatedProducts}
        />
    );
}
