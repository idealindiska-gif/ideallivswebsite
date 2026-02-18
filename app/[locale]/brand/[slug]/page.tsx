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
        locale: string;
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
    const rawBrandDesc = brand.description
        ? brand.description.replace(/\<[^>]*>/g, '').trim()
        : '';
    let description = rawBrandDesc.length >= 80
        ? `${rawBrandDesc.substring(0, 100)} | Shop ${brand.name} at Ideal Indiska LIVS Stockholm. Fast delivery across Sweden & EU.`.substring(0, 160)
        : `Shop all ${brand.name} products at Ideal Indiska LIVS. Your trusted source for authentic Indian and Pakistani groceries in Stockholm. High-quality products from top brands.`;

    // Pakistani targeting for National Foods
    if (resolvedParams.slug === 'national') {
        title = `National Foods Pakistan Store Stockholm | Shop Authentic Masalas & Pickles`;
        description = `Buy authentic National Foods Pakistan products in Stockholm & Europe. Wide range of masalas, pickles, and desserts with NO customs duty in EU. The first choice for Pakistani families in Sweden.`;
    }

    // Pakistani targeting for Shan Foods
    if (resolvedParams.slug === 'shan' || resolvedParams.slug === 'shan-foods') {
        title = `Shan Foods Pakistan | Authentic Spices & Recipe Mixes in Stockholm`;
        description = `Shop Shan Foods - Pakistan's #1 spice brand in Stockholm. Complete range of Biryani, Nihari, and Karahi recipe mixes, cooking pastes, and pickles. Fast EU shipping, no customs duty.`;
    }

    // Pakistani targeting for Guard & Falak (Rice)
    if (['guard', 'falak'].includes(resolvedParams.slug)) {
        const brandName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
        title = `${brandName} Basmati Rice | Authentic Pakistani Rice in Stockholm`;
        description = `Buy premium ${brandName} Basmati Rice at Ideal Indiska LIVS. Long-grain, aromatic Pakistani rice perfect for Biryani and Pulao. Fast Sweden & EU delivery.`;
    }

    // Pakistani targeting for Ahmed Foods & Laziza (Desserts/Mixes)
    if (['ahmed-foods', 'ahmed', 'laziza'].includes(resolvedParams.slug)) {
        const brandName = resolvedParams.slug.includes('ahmed') ? 'Ahmed Foods' : 'Laziza';
        title = `${brandName} Pakistan | Traditional Dessert Mixes & Pickles`;
        description = `Shop ${brandName} products in Stockholm. Authentic Pakistani dessert mixes (Kheer, Rasmalai), pickles, and spices. Bring the taste of home to Europe with fast shipping.`;
    }

    // Pakistani targeting for Hamdard & Qarshi (Drinks/Herbal)
    if (['hamdard', 'qarshi'].includes(resolvedParams.slug)) {
        const brandName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
        const drink = brandName === 'Hamdard' ? 'Rooh Afza' : 'Jam-e-Shirin';
        title = `${brandName} Pakistan | ${drink} & Herbal Wellness in Stockholm`;
        description = `Get authentic ${brandName} products like ${drink} and Johar Joshanda at Ideal Indiska LIVS. Traditional Pakistani beverages and herbal remedies. No customs duty in EU.`;
    }

    // Pakistani targeting for Shezan (Juices)
    if (resolvedParams.slug === 'shezan') {
        title = `Shezan Pakistan | Authentic Juices, Preserves & Pickles in Stockholm`;
        description = `Shop Shezan's famous mango juices, jams, and pickles at Ideal Indiska LIVS. Authentic Pakistani taste delivered across Sweden and Europe.`;
    }

    // Pakistani targeting for Tapal (Tea)
    if (resolvedParams.slug === 'tapal') {
        title = `Tapal Tea Pakistan | Danedar & Mezban Tea in Stockholm`;
        description = `Experience the strong taste of Tapal Tea. Authentic Tapal Danedar and Mezban available at Ideal Indiska LIVS Stockholm. Fast delivery throughout Europe.`;
    }

    // Indian targeting for India Gate (Rice)
    if (resolvedParams.slug === 'india-gate') {
        title = `India Gate Basmati Rice Stockholm | Premium Long-Grain Rice`;
        description = `Shop India Gate Basmati Rice at Ideal Indiska LIVS. The world's finest long-grain rice for perfect Biryani and Pulao. Fast EU shipping, no customs duty.`;
    }

    // Indian targeting for MDH (Spices)
    if (resolvedParams.slug === 'mdh') {
        title = `MDH Masala Stockholm | Authentic Indian Spices & Blends`;
        description = `Get original MDH spices and masalas at Ideal Indiska LIVS. Traditional Indian spice blends for authentic home-cooked flavor. Fast delivery across Europe.`;
    }

    // Indian targeting for Haldiram (Snacks & Sweets)
    if (resolvedParams.slug === 'haldiram' || resolvedParams.slug === 'haldirams') {
        title = `Haldiram's Snacks & Sweets Stockholm | Authentic Indian Namkeen`;
        description = `Shop Haldiram's famous Bhujia, snacks, and sweets at Ideal Indiska LIVS. Authentic Indian namkeen and ready-to-eat meals delivered to your door in Europe.`;
    }

    // Indian targeting for TRS (Wholesale Spices & Lentils)
    if (resolvedParams.slug === 'trs') {
        title = `TRS Spices & Lentils Stockholm | Quality Asian Groceries`;
        description = `Explore the full range of TRS spices, lentils, and pulses at Ideal Indiska LIVS. High-quality ingredients for authentic Indian cooking. Fast EU shipping.`;
    }

    // Indian targeting for Aashirvaad (Atta/Flour)
    if (resolvedParams.slug === 'aashirvaad') {
        title = `Aashirvaad Atta Stockholm | Whole Wheat Flour for Soft Rotis`;
        description = `Buy authentic Aashirvaad Select & Superior MP Atta at Ideal Indiska LIVS. The trusted choice for soft, healthy Indian flatbreads in Sweden.`;
    }

    // Indian targeting for Dabur & Vatika (Health & Personal Care)
    if (['dabur', 'vatika'].includes(resolvedParams.slug)) {
        title = `Dabur & Vatika Products Stockholm | Ayurvedic Health & Beauty`;
        description = `Shop Dabur Chyawanprash, Honey, and Vatika hair care at Ideal Indiska LIVS. Authentic Ayurvedic health and beauty products from India.`;
    }

    // Indian targeting for Annam, Idhayam, Fortune
    if (['annam', 'idhayam', 'fortune'].includes(resolvedParams.slug)) {
        const brandName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
        title = `${brandName} Store Stockholm | Authentic Indian Groceries & Oils`;
        description = `Discover ${brandName} products at Ideal Indiska LIVS. From premium oils to South Indian staples, we bring the best of India to Stockholm and Europe.`;
    }

    // International/European Brands targeting
    if (resolvedParams.slug === 'colgate') {
        title = `Colgate Oral Care Stockholm | Toothpaste & Toothbrushes`;
        description = `Shop Colgate toothpaste, brushes, and mouthwash at Ideal Indiska LIVS. World-leading oral care products delivered fast to your door in Sweden and Europe.`;
    }

    if (resolvedParams.slug === 'nestle') {
        title = `Nestle Products Stockholm | Coffee, Snacks & Cereals`;
        description = `Find your favorite Nestle products like Maggi, Nescafe, and cereals at Ideal Indiska LIVS. Trusted quality for your daily needs with fast EU shipping.`;
    }

    if (resolvedParams.slug === 'coca-cola' || resolvedParams.slug === 'coke') {
        title = `Coca-Cola Stockholm | Refreshing Beverages & Soda`;
        description = `Order Coca-Cola, Diet Coke, and Zero Sugar at Ideal Indiska LIVS. Cold beverages delivered fast across Stockholm and Europe.`;
    }

    if (resolvedParams.slug === 'ali-baba') {
        title = `Ali Baba Spices & Lentils Stockholm | Premium Quality Pulses`;
        description = `Shop Ali Baba's wide range of spices, lentils, and pulses at Ideal Indiska LIVS. Authentic flavors and premium ingredients for your kitchen. Fast EU delivery.`;
    }

    if (resolvedParams.slug === 'pataks' || resolvedParams.slug === 'patak') {
        title = `Patak's Cooking Sauces Stockholm | Authentic Curry Pastes`;
        description = `Experience the taste of India with Patak's cooking sauces and curry pastes. Easy and delicious Indian meals start with Patak's. Available at Ideal Indiska LIVS.`;
    }

    if (resolvedParams.slug === 'pillsbury' || resolvedParams.slug === 'pilsbury') {
        title = `Pillsbury Atta Stockholm | Multi-grain & Whole Wheat Flour`;
        description = `Buy Pillsbury Chakki Fresh Atta at Ideal Indiska LIVS. Perfect for soft rotis and parathas. Premium flour for the South Asian community in Sweden.`;
    }

    if (resolvedParams.slug === 'jabsons') {
        title = `Jabsons Dry Fruits & Snacks Stockholm | Roasted Cashews & Peanuts`;
        description = `Shop Jabsons premium dry fruit snacks, roasted nuts, and namkeens at Ideal Indiska LIVS. The perfect healthy snack delivered fast across Europe.`;
    }

    if (resolvedParams.slug === 'johnson-johnson' || resolvedParams.slug === 'johnsons') {
        title = `Johnson & Johnson Baby Care Stockholm | Trusted Baby Products`;
        description = `Order Johnson's baby oil, powder, and shampoo at Ideal Indiska LIVS. Safe and gentle care for your little ones with fast delivery in Sweden.`;
    }

    if (resolvedParams.slug === 'vaseline') {
        title = `Vaseline Skin Care Stockholm | Intensive Care Lotions`;
        description = `Shop Vaseline Intensive Care lotions and jelly at Ideal Indiska LIVS. Keep your skin hydrated and healthy with trusted Vaseline products. Fast EU shipping.`;
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

const STRUCTURED_BRANDS = [
    'national', 'shan', 'shan-foods', 'guard', 'falak', 'ahmed-foods', 'ahmed', 'hamdard', 'qarshi', 'laziza', 'shezan', 'tapal',
    'india-gate', 'mdh', 'haldiram', 'haldirams', 'trs', 'aashirvaad', 'dabur', 'vatika', 'annam', 'idhayam', 'fortune',
    'colgate', 'nestle', 'coke', 'coca-cola', 'ali-baba', 'pataks', 'patak', 'pillsbury', 'pilsbury', 'jabsons', 'johnsons', 'johnson-johnson', 'vaseline'
];

export default async function BrandArchivePage({ params, searchParams }: BrandArchivePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const locale = resolvedParams.locale;

    const brand = await getBrandBySlug(resolvedParams.slug);

    if (!brand) {
        notFound();
    }

    const isStructuredBrand = STRUCTURED_BRANDS.includes(brand.slug);


    const page = Number(resolvedSearchParams.page) || 1;
    const perPage = 20;

    // Get categories and brands for filters
    const [categories, brandsData] = await Promise.all([
        getProductCategories(),
        getProductBrands({ hide_empty: true })
    ]);

    // Fetch products filtered by brand ID directly from WooCommerce API
    // This is much more accurate and efficient than fetching global products and filtering
    const { data: brandProducts, total: totalProductsCount } = await getProducts({
        brand: brand.id.toString(),
        per_page: 80, // Fetch a large chunk for categorization, or standard page size
        page: isStructuredBrand ? 1 : page,
        orderby: (resolvedSearchParams.orderby as any) || 'date',
        order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
        category: resolvedSearchParams.category as string,
        min_price: resolvedSearchParams.min_price as string,
        max_price: resolvedSearchParams.max_price as string,
    });

    // For major structured brands, we might need even more products for categorization if they have > 80
    let allBrandProducts = brandProducts;
    if (isStructuredBrand && totalProductsCount > 80) {
        const remainingPages = Math.ceil(totalProductsCount / 80);
        const nextPagesRequests = [];
        for (let i = 2; i <= Math.min(remainingPages, 5); i++) { // Fetch up to 400 products for these brands
            nextPagesRequests.push(getProducts({
                brand: brand.id.toString(),
                per_page: 80,
                page: i,
                orderby: (resolvedSearchParams.orderby as any) || 'date',
                order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
            }));
        }
        const extraPages = await Promise.all(nextPagesRequests);
        extraPages.forEach(p => {
            allBrandProducts = [...allBrandProducts, ...p.data];
        });
    }

    const total = totalProductsCount;
    const totalPages = isStructuredBrand
        ? 1 // One big page for these structured brands
        : Math.ceil(total / perPage);

    // For normal brands, brandProducts is already paginated by the API
    const paginatedProducts = isStructuredBrand
        ? allBrandProducts // Use all for structured display
        : brandProducts; // Already correct page from API

    return (
        <div className="min-h-screen bg-background">
            {/* Categorized Products for Structured Brands */}
            {isStructuredBrand ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-12 text-center">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                            {brand.name} - Official Store
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {brand.slug.includes('shan') && "Experience the world-renowned taste of Shan Foods. From iconic Biryani mixes to premium spices, bring the authentic taste of Pakistan to your kitchen."}
                            {brand.slug === 'national' && "The choice of Pakistani families in Sweden and Europe. Explore the full range of National Foods, from traditional achars to aromatic biryani masalas."}
                            {['guard', 'falak', 'india-gate'].includes(brand.slug) && "Premium quality long-grain Basmati rice. The perfect choice for authentic Biryani and Pulao, loved by families across Europe."}
                            {brand.slug.includes('ahmed') && "Ahmed Foods brings you the traditional taste of Pakistani desserts and pickles. High-quality ingredients and authentic recipes."}
                            {brand.slug === 'laziza' && "Elevate your desserts with Laziza's authentic Pakistani mixes. Quick, easy, and undeniably delicious."}
                            {brand.slug === 'hamdard' && "The soul of the East. Refresh yourself with the legendary Rooh Afza and traditional herbal remedies from Hamdard."}
                            {brand.slug === 'qarshi' && "Natural goodness for a healthier lifestyle. Shop Qarshi's iconic Jam-e-Shirin and effective herbal solutions in Stockholm."}
                            {brand.slug === 'shezan' && "Nature's best in every sip. Enjoy the pure taste of Shezan juices and premium preserves, now available in Sweden."}
                            {brand.slug === 'tapal' && "Start your day with Pakistan's favourite tea. Tapal Danedar offers the perfect blend of strength and aroma for the ultimate tea experience."}

                            {/* Indian Brands */}
                            {brand.slug === 'mdh' && "Mahashian Di Hatti (MDH) - The king of Indian spices. Authentic traditional spice blends for the true taste of India."}
                            {(brand.slug === 'haldiram' || brand.slug === 'haldirams') && "India's favorite snacks and sweets. From spicy Bhujia to mouth-watering Gulab Jamun, bring the taste of Haldiram home."}
                            {brand.slug === 'trs' && "A legacy of quality. TRS offers the finest selection of spices, lentils, and grocery staples for authentic Asian cooking."}
                            {brand.slug === 'aashirvaad' && "Pure and natural wheat flour. Aashirvaad Atta is crafted to produce the softest rotis for your family's health."}
                            {['dabur', 'vatika'].includes(brand.slug) && "Pioneering the best of Ayurveda. Trust Dabur and Vatika for natural health, wellness, and beauty products."}
                            {brand.slug === 'annam' && "Bringing South Indian traditions to your table. Premium quality rice, lentils, and specialty ingredients from Annam."}
                            {brand.slug === 'idhayam' && "The oil of well-being. Idhayam Gingelly oil is a cornerstone of authentic South Indian cooking, known for its health benefits and flavor."}
                            {brand.slug === 'fortune' && "Cooking the Indian way. Fortune oils offer the perfect balance of health and taste for every meal."}

                            {/* International Brands */}
                            {brand.slug === 'colgate' && "The #1 brand for oral care. Trust Colgate for a whiter, healthier smile for your entire family."}
                            {brand.slug === 'nestle' && "A global leader in nutrition and wellness. From Maggi to Nescafe, find all your Nestle favorites here."}
                            {(brand.slug === 'coca-cola' || brand.slug === 'coke') && "Refresh your day with the iconic taste of Coca-Cola. Cold drinks for every occasion."}
                            {brand.slug === 'ali-baba' && "Ali Baba brings you the finest selection of lentils, beans, and spices. Essential ingredients for every pantry."}
                            {(brand.slug === 'pataks' || brand.slug === 'patak') && "Patak's - The secret to easy Indian cooking. Authentic curry pastes and sauces that bring the spice trail to your home."}
                            {(brand.slug === 'pillsbury' || brand.slug === 'pilsbury') && "Pillsbury Chakki Fresh Atta - For rotis that stay soft and fresh all day long."}
                            {brand.slug === 'jabsons' && "Traditional Indian snacks with a modern twist. Enjoy the crunch of Jabsons premium roasted nuts and dry fruits."}
                            {(brand.slug === 'johnson-johnson' || brand.slug === 'johnsons') && "Johnson's - The most trusted name in baby care. Gentle products for your baby's delicate skin."}
                            {brand.slug === 'vaseline' && "Vaseline - Healing skin since 1870. Intensive care products that keep your skin soft and hydrated."}

                            <br />
                            <strong> Fast EU Shipping | No Customs Duty.</strong>
                        </p>
                    </div>

                    {/* Group by category slugs known to Pakistani brands */}
                    {['pickles-chutneys-pastes', 'curry-massala', 'curry-masala', 'desserts', 'sauces', 'lentils-beans-dals', 'rice-grains', 'tea', 'beverages-liquids'].map(catSlug => {
                        const productsInCategory = allBrandProducts.filter(p => p.categories.some(c => c.slug === catSlug));
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
                        const otherProducts = allBrandProducts.filter(p => !p.categories.some(c => ['pickles-chutneys-pastes', 'curry-masala', 'desserts', 'sauces', 'lentils-beans-dals', 'rice-grains'].includes(c.slug)));
                        if (otherProducts.length === 0) return null;
                        return (
                            <section className="mb-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-2xl font-bold font-heading">More from {brand.name}</h3>
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
                                        locale,
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
