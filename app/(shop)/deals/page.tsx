import Link from 'next/link';
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
    title: `January Grocery Deals Stockholm: Basmati, Idli Rice, Atta & Sweets | ${brandProfile.name}`,
    description: `Don't miss our January 13-18 Flash Sale! Exclusive deals in Stockholm on Aashirvaad Atta (99 kr), India Gate Idli Rice (99 kr), Basmati (139 kr), and Haldirams Sweets. Order online for same-day delivery.`,
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
                    { name: 'Deals & Offers', url: '/deals' },
                ])}
            />
            <SchemaScript
                id="deals-collection"
                schema={collectionPageSchema({
                    name: "Special Offers on Indian & Pakistani Groceries",
                    description: "Weekly discounts and promotions on authentic South Asian products in Stockholm.",
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
                    name: "Current Deals & Special Offers - Ideal Indiska LIVS",
                    description: "Limited time promotional prices on Indian & Pakistani groceries in Stockholm.",
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
            <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

                <div className="relative container-wide mx-auto page-section-sm">
                    <div className="flex flex-col items-center text-center space-y-6">
                        {/* Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-400 blur-3xl opacity-30 rounded-full" />
                            <div className="relative p-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-2xl">
                                <Percent className="h-12 w-12 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                                Indian Grocery Deals & Offers
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
                                Stockholm&apos;s best prices on South Asian cooking essentials.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-border">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                                <span className="text-sm font-semibold text-foreground">
                                    {saleProducts.length} Flash Deals Active
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-600 text-white">
                                <Percent className="h-4 w-4" />
                                <span className="text-sm font-bold">
                                    Stockholm Delivery
                                </span>
                            </div>
                        </div>
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
