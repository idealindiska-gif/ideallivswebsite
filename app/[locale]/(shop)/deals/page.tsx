import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { ProductCard } from '@/components/shop/product-card';
import { Percent, TrendingDown, ChevronDown, Tag, Clock, Truck } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { brandProfile } from '@/config/brand-profile';
import { SchemaScript } from "@/lib/schema/schema-script";
import { collectionPageSchema } from "@/lib/schema/collection";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb";
import { wooCommerceProductSchema } from "@/lib/schema/product";
import { siteConfig } from '@/site.config';

interface PageProps {
    params: Promise<{ locale: string }>;
}

// ─── Compute current week's Mon–Sun validity window ──────────────────────────
// Used in OfferCatalog + SaleEvent schema so Google knows offers are live this week
function getWeekValidity() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun … 6=Sat
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;

    if (locale === 'sv') {
        return {
            title: `Veckans Erbjudanden på Indiska & Pakistanska Matvaror Stockholm | ${brandProfile.name}`,
            description: `Veckans bästa deals på autentiska indiska och pakistanska livsmedel i Stockholm. Rabatter på Basmati-ris, kryddor, halaltkött och snacks — uppdateras varje vecka.`,
            alternates: {
                canonical: `${siteConfig.site_domain}/sv/deals`,
                languages: {
                    'en': `${siteConfig.site_domain}/deals`,
                    'sv': `${siteConfig.site_domain}/sv/deals`,
                    'x-default': `${siteConfig.site_domain}/deals`,
                },
            },
            openGraph: {
                title: `Veckans Erbjudanden — Ideal Indiska LIVS Stockholm`,
                description: `Veckans bästa deals på autentiska indiska och pakistanska livsmedel i Stockholm.`,
                url: `${siteConfig.site_domain}/sv/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'sv_SE',
                type: 'website',
            },
        };
    }

    return {
        title: `Weekly Indian & Pakistani Grocery Deals Stockholm | ${brandProfile.name}`,
        description: `This week's best deals on authentic Indian and Pakistani groceries in Stockholm. Discounts on Basmati rice, spices, Halal meat, and snacks — updated every week.`,
        alternates: {
            canonical: `${siteConfig.site_domain}/deals`,
            languages: {
                'en': `${siteConfig.site_domain}/deals`,
                'sv': `${siteConfig.site_domain}/sv/deals`,
                'x-default': `${siteConfig.site_domain}/deals`,
            },
        },
        openGraph: {
            title: `Weekly Deals — Ideal Indiska LIVS Stockholm`,
            description: `This week's best deals on authentic Indian and Pakistani groceries in Stockholm.`,
            url: `${siteConfig.site_domain}/deals`,
            siteName: 'Ideal Indiska LIVS',
            locale: 'en_GB',
            type: 'website',
        },
    };
}

// ─── FAQ data (machine-liftable for Google AI Overview) ───────────────────────

const dealsFaqsEn = [
    {
        q: 'How often are the deals updated?',
        a: 'We update our weekly deals every week. New discounts go live regularly on products including Basmati rice, spices, lentils, Halal meat, and frozen snacks. Bookmark this page and check back every week for the latest offers.',
    },
    {
        q: 'What kind of products are on sale at Ideal Indiska LIVS?',
        a: 'Our weekly deals cover a wide range of Indian and Pakistani groceries including Basmati rice, atta flour, spice mixes (Shan, MDH, National Foods), lentils, Halal meat, frozen samosas and kebabs, fresh vegetables, cooking oils, and snacks.',
    },
    {
        q: 'Do you offer free delivery on deals orders in Stockholm?',
        a: 'Yes. Orders of 500 SEK or more get free home delivery anywhere in Stockholm. Orders between 300–499 SEK have a flat 30 SEK delivery fee. Same-day delivery is available to nearby areas for orders placed before 4 PM.',
    },
    {
        q: 'Can I get deals delivered across Europe?',
        a: 'Yes. We ship to all EU countries via DHL with no customs duties. There is no minimum order value for EU delivery. Rates are calculated at checkout based on weight and destination.',
    },
    {
        q: 'How do I know if a product is genuinely discounted?',
        a: 'Every deal shows both the original price and the discounted sale price so you can see the exact saving. All deals are pulled live from our WooCommerce store — only products with an active sale price appear on this page.',
    },
];

const dealsFaqsSv = [
    {
        q: 'Hur ofta uppdateras erbjudandena?',
        a: 'Vi uppdaterar veckans deals regelbundet. Nya rabatter lanseras kontinuerligt på produkter som Basmati-ris, kryddor, linser, halaltkött och frysta snacks. Bokmärk sidan och kom tillbaka varje vecka för de senaste erbjudandena.',
    },
    {
        q: 'Vilka typer av produkter är på rea hos Ideal Indiska LIVS?',
        a: 'Veckans deals täcker ett brett sortiment av indiska och pakistanska livsmedel: Basmati-ris, atta-mjöl, kryddblandningar (Shan, MDH, National Foods), linser, halaltkött, frysta samosas och kebab, färska grönsaker, matolja och snacks.',
    },
    {
        q: 'Erbjuder ni gratis leverans på dealbeställningar i Stockholm?',
        a: 'Ja. Beställningar på 500 kr eller mer får gratis hemleverans inom hela Stockholm. Beställningar på 300–499 kr kostar 30 kr. Samma-dagleverans finns till närliggande områden för beställningar lagda före 16:00.',
    },
    {
        q: 'Kan jag få deals levererade inom Europa?',
        a: 'Ja. Vi skickar till alla EU-länder via DHL utan tullavgifter. Inget minimivärde för EU-leverans. Priset beräknas i kassan baserat på vikt och destination.',
    },
    {
        q: 'Hur vet jag att en produkt verkligen är rabatterad?',
        a: 'Varje deal visar både ordinarie pris och reapris så du ser exakt hur mycket du sparar. Alla deals hämtas live från vår butik — endast produkter med aktivt reapris visas på den här sidan.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
// NOTE: No <Suspense> wrapper — all content including schema renders in initial HTML
// so Googlebot and AI crawlers (ChatGPT, Perplexity) index the full page on first pass.

export default async function DealsPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const [t, saleProducts] = await Promise.all([
        getTranslations('deals'),
        getOnSaleProducts(50),
    ]);

    const { validFrom, validThrough } = getWeekValidity();
    const isSv = locale === 'sv';
    const pageUrl = isSv
        ? `${siteConfig.site_domain}/sv/deals`
        : `${siteConfig.site_domain}/deals`;
    const faqs = isSv ? dealsFaqsSv : dealsFaqsEn;

    return (
        <div className="min-h-screen w-full bg-background">

            {/* ── Schema: Breadcrumb ── */}
            <SchemaScript
                id="deals-breadcrumb"
                schema={breadcrumbSchema([
                    { name: isSv ? 'Hem' : 'Home', url: isSv ? `${siteConfig.site_domain}/sv` : siteConfig.site_domain },
                    { name: isSv ? 'Veckans Erbjudanden' : 'Deals & Offers', url: pageUrl },
                ])}
            />

            {/* ── Schema: CollectionPage ── */}
            <SchemaScript
                id="deals-collection"
                schema={collectionPageSchema({
                    name: isSv
                        ? 'Veckans Erbjudanden på Indiska & Pakistanska Matvaror'
                        : 'Weekly Indian & Pakistani Grocery Deals',
                    description: isSv
                        ? 'Veckovisa rabatter på autentiska indiska och pakistanska livsmedel i Stockholm.'
                        : 'Weekly discounts on authentic Indian and Pakistani groceries in Stockholm.',
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
                    name: isSv
                        ? `Veckans Erbjudanden — ${brandProfile.name}`
                        : `Weekly Deals — ${brandProfile.name}`,
                    description: isSv
                        ? 'Veckovisa kampanjpriser på indiska och pakistanska livsmedel i Stockholm.'
                        : 'Weekly promotional prices on Indian and Pakistani groceries in Stockholm.',
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

            {/* ── Schema: SaleEvent — signals this is a live recurring sale ── */}
            <SchemaScript
                id="deals-sale-event"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'SaleEvent',
                    name: isSv ? 'Veckans Erbjudanden — Ideal Indiska LIVS' : 'Weekly Deals — Ideal Indiska LIVS',
                    description: isSv
                        ? 'Veckovisa rabatter på indiska och pakistanska matvaror i Stockholm. Uppdateras varje vecka.'
                        : 'Weekly discounts on Indian and Pakistani groceries in Stockholm. Updated every week.',
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
                    name: isSv ? 'Veckans Deals — Produkter på rea' : 'Weekly Deals — On Sale Products',
                    description: isSv
                        ? 'Kampanjpriser på indiska och pakistanska matvaror i Stockholm.'
                        : 'Promotional prices on Indian and Pakistani groceries in Stockholm.',
                    numberOfItems: saleProducts.slice(0, 30).length,
                    itemListElement: saleProducts.slice(0, 30).map((p, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: wooCommerceProductSchema(p, {
                            baseUrl: siteConfig.site_domain,
                            brandName: brandProfile.name,
                            sellerName: brandProfile.name,
                            locale,
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
                    mainEntity: faqs.map(faq => ({
                        '@type': 'Question',
                        name: faq.q,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: faq.a,
                        },
                    })),
                }}
            />

            {/* ── Hero ── */}
            {/* TODO: Replace hero image with a generic weekly-deals banner (current image is seasonal) */}
            <div className="relative w-full overflow-hidden bg-emerald-950 min-h-[480px] flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ideal-Ramadan-Savings-e1770765144207.jpg"
                        alt={isSv ? 'Veckans erbjudanden på indiska och pakistanska matvaror i Stockholm' : 'Weekly deals on Indian and Pakistani groceries in Stockholm'}
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
                            {t('heroTitle')}{' '}
                            <span className="text-emerald-300">{t('heroTitleHighlight')}</span>
                        </h1>
                        <p className="text-lg text-emerald-100/90 font-medium leading-relaxed max-w-lg">
                            {t('heroDesc')}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50">
                                <TrendingDown className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-semibold">
                                    {t('exclusiveDeals', { count: saleProducts.length })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-900 shadow-lg">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-bold">{t('limitedTime')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TL;DR — machine-liftable summary for Google AI Overview ── */}
            <section className="bg-primary/5 border-b border-primary/10 py-6">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary whitespace-nowrap pt-0.5">
                            {isSv ? 'SNABBFAKTA' : 'QUICK FACTS'}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {(isSv ? [
                                '🏷️ Erbjudanden uppdateras varje vecka',
                                '🛒 Ris, kryddor, halaltkött, snacks & mer',
                                '🚚 Gratis Stockholmsleverans på beställningar över 500 kr',
                                '🌍 DHL till hela Europa — inga tullavgifter',
                                '📦 1 500+ autentiska produkter i lager',
                            ] : [
                                '🏷️ Deals updated every week',
                                '🛒 Rice, spices, Halal meat, snacks & more',
                                '🚚 Free Stockholm delivery on orders over 500 SEK',
                                '🌍 DHL to all of Europe — no customs fees',
                                '📦 1,500+ authentic products in stock',
                            ]).map((fact, i) => (
                                <span key={i} className="text-sm text-foreground">{fact}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SEO Description Section ── */}
            <section className="w-full bg-muted/30 py-12 border-b border-border/50">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-heading font-bold text-foreground">
                                {t('seoTitle')}{' '}
                                <span className="text-primary">{t('seoTitleHighlight')}</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">{t('seoP1')}</p>
                            <p className="text-muted-foreground leading-relaxed">{t('seoP2')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <Tag className="w-5 h-5" /> {t('whatToLook')}
                            </h3>
                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    t('riceFlour'),
                                    t('spiceMix'),
                                    t('halalMeat'),
                                    t('freshVeg'),
                                    t('frozenFood'),
                                    t('brandWeek'),
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                                {isSv
                                    ? 'Gratis frakt i Stockholm på beställningar över 500 kr'
                                    : 'Free Stockholm delivery on orders over 500 SEK'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Products Grid ── */}
            <section className="container mx-auto px-4 max-w-screen-xl py-12">
                {saleProducts.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {t('allDeals', { count: saleProducts.length })}
                            </h2>
                            <p className="text-muted-foreground text-sm">{t('grabThem')}</p>
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
                        <h2 className="text-2xl font-bold text-foreground mb-2">{t('noDealsTitle')}</h2>
                        <p className="text-muted-foreground max-w-md mb-6">{t('noDealsDesc')}</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {t('browseAll')}
                        </Link>
                    </div>
                )}
            </section>

            {/* ── FAQ Section — visible Q&A required for FAQPage rich results ── */}
            <section className="border-t bg-muted/20 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-heading font-bold mb-2 text-foreground" style={{ fontSize: '25px' }}>
                        {isSv ? 'Vanliga frågor om våra erbjudanden' : 'Deals FAQ'}
                    </h2>
                    <p className="text-muted-foreground mb-8 text-sm">
                        {isSv
                            ? 'Allt du behöver veta om veckans deals, leverans och priser.'
                            : 'Everything you need to know about our weekly deals, delivery, and pricing.'}
                    </p>
                    <div className="divide-y divide-border">
                        {faqs.map((faq, i) => (
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
