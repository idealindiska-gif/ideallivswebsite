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
import { ChevronDown } from "lucide-react";
import type { ProductCategoryFull } from "@/types/woocommerce";

interface ContentHeaderProps {
  categories?: ProductCategoryFull[];
}

const logoUrl =
  "https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png";

export function ContentHeader({ categories = [] }: ContentHeaderProps) {
  const ts = useTranslations("search");
  const nav = useTranslations("navigation");

  return (
    <header
      className="sticky top-0 z-30 w-full bg-white border-b border-border shadow-sm"
      style={{ "--header-height": "112px" } as React.CSSProperties}
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

      {/* ── Desktop Nav Strip ─────────────────────────────── */}
      <div className="hidden lg:block border-t border-border/40">
        <nav aria-label="Main navigation" className="max-w-[1380px] mx-auto px-8 h-10 flex items-center gap-0.5">

          <NavItem href="/shop">{nav("allProducts")}</NavItem>
          <NavItem href="/deals" variant="deals">{nav("dealsOffers")}</NavItem>
          <NavItem href="/brands">{nav("brands")}</NavItem>
          <NavItem href="/prepared-meals">{nav("preparedMeals")}</NavItem>
          <NavItem href="/blog">{nav("blog")}</NavItem>

          {/* Delivery dropdown */}
          <div className="relative group h-10 flex items-center">
            <button
              className="flex items-center gap-1 px-3 h-10 text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              aria-haspopup="true"
            >
              {nav("delivery")}
              <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {/* -mt-1 overlaps 4px with the button row so the hover bridge has no gap */}
            <div className="absolute top-full -mt-1 left-0 hidden group-hover:block z-50 min-w-[230px]">
              <div className="pt-1">
                <div className="bg-white rounded-lg border border-border shadow-xl py-1.5">
                  <DropLink href="/delivery-information">{nav("stockholmDelivery")}</DropLink>
                  <DropLink href="/delivery-goteborg-malmo">{nav("goteborgMalmoDelivery")}</DropLink>
                  <DropLink href="/delivery-kalmar">{nav("kalmarDelivery")}</DropLink>
                  <DropLink href="/norway-delivery">{nav("norwayDelivery")}</DropLink>
                  <DropLink href="/denmark-delivery">{nav("denmarkDelivery")}</DropLink>
                  <DropLink href="/europe-delivery">{nav("europeDelivery")}</DropLink>
                </div>
              </div>
            </div>
          </div>

          <NavItem href="/about">{nav("ourStory")}</NavItem>
          <NavItem href="/contact">{nav("contactUs")}</NavItem>

        </nav>
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
    { href: "/prepared-meals", label: nav("preparedMeals"), highlight: false },
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

function NavItem({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "deals";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "deals"
          ? "flex items-center px-3 h-10 text-[13px] font-semibold text-destructive/80 hover:text-destructive transition-colors whitespace-nowrap"
          : "flex items-center px-3 h-10 text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
      }
    >
      {children}
    </Link>
  );
}

function DropLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-[13px] text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
