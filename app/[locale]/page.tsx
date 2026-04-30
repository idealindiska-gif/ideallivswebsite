import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { DealsSection } from "@/components/home/deals-section";
import { ProductShowcase } from "@/components/home/product-showcase";
import { BrandsStrip } from "@/components/home/brands-strip";
import { ReviewsSection } from "@/components/home/reviews-section";
import { Features } from "@/components/home/features";
import { SeoContent } from "@/components/home/seo-content";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { webpageSchema } from "@/lib/schema/website";
import { enhancedItemListSchema } from "@/lib/schema/collection";
import { faqCollectionPageSchema } from "@/lib/schema/faq";
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ChevronDown } from "lucide-react";

// ISR: Revalidate every 2 hours
export const revalidate = 7200;

const BASE_URL = "https://www.ideallivs.com";

// ─── FAQ data (machine-liftable for Google AI Overview) ───────────────────────

const enFaqs = [
    {
        question: "Where can I buy Indian and Pakistani groceries in Stockholm?",
        answer: "Ideal Indiska LIVS is Stockholm's specialist Indian and Pakistani grocery store, located at Bandhagsplan 4 in Bandhagen. We stock over 1,500 authentic products including premium Basmati rice, spices, lentils, frozen snacks, and fresh produce — all available online with fast delivery.",
    },
    {
        question: "Do you deliver in Stockholm?",
        answer: "Yes. We offer local delivery across all of Stockholm. A delivery fee applies to all orders. Minimum order is 300 SEK. Same-day delivery is available to nearby areas (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) for orders placed before 4 PM. Visit our Delivery Information page for full pricing details.",
    },
    {
        question: "Do you deliver Indian groceries outside Stockholm and Sweden?",
        answer: "Yes. We ship to all of Sweden and across Europe via DHL. There is no minimum order value for DHL delivery — rates are calculated at checkout based on your location and order weight. No customs duties apply within the EU since we ship from Sweden.",
    },
    {
        question: "Are your products Halal certified?",
        answer: "Yes. We carry a dedicated range of 100% Halal certified meat, poultry, and packaged food products. All Halal items are clearly labelled in our online store and in our Bandhagen shop.",
    },
    {
        question: "What Indian and Pakistani brands do you stock?",
        answer: "We carry over 150 trusted brands including India Gate, Guard, Shan, National Foods, Haldiram's, Ashoka, Ahmed Foods, Rooh Afza, MDH, TRS, and many more. Our range covers spices, rice, flours, lentils, pickles, frozen foods, snacks, and beverages.",
    },
    {
        question: "What are your store opening hours?",
        answer: "Our Bandhagen store is open Monday to Friday 10:00–20:00, and Saturday to Sunday 11:00–19:00. You can also shop online 24/7 at ideallivs.com.",
    },
];

const svFaqs = [
    {
        question: "Var kan jag köpa indiska och pakistanska matvaror i Stockholm?",
        answer: "Ideal Indiska LIVS är Stockholms specialbutik för indiska och pakistanska livsmedel, med adress Bandhagsplan 4 i Bandhagen. Vi har över 1 500 autentiska produkter — premium Basmati-ris, kryddor, linser, frysta snacks och färska varor — tillgängliga online med snabb leverans.",
    },
    {
        question: "Levererar ni i Stockholm?",
        answer: "Ja. Vi erbjuder lokalleverans i hela Stockholm. Leveransavgift tillkommer på alla beställningar. Minimibeställning är 300 kr. Samma-dagleverans finns till närliggande områden (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) för beställningar lagda före 16:00. Besök vår leveransinformationssida för aktuell prisinformation.",
    },
    {
        question: "Levererar ni utanför Stockholm och Sverige?",
        answer: "Ja. Vi skickar till hela Sverige och Europa via DHL. Inget minimivärde krävs för DHL-leverans — priset beräknas i kassan. Inga tullavgifter tillkommer inom EU eftersom vi skickar från Sverige.",
    },
    {
        question: "Är era produkter Halal-certifierade?",
        answer: "Ja. Vi erbjuder ett brett sortiment av Halal-certifierade förpackade livsmedel, kryddor och snacks. Observera att vi för tillfället inte erbjuder färskt eller fryst halaltkött.",
    },
    {
        question: "Vilka indiska och pakistanska varumärken säljer ni?",
        answer: "Vi har över 150 välkända varumärken, bland annat India Gate, Guard, Shan, National Foods, Haldiram's, Ashoka, Ahmed Foods, Rooh Afza, MDH och TRS. Sortimentet inkluderar kryddor, ris, mjöl, linser, pickles, fryst mat, snacks och drycker.",
    },
    {
        question: "Vilka öppettider har er butik?",
        answer: "Vår Bandhagen-butik har öppet måndag–fredag 10:00–20:00 och lördag–söndag 11:00–19:00. Du kan också handla online dygnet runt på ideallivs.com.",
    },
];

