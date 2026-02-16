import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getProductsByIds } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { getBundlesForProduct, getBundleProductIds } from '@/config/bundles.config';
import { siteConfig } from '@/site.config';
import { getSwedishProductMeta } from '@/lib/seo/swedish-meta';
import { getAlternates } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export const revalidate = 7200;

interface ProductPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    try {
        const product = await getProductBySlug(slug);

        if (!product) {
            return {
                title: 'Product Not Found',
                robots: { index: false, follow: false },
            };
        }

        const defaultImage = {
            url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
            width: 1200,
            height: 630,
            alt: 'Ideal Indiska LIVS - Indian & Pakistani Groceries in Stockholm',
        };

        const price = product.sale_price || product.price;
        const priceStr = price ? `${price} kr` : '';
        const stockStatus = product.stock_status === 'instock' ? 'In Stock' : '';
        const categoryName = product.categories?.[0]?.name || '';
        const cleanDescription = product.short_description?.replace(/\<[^>]*>/g, '').trim() || '';
        const productPath = `/product/${slug}`;

        let customTitle: string;
        let customDescription: string;

        if (locale === 'sv') {
            // Swedish meta
            const svMeta = getSwedishProductMeta(product.name, price || undefined, categoryName);
            customTitle = svMeta.title;
            customDescription = svMeta.description;

            // Swedish sale override
            if (product.on_sale) {
                const salePrice = product.sale_price || product.price;
                const regPrice = product.regular_price;
                const discount = regPrice && salePrice ? Math.round(((Number(regPrice) - Number(salePrice)) / Number(regPrice)) * 100) : 0;
                if (discount > 0) {
                    customTitle = `${product.name} - ${discount}% Rabatt | Nu ${salePrice} kr | Ideal Livs`;
                    customDescription = `Spara ${discount}% på ${product.name}. Nu ${salePrice} kr (ord. ${regPrice} kr). Handla online hos Ideal Livs Stockholm. Snabb leverans.`;
                }
            }
        } else {
            // English meta (optimized for CTR)
            customTitle = priceStr
                ? `${product.name} - Buy Online | ${priceStr} | Ideal Livs Stockholm`
                : `${product.name} - Buy Online Stockholm | Ideal Livs`;

            if (customTitle.length > 60) {
                customTitle = priceStr
                    ? `${product.name} | ${priceStr} | Ideal Livs`
                    : `${product.name} | Buy Online | Ideal Livs`;
            }
            if (customTitle.length > 60) {
                customTitle = `${product.name} | Ideal Livs Stockholm`;
            }

            customDescription = cleanDescription
                ? `${cleanDescription.substring(0, 100)}. Buy online at Ideal Livs Stockholm. ${stockStatus ? 'In stock. ' : ''}Fast delivery across Sweden & Europe.`
                : `Buy ${product.name} online at Ideal Livs Stockholm.${categoryName ? ` Premium ${categoryName}.` : ''} ${stockStatus ? 'In stock. ' : ''}Fast delivery Sweden & Europe. Authentic Indian & Pakistani groceries.`;

            if (product.on_sale) {
                const salePrice = product.sale_price || product.price;
                const regPrice = product.regular_price;
                const discount = regPrice && salePrice ? Math.round(((Number(regPrice) - Number(salePrice)) / Number(regPrice)) * 100) : 0;
                if (discount > 0) {
                    customTitle = `${product.name} - ${discount}% Off | Now ${salePrice} kr | Ideal Livs`;
                    customDescription = `Save ${discount}% on ${product.name}. Now ${salePrice} kr (was ${regPrice} kr). Buy online at Ideal Livs Stockholm. Fast delivery Sweden & Europe.`;
                }
            }
        }

        const url = `${siteConfig.site_domain}${locale === 'sv' ? '/sv' : ''}${productPath}`;

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
                url,
                siteName: 'Ideal Indiska LIVS',
                locale: locale === 'sv' ? 'sv_SE' : 'en_SE',
            },
            twitter: {
                card: 'summary_large_image',
                title: customTitle,
                description: customDescription.substring(0, 160),
                images: product.images && product.images.length > 0
                    ? [product.images[0].src]
                    : [defaultImage.url],
            },
            alternates: getAlternates(productPath),
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
    const { slug } = await params;
    let product;

    try {
        product = await getProductBySlug(slug);
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
