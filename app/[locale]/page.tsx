import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { BannerStrip } from "@/components/home/banner-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Features } from "@/components/home/features";
import { SeoContent } from "@/components/home/seo-content";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { SchemaScript } from "@/lib/schema/schema-script";
import { idealIndiskaOrganizationSchemaFull } from "@/lib/schema/organization";
import { idealIndiskaWebsiteSchema, webpageSchema } from "@/lib/schema/website";
import { enhancedItemListSchema } from "@/lib/schema/collection";
import { setRequestLocale, getTranslations } from 'next-intl/server';

// ISR: Revalidate every 2 hours
export const revalidate = 7200;

const BASE_URL = "https://www.ideallivs.com";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;

    if (locale === 'sv') {
        return {
            title: "Ideal Indiska LIVS | Indiska & Pakistanska Matvaror Stockholm",
            description: "Stockholms bästa indiska & pakistanska livsmedelsbutik. Handla premium Basmati-ris, aromatiska kryddor, halaltkött och färska produkter. Snabb leverans i Stockholm & Europa.",
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
        title: "Ideal Indiska LIVS | Authentic Indian & Pakistani Groceries Stockholm",
        description: "Stockholm's best Indian & Pakistani grocery store. Shop premium Basmati rice, aromatic spices, Halal meat, and fresh produce. Fast delivery in Stockholm & Europe-wide.",
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
            {/* 1. Hero Section */}
            <Hero
                title={t('heroTitle')}
                subtitle={t('heroSubtitle')}
                badge={t('heroBadge')}
            />

            {/* 2. Features/Benefits Section */}
            <Features />

            {/* 3. Top Categories */}
            <CategoryGrid categories={categories} />

            {/* 4. Promotion/Deals Grid */}
            <PromotionGrid />

            {/* 5. Special Offers */}
            <ProductShowcase
                title={t('specialOffers')}
                products={dealProducts}
                moreLink={`${linkPrefix}/deals`}
            />

            {/* 6. Banner Strip */}
            <BannerStrip />

            {/* 7. Trending Products */}
            <ProductShowcase
                title={t('customerFavorites')}
                products={trendingProducts}
                moreLink={`${linkPrefix}/shop?sort=bestsellers`}
            />

            {/* 8. Haldiram Section */}
            <ProductShowcase
                title={t('haldiramSection')}
                products={haldiramProducts}
                moreLink={`${linkPrefix}/brand/haldiram`}
            />

            {/* 9. New Arrivals */}
            <ProductShowcase
                title={t('freshArrivals')}
                products={newProducts}
                moreLink={`${linkPrefix}/shop?sort=new`}
            />

            {/* 10. Fresh Produce Section */}
            <ProductShowcase
                title={t('freshProduce')}
                products={freshProduceProducts}
                moreLink={`${linkPrefix}/product-category/fresh-produce`}
            />

            {/* 11. SEO & Brand Content */}
            <SeoContent />

            {/* ========== SEO STRUCTURED DATA ========== */}

            {/* 1. Organization Schema - Full business information */}
            <SchemaScript
                id="homepage-org-schema"
                schema={idealIndiskaOrganizationSchemaFull()}
            />

            {/* 2. WebSite Schema - Enables Sitelinks Searchbox in Google */}
            <SchemaScript
                id="homepage-website-schema"
                schema={idealIndiskaWebsiteSchema()}
            />

            {/* 3. WebPage Schema - Homepage context */}
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

            {/* 4. Featured Categories ItemList */}
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

            {/* Note: Product ItemList schemas removed to avoid Google carousel validation errors */}
        </main>
    );
}
