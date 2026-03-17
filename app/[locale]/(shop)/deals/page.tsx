import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getOnSaleProducts } from '@/lib/woocommerce/products-direct';
import { getProductsByIds } from '@/lib/woocommerce';
import { ProductCard } from '@/components/shop/product-card';
import { BundleOfferCard } from '@/components/shop/bundle-offer';
import { getBundlesForDealsPage, getBundleProductIds } from '@/config/bundles.config';
import { Percent, TrendingDown, ChevronDown, Tag, Clock, Truck, Gift } from 'lucide-react';
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
            title: `Eid Mubarak 2026 Erbjudanden – Indiska & Pakistanska Matvaror Stockholm | ${brandProfile.name}`,
            description: `Eid Mubarak 2026! Fira med bästa deals på dadlar, vermicelli, Shan-kryddor, Basmati-ris, halaltkött & snacks. Uppdateras varje vecka hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/sv/deals`, languages: allLanguages },
            openGraph: {
                title: `Eid 2026 Erbjudanden — Ideal Indiska LIVS Stockholm`,
                description: `Eid Mubarak! Fira med bästa deals på dadlar, vermicelli, Shan-kryddor, Basmati-ris & halaltkött.`,
                url: `${siteConfig.site_domain}/sv/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'sv_SE',
                type: 'website',
            },
        };
    }

    if (locale === 'no') {
        return {
            title: `Eid Mubarak 2026 Tilbud – Indiske & Pakistanske Dagligvarer Stockholm | ${brandProfile.name}`,
            description: `Eid Mubarak 2026! Feir med beste tilbud på dadler, vermicelli, Shan-krydder, Basmatiris & halaltkjøtt. Oppdateres hver uke hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/no/deals`, languages: allLanguages },
            openGraph: {
                title: `Eid 2026 Tilbud — Ideal Indiska LIVS Stockholm`,
                description: `Eid Mubarak! Feir med beste tilbud på dadler, vermicelli, Shan-krydder, Basmatiris & halaltkjøtt.`,
                url: `${siteConfig.site_domain}/no/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'nb_NO',
                type: 'website',
            },
        };
    }

    if (locale === 'da') {
        return {
            title: `Eid Mubarak 2026 Tilbud – Indiske & Pakistanske Dagligvarer Stockholm | ${brandProfile.name}`,
            description: `Eid Mubarak 2026! Fejr med bedste tilbud på dadler, vermicelli, Shan-krydderier, Basmatiris & halaltkød. Opdateres hver uge hos Ideal Indiska LIVS Stockholm.`,
            alternates: { canonical: `${siteConfig.site_domain}/da/deals`, languages: allLanguages },
            openGraph: {
                title: `Eid 2026 Tilbud — Ideal Indiska LIVS Stockholm`,
                description: `Eid Mubarak! Fejr med bedste tilbud på dadler, vermicelli, Shan-krydderier, Basmatiris & halaltkød.`,
                url: `${siteConfig.site_domain}/da/deals`,
                siteName: 'Ideal Indiska LIVS',
                locale: 'da_DK',
                type: 'website',
            },
        };
    }

    return {
        title: `Eid Mubarak 2026 Deals – Indian & Pakistani Groceries Stockholm | ${brandProfile.name}`,
        description: `Eid Mubarak 2026! Celebrate with the best deals on dates, vermicelli, Shan spice mixes, Basmati rice, Halal meat & snacks. Updated weekly at Ideal Indiska LIVS Stockholm.`,
        alternates: { canonical: `${siteConfig.site_domain}/deals`, languages: allLanguages },
        openGraph: {
            title: `Eid 2026 Deals — Ideal Indiska LIVS Stockholm`,
            description: `Eid Mubarak! Celebrate with deals on dates, vermicelli, Shan spices, Basmati rice & Halal meat.`,
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
        q: 'Do you have Eid 2026 special offers?',
        a: 'Yes! For Eid al-Fitr 2026 (March 20) we have over 30 special deals on popular Eid essentials including Shan Vermicelli, dates, kheer mix, jelly, cooking oil, atta flour, Basmati rice, Shan spice mixes, and festive snacks. Check the Bundle Deals section above for our exclusive 2-for-15 kr Shan Vermicelli offer.',
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
        a: 'Every deal shows both the original price and the discounted sale price so you can see the exact saving. All deals are pulled live from our WooCommerce store — only products with an active sale price appear on this page.',
    },
];

