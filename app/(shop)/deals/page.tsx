import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { getProductsByIds } from '@/lib/woocommerce';
import { ProductCard } from '@/components/shop/product-card';
import { BundleOfferCard } from '@/components/shop/bundle-offer';
import { getBundlesForDealsPage, getBundleProductIds } from '@/config/bundles.config';
import { Percent, TrendingDown, ChevronDown, Tag, Clock, Truck, Gift } from 'lucide-react';
import { brandProfile } from '@/config/brand-profile';
import { SchemaScript } from "@/lib/schema/schema-script";
import { collectionPageSchema } from "@/lib/schema/collection";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";
import { wooCommerceProductSchema } from "@/lib/schema/product";
import { siteConfig } from '@/site.config';

// ─── Compute current week's Mon–Sun validity window ──────────────────────────
function getWeekValidity() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 0);
    return {
        validFrom: monday.toISOString(),
        validThrough: sunday.toISOString(),
    };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: `Eid Mubarak 2026 Deals – Indian & Pakistani Groceries Stockholm | ${brandProfile.name}`,
    description: `Eid Mubarak 2026! Celebrate with 30+ special deals on dates, vermicelli, kheer mix, jelly, cooking oil, atta flour, Shan spices & more. Updated weekly at Ideal Indiska LIVS Stockholm.`,
    alternates: {
        canonical: `${siteConfig.site_domain}/deals`,
        languages: {
            'en': `${siteConfig.site_domain}/deals`,
            'sv': `${siteConfig.site_domain}/sv/deals`,
            'x-default': `${siteConfig.site_domain}/deals`,
        },
    },
    openGraph: {
        title: `Eid 2026 Deals — Ideal Indiska LIVS Stockholm`,
        description: `Eid Mubarak! 30+ deals on dates, vermicelli, kheer, jelly, oil, atta & Shan spices.`,
        url: `${siteConfig.site_domain}/deals`,
        siteName: 'Ideal Indiska LIVS',
        locale: 'en_GB',
        type: 'website',
    },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const dealsFaqs = [
    {
        q: 'Do you have Eid 2026 special offers?',
        a: 'Yes! For Eid al-Fitr 2026 (March 20) we have 30+ special deals on popular Eid essentials including Shan Vermicelli, dates, kheer mix, jelly, cooking oil, atta flour, Basmati rice, Shan spice mixes and festive snacks. Check the Bundle Deals section above for our exclusive 2-for-15 kr Shan Vermicelli offer.',
    },
    {
        q: 'How often are the deals updated?',
        a: 'We update our weekly deals every week. New discounts go live regularly on products including Basmati rice, spices, lentils, Halal meat, and frozen snacks. Bookmark this page and check back every week for the latest offers.',
    },
    {
        q: 'What kind of products are on sale at Ideal Indiska LIVS?',
        a: 'Our weekly deals cover a wide range of Indian and Pakistani groceries including Basmati rice, atta flour, spice mixes (Shan, MDH, National Foods), lentils, Halal meat, frozen samosas and kebabs, fresh vegetables, cooking oils, and snacks.',
    },
    {
        q: 'Do you deliver deals orders in Stockholm?',
        a: 'Yes. We offer local delivery across all of Stockholm. A delivery fee applies to all orders. Minimum order is 300 SEK. Same-day delivery is available to nearby areas for orders placed before 4 PM.',
    },
    {
        q: 'Can I get deals delivered across Europe?',
        a: 'Yes. We ship to all EU countries via DHL with no customs duties. There is no minimum order value for EU delivery. Rates are calculated at checkout based on weight and destination.',
    },
    {
        q: 'How do I know if a product is genuinely discounted?',
        a: 'Every deal shows both the original price and the discounted sale price so you can see the exact saving. All deals are pulled live from our store — only products with an active sale price appear on this page.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
// NOTE: No <Suspense> — all content and schema render in initial HTML so
// Googlebot and AI crawlers (ChatGPT, Perplexity) index the full page on first pass.

export default async function DealsPage() {
    const dealBundles = getBundlesForDealsPage();
    const bundleProductIds = getBundleProductIds(dealBundles);

    const [saleProducts, bundleProducts] = await Promise.all([
        getOnSaleProducts(50),
        bundleProductIds.length > 0 ? getProductsByIds(bundleProductIds) : Promise.resolve([]),
    ]);

    const { validFrom, validThrough } = getWeekValidity();
    const pageUrl = `${siteConfig.site_domain}/deals`;

    return (
        <div className="min-h-screen w-full bg-background">

            {/* ── Schema: Breadcrumb ── */}
            <SchemaScript
                id="deals-breadcrumb"
                schema={breadcrumbSchema([
                    { name: 'Home', url: siteConfig.site_domain },
                    { name: 'Deals & Offers', url: pageUrl },
                ])}
            />

            {/* ── Schema: CollectionPage ── */}
            <SchemaScript
                id="deals-collection"
                schema={collectionPageSchema({
                    name: 'Weekly Indian & Pakistani Grocery Deals',
                    description: 'Weekly discounts on authentic Indian and Pakistani groceries in Stockholm.',
                    url: pageUrl,
                    items: saleProducts.slice(0, 20).map(p => ({
                        url: `${siteConfig.site_domain}/product/${p.slug}`,
                        name: p.name,
                        image: p.images?.[0]?.src,
                    })),
                })}
            />

            {/* ── Schema: OfferCatalog with validFrom/validThrough ── */}
            <SchemaScript
                id="deals-offer-catalog"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'OfferCatalog',
                    name: `Weekly Deals — ${brandProfile.name}`,
                    description: 'Weekly promotional prices on Indian and Pakistani groceries in Stockholm.',
                    url: pageUrl,
                    validFrom,
                    validThrough,
                    numberOfItems: saleProducts.length,
                    provider: {
                        '@type': 'Organization',
                        '@id': `${siteConfig.site_domain}/#organization`,
                        name: brandProfile.name,
                        url: siteConfig.site_domain,
                    },
                    itemListElement: saleProducts.slice(0, 30).map((p, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        item: {
                            '@type': 'Offer',
                            name: p.name,
                            url: `${siteConfig.site_domain}/product/${p.slug}`,
                            ...(p.images?.[0]?.src && { image: p.images[0].src }),
                            price: p.sale_price || p.price,
                            priceCurrency: 'SEK',
                            availability: 'https://schema.org/InStock',
                            validFrom,
                            validThrough,
                            seller: {
                                '@type': 'Organization',
                                name: brandProfile.name,
                            },
                        },
                    })),
                }}
            />

            {/* ── Schema: SaleEvent ── */}
            <SchemaScript
                id="deals-sale-event"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'SaleEvent',
                    name: 'Eid al-Fitr 2026 & Weekly Deals — Ideal Indiska LIVS',
                    description: 'Eid Mubarak 2026! Special festive offers and weekly discounts on Indian and Pakistani groceries in Stockholm.',
                    url: pageUrl,
                    startDate: validFrom,
                    endDate: validThrough,
                    eventStatus: 'https://schema.org/EventScheduled',
                    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
                    organizer: {
                        '@type': 'Organization',
                        '@id': `${siteConfig.site_domain}/#organization`,
                        name: brandProfile.name,
                        url: siteConfig.site_domain,
                    },
                    location: {
                        '@type': 'VirtualLocation',
                        url: pageUrl,
                    },
                    offers: {
                        '@type': 'Offer',
                        url: pageUrl,
                        availability: 'https://schema.org/InStock',
                        validFrom,
                        validThrough,
                        priceCurrency: 'SEK',
                    },
                }}
            />

            {/* ── Schema: Product ItemList ── */}
            <SchemaScript
                id="deals-products-itemlist"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Weekly Deals — On Sale Products',
                    description: 'Promotional prices on Indian and Pakistani groceries in Stockholm.',
                    numberOfItems: saleProducts.slice(0, 30).length,
                    itemListElement: saleProducts.slice(0, 30).map((p, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: wooCommerceProductSchema(p, {
                            baseUrl: siteConfig.site_domain,
                            brandName: brandProfile.name,
                            sellerName: brandProfile.name,
                            locale: 'en',
                        }),
                    })),
                }}
            />

            {/* ── Schema: FAQPage ── */}
            <SchemaScript
                id="deals-faq-schema"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: dealsFaqs.map(faq => ({
                        '@type': 'Question',
                        name: faq.q,
                        acceptedAnswer: { '@type': 'Answer', text: faq.a },
                    })),
                }}
            />

            {/* ── Hero ── */}
            {/* TODO: Replace hero image with a generic weekly-deals banner */}
            <div className="relative w-full overflow-hidden bg-emerald-950 min-h-[480px] flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ideal-Ramadan-Savings-e1770765144207.jpg"
                        alt="Weekly deals on Indian and Pakistani groceries in Stockholm"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />
                </div>

                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl py-16 w-full">
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="inline-flex p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                            <Percent className="h-7 w-7 text-emerald-300" />
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                            Weekly{' '}
                            <span className="text-emerald-300">Deals & Offers</span>
                        </h1>
                        <p className="text-lg text-emerald-100/90 font-medium leading-relaxed max-w-lg">
                            Stockholm&apos;s best weekly discounts on authentic Indian and Pakistani groceries. New deals added every week — bookmark this page!
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50">
                                <TrendingDown className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-semibold">{saleProducts.length} Active Deals</span>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-900 shadow-lg">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-bold">Updated Every Week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TL;DR ── */}
            <section className="bg-primary/5 border-b border-primary/10 py-6">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary whitespace-nowrap pt-0.5">
                            QUICK FACTS
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {[
                                '🌙 Eid Mubarak 2026 – special offers live now',
                                '🏷️ 30+ Eid deals: kheer, jelly, oil, atta, vermicelli & more',
                                '🛒 Shan Vermicelli 2-for-15 kr – exclusive bundle offer',
                                '🚚 Local delivery available across Stockholm',
                                '🌍 DHL to all of Europe — no customs fees',
                            ].map((fact, i) => (
                                <span key={i} className="text-sm text-foreground">{fact}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SEO Description ── */}
            <section className="w-full bg-muted/30 py-12 border-b border-border/50">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-heading font-bold text-foreground">
                                Authentic Flavors,{' '}
                                <span className="text-primary">Unbeatable Prices</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At <strong>Ideal Indiska LIVS</strong>, we believe that authentic cooking
                                shouldn&apos;t break the bank. Our weekly deals bring you the best discounts
                                on high-quality Indian and Pakistani staples right here in <strong>Stockholm</strong>.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                From 5kg bags of premium <strong>Basmati Rice</strong> to essential{' '}
                                <strong>spices, lentils, and frozen snacks</strong>, we rotate deals every week
                                on the items your family uses most. Prices are updated regularly — come back often!
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Tag className="w-5 h-5" /> What&apos;s on sale this week:
                            </h3>
                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    'Rice & Flour Deals',
                                    'Spice Mix Discounts',
                                    'Halal Meat Offers',
                                    'Fresh Vegetable Sales',
                                    'Frozen Food Promos',
                                    'Brand of the Week',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                                Local delivery available across Stockholm
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Eid 2026 Callout ── */}
            <section className="bg-gradient-to-r from-amber-950 via-green-950 to-amber-950 border-y border-yellow-600/30 py-6">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <span className="text-4xl select-none">☪️</span>
                        <div>
                            <h2 className="text-lg font-heading font-bold text-yellow-300">
                                Eid Mubarak 2026 – Eid al-Fitr March 20
                            </h2>
                            <p className="text-sm text-yellow-100/80 mt-0.5">
                                Celebrate with 30+ special offers on dates, vermicelli, kheer mix, jelly, cooking oil, atta flour, Shan spices and all your Eid essentials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bundle Deals ── */}
            {dealBundles.length > 0 && (
                <section className="container mx-auto px-4 max-w-screen-xl pt-12 pb-4">
                    <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                        <Gift className="h-6 w-6 text-primary" />
                        Bundle Deals
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Buy more and save more with our special bundles.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dealBundles.map((bundle) => (
                            <BundleOfferCard key={bundle.id} bundle={bundle} products={bundleProducts} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Products Grid ── */}
            <section className="container mx-auto px-4 max-w-screen-xl py-12">
                {saleProducts.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                All Deals ({saleProducts.length})
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Weekly prices — updated regularly. Grab them while stock lasts!
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {saleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-6 bg-muted rounded-full mb-6">
                            <Percent className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">No Deals Available Right Now</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            We&apos;re refreshing our weekly offers. Check back soon or browse our full range!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}
            </section>

            {/* ── FAQ Section ── */}
            <section className="border-t bg-muted/20 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-heading font-bold mb-2 text-foreground" style={{ fontSize: '25px' }}>
                        Deals FAQ
                    </h2>
                    <p className="text-muted-foreground mb-8 text-sm">
                        Everything you need to know about our weekly deals, delivery, and pricing.
                    </p>
                    <div className="divide-y divide-border">
                        {dealsFaqs.map((faq, i) => (
                            <details key={i} className="group py-4">
                                <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                                    <span className="font-medium text-foreground" style={{ fontSize: '15.13px' }}>
                                        {faq.q}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="mt-3 text-muted-foreground leading-relaxed" style={{ fontSize: '14.31px' }}>
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
