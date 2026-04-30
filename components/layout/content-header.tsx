"use client";

import { Link } from "@/lib/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CartIcon } from "@/components/cart/cart-icon";
import { WishlistIcon } from "@/components/wishlist/wishlist-icon";
import { UserNav } from "@/components/layout/user-nav";
import { SmartSearch } from "@/components/search/smart-search";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import type { ProductCategoryFull } from "@/types/woocommerce";

interface ContentHeaderProps {
  categories?: ProductCategoryFull[];
}

const logoUrl =
  "https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png";

export function ContentHeader({ categories = [] }: ContentHeaderProps) {
  const ts = useTranslations("search");

  return (
    <header
      className="sticky top-0 z-30 w-full bg-white border-b border-border shadow-sm"
      style={{ "--header-height": "72px" } as React.CSSProperties}
    >
      {/* ── Desktop Header ──────────────────────────────── */}
      <div className="hidden lg:flex items-center gap-6 max-w-[1380px] mx-auto px-8 h-[72px]">

        {/* Logo */}
        <Link href="/" aria-label="Ideal Indiska LIVS Home" className="shrink-0">
          <div className="relative h-14 w-36">
            <Image
              src={logoUrl}
              alt="Ideal Indiska LIVS — Indian & Pakistani Groceries Stockholm"
              fill
              className="object-contain"
              sizes="144px"
              priority
            />
          </div>
        </Link>

        {/* Search bar — grows to fill space */}
        <div role="search" className="flex-1 max-w-[600px]">
          <SmartSearch
            placeholder={ts("searchPlaceholderLong")}
            className="w-full"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <LanguageSwitcher variant="compact" />
          <div className="h-6 w-px bg-border" />
          <UserNav />
          <WishlistIcon />
          <CartIcon />
        </div>
      </div>

      {/* ── Mobile Header ───────────────────────────────── */}
      <div className="lg:hidden flex flex-col bg-white">
        {/* Top row */}
        <div className="flex items-center justify-between px-4 h-[60px]">
          {/* Hamburger */}
          <MobileMenu />

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-28">
              <Image
                src={logoUrl}
                alt="Ideal Indiska LIVS"
                fill
                className="object-contain"
                priority
                sizes="112px"
              />
            </div>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher variant="icon" />
            <WishlistIcon />
            <CartIcon />
          </div>
        </div>

        {/* Search */}
        <div role="search" className="px-4 pb-3">
          <SmartSearch
            placeholder={ts("searchProducts")}
            className="w-full"
          />
        </div>

        {/* Mobile quick-nav strip */}
        <nav
          aria-label="Quick navigation"
          className="border-t border-border/40 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <MobileQuickNav />
        </nav>
      </div>
    </header>
  );
}

function MobileQuickNav() {
  const nav = useTranslations("navigation");

  const links = [
    { href: "/shop", label: nav("shop"), highlight: false },
    { href: "/deals", label: nav("dealsOffers"), highlight: true },
    { href: "/brands", label: nav("shopByBrands"), highlight: false },
    { href: "/blog", label: nav("blog"), highlight: false },
    { href: "/delivery-information", label: nav("deliveryInfo"), highlight: false },
    { href: "/about", label: nav("aboutUs"), highlight: false },
    { href: "/contact", label: nav("contact"), highlight: false },
  ];

  return (
    <ul role="list" className="flex items-center gap-1.5 px-3 py-2 w-max">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={
              link.highlight
                ? "flex items-center px-3 py-1.5 rounded-full bg-destructive/10 text-xs font-semibold text-destructive whitespace-nowrap"
                : "flex items-center px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
