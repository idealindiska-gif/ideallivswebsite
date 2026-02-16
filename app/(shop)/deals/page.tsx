import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { ProductCard } from '@/components/shop/product-card';
import { Loader2, Percent, TrendingDown } from 'lucide-react';

import { brandProfile } from '@/config/brand-profile';
import { SchemaScript } from "@/lib/schema/schema-script";
import { collectionPageSchema, offerCatalogSchema } from "@/lib/schema/collection";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
    title: `Deals & Offers on Indian Groceries Stockholm | Ideal Livs`,
    description: `Save big on Indian & Pakistani groceries in Stockholm. Exclusive deals on Basmati rice, spices, halal meat & more. Order online with fast delivery across Sweden & Europe.`,
    alternates: {
        canonical: 'https://www.ideallivs.com/deals',
    },
};

async function DealsContent() {
    const saleProducts = await getOnSaleProducts(50); // Get up to 50 products on sale

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
            {/* OfferCatalog Schema - signals promotional content to search engines */}
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

            {/* Hero Section */}
            <div className="relative w-full overflow-hidden bg-emerald-950 min-h-[500px] flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ideal-Ramadan-Savings-e1770765144207.jpg"
                        alt="Ramadan Mega Savings"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    {/* Gradient Overlay for Text Readability - Stronger on the left */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />
                </div>

                <div className="relative container-wide mx-auto page-section-sm w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">

                        {/* Text Content - Left Side */}
                        <div className="w-full md:w-1/2 space-y-8 z-10">
                            {/* Icon */}
                            <div className="inline-flex p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                                <Percent className="h-8 w-8 text-emerald-300" />
                            </div>

                            {/* Title */}
                            <div className="space-y-4">
                                <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                                    Ramadan <br />
                                    <span className="text-emerald-300">Mega Savings</span>
                                </h1>
                                <p className="text-lg md:text-xl text-emerald-100/90 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                    Prepare for a blessed month with Stockholm&apos;s best prices on dates, rice, and Iftar essentials.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 shadow-sm">
                                    <TrendingDown className="h-5 w-5 text-emerald-400" />
                                    <span className="text-base font-semibold">
                                        {saleProducts.length} Exclusive Deals
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-900 shadow-lg shadow-black/10">
                                    <Percent className="h-5 w-5" />
                                    <span className="text-base font-bold">
                                        Limited Time Only
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Empty spacer to show the image */}
                        <div className="hidden md:block w-1/2" />
                    </div>
                </div>
            </div>

            {/* In-depth SEO Description Section */}
            <section className="w-full bg-muted/30 py-12 border-y border-border/50">
                <div className="container-wide mx-auto px-[var(--container-padding)]">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-heading font-bold text-foreground">
                                Authentic Flavors, <span className="text-primary">Unbeatable Prices</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At <strong>Ideal Indiska LIVS</strong>, we believe that authentic cooking shouldn&apos;t break the bank. Our weekly <strong>Special Offers</strong> bring you the best discounts on high-quality Indian and Pakistani staples right here in <strong>Stockholm</strong>.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                From 5kg bags of premium <strong>Basmati Rice</strong> to essential <strong>spices and dals</strong>, we regularly discount the items your family uses most. Our deals are updated every week, so be sure to bookmark this page!
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Percent className="w-5 h-5" /> What to look for this week:
                            </h3>
                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Rice & Flour Deals
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Spice Mix Discounts
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Halal Meat Offers
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Fresh Vegetable Sales
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Frozen Food Promos
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Brand of the Week
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
                                All Deals ({saleProducts.length})
                            </h2>
                            <p className="text-muted-foreground">
                                Limited time offers - grab them before they're gone!
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
                            No Deals Available Right Now
                        </h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            We don't have any special offers at the moment, but check back soon for amazing deals!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DealsPage() {
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
            <DealsContent />
        </Suspense>
    );
}
