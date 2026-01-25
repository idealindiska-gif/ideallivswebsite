import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBrandBySlug, getProductBrands } from '@/lib/woocommerce/brands';
import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { ArchiveTemplate } from '@/components/templates';
import { ShopTopBar } from '@/components/shop/shop-top-bar';
import { ProductCard } from '@/components/shop/product-card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { decodeHtmlEntities } from '@/lib/utils';
import { brandSchema, breadcrumbSchema, productListItem } from '@/lib/schema';
import { siteConfig } from '@/site.config';

// ISR: Revalidate brand pages every 2 hours
// Brand product associations rarely change
export const revalidate = 7200;

interface BrandArchivePageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        page?: string;
        orderby?: string;
        order?: string;
        min_price?: string;
        max_price?: string;
        stock_status?: string;
        on_sale?: string;
        featured?: string;
        category?: string;
    }>;
}

export async function generateMetadata({ params }: BrandArchivePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const brand = await getBrandBySlug(resolvedParams.slug);

    if (!brand) {
        return {
            title: 'Brand Not Found | Ideal Indiska LIVS',
        };
    }

    let title = `${brand.name} | Authentic Products at Ideal Indiska LIVS`;
    let description = brand.description
        ? brand.description.replace(/\<[^>]*>/g, '').substring(0, 150) + " | Shop authentic products at Ideal Indiska LIVS Stockholm."
        : `Shop all ${brand.name} products at Ideal Indiska LIVS. Your trusted source for authentic Indian and Pakistani groceries in Stockholm. High-quality products from top brands.`;

    // Pakistani targeting for National Foods
    if (resolvedParams.slug === 'national') {
        title = `National Foods Pakistan Store Stockholm | Shop Authentic Masalas & Pickles`;
        description = `Buy authentic National Foods Pakistan products in Stockholm & Europe. Wide range of masalas, pickles, and desserts with NO customs duty in EU. The first choice for Pakistani families in Sweden.`;
    }

    return {
        title,
        description: description.substring(0, 160),
        openGraph: {
            title,
            description: description.substring(0, 160),
            siteName: 'Ideal Indiska LIVS',
            type: 'website',
        },
        alternates: {
            canonical: `${siteConfig.site_domain}/brand/${resolvedParams.slug}`,
        },
    };
}

