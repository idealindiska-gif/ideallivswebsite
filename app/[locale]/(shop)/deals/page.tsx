import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { ProductCard } from '@/components/shop/product-card';
import { Loader2, Percent, TrendingDown } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { brandProfile } from '@/config/brand-profile';
import { SchemaScript } from "@/lib/schema/schema-script";
import { collectionPageSchema, offerCatalogSchema } from "@/lib/schema/collection";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";
import { wooCommerceProductSchema } from "@/lib/schema/product";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    if (locale === 'sv') {
        return {
            title: `Ramadan Megabesparingar Stockholm: Dadlar, Ris, Rooh Afza & Mer | ${brandProfile.name}`,
            description: `Stora Ramadan-besparingar på autentiska indiska och pakistanska matvaror i Stockholm. Exklusiva erbjudanden på dadlar, Basmati-ris, Rooh Afza och halaltkött.`,
            alternates: { canonical: 'https://www.ideallivs.com/sv/deals' },
        };
    }
    return {
        title: `Ramadan Mega Savings Stockholm: Dates, Rice, Rooh Afza & More | ${brandProfile.name}`,
        description: `Huge Ramadan savings on authentic Indian and Pakistani groceries in Stockholm. Exclusive deals on Dates, Basmati rice, Rooh Afza, and Halal meat for Iftar & Suhoor. Order online!`,
        alternates: { canonical: 'https://www.ideallivs.com/deals' },
    };
}

async function DealsContent({ locale }: { locale: string }) {
    const t = await getTranslations('deals');
    const saleProducts = await getOnSaleProducts(50);

    return (
        <div className="min-h-screen w-full bg-background">
            {/* SEO Structured Data */}
            <SchemaScript
                id="deals-breadcrumb"
                schema={breadcrumbSchema([
                    { name: 'Home', url: '/' },
                    { name: 'Ramadan Deals', url: '/deals' },
                ])}
            />
            <SchemaScript
                id="deals-collection"
                schema={collectionPageSchema({
                    name: "Ramadan Mega Savings on Indian & Pakistani Groceries",
                    description: "Exclusive Ramadan discounts and promotions on authentic South Asian products in Stockholm.",
                    url: "https://www.ideallivs.com/deals",
                    items: saleProducts.slice(0, 20).map(p => ({
                        url: `https://www.ideallivs.com/product/${p.slug}`,
                        name: p.name,
                        image: p.images?.[0]?.src
                    }))
                })}
            />
            <SchemaScript
                id="deals-offer-catalog"
                schema={offerCatalogSchema({
                    name: "Ramadan Mega Savings - Ideal Indiska LIVS",
                    description: "Limited time Ramadan promotional prices on Indian & Pakistani groceries in Stockholm.",
                    url: "https://www.ideallivs.com/deals",
                    items: saleProducts.slice(0, 30).map(p => ({
                        name: p.name,
                        url: `https://www.ideallivs.com/product/${p.slug}`,
                        image: p.images?.[0]?.src,
                        salePrice: p.sale_price || p.price,
                        currency: "SEK"
                    })),
                    provider: {
                        name: brandProfile.name,
                        url: "https://www.ideallivs.com"
                    }
                })}
            />
            {/* Product ItemList — proper Product+Offer schema required for Google Search Console rich results */}
            <SchemaScript
                id="deals-products-itemlist"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: locale === 'sv' ? 'Ramadandeals — Produkter på rea' : 'Ramadan Deals — On Sale Products',
                    description: locale === 'sv'
                        ? 'Kampanjpriser på indiska och pakistanska matvaror i Stockholm.'
                        : 'Promotional prices on Indian and Pakistani groceries in Stockholm.',
                    numberOfItems: saleProducts.slice(0, 30).length,
                    itemListElement: saleProducts.slice(0, 30).map((p, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: wooCommerceProductSchema(p, {
                            baseUrl: 'https://www.ideallivs.com',
                            brandName: 'Ideal Indiska LIVS',
                            sellerName: 'Ideal Indiska LIVS',
                            locale,
                        }),
                    })),
                }}
            />

            {/* Hero Section */}
            <div className="relative w-full overflow-hidden bg-emerald-950 min-h-[500px] flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ideal-Ramadan-Savings-e1770765144207.jpg"
                        alt="Ramadan Mega Savings"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />
                </div>

                <div className="relative container-wide mx-auto page-section-sm w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                        <div className="w-full md:w-1/2 space-y-8 z-10">
                            <div className="inline-flex p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                                <Percent className="h-8 w-8 text-emerald-300" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                                    {t('heroTitle')} <br />
                                    <span className="text-emerald-300">{t('heroTitleHighlight')}</span>
                                </h1>
                                <p className="text-lg md:text-xl text-emerald-100/90 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                    {t('heroDesc')}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 shadow-sm">
                                    <TrendingDown className="h-5 w-5 text-emerald-400" />
                                    <span className="text-base font-semibold">
                                        {t('exclusiveDeals', { count: saleProducts.length })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-900 shadow-lg shadow-black/10">
                                    <Percent className="h-5 w-5" />
                                    <span className="text-base font-bold">
                                        {t('limitedTime')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-1/2" />
                    </div>
                </div>
            </div>

            {/* SEO Description Section */}
            <section className="w-full bg-muted/30 py-12 border-y border-border/50">
                <div className="container-wide mx-auto px-[var(--container-padding)]">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-heading font-bold text-foreground">
                                {t('seoTitle')} <span className="text-primary">{t('seoTitleHighlight')}</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('seoP1')}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('seoP2')}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Percent className="w-5 h-5" /> {t('whatToLook')}
                            </h3>
                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('riceFlour')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('spiceMix')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('halalMeat')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('freshVeg')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('frozenFood')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t('brandWeek')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <div className="container-wide mx-auto page-section">
                {saleProducts.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                {t('allDeals', { count: saleProducts.length })}
                            </h2>
                            <p className="text-muted-foreground">
                                {t('grabThem')}
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {t('noDealsTitle')}
                        </h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            {t('noDealsDesc')}
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {t('browseAll')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default async function DealsPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading deals...</p>
                    </div>
                </div>
            }
        >
            <DealsContent locale={locale} />
        </Suspense>
    );
}
