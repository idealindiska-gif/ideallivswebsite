"use client";

import { Link } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategoryFull } from "@/types/woocommerce";

interface CategoryNavStripProps {
  categories: ProductCategoryFull[];
}

export function CategoryNavStrip({ categories }: CategoryNavStripProps) {
  const pathname = usePathname();

  const isActive = (slug: string) =>
    pathname.includes(`/product-category/${slug}`);

  const dealsActive = pathname.includes("/deals");

  return (
    <nav
      aria-label="Shop categories"
      className="hidden lg:block w-full bg-white border-b border-border/60 sticky top-[var(--header-height,72px)] z-20"
    >
      <div
        className="max-w-[1380px] mx-auto px-8 flex items-center gap-0 h-12 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Deals link — always first */}
        <Link
          href="/deals"
          className={cn(
            "flex items-center gap-1.5 px-4 h-12 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0",
            dealsActive
              ? "text-destructive border-destructive"
              : "text-destructive/80 border-transparent hover:text-destructive hover:border-destructive/40"
          )}
        >
          <Percent className="h-3 w-3" />
          Deals
        </Link>

        <div className="h-5 w-px bg-border/60 mx-1 shrink-0" />

        {/* Dynamic categories */}
        {categories
          .filter((c) => c.count && c.count > 0)
          .slice(0, 12)
          .map((cat) => (
            <Link
              key={cat.id}
              href={`/product-category/${cat.slug}`}
              className={cn(
                "flex items-center px-4 h-12 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                isActive(cat.slug)
                  ? "text-primary border-primary font-semibold"
                  : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/40"
              )}
            >
              {cat.name}
            </Link>
          ))}
      </div>
    </nav>
  );
}