export default async function BrandArchivePage({ params, searchParams }: BrandArchivePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const brand = await getBrandBySlug(resolvedParams.slug);

    if (!brand) {
        notFound();
    }

    const page = Number(resolvedSearchParams.page) || 1;
    const perPage = 20;

    // Get categories and brands for filters
    const [categories, brandsData] = await Promise.all([
        getProductCategories(),
        getProductBrands({ hide_empty: true })
    ]);

    // Fetch products with brand filter
    // WooCommerce Brands plugin requires client-side filtering
    // Fetch multiple pages to ensure we capture all brand products (up to 1000)

    const [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10] = await Promise.all([
        getProducts({ per_page: 100, page: 1, orderby: (resolvedSearchParams.orderby as any) || 'date', order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc' }),
        getProducts({ per_page: 100, page: 2 }),
        getProducts({ per_page: 100, page: 3 }),
        getProducts({ per_page: 100, page: 4 }),
        getProducts({ per_page: 100, page: 5 }),
        getProducts({ per_page: 100, page: 6 }),
        getProducts({ per_page: 100, page: 7 }),
        getProducts({ per_page: 100, page: 8 }),
        getProducts({ per_page: 100, page: 9 }),
        getProducts({ per_page: 100, page: 10 }),
    ]);

    const allProducts = [
        ...page1.data,
        ...page2.data,
        ...page3.data,
        ...page4.data,
        ...page5.data,
        ...page6.data,
        ...page7.data,
        ...page8.data,
        ...page9.data,
        ...page10.data,
    ];

    console.log(`Fetched ${allProducts.length} total products for brand filtering`);

    // Filter by brand - check multiple ways (brands array, attributes, meta_data)
    const brandProducts = allProducts.filter(product => {
        // Check the brands array (standard WooCommerce Brands plugin)
        if (product.brands?.some((b: any) =>
            b.id === brand.id ||
            b.slug === brand.slug ||
            b.name?.toLowerCase() === brand.name?.toLowerCase()
        )) {
            return true;
        }

        // Check meta_data for brand
        if (product.meta_data) {
            const brandMeta = product.meta_data.find((m: any) =>
                m.key === 'product_brand' ||
                m.key === '_product_brand' ||
                m.key === 'brand' ||
                m.key === '_brand'
            );
            if (brandMeta && (
                brandMeta.value === brand.id.toString() ||
                brandMeta.value === brand.slug ||
                brandMeta.value === brand.name
            )) {
                return true;
            }
        }

        // Check attributes for brand
        if (product.attributes) {
            const brandAttr = product.attributes.find((attr: any) =>
                attr.name?.toLowerCase() === 'brand' ||
                attr.name?.toLowerCase() === 'product brand' ||
                attr.slug === 'pa_brand'
            );
            if (brandAttr && brandAttr.options?.some((opt: string) =>
                opt.toLowerCase() === brand.name?.toLowerCase() ||
                opt.toLowerCase() === brand.slug
            )) {
                return true;
            }
        }

        return false;
    });

    console.log(`Found ${brandProducts.length} products for brand "${brand.slug}"`);

    // Apply other filters client-side if needed (category, price)
    let filteredProducts = brandProducts;
    if (resolvedSearchParams.category) {
        filteredProducts = filteredProducts.filter(p => p.categories.some(c => c.slug === resolvedSearchParams.category));
    }
    // Price filter
    if (resolvedSearchParams.min_price || resolvedSearchParams.max_price) {
        const min = resolvedSearchParams.min_price ? parseFloat(resolvedSearchParams.min_price) : 0;
        const max = resolvedSearchParams.max_price ? parseFloat(resolvedSearchParams.max_price) : Infinity;
        filteredProducts = filteredProducts.filter(p => {
            const price = parseFloat(p.price || '0');
            return price >= min && price <= max;
        });
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedProducts = filteredProducts.slice(start, end);


    return (
        <div className="min-h-screen bg-background">
            {/* Categorized Products for National Foods */}
            {brand.slug === 'national' ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-12 text-center">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-4">Authentic Pakistani Kitchen Essentials</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The choice of Pakistani families in Sweden and Europe. Explore the full range of National Foods, from traditional achars to aromatic biryani masalas.
                            <strong> Fast EU Shipping | No Customs Duty.</strong>
                        </p>
                    </div>

                    {/* Group by category slugs known to National Foods */}
                    {['pickles-chutneys-pastes', 'curry-masala', 'desserts', 'sauces'].map(catSlug => {
                        const productsInCategory = brandProducts.filter(p => p.categories.some(c => c.slug === catSlug));
                        if (productsInCategory.length === 0) return null;

                        const categoryName = productsInCategory[0].categories.find(c => c.slug === catSlug)?.name || catSlug;

                        return (
                            <section key={catSlug} className="mb-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-2xl font-bold font-heading">{categoryName}</h3>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {productsInCategory.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}

                    {/* Other products */}
                    {(() => {
                        const otherProducts = brandProducts.filter(p => !p.categories.some(c => ['pickles-chutneys-pastes', 'curry-masala', 'desserts', 'sauces'].includes(c.slug)));
                        if (otherProducts.length === 0) return null;
                        return (
                            <section className="mb-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-2xl font-bold font-heading">More from National</h3>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {otherProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        );
                    })()}
                </div>
            ) : (
                <ArchiveTemplate
                    title={`${brand.name}`}
                    description={brand.description || `Browse all products from ${brand.name}`}
                    breadcrumbs={[
                        { label: 'Shop', href: '/shop' },
                        { label: 'Brands', href: '/brands' },
                        { label: brand.name }
                    ]}
                    products={paginatedProducts}
                    totalProducts={total}
                    currentPage={page}
                    totalPages={totalPages}
                    basePath={`/brand/${brand.slug}`}
                    gridColumns={5}
                    filterBar={
                        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                            <ShopTopBar
                                categories={categories}
                                brands={brandsData}
                                totalProducts={total}
                            />
                        </Suspense>
                    }
                />
            )}

            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        '@id': `${siteConfig.site_domain}/brand/${brand.slug}`,
                        name: `${brand.name} Products`,
                        description: brand.description || `Browse all products from ${brand.name}`,
                        url: `${siteConfig.site_domain}/brand/${brand.slug}`,
                        about: brandSchema(brand.name, {
                            url: `${siteConfig.site_domain}/brand/${brand.slug}`,
                            logo: brand.image && typeof brand.image !== 'string' ? brand.image.src : undefined,
                            description: brand.description,
                        }),
                        mainEntity: {
                            '@type': 'ItemList',
                            numberOfItems: total,
                            itemListElement: paginatedProducts.map((product, index) =>
                                productListItem(
                                    {
                                        name: product.name,
                                        description: product.short_description,
                                        images: product.images,
                                        sku: product.sku,
                                        price: product.price,
                                        currency: 'SEK',
                                        url: `${siteConfig.site_domain}/product/${product.slug}`,
                                        brand: brand.name,
                                        availability: product.stock_status === 'instock' ? 'InStock' : 'OutOfStock',
                                    },
                                    index + 1,
                                    {
                                        brandName: brand.name,
                                        sellerName: 'Ideal Indiska LIVS',
                                    }
                                )
                            ),
                        },
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema([
                        { name: 'Home', url: siteConfig.site_domain },
                        { name: 'Shop', url: `${siteConfig.site_domain}/shop` },
                        { name: 'Brands', url: `${siteConfig.site_domain}/brands` },
                        { name: brand.name },
                    ]))
                }}
            />
        </div>
    );
}
