import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getProductsByIds } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { getBundlesForProduct, getBundleProductIds } from '@/config/bundles.config';
import { brandConfig } from '@/config/brand.config';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

// ISR: Revalidate product pages every 2 hours
// Products are cached and served instantly, regenerated in background
// Use on-demand revalidation via webhook for immediate updates during promotions
export const revalidate = 7200;

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

        const cleanDescription = product.short_description?.replace(/\<[^>]*>/g, '').trim() || '';
        const url = `${siteConfig.site_domain}/product/${resolvedParams.slug}`;

        // Build price string for meta
        const price = product.sale_price || product.price;
        const priceStr = price ? `${price} kr` : '';
        const stockStatus = product.stock_status === 'instock' ? 'In Stock' : '';
        const categoryName = product.categories?.[0]?.name || '';

        // Default meta title: Product Name - Buy Online | Price | Ideal Livs
        let customTitle = priceStr
            ? `${product.name} - Buy Online | ${priceStr} | Ideal Livs Stockholm`
            : `${product.name} - Buy Online Stockholm | Ideal Livs`;

        // Truncate title if too long (keep under 60 chars for Google display)
        if (customTitle.length > 60) {
            customTitle = priceStr
                ? `${product.name} | ${priceStr} | Ideal Livs`
                : `${product.name} | Buy Online | Ideal Livs`;
        }
        if (customTitle.length > 60) {
            customTitle = `${product.name} | Ideal Livs Stockholm`;
        }

        // Default meta description with buying intent
        let customDescription = cleanDescription
            ? `${cleanDescription.substring(0, 100)}. Buy online at Ideal Livs Stockholm. ${stockStatus ? 'In stock. ' : ''}Fast delivery across Sweden & Europe.`
            : `Buy ${product.name} online at Ideal Livs Stockholm.${categoryName ? ` Premium ${categoryName}.` : ''} ${stockStatus ? 'In stock. ' : ''}Fast delivery Sweden & Europe. Authentic Indian & Pakistani groceries.`;

        // On Sale: add price & discount to title/description
        if (product.on_sale) {
            const salePrice = product.sale_price || product.price;
            const regPrice = product.regular_price;
            const discount = regPrice && salePrice ? Math.round(((Number(regPrice) - Number(salePrice)) / Number(regPrice)) * 100) : 0;

            if (discount > 0) {
                customTitle = `${product.name} - ${discount}% Off | Now ${salePrice} kr | Ideal Livs`;
                customDescription = `Save ${discount}% on ${product.name}. Now ${salePrice} kr (was ${regPrice} kr). Buy online at Ideal Livs Stockholm. Fast delivery Sweden & Europe.`;
            } else if (salePrice) {
                customTitle = `${product.name} | Sale ${salePrice} kr | Ideal Livs Stockholm`;
                customDescription = `${product.name} on sale for ${salePrice} kr at Ideal Livs Stockholm. Order online with fast delivery across Sweden & Europe.`;
            }
        }

        return {
            title: customTitle,
            description: customDescription.substring(0, 160),
            keywords: [
                product.name,
                `buy ${product.name} online`,
                ...(product.categories?.map(c => c.name) || []),
                "Indian grocery Stockholm",
                "buy online Sweden",
            ],
            openGraph: {
                type: 'website',
                title: customTitle,
                description: customDescription.substring(0, 160),
                images: product.images && product.images.length > 0
                    ? product.images.map((img) => ({
                        url: img.src,
                        width: 800,
                        height: 800,
                        alt: img.alt || product.name,
                    }))
                    : [defaultImage],
                url: url,
                siteName: 'Ideal Indiska LIVS',
            },
            twitter: {
                card: 'summary_large_image',
                title: customTitle,
                description: customDescription.substring(0, 160),
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

    // Fetch bundle offers for this product
    const bundles = getBundlesForProduct(product.id);
    const bundleProductIds = getBundleProductIds(bundles);
    const bundleProducts = bundleProductIds.length > 0
      ? await getProductsByIds(bundleProductIds)
      : [];

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
            bundles={bundles}
            bundleProducts={bundleProducts}
        />
    );
}