const noFaqs = [
    {
        question: "Hvor kan jeg kjøpe indiske og pakistanske matvarer i Stockholm?",
        answer: "Ideal Indiska LIVS er Stockholms spesialbutikk for indiske og pakistanske dagligvarer, med adresse Bandhagsplan 4 i Bandhagen. Vi har over 1 500 autentiske produkter — premium Basmatiris, krydder, linser, frosne snacks og ferske varer — tilgjengelig online med rask levering.",
    },
    {
        question: "Leverer dere i Stockholm?",
        answer: "Ja. Vi tilbyr lokal levering i hele Stockholm. En leveringsavgift gjelder for alle bestillinger. Minimumsbestilling er 300 SEK. Samme-dag levering er tilgjengelig til nærliggende områder (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) for bestillinger lagt inn før kl. 16:00. Besøk vår leveringsinformasjonsside for gjeldende priser.",
    },
    {
        question: "Leverer dere indiske matvarer utenfor Stockholm og Sverige?",
        answer: "Ja. Vi sender til hele Sverige og Europa via DHL. Ingen minimumsbestillingsverdi for DHL-levering — priser beregnes ved kassen basert på din plassering og bestillingens vekt. Ingen tollgebyrer innen EU siden vi sender fra Sverige.",
    },
    {
        question: "Er produktene deres Halal-sertifiserte?",
        answer: "Ja. Vi tilbyr et bredt sortiment av Halal-sertifiserte pakkede varer, krydder og snacks. Vær oppmerksom på at vi for øyeblikket ikke fører fersk eller frossen halalkjøtt.",
    },
    {
        question: "Hvilke indiske og pakistanske merker selger dere?",
        answer: "Vi har over 150 pålitelige merker inkludert India Gate, Guard, Shan, National Foods, Haldiram's, Ashoka, Ahmed Foods, Rooh Afza, MDH, TRS og mange fler. Sortimentet dekker krydder, ris, mel, linser, pickles, fryst mat, snacks og drikke.",
    },
    {
        question: "Hva er åpningstidene deres?",
        answer: "Vår Bandhagen-butikk har åpent mandag–fredag 10:00–20:00 og lørdag–søndag 11:00–19:00. Du kan også handle på nett 24/7 på ideallivs.com.",
    },
];

const daFaqs = [
    {
        question: "Hvor kan jeg købe indiske og pakistanske dagligvarer i Stockholm?",
        answer: "Ideal Indiska LIVS er Stockholms specialforretning for indiske og pakistanske dagligvarer, beliggende på Bandhagsplan 4 i Bandhagen. Vi har over 1.500 autentiske produkter — premium Basmatiris, krydderier, linser, frosne snacks og friske varer — tilgængeligt online med hurtig levering.",
    },
    {
        question: "Leverer I i Stockholm?",
        answer: "Ja. Vi tilbyder lokal levering i hele Stockholm. Et leveringsgebyr gælder for alle bestillinger. Minimumsbestilling er 300 SEK. Samme-dag levering er tilgængeligt til nærliggende områder (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) for bestillinger afgivet inden kl. 16:00. Besøg vores leveringsinformationsside for aktuelle priser.",
    },
    {
        question: "Leverer I indiske dagligvarer uden for Stockholm og Sverige?",
        answer: "Ja. Vi sender til hele Sverige og Europa via DHL. Der er ingen minimumsbestillingsværdi for DHL-levering — priser beregnes ved kassen baseret på din placering og bestillingens vægt. Ingen toldsatser inden for EU, da vi sender fra Sverige.",
    },
    {
        question: "Er jeres produkter Halal-certificerede?",
        answer: "Ja. Vi tilbyder et bredt udvalg af Halal-certificerede pakkede fødevarer, krydderier og snacks. Bemærk, at vi i øjeblikket ikke fører frisk eller frossen halalkød.",
    },
    {
        question: "Hvilke indiske og pakistanske mærker fører I?",
        answer: "Vi fører over 150 betroede mærker, herunder India Gate, Guard, Shan, National Foods, Haldiram's, Ashoka, Ahmed Foods, Rooh Afza, MDH, TRS og mange flere. Sortimentet dækker krydderier, ris, mel, linser, pickles, frossen mad, snacks og drikkevarer.",
    },
    {
        question: "Hvad er jeres åbningstider?",
        answer: "Vores Bandhagen-butik har åbent mandag–fredag 10:00–20:00 og lørdag–søndag 11:00–19:00. Du kan også handle online 24/7 på ideallivs.com.",
    },
];