const dealsFaqsSv = [
    {
        q: 'Har ni Eid 2026 specialerbjudanden?',
        a: 'Ja! Till Eid al-Fitr 2026 (20 mars) har vi över 30 specialerbjudanden på populära Eid-essentials: Shan Vermicelli, dadlar, kheer-mix, gelé, matolja, atta-mjöl, Basmati-ris, Shan-kryddblandningar och festliga snacks. Se avsnittet Bunterbjudanden ovan för vårt exklusiva 2-för-15 kr-erbjudande på Shan Vermicelli.',
    },
    {
        q: 'Hur ofta uppdateras erbjudandena?',
        a: 'Vi uppdaterar veckans deals regelbundet. Nya rabatter lanseras kontinuerligt på produkter som Basmati-ris, kryddor, linser, halaltkött och frysta snacks. Bokmärk sidan och kom tillbaka varje vecka för de senaste erbjudandena.',
    },
    {
        q: 'Vilka typer av produkter är på rea hos Ideal Indiska LIVS?',
        a: 'Veckans deals täcker ett brett sortiment av indiska och pakistanska livsmedel: Basmati-ris, atta-mjöl, kryddblandningar (Shan, MDH, National Foods), linser, halaltkött, frysta samosas och kebab, färska grönsaker, matolja och snacks.',
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
        q: 'Har dere Eid 2026 spesialtilbud?',
        a: 'Ja! Til Eid al-Fitr 2026 (20. mars) har vi over 30 spesialtilbud på populære Eid-essensielle varer: Shan Vermicelli, dadler, kheer-mix, gelé, matolje, atta-mel, Basmatiris, Shan-kryddblandinger og festlige snacks. Se seksjonen Pakketilbud ovenfor for vårt eksklusive 2-for-15 kr-tilbud på Shan Vermicelli.',
    },
    {
        q: 'Hvor ofte oppdateres tilbudene?',
        a: 'Vi oppdaterer ukenstilbudene jevnlig. Nye rabatter lanseres kontinuerlig på produkter som Basmatiris, krydder, linser, halaltkjøtt og frosne snacks. Bokmerk siden og kom tilbake hver uke for de siste tilbudene.',
    },
    {
        q: 'Hvilke typer produkter er på salg hos Ideal Indiska LIVS?',
        a: 'Ukenstilbudene dekker et bredt utvalg av indiske og pakistanske dagligvarer: Basmatiris, atta-mel, kryddblandinger (Shan, MDH, National Foods), linser, halaltkjøtt, frosne samosas og kebab, ferske grønnsaker, matolje og snacks.',
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
        q: 'Har I Eid 2026 specialtilbud?',
        a: 'Ja! Til Eid al-Fitr 2026 (20. marts) har vi over 30 specialtilbud på populære Eid-essentials: Shan Vermicelli, dadler, kheer-mix, gelé, madolie, atta-mel, Basmatiris, Shan-krydderiblandinger og festlige snacks. Se sektionen Pakketilbud ovenfor for vores eksklusive 2-for-15 kr-tilbud på Shan Vermicelli.',
    },
    {
        q: 'Hvor tit opdateres tilbuddene?',
        a: 'Vi opdaterer ugenstilbuddene løbende. Nye rabatter lanceres jævnligt på produkter som Basmatiris, krydderier, linser, halaltkød og frosne snacks. Bogmærk siden og kom tilbage hver uge for de seneste tilbud.',
    },
    {
        q: 'Hvilke typer produkter er på tilbud hos Ideal Indiska LIVS?',
        a: 'Ugenstilbuddene dækker et bredt udvalg af indiske og pakistanske dagligvarer: Basmatiris, atta-mel, krydderiblandinger (Shan, MDH, National Foods), linser, halaltkød, frosne samosas og kebab, friske grøntsager, madolie og snacks.',
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
                    name: locale === 'sv' ? 'Eid 2026 & Veckans Erbjudanden — Ideal Indiska LIVS' : locale === 'no' ? 'Eid 2026 & Ukens Tilbud — Ideal Indiska LIVS' : locale === 'da' ? 'Eid 2026 & Ugens Tilbud — Ideal Indiska LIVS' : 'Eid al-Fitr 2026 & Weekly Deals — Ideal Indiska LIVS',
                    description: locale === 'sv'
                        ? 'Eid Mubarak 2026! Specialerbjudanden och veckovisa rabatter på indiska och pakistanska matvaror i Stockholm.'
                        : locale === 'no'
                        ? 'Eid Mubarak 2026! Spesialtilbud og ukentlige rabatter på indiske og pakistanske dagligvarer i Stockholm.'
                        : locale === 'da'
                        ? 'Eid Mubarak 2026! Specialtilbud og ugentlige rabatter på indiske og pakistanske dagligvarer i Stockholm.'
                        : 'Eid Mubarak 2026! Special festive offers and weekly discounts on Indian and Pakistani groceries in Stockholm.',
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

            {/* ── Hero ── */}
            {/* TODO: Replace hero image with a generic weekly-deals banner (current image is seasonal) */}
            <div className="relative w-full overflow-hidden bg-emerald-950 min-h-[480px] flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="https://crm.ideallivs.com/wp-content/uploads/2026/02/Ideal-Ramadan-Savings-e1770765144207.jpg"
                        alt={locale === 'sv' ? 'Veckans erbjudanden på indiska och pakistanska matvaror i Stockholm' : locale === 'no' ? 'Ukens tilbud på indiske og pakistanske dagligvarer i Stockholm' : locale === 'da' ? 'Ugens tilbud på indiske og pakistanske dagligvarer i Stockholm' : 'Weekly deals on Indian and Pakistani groceries in Stockholm'}
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
                            {locale === 'sv' ? 'SNABBFAKTA' : locale === 'no' ? 'HURTIGFAKTA' : locale === 'da' ? 'HURTIGFAKTA' : 'QUICK FACTS'}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {(locale === 'sv' ? [
                                '🌙 Eid Mubarak 2026 – specialerbjudanden live nu',
                                '🏷️ Över 30 Eid-deals: kheer, gelé, olja, atta & mer',
                                '🛒 Shan Vermicelli 2-för-15 kr – exklusivt bunterbjudande',
                                '🚚 Lokalleverans tillgänglig i hela Stockholm',
                                '🌍 DHL till hela Europa — inga tullavgifter',
                            ] : locale === 'no' ? [
                                '🌙 Eid Mubarak 2026 – spesialtilbud live nå',
                                '🏷️ Over 30 Eid-tilbud: kheer, gelé, olje, atta & mer',
                                '🛒 Shan Vermicelli 2-for-15 kr – eksklusivt pakketilbud',
                                '🚚 Lokal levering tilgjengelig i hele Stockholm',
                                '🌍 DHL til hele Europa — ingen tollgebyrer',
                            ] : locale === 'da' ? [
                                '🌙 Eid Mubarak 2026 – specialtilbud live nu',
                                '🏷️ Over 30 Eid-tilbud: kheer, gelé, olie, atta & mere',
                                '🛒 Shan Vermicelli 2-for-15 kr – eksklusivt pakketilbud',
                                '🚚 Lokal levering tilgængelig i hele Stockholm',
                                '🌍 DHL til hele Europa — ingen toldsatser',
                            ] : [
                                '🌙 Eid Mubarak 2026 – special offers live now',
                                '🏷️ 30+ Eid deals: kheer, jelly, oil, atta, vermicelli & more',
                                '🛒 Shan Vermicelli 2-for-15 kr – exclusive bundle offer',
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

            {/* ── Eid 2026 Callout ── */}
            <section className="bg-gradient-to-r from-amber-950 via-green-950 to-amber-950 border-y border-yellow-600/30 py-6">
                <div className="container mx-auto px-4 max-w-screen-xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <span className="text-4xl select-none">☪️</span>
                        <div>
                            <h2 className="text-lg font-heading font-bold text-yellow-300">
                                {locale === 'sv'
                                    ? 'Eid Mubarak 2026 – Eid al-Fitr 20 mars'
                                    : locale === 'no'
                                    ? 'Eid Mubarak 2026 – Eid al-Fitr 20. mars'
                                    : locale === 'da'
                                    ? 'Eid Mubarak 2026 – Eid al-Fitr 20. marts'
                                    : 'Eid Mubarak 2026 – Eid al-Fitr March 20'}
                            </h2>
                            <p className="text-sm text-yellow-100/80 mt-0.5">
                                {locale === 'sv'
                                    ? 'Fira med över 30 specialerbjudanden på dadlar, vermicelli, kheer-mix, gelé, matolja, atta-mjöl, Shan-kryddor och andra Eid-essentials.'
                                    : locale === 'no'
                                    ? 'Feir med over 30 spesialtilbud på dadler, vermicelli, kheer-mix, gelé, matolje, atta-mel, Shan-krydder og andre Eid-essensielle varer.'
                                    : locale === 'da'
                                    ? 'Fejr med over 30 specialtilbud på dadler, vermicelli, kheer-mix, gelé, madolie, atta-mel, Shan-krydderier og andre Eid-essentials.'
                                    : 'Celebrate with 30+ special offers on dates, vermicelli, kheer mix, jelly, cooking oil, atta flour, Shan spices and all your Eid essentials.'}
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
