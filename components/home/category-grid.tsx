"use client";

import { Link } from "@/lib/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { decodeHtmlEntities } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: { src: string; alt: string } | null;
  count?: number;
}

interface CategoryGridProps {
  categories: Category[];
}

// Solid color fallbacks (no emoji) — one per slot
const fallbackColors = [
  "#d4e8da",
  "#dde9f5",
  "#f5e4d4",
  "#e8d4e8",
  "#f5f0d4",
  "#d4e8e8",
  "#e8d4d4",
  "#d8e8d4",
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  if (!categories || categories.length === 0) return null;

  const visible = categories.slice(0, 7);

  return (
    <section className="bg-background pt-1 pb-6">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-[18px] text-foreground tracking-[-0.3px]">
            {t("topCategories")}
          </h2>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {tc("viewAll")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Desktop: 7-col grid — Mobile: horizontal scroll */}
        <div className="hidden lg:grid grid-cols-7 gap-2.5">
          {visible.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

        <div
          className="lg:hidden flex gap-2.5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.slice(0, 10).map((cat, i) => (
            <div key={cat.id} className="flex-none w-[110px]">
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  return (
    <Link
      href={`/product-category/${cat.slug}`}
      className="group flex flex-col items-center gap-2 bg-card rounded-xl border border-border p-3 hover:border-primary/50 hover:shadow-md transition-all duration-200"
    >
      {/* Image / fallback */}
      <div
        className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
        style={
          !cat.image
            ? { background: fallbackColors[index % fallbackColors.length] }
            : undefined
        }
      >
        {cat.image ? (
          <Image
            src={cat.image.src}
            alt={cat.image.alt || cat.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="56px"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-[22px] text-foreground/30">
            {decodeHtmlEntities(cat.name).charAt(0)}
          </span>
        )}
      </div>

      <span className="text-[11px] font-semibold text-foreground text-center leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {decodeHtmlEntities(cat.name)}
      </span>
    </Link>
  );
}
