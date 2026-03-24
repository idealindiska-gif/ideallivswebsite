import { Link } from '@/lib/navigation';
import { Metadata } from 'next';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { getProductsByIds } from '@/lib/woocommerce';
import { ProductCard } from '@/components/shop/product-card';
import { BundleOfferCard } from '@/components/shop/bundle-offer';
import { getBundlesForDealsPage, getBundleProductIds } from '@/config/bundles.config';
import { Percent, ChevronDown, Tag, Truck, Gift, Sparkles } from 'lucide-react';
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

    const allLanguages = {
        'en': `${siteConfig.site_domain}/deals`,
        'sv': `${siteConfig.site_domain}/sv/deals`,
        'nb': `${siteConfig.site_domain}/no/deals`,
        'da': `${siteConfig.site_domain}/da/deals`,
        'x-default': `${siteConfig.site_domain}/deals`,
    };

    if (locale === 'sv') {
        return {
            title: `Veckans Erbjudanden – Indiska & Pakistanska Matvaror Stockholm | ${brandProfile.name}`,
            description: `Handla 30+ veckans erbjudanden på Basmati-ris, kryddor, atta-mjöl, matolja, linser & snacks. Uppdateras varje vecka hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/sv/deals`, languages: allLanguages },
            openGraph: {
                title: `Veckans Erbjudanden — Ideal Indiska LIVS Stockholm`,
                description: `30+ veckans deals på Basmati-ris, kryddor & atta-mjöl. Uppdateras varje vecka.`,
                url: `${siteConfig.site_domain}/sv/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'sv_SE',
                type: 'website',
            },
        };
    }

    if (locale === 'no') {
        return {
            title: `Ukens Tilbud – Indiske & Pakistanske Dagligvarer Stockholm | ${brandProfile.name}`,
            description: `Handle 30+ ukens tilbud på Basmatiris, krydder, atta-mel, matolje, linser & snacks. Oppdateres hver uke hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/no/deals`, languages: allLanguages },
            openGraph: {
                title: `Ukens Tilbud — Ideal Indiska LIVS Stockholm`,
                description: `30+ ukens tilbud på Basmatiris, krydder & atta-mel. Oppdateres hver uke.`,
                url: `${siteConfig.site_domain}/no/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'nb_NO',
                type: 'website',
            },
        };
    }

    if (locale === 'da') {
        return {
            title: `Ugens Tilbud – Indiske & Pakistanske Dagligvarer Stockholm | ${brandProfile.name}`,
            description: `Køb 30+ ugens tilbud på Basmatiris, krydderier, atta-mel, madolie, linser & snacks. Opdateres hver uge hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/da/deals`, languages: allLanguages },
            openGraph: {
                title: `Ugens Tilbud — Ideal Indiska LIVS Stockholm`,
                description: `30+ ugens tilbud på Basmatiris, krydderier & atta-mel. Opdateres hver uge.`,
                url: `${siteConfig.site_domain}/da/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'da_DK',
                type: 'website',
            },
        };
    }

    return {
        title: `Weekly Deals – Indian & Pakistani Groceries Stockholm | ${brandProfile.name}`,
        description: `Shop 30+ weekly deals on Basmati rice, spices, atta flour, cooking oil, lentils & snacks. Updated every week at Ideal Indiska LIVS Stockholm.`,
        alternates: { canonical: `${siteConfig.site_domain}/deals`, languages: allLanguages },
        openGraph: {
            title: `Weekly Deals — Ideal Indiska LIVS Stockholm`,
            description: `30+ weekly deals on Basmati rice, spices, atta flour & more. Updated every week.`,
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
        q: 'What weekly deals do you have?',
        a: 'We offer weekly deals on popular Indian and Pakistani groceries including Basmati rice, spice mixes, cooking oil, atta flour, lentils and snacks. Our deals are updated every week — bookmark this page and check back regularly for the latest discounts.',
    },
    {
        q: 'How often are the deals updated?',
        a: 'We update our weekly deals every week. New discounts go live regularly on products including Basmati rice, spices, lentils, and frozen snacks. Bookmark this page and check back every week for the latest offers.',
    },
    {
        q: 'What kind of products are on sale at Ideal Indiska LIVS?',
        a: 'Our weekly deals cover a wide range of Indian and Pakistani groceries including Basmati rice, atta flour, spice mixes (Shan, MDH, National Foods), lentils, frozen samosas and kebabs, fresh vegetables, cooking oils, and snacks.',
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
        a: 'Every deal shows both the original price and the discounted sale price so you can see the exact saving. All deals are pulled live from our WooCommerce store — only products with an active sale price appear on this page.',
    },
];

const dealsFaqsSv = [
    {
        q: 'Vilka veckodear har ni?',
        a: 'Vi erbjuder veckodear på populära indiska och pakistanska livsmedel: Basmati-ris, kryddblandningar, matolja, atta-mjöl, linser och snacks. Våra erbjudanden uppdateras varje vecka — bokmärk sidan och kom tillbaka regelbundet för de senaste rabatterna.',
    },
    {
        q: 'Hur ofta uppdateras erbjudandena?',
        a: 'Vi uppdaterar veckans deals regelbundet. Nya rabatter lanseras kontinuerligt på produkter som Basmati-ris, kryddor, linser och frysta snacks. Bokmärk sidan och kom tillbaka varje vecka för de senaste erbjudandena.',
    },
    {
        q: 'Vilka typer av produkter är på rea hos Ideal Indiska LIVS?',
        a: 'Veckans deals täcker ett brett sortiment av indiska och pakistanska livsmedel: Basmati-ris, atta-mjöl, kryddblandningar (Shan, MDH, National Foods), linser, frysta samosas och kebab, färska grönsaker, matolja och snacks.',
    },
    {
        q: 'Levererar ni dealbeställningar i Stockholm?',
        a: 'Ja. Vi erbjuder lokalleverans i hela Stockholm. Leveransavgift tillkommer på alla beställningar. Minimibeställning är 300 kr. Samma-dagleverans finns till närliggande områden för beställningar lagda före 16:00.',
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

const dealsFaqsNo = [
    {
        q: 'Hvilke ukenstilbud har dere?',
        a: 'Vi tilbyr ukenstilbud på populære indiske og pakistanske dagligvarer: Basmatiris, kryddblandinger, matolje, atta-mel, linser og snacks. Tilbudene oppdateres hver uke — bokmerk siden og kom tilbake jevnlig for de siste rabattene.',
    },
    {
        q: 'Hvor ofte oppdateres tilbudene?',
        a: 'Vi oppdaterer ukenstilbudene jevnlig. Nye rabatter lanseres kontinuerlig på produkter som Basmatiris, krydder, linser og frosne snacks. Bokmerk siden og kom tilbake hver uke for de siste tilbudene.',
    },
    {
        q: 'Hvilke typer produkter er på salg hos Ideal Indiska LIVS?',
        a: 'Ukenstilbudene dekker et bredt utvalg av indiske og pakistanske dagligvarer: Basmatiris, atta-mel, kryddblandinger (Shan, MDH, National Foods), linser, frosne samosas og kebab, ferske grønnsaker, matolje og snacks.',
    },
    {
        q: 'Leverer dere tilbudsbestillinger i Stockholm?',
        a: 'Ja. Vi tilbyr lokal levering i hele Stockholm. En leveringsavgift gjelder for alle bestillinger. Minimumsbestilling er 300 SEK. Samme-dag levering er tilgjengelig til nærliggende områder for bestillinger lagt inn før kl. 16:00.',
    },
    {
        q: 'Kan jeg få tilbud levert i hele Europa?',
        a: 'Ja. Vi sender til alle EU-land via DHL uten tollgebyrer. Ingen minimumsbestillingsverdi for EU-levering. Priser beregnes ved kassen basert på vekt og destination.',
    },
    {
        q: 'Hvordan vet jeg at et produkt virkelig er rabattert?',
        a: 'Hvert tilbud viser både originalprisen og rabattert salgspris slik at du ser nøyaktig hva du sparer. Alle tilbud hentes live fra vår butikk — kun produkter med aktivt salgspris vises på denne siden.',
    },
];

const dealsFaqsDa = [
    {
        q: 'Hvilke ugestilbud har I?',
        a: 'Vi tilbyder ugestilbud på populære indiske og pakistanske dagligvarer: Basmatiris, krydderiblandinger, madolie, atta-mel, linser og snacks. Vores tilbud opdateres hver uge — bogmærk siden og kom tilbage jævnligt for de seneste rabatter.',
    },
    {
        q: 'Hvor tit opdateres tilbuddene?',
        a: 'Vi opdaterer ugenstilbuddene løbende. Nye rabatter lanceres jævnligt på produkter som Basmatiris, krydderier, linser og frosne snacks. Bogmærk siden og kom tilbage hver uge for de seneste tilbud.',
    },
    {
        q: 'Hvilke typer produkter er på tilbud hos Ideal Indiska LIVS?',
        a: 'Ugenstilbuddene dækker et bredt udvalg af indiske og pakistanske dagligvarer: Basmatiris, atta-mel, krydderiblandinger (Shan, MDH, National Foods), linser, frosne samosas og kebab, friske grøntsager, madolie og snacks.',
    },
    {
        q: 'Leverer I tilbudsbestillinger i Stockholm?',
        a: 'Ja. Vi tilbyder lokal levering i hele Stockholm. Et leveringsgebyr gælder for alle bestillinger. Minimumsbestilling er 300 SEK. Samme-dag levering er tilgængeligt til nærliggende områder for bestillinger afgivet inden kl. 16:00.',
    },
    {
        q: 'Kan jeg få tilbud leveret i hele Europa?',
        a: 'Ja. Vi sender til alle EU-lande via DHL uden toldsatser. Ingen minimumsbestillingsværdi for EU-levering. Priser beregnes ved kassen baseret på vægt og destination.',
    },
    {
        q: 'Hvordan ved jeg, at et produkt virkelig er rabatteret?',
        a: 'Hvert tilbud viser både originalprisen og den nedsatte salgspris, så du kan se den nøjagtige besparelse. Alle tilbud hentes live fra vores butik — kun produkter med en aktiv salgspris vises på denne side.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
// NOTE: No <Suspense> wrapper — all content including schema renders in initial HTML
// so Googlebot and AI crawlers (ChatGPT, Perplexity) index the full page on first pass.

export default async function DealsPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const dealBundles = getBundlesForDealsPage();
    const bundleProductIds = getBundleProductIds(dealBundles);

    const [t, saleProducts, bundleProducts] = await Promise.all([
        getTranslations('deals'),
        getOnSaleProducts(50),
        bundleProductIds.length > 0 ? getProductsByIds(bundleProductIds) : Promise.resolve([]),
    ]);

    const { validFrom, validThrough } = getWeekValidity();
    const localePrefix = locale !== 'en' ? `/${locale}` : '';
    const pageUrl = `${siteConfig.site_domain}${localePrefix}/deals`;
    const faqs = locale === 'sv' ? dealsFaqsSv : locale === 'no' ? dealsFaqsNo : locale === 'da' ? dealsFaqsDa : dealsFaqsEn;

    return (
        <div className="min-h-screen w-full bg-background">

            {/* ── Schema: Breadcrumb ── */}
            <SchemaScript
                id="deals-breadcrumb"
                schema={breadcrumbSchema([
                    { name: locale === 'sv' ? 'Hem' : locale === 'no' ? 'Hjem' : locale === 'da' ? 'Hjem' : 'Home', url: locale !== 'en' ? `${siteConfig.site_domain}/${locale}` : siteConfig.site_domain },
                    { name: locale === 'sv' ? 'Veckans Erbjudanden' : locale === 'no' ? 'Ukens Tilbud' : locale === 'da' ? 'Ugens Tilbud' : 'Deals & Offers', url: pageUrl },
                ])}
            />

            {/* ── Schema: CollectionPage ── */}
            <SchemaScript
                id="deals-collection"
                schema={collectionPageSchema({
                    name: locale === 'sv'
                        ? 'Veckans Erbjudanden på Indiska & Pakistanska Matvaror'
                        : locale === 'no'
                        ? 'Ukens Tilbud på Indiske & Pakistanske Dagligvarer'
                        : locale === 'da'
                        ? 'Ugens Tilbud på Indiske & Pakistanske Dagligvarer'
                        : 'Weekly Indian & Pakistani Grocery Deals',
                    description: locale === 'sv'
                        ? 'Veckovisa rabatter på autentiska indiska och pakistanska livsmedel i Stockholm.'
                        : locale === 'no'
                        ? 'Ukentlige rabatter på autentiske indiske og pakistanske dagligvarer i Stockholm.'
                        : locale === 'da'
                        ? 'Ugentlige rabatter på autentiske indiske og pakistanske dagligvarer i Stockholm.'
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
                    name: locale === 'sv'
                        ? `Veckans Erbjudanden — ${brandProfile.name}`
                        : locale === 'no'
                        ? `Ukens Tilbud — ${brandProfile.name}`
                        : locale === 'da'
                        ? `Ugens Tilbud — ${brandProfile.name}`
                        : `Weekly Deals — ${brandProfile.name}`,
                    description: locale === 'sv'
                        ? 'Veckovisa kampanjpriser på indiska och pakistanska livsmedel i Stockholm.'
                        : locale === 'no'
                        ? 'Ukentlige kampanjepriser på indiske og pakistanske dagligvarer i Stockholm.'
                        : locale === 'da'
                        ? 'Ugentlige kampagnepriser på indiske og pakistanske dagligvarer i Stockholm.'
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
                    name: locale === 'sv' ? 'Veckans Erbjudanden — Ideal Indiska LIVS' : locale === 'no' ? 'Ukens Tilbud — Ideal Indiska LIVS' : locale === 'da' ? 'Ugens Tilbud — Ideal Indiska LIVS' : 'Weekly Deals & Offers — Ideal Indiska LIVS',
                    description: locale === 'sv'
                        ? 'Veckovisa rabatter på indiska och pakistanska matvaror i Stockholm.'
                        : locale === 'no'
                        ? 'Ukentlige rabatter på indiske og pakistanske dagligvarer i Stockholm.'
                        : locale === 'da'
                        ? 'Ugentlige rabatter på indiske og pakistanske dagligvarer i Stockholm.'
                        : 'Weekly promotional discounts on Indian and Pakistani groceries in Stockholm.',
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
                    name: locale === 'sv' ? 'Veckans Deals — Produkter på rea' : locale === 'no' ? 'Ukens Tilbud — Produkter på salg' : locale === 'da' ? 'Ugens Tilbud — Produkter på tilbud' : 'Weekly Deals — On Sale Products',
                    description: locale === 'sv'
                        ? 'Kampanjpriser på indiska och pakistanska matvaror i Stockholm.'
                        : locale === 'no'
                        ? 'Kampanjepriser på indiske og pakistanske dagligvarer i Stockholm.'
                        : locale === 'da'
                        ? 'Kampagnepriser på indiske og pakistanske dagligvarer i Stockholm.'
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

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden py-14 sm:py-20 px-5 sm:px-8"
                style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #0d3d2a 25%, #1a3a0a 50%, #2e1a00 80%, #0a2e1a 100%)' }}>
                {/* Decorative glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-[5%] w-48 h-48 bg-yellow-400/15 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-[15%] w-56 h-56 bg-amber-500/15 rounded-full blur-3xl" />
                    <div className="absolute top-0 right-[5%] w-40 h-40 bg-yellow-300/15 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative z-10 container mx-auto max-w-screen-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Icon */}
                        <div className="hidden md:flex items-center justify-center shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-amber-300/30 to-emerald-400/40 rounded-full blur-xl scale-150" />
                                <div className="relative p-5 bg-gradient-to-br from-yellow-500/20 via-amber-400/15 to-emerald-500/20 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                                    <Tag className="w-12 h-12 text-yellow-300" />
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                                    style={{ background: 'linear-gradient(90deg, #d97706, #15803d)', color: '#fff' }}>
                                    <Sparkles className="w-3 h-3" />
                                    {locale === 'sv' ? 'Veckans Deals' : locale === 'no' ? 'Ukens Tilbud' : locale === 'da' ? 'Ugens Tilbud' : 'Weekly Deals'}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/10 text-white/80 border border-white/20">
                                    {locale === 'sv' ? 'Uppdateras varje vecka' : locale === 'no' ? 'Oppdateres hver uke' : locale === 'da' ? 'Opdateres hver uge' : 'Updated every week'}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 leading-tight"
                                style={{
                                    background: 'linear-gradient(90deg, #fcd34d, #86efac, #fbbf24, #d1fae5)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                {locale === 'sv' ? 'Veckans Erbjudanden & Deals' : locale === 'no' ? 'Ukens Tilbud & Deals' : locale === 'da' ? 'Ugens Tilbud & Deals' : 'Weekly Deals & Offers'}
                            </h1>

                            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                                {locale === 'sv'
                                    ? 'Handla veckans bästa erbjudanden på autentiska indiska och pakistanska livsmedel i Stockholm. Basmati-ris, kryddblandningar, matolja, atta-mjöl, linser och snacks.'
                                    : locale === 'no'
                                    ? 'Handle ukens beste tilbud på autentiske indiske og pakistanske dagligvarer i Stockholm. Basmatiris, kryddblandinger, matolje, atta-mel, linser og snacks.'
                                    : locale === 'da'
                                    ? 'Køb ugens bedste tilbud på autentiske indiske og pakistanske dagligvarer i Stockholm. Basmatiris, krydderiblandinger, madolie, atta-mel, linser og snacks.'
                                    : 'Shop this week\'s best discounts on authentic Indian and Pakistani groceries in Stockholm — Basmati rice, spice mixes, cooking oil, atta flour, lentils and snacks.'}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-yellow-500/40 bg-yellow-500/10">
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                    {saleProducts.length > 0
                                        ? (locale === 'sv' ? `${saleProducts.length} aktiva deals` : locale === 'no' ? `${saleProducts.length} aktive tilbud` : locale === 'da' ? `${saleProducts.length} aktive tilbud` : `${saleProducts.length} active deals`)
                                        : (locale === 'sv' ? 'Deals live nu' : locale === 'no' ? 'Tilbud live nå' : locale === 'da' ? 'Tilbud live nu' : 'Deals live now')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom gold-green border */}
                <div className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: 'linear-gradient(90deg, #d97706, #fcd34d, #15803d, #86efac, #d97706)' }} />
            </div>

            {/* ── TL;DR — machine-liftable summary for Google AI Overview ── */}
            <section className="bg-primary/5 border-b border-primary/10 py-6">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary whitespace-nowrap pt-0.5">
                            {locale === 'sv' ? 'SNABBFAKTA' : locale === 'no' ? 'HURTIGFAKTA' : locale === 'da' ? 'HURTIGFAKTA' : 'QUICK FACTS'}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {(locale === 'sv' ? [
                                '🏷️ Veckodear — uppdateras varje måndag',
                                '🛒 Aktiva deals på ris, kryddor, linser & mer',
                                '🚚 Lokalleverans tillgänglig i hela Stockholm',
                                '🌍 DHL till hela Europa — inga tullavgifter',
                            ] : locale === 'no' ? [
                                '🏷️ Ukenstilbud — oppdateres hver mandag',
                                '🛒 Aktive tilbud på ris, krydder, linser & mer',
                                '🚚 Lokal levering tilgjengelig i hele Stockholm',
                                '🌍 DHL til hele Europa — ingen tollgebyrer',
                            ] : locale === 'da' ? [
                                '🏷️ Ugestilbud — opdateres hver mandag',
                                '🛒 Aktive tilbud på ris, krydderier, linser & mere',
                                '🚚 Lokal levering tilgængelig i hele Stockholm',
                                '🌍 DHL til hele Europa — ingen toldsatser',
                            ] : [
                                '🏷️ Weekly deals — updated every Monday',
                                '🛒 Active deals on rice, spices, lentils & more',
                                '🚚 Local delivery available across Stockholm',
                                '🌍 DHL to all of Europe — no customs fees',
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
                                    t('lentilsDal'),
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
                                {locale === 'sv'
                                    ? 'Lokalleverans tillgänglig i hela Stockholm'
                                    : locale === 'no'
                                    ? 'Lokal levering tilgjengelig i hele Stockholm'
                                    : locale === 'da'
                                    ? 'Lokal levering tilgængelig i hele Stockholm'
                                    : 'Local delivery available across Stockholm'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bundle Deals ── */}
            {dealBundles.length > 0 && (
                <section className="container mx-auto px-4 max-w-screen-xl pt-12 pb-4">
                    <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                        <Gift className="h-6 w-6 text-primary" />
                        {locale === 'sv' ? 'Bunterbjudanden' : locale === 'no' ? 'Pakketilbud' : locale === 'da' ? 'Pakketilbud' : 'Bundle Deals'}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        {locale === 'sv' ? 'Köp mer och spara mer med våra specialpaket.' : locale === 'no' ? 'Kjøp mer og spar mer med våre spesialpakker.' : locale === 'da' ? 'Køb mere og spar mere med vores specialpakker.' : 'Buy more and save more with our special bundles.'}
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
                        {locale === 'sv' ? 'Vanliga frågor om våra erbjudanden' : locale === 'no' ? 'Vanlige spørsmål om våre tilbud' : locale === 'da' ? 'Ofte stillede spørgsmål om vores tilbud' : 'Deals FAQ'}
                    </h2>
                    <p className="text-muted-foreground mb-8 text-sm">
                        {locale === 'sv'
                            ? 'Allt du behöver veta om veckans deals, leverans och priser.'
                            : locale === 'no'
                            ? 'Alt du trenger å vite om ukens tilbud, levering og priser.'
                            : locale === 'da'
                            ? 'Alt hvad du behøver at vide om ugens tilbud, levering og priser.'
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
