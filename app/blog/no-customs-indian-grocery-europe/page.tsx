import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar,
    ShieldCheck,
    Truck,
    Clock,
    Euro,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brandProfile } from '@/config/brand-profile';
import { siteConfig } from '@/site.config';
import { SchemaScript } from '@/lib/schema/schema-script';

export const metadata: Metadata = {
    title: "Ordering Indian Groceries in Europe: Why Shipping from Sweden is Smarter",
    description: "Avoid customs duties and high shipping costs. Learn why ordering Indian and Pakistani groceries from within the EU (Ideal Indiska, Sweden) is faster and cheaper.",
    openGraph: {
        title: "No Customs Duty: Shop Indian Groceries Across Europe",
        description: "Shopping from within the EU means zero hidden fees. Discover the best way to get authentic spices and rice delivered to your home.",
        images: [{ url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', width: 1200, height: 630, alt: 'Indian Spices Market' }],
    },
};

export default function NoCustomsPostPage() {
    const publishDate = "January 26, 2026";
    const title = "EU Shipping Guide: Why Buying Indian Groceries from Sweden Saves You Money";

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="bg-primary/5 border-b py-16 md:py-24">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground mb-8">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {publishDate}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span>Logistics & Customs</span>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground/90 prose-headings:text-foreground">
                        <p className="lead text-xl">
                            If you live in Germany, the Netherlands, France, or any other EU country, you know the frustration of ordering authentic Indian groceries only to be hit with unexpected customs duties and long delays at the border.
                        </p>

                        <p>
                            Since the UK left the European Union, many traditional sources of South Asian products have become expensive and complicated to use. At <strong>Ideal Indiska LIVS</strong>, we offer a solution: high-quality Indian and Pakistani groceries shipped directly from our Stockholm warehouse.
                        </p>

                        <div className="my-12 p-8 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-2xl">
                            <h3 className="text-blue-800 dark:text-blue-300 flex items-center gap-2 mt-0">
                                <ShieldCheck className="h-6 w-6" /> The EU Advantage
                            </h3>
                            <p className="mb-0 text-blue-900/80 dark:text-blue-400/80 italic">
                                "Because Sweden is an EU member state, there are zero customs duties, zero import VAT, and zero brokerage fees for orders shipped to other EU countries."
                            </p>
                        </div>

                        <h2>Why Shop from within the EU?</h2>

                        <div className="space-y-8 my-10">
                            <div className="flex gap-4">
                                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-6 w-6 text-primary" /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Transparent Pricing</h4>
                                    <p className="text-sm">The price you see at checkout is exactly what you pay. No surprises at your doorstep.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-6 w-6 text-primary" /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Faster Delivery</h4>
                                    <p className="text-sm">Packages do not stop for customs clearance. Once your order leaves our Stockholm hub, it moves directly to its final destination via DHL.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-6 w-6 text-primary" /></div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Authenticity Guaranteed</h4>
                                    <p className="text-sm">We stock over 1,500 products from trusted brands like Shan, MDH, Haldiram's, and National Foods, ensuring you get the real taste of home.</p>
                                </div>
                            </div>
                        </div>

                        <h2>Shipping to Germany, Denmark, and the Netherlands</h2>
                        <p>
                            Our primary shipping partner, <strong>DHL</strong>, provides end-to-end tracking. For our customers in Scandinavia (Denmark and Norway) and Central Europe (Germany, Netherlands, Belgium), delivery typically takes between 2 to 5 business days.
                        </p>

                        <div className="bg-muted p-6 rounded-2xl my-8 border">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-primary" /> What you can order:
                            </h4>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li><strong>Dry Goods:</strong> Basmati rice, flours, lentils (dals), and beans.</li>
                                <li><strong>Masalas & Spices:</strong> All major spice blends and whole spices.</li>
                                <li><strong>Snacks & Sweets:</strong> Haldiram snacks, ladoos, and biscuits.</li>
                                <li><strong>Personal Care:</strong> Vatika oils, henna, and soaps.</li>
                                <li><em>Note: Fresh vegetables and frozen items are currently only available for Stockholm local delivery.</em></li>
                            </ul>
                        </div>

                        <h2>How to Order</h2>
                        <p>
                            Simply visit our <Link href="/shop" className="text-primary hover:underline font-bold">Online Shop</Link>, add your items to the cart, and select your country at checkout. The shipping fee will be calculated automatically based on the weight of your package.
                        </p>

                        <div className="mt-16 text-center">
                            <Button asChild size="lg" className="rounded-full px-12 h-16 shadow-lg shadow-primary/20">
                                <Link href="/europe-delivery">View Full Shipping Details</Link>
                            </Button>
                        </div>
                    </article>
                </div>
            </section>

            <SchemaScript
                id="no-customs-post-schema"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": title,
                    "datePublished": "2026-01-26",
                    "description": "Learn why buying Indian groceries from within the EU saves money and time.",
                    "author": {
                        "@type": "Organization",
                        "name": "Ideal Indiska LIVS"
                    }
                }}
            />
        </main>
    );
}