// ─── HomeFAQ component ─────────────────────────────────────────────────────────

function HomeFAQ({ locale }: { locale: string }) {
    const faqs = locale === 'sv' ? svFaqs : locale === 'no' ? noFaqs : locale === 'da' ? daFaqs : enFaqs;
    const heading = locale === 'sv'
        ? 'Vanliga frågor om Ideal Indiska LIVS'
        : locale === 'no'
        ? 'Vanlige spørsmål om Ideal Indiska LIVS'
        : locale === 'da'
        ? 'Ofte stillede spørgsmål om Ideal Indiska LIVS'
        : 'Frequently Asked Questions';
    const subheading = locale === 'sv'
        ? 'Allt du behöver veta om vår butik, leverans och sortiment.'
        : locale === 'no'
        ? 'Alt du trenger å vite om vår butikk, levering og sortiment.'
        : locale === 'da'
        ? 'Alt hvad du behøver at vide om vores butik, levering og sortiment.'
        : 'Everything you need to know about our store, delivery, and products.';

    return (
        <section className="py-12 border-t bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="font-heading font-bold mb-2 text-foreground" style={{ fontSize: '25px' }}>
                    {heading}
                </h2>
                <p className="text-muted-foreground mb-8" style={{ fontSize: '15.13px' }}>
                    {subheading}
                </p>
                <div className="divide-y divide-border">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group py-4">
                            <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                                <span className="font-medium text-foreground" style={{ fontSize: '15.13px' }}>
                                    {faq.question}
                                </span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 text-muted-foreground leading-relaxed" style={{ fontSize: '14.31px' }}>
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;

    if (locale === 'sv') {
        return {
            title: "Indiska & Pakistanska Matvaror Stockholm | Ideal Indiska LIVS",
            description: "Stockholms bästa indiska & pakistanska livsmedelsbutik. Handla premium Basmati-ris, kryddor & färska produkter. Snabb leverans i hela Europa.",
            alternates: {
                canonical: "https://www.ideallivs.com/sv",
                languages: {
                    'en': 'https://www.ideallivs.com',
                    'sv': 'https://www.ideallivs.com/sv',
                    'nb': 'https://www.ideallivs.com/no',
                    'da': 'https://www.ideallivs.com/da',
                    'x-default': 'https://www.ideallivs.com',
                },
            },
            openGraph: {
                title: "Ideal Indiska LIVS - Indiska & Pakistanska Matvaror i Stockholm",
                description: "Handla indisk, pakistansk och internationell mat online. Snabb leverans i Stockholm, Göteborg och Malmö — och med DHL till hela Sverige och Europa.",
                url: "https://www.ideallivs.com/sv",
                siteName: "Ideal Indiska LIVS",
                locale: "sv_SE",
                type: "website",
            },
        };
    }

    if (locale === 'no') {
        return {
            title: "Indiske & Pakistanske Dagligvarer Stockholm | Ideal Indiska LIVS",
            description: "Stockholms beste indiske & pakistanske dagligvarebutikk. Handle premium Basmatiris, krydder & ferske varer. Rask levering i hele Europa.",
            alternates: {
                canonical: "https://www.ideallivs.com/no",
                languages: {
                    'en': 'https://www.ideallivs.com',
                    'sv': 'https://www.ideallivs.com/sv',
                    'nb': 'https://www.ideallivs.com/no',
                    'da': 'https://www.ideallivs.com/da',
                    'x-default': 'https://www.ideallivs.com',
                },
            },
            openGraph: {
                title: "Ideal Indiska LIVS - Indiske & Pakistanske Dagligvarer i Stockholm",
                description: "Bestill indisk, pakistansk og internasjonal mat på nett. Rask levering i Stockholm, Göteborg og Malmö — og med DHL til hele Sverige og Europa.",
                url: "https://www.ideallivs.com/no",
                siteName: "Ideal Indiska LIVS",
                locale: "nb_NO",
                type: "website",
            },
        };
    }

    if (locale === 'da') {
        return {
            title: "Indiske & Pakistanske Dagligvarer Stockholm | Ideal Indiska LIVS",
            description: "Stockholms bedste indiske & pakistanske dagligvarebutik. Shop premium Basmatiris, krydderier & friske varer. Hurtig levering i hele Europa.",
            alternates: {
                canonical: "https://www.ideallivs.com/da",
                languages: {
                    'en': 'https://www.ideallivs.com',
                    'sv': 'https://www.ideallivs.com/sv',
                    'nb': 'https://www.ideallivs.com/no',
                    'da': 'https://www.ideallivs.com/da',
                    'x-default': 'https://www.ideallivs.com',
                },
            },
            openGraph: {
                title: "Ideal Indiska LIVS - Indiske & Pakistanske Dagligvarer i Stockholm",
                description: "Bestil indisk, pakistansk og international mad online. Hurtig levering i Stockholm, Göteborg og Malmö — og med DHL til hele Sverige og Europa.",
                url: "https://www.ideallivs.com/da",
                siteName: "Ideal Indiska LIVS",
                locale: "da_DK",
                type: "website",
            },
        };
    }

    // English (default)
    return {
        title: "Indian Grocery Online Sweden — Shop & Delivery | Ideal Indiska LIVS",
        description: "Buy authentic Indian & Pakistani groceries online in Stockholm. Premium Basmati rice, spices, lentils & snacks. Same-day delivery in Stockholm, DHL shipping to Gothenburg, Malmö & across Europe.",
        alternates: {
            canonical: "https://www.ideallivs.com",
            languages: {
                'en': 'https://www.ideallivs.com',
                'sv': 'https://www.ideallivs.com/sv',
                'nb': 'https://www.ideallivs.com/no',
                'da': 'https://www.ideallivs.com/da',
                'x-default': 'https://www.ideallivs.com',
            },
        },
    };
}

export default async function LocaleHomePage({ params }: PageProps) {
    const { locale } = await params;

    // Enable static rendering for this locale
    setRequestLocale(locale);

    // Get translations
    const t = await getTranslations('home');

    // Fetch more categories to allow for manual filtering/ordering
    const [categoriesResAll, trendingRes, newArrivalsRes, dealsRes, haldiramRes, freshProduceRes] = await Promise.all([
        getProductCategories({ per_page: 12, orderby: 'count', order: 'desc', parent: 0 }),
        getProducts({ per_page: 8, orderby: 'popularity' }),
        getProducts({ per_page: 8, orderby: 'date' }),
        getProducts({ per_page: 8, on_sale: true }),
        getProducts({ per_page: 8, brand: 'hr' }),
        getProducts({ per_page: 8, category: 'fresh-produce' }),
    ]);

    // Filter out fragrance and replace with fresh-produce if needed
    let categories = (categoriesResAll || [])
        .filter(c => c.slug !== 'fragrance')
        .slice(0, 6);

    // Ensure fresh-produce is in there (user specifically requested this)
    const freshProduceCategory = (categoriesResAll || []).find(c => c.slug === 'fresh-produce');
    if (freshProduceCategory && !categories.find(c => c.slug === 'fresh-produce')) {
        categories[categories.length - 1] = freshProduceCategory;
    }

    const trendingProducts = trendingRes.data || [];
    const newProducts = newArrivalsRes.data || [];
    const dealProducts = dealsRes.data || [];
    const haldiramProducts = haldiramRes?.data || [];
    const freshProduceProducts = freshProduceRes?.data || [];

    // Locale-aware links
    const linkPrefix = locale !== 'en' ? `/${locale}` : '';
    const pageUrl = locale !== 'en' ? `${BASE_URL}/${locale}` : BASE_URL;

    return (
        <main className="flex min-h-screen flex-col bg-background overflow-x-hidden max-w-full">
            {/* 1. Hero — 2-col Nordic layout */}
            <Hero />

            {/* 2. Top Categories — 7-col tile grid */}
            <CategoryGrid categories={categories} />

            {/* 3. Today's Best Deals — filter tabs + product grid */}
            <DealsSection products={dealProducts} moreLink={`${linkPrefix}/deals`} />

            {/* 4. Trending Products */}
            <ProductShowcase
                title={t('customerFavorites')}
                products={trendingProducts}
                moreLink={`${linkPrefix}/shop?sort=bestsellers`}
            />

            {/* 5. New Arrivals */}
            <ProductShowcase
                title={t('freshArrivals')}
                products={newProducts}
                moreLink={`${linkPrefix}/shop?sort=new`}
            />

            {/* 6. Haldiram Section */}
            <ProductShowcase
                title={t('haldiramSection')}
                products={haldiramProducts}
                moreLink={`${linkPrefix}/brand/hr`}
            />

            {/* 7. Fresh Produce */}
            <ProductShowcase
                title={t('freshProduce')}
                products={freshProduceProducts}
                moreLink={`${linkPrefix}/product-category/fresh-produce`}
            />

            {/* 8. Brands Strip */}
            <BrandsStrip />

            {/* 9. Customer Reviews */}
            <ReviewsSection />

            {/* 10. SEO & Brand Content */}
            <SeoContent />

            {/* 11. FAQ Section — machine-liftable for Google AI Overview */}
            <HomeFAQ locale={locale} />

            {/* 12. Features/Benefits */}
            <Features />

            {/* ========== SEO STRUCTURED DATA ========== */}
            {/* Note: Organization and WebSite schemas are in layout.tsx (global) */}

            {/* CollectionPage Q&A Schema (replaces FAQPage — restricted to gov/health since Aug 2023) */}
            <SchemaScript
                id="homepage-faq-schema"
                schema={faqCollectionPageSchema({
                    pageUrl: pageUrl,
                    faqs: locale === 'sv' ? svFaqs : locale === 'no' ? noFaqs : locale === 'da' ? daFaqs : enFaqs,
                })}
            />

            {/* WebPage Schema - Homepage specific context */}
            <SchemaScript
                id="homepage-webpage-schema"
                schema={webpageSchema({
                    name: locale === 'sv' ? "Ideal Indiska LIVS - Hem" : locale === 'no' ? "Ideal Indiska LIVS - Hjem" : locale === 'da' ? "Ideal Indiska LIVS - Hjem" : "Ideal Indiska LIVS - Home",
                    url: pageUrl,
                    description: locale === 'sv'
                        ? "Stockholms bästa indiska & pakistanska livsmedelsbutik."
                        : locale === 'no'
                        ? "Stockholms beste indiske og pakistanske dagligvarebutikk."
                        : locale === 'da'
                        ? "Stockholms bedste indiske og pakistanske dagligvarebutik."
                        : "Stockholm's best Indian & Pakistani grocery store.",
                    websiteId: `${BASE_URL}/#website`,
                    language: locale === 'sv' ? "sv-SE" : locale === 'no' ? "nb-NO" : locale === 'da' ? "da-DK" : "en",
                })}
            />

            {/* Featured Categories ItemList */}
            <SchemaScript
                id="homepage-categories-schema"
                schema={enhancedItemListSchema({
                    name: locale === 'sv' ? "Populära produktkategorier" : locale === 'no' ? "Populære produktkategorier" : locale === 'da' ? "Populære produktkategorier" : "Popular Product Categories",
                    description: locale === 'sv'
                        ? "Utforska våra mest populära kategorier"
                        : locale === 'no'
                        ? "Utforsk våre mest populære kategorier"
                        : locale === 'da'
                        ? "Udforsk vores mest populære kategorier"
                        : "Browse our most popular grocery categories",
                    url: pageUrl,
                    items: categories.slice(0, 6).map(c => ({
                        url: `${BASE_URL}/shop/${c.slug}`,
                        name: c.name,
                        image: c.image?.src,
                    })),
                    itemListOrder: 'ItemListUnordered',
                })}
            />
        </main>
    );
}
