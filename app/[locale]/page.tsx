import { CategoryGrid } from "@/components/home/category-grid";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { BannerStrip } from "@/components/home/banner-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Features } from "@/components/home/features";
import { SeoContent } from "@/components/home/seo-content";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { webpageSchema } from "@/lib/schema/website";
import { enhancedItemListSchema } from "@/lib/schema/collection";
import { faqSchema } from "@/lib/schema/faq";
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ChevronDown } from "lucide-react";

// ISR: Revalidate every 2 hours
export const revalidate = 7200;

const BASE_URL = "https://www.ideallivs.com";

// ─── FAQ data (machine-liftable for Google AI Overview) ───────────────────────

const enFaqs = [
    {
        question: "Where can I buy Indian and Pakistani groceries in Stockholm?",
        answer: "Ideal Indiska LIVS is Stockholm's specialist Indian and Pakistani grocery store, located at Bandhagsplan 4 in Bandhagen. We stock over 1,500 authentic products including premium Basmati rice, spices, Halal meat, frozen snacks, and fresh produce — all available online with fast delivery.",
    },
    {
        question: "Do you offer free delivery in Stockholm?",
        answer: "Yes. Orders of 500 SEK or more receive free home delivery anywhere in Stockholm. Orders between 300–499 SEK have a flat 30 SEK delivery fee. Minimum order is 300 SEK. Same-day delivery is available to nearby areas (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) for orders placed before 4 PM.",
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
        answer: "Ideal Indiska LIVS är Stockholms specialbutik för indiska och pakistanska livsmedel, med adress Bandhagsplan 4 i Bandhagen. Vi har över 1 500 autentiska produkter — premium Basmati-ris, kryddor, halaltkött, frysta snacks och färska varor — tillgängliga online med snabb leverans.",
    },
    {
        question: "Erbjuder ni fri leverans i Stockholm?",
        answer: "Ja. Beställningar på 500 kr eller mer får gratis hemleverans inom hela Stockholm. Beställningar på 300–499 kr har en fast avgift på 30 kr. Minimibeställning är 300 kr. Samma-dagleverans finns till närliggande områden (Bandhagen, Hagsätra, Högdalen, Farsta, Enskede, Huddinge) för beställningar lagda före 16:00.",
    },
    {
        question: "Levererar ni utanför Stockholm och Sverige?",
        answer: "Ja. Vi skickar till hela Sverige och Europa via DHL. Inget minimivärde krävs för DHL-leverans — priset beräknas i kassan. Inga tullavgifter tillkommer inom EU eftersom vi skickar från Sverige.",
    },
    {
        question: "Är era produkter Halal-certifierade?",
        answer: "Ja. Vi har ett dedikerat sortiment av 100% Halal-certifierat kött, fjäderfä och förpackade livsmedel. Alla Halal-produkter är tydligt märkta i vår webbutik och i vår Bandhagen-butik.",
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

// ─── HomeFAQ component ─────────────────────────────────────────────────────────

function HomeFAQ({ locale }: { locale: string }) {
    const isSv = locale === 'sv';
    const faqs = isSv ? svFaqs : enFaqs;
    const heading = isSv
        ? 'Vanliga frågor om Ideal Indiska LIVS'
        : 'Frequently Asked Questions';
    const subheading = isSv
        ? 'Allt du behöver veta om vår butik, leverans och sortiment.'
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
            description: "Stockholms bästa indiska & pakistanska livsmedelsbutik. Handla premium Basmati-ris, kryddor, halaltkött & färska produkter. Snabb leverans i hela Europa.",
            alternates: {
                canonical: "https://www.ideallivs.com/sv",
                languages: {
                    'en': 'https://www.ideallivs.com',
                    'sv': 'https://www.ideallivs.com/sv',
                },
            },
            openGraph: {
                title: "Ideal Indiska LIVS - Indiska & Pakistanska Matvaror i Stockholm",
                description: "Din pålitliga källa för autentiska indiska och pakistanska livsmedel i Stockholm. Färska produkter, aromatiska kryddor, premium Basmati-ris och halaltkött levererat till din dörr.",
                url: "https://www.ideallivs.com/sv",
                siteName: "Ideal Indiska LIVS",
                locale: "sv_SE",
                type: "website",
            },
        };
    }

    // English (default)
    return {
        title: "Indian & Pakistani Groceries Stockholm | Ideal Indiska LIVS",
        description: "Stockholm's best Indian & Pakistani grocery store. Shop premium Basmati rice, spices, Halal meat & fresh produce. Fast delivery Europe-wide.",
        alternates: {
            canonical: "https://www.ideallivs.com",
            languages: {
                'en': 'https://www.ideallivs.com',
                'sv': 'https://www.ideallivs.com/sv',
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
        getProducts({ per_page: 8, brand: 'haldiram' }),
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
    const linkPrefix = locale === 'sv' ? '/sv' : '';
    const pageUrl = locale === 'sv' ? `${BASE_URL}/sv` : BASE_URL;

    return (
        <main className="flex min-h-screen flex-col bg-background pb-20 overflow-x-hidden max-w-full">
            {/* 1. Promotion Cards (first card contains the page H1) */}
            <PromotionGrid promotionProducts={dealProducts} />

            {/* 2. Top Categories */}
            <CategoryGrid categories={categories} />

            {/* 3. Special Offers */}
            <ProductShowcase
                title={t('specialOffers')}
                products={dealProducts}
                moreLink={`${linkPrefix}/deals`}
            />

            {/* 3. Banner Strip */}
            <BannerStrip />

            {/* 4. Trending Products */}
            <ProductShowcase
                title={t('customerFavorites')}
                products={trendingProducts}
                moreLink={`${linkPrefix}/shop?sort=bestsellers`}
            />

            {/* 5. Haldiram Section */}
            <ProductShowcase
                title={t('haldiramSection')}
                products={haldiramProducts}
                moreLink={`${linkPrefix}/brand/haldiram`}
            />

            {/* 6. New Arrivals */}
            <ProductShowcase
                title={t('freshArrivals')}
                products={newProducts}
                moreLink={`${linkPrefix}/shop?sort=new`}
            />

            {/* 7. Fresh Produce Section */}
            <ProductShowcase
                title={t('freshProduce')}
                products={freshProduceProducts}
                moreLink={`${linkPrefix}/product-category/fresh-produce`}
            />

            {/* 8. SEO & Brand Content */}
            <SeoContent />

            {/* 9. FAQ Section — machine-liftable for Google AI Overview */}
            <HomeFAQ locale={locale} />

            {/* 10. Features/Benefits Section */}
            <Features />

            {/* ========== SEO STRUCTURED DATA ========== */}
            {/* Note: Organization and WebSite schemas are in layout.tsx (global) */}

            {/* FAQPage Schema */}
            <SchemaScript
                id="homepage-faq-schema"
                schema={faqSchema({
                    pageUrl: pageUrl,
                    faqs: locale === 'sv' ? svFaqs : enFaqs,
                })}
            />

            {/* WebPage Schema - Homepage specific context */}
            <SchemaScript
                id="homepage-webpage-schema"
                schema={webpageSchema({
                    name: locale === 'sv' ? "Ideal Indiska LIVS - Hem" : "Ideal Indiska LIVS - Home",
                    url: pageUrl,
                    description: locale === 'sv'
                        ? "Stockholms bästa indiska & pakistanska livsmedelsbutik."
                        : "Stockholm's best Indian & Pakistani grocery store.",
                    websiteId: `${BASE_URL}/#website`,
                    language: locale === 'sv' ? "sv-SE" : "en",
                })}
            />

            {/* Featured Categories ItemList */}
            <SchemaScript
                id="homepage-categories-schema"
                schema={enhancedItemListSchema({
                    name: locale === 'sv' ? "Populära produktkategorier" : "Popular Product Categories",
                    description: locale === 'sv'
                        ? "Utforska våra mest populära kategorier"
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
