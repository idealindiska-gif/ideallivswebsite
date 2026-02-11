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

// Revalidate page every hour
export const revalidate = 3600;

const BASE_URL = "https://www.ideallivs.com";

export const metadata: Metadata = {
  title: "Ideal Indiska LIVS - Indian & Pakistani Groceries Stockholm",
  description: "Stockholm's best Indian & Pakistani grocery store. Shop premium Basmati rice, spices, Halal meat & fresh produce. Fast delivery Europe-wide.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Ideal Indiska LIVS - Indian & Pakistani Groceries in Stockholm",
    description: "Your trusted source for authentic Indian and Pakistani groceries in Stockholm. Fresh produce, aromatic spices, premium Basmati rice, and halal meat delivered to your door.",
    url: BASE_URL,
    siteName: "Ideal Indiska LIVS",
    images: [
      {
        url: "https://crm.ideallivs.com/wp-content/uploads/2025/08/delivery-cover-post.png",
        width: 1200,
        height: 630,
        alt: "Ideal Indiska LIVS Store - Indian & Pakistani Groceries",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Indiska LIVS - Indian & Pakistani Groceries in Stockholm",
    description: "Your trusted source for authentic Indian and Pakistani groceries in Stockholm. Fresh produce, aromatic spices, premium Basmati rice, and halal meat delivered to your door.",
    images: ["https://crm.ideallivs.com/wp-content/uploads/2025/08/delivery-cover-post.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function HomePage() {
  // Fetch data in parallel
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

  return (
    <main className="flex min-h-screen flex-col bg-background pb-20 overflow-x-hidden max-w-full">
      {/* Hidden H1 for SEO - Describes the main topic of the page */}
      <h1 className="sr-only">Ideal Indiska LIVS - Indian & Pakistani Grocery Store Stockholm</h1>

      {/* 1. New Hero: Promotion/Deals Grid */}
      <PromotionGrid promotionProducts={dealProducts} />

      {/* 2. Top Categories */}
      <CategoryGrid categories={categories} />

      {/* 3. Special Offers */}
      <ProductShowcase
        title="Special Offers on Indian & Pakistani Groceries"
        products={dealProducts}
        moreLink="/deals"
      />

      {/* 5. Banner Strip */}
      <BannerStrip />

      {/* 6. Trending Products */}
      <ProductShowcase
        title="Customer Favorites - Most Popular Items"
        products={trendingProducts}
        moreLink="/shop?sort=bestsellers"
      />

      {/* 7. Haldiram Section */}
      <ProductShowcase
        title="Haldiram's - Authentic Indian Snacks"
        products={haldiramProducts}
        moreLink="/brand/haldiram"
      />

      {/* 8. New Arrivals */}
      <ProductShowcase
        title="Fresh Arrivals - New Stock Just In"
        products={newProducts}
        moreLink="/shop?sort=new"
      />

      {/* 9. Fresh Produce Section */}
      <ProductShowcase
        title="Fresh Produce - Fruits & Vegetables"
        products={freshProduceProducts}
        moreLink="/product-category/fresh-produce"
      />

      {/* 11. SEO & Brand Content (NEW) */}
      <SeoContent />

      {/* 12. Features/Benefits Section */}
      <Features />

      {/* ========== SEO STRUCTURED DATA ========== */}
      {/* Note: Organization and WebSite schemas are in layout.tsx (global) */}

      {/* WebPage Schema - Homepage specific context */}
      <SchemaScript
        id="homepage-webpage-schema"
        schema={webpageSchema({
          name: "Ideal Indiska LIVS - Home",
          url: BASE_URL,
          description: "Stockholm's best Indian & Pakistani grocery store. Shop premium Basmati rice, aromatic spices, Halal meat, and fresh produce.",
          websiteId: `${BASE_URL}/#website`,
          language: "sv-SE",
        })}
      />

      {/* Featured Categories ItemList */}
      <SchemaScript
        id="homepage-categories-schema"
        schema={enhancedItemListSchema({
          name: "Popular Product Categories",
          description: "Browse our most popular grocery categories",
          url: BASE_URL,
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
