"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/woocommerce";

interface DealsSectionProps {
  products: Product[];
  moreLink?: string;
}

const TABS = [
  { label: "All Deals", slug: null },
  { label: "Spices", slug: "spices" },
  { label: "Rice & Grains", slug: "rice-grains" },
  { label: "Snacks", slug: "snacks" },
  { label: "Drinks", slug: "drinks" },
];

export function DealsSection({
  products,
  moreLink = "/deals",
}: DealsSectionProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!products || products.length === 0) return null;

  const filtered =
    activeTab === null
      ? products
      : products.filter((p) =>
          p.categories?.some(
            (c) =>
              c.slug === activeTab ||
              c.name.toLowerCase().includes(activeTab.split("-")[0])
          )
        );

  // Fall back to all products if filter returns nothing
  const display = filtered.length > 0 ? filtered : products;

  return (
    <section className="bg-background pt-2 pb-8">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-[18px] text-foreground tracking-[-0.3px]">
            Today&apos;s Best Deals
          </h2>
          <Link
            href={moreLink}
            className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            All Deals
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto mb-5"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.slug)}
              className={
                activeTab === tab.slug
                  ? "flex-none px-3.5 py-1.5 rounded-lg text-[12px] font-semibold bg-primary text-primary-foreground border border-primary"
                  : "flex-none px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-muted-foreground bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          }}
        >
          {display.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
