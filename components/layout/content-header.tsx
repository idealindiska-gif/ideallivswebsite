"use client";

import { Menu, X } from "lucide-react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { useSidebar } from "./mobile-sidebar-toggle";
import { useTranslations } from 'next-intl';
import { CartIcon } from "@/components/cart/cart-icon";
import { UserNav } from "@/components/layout/user-nav";
import { DeliveryLocationSelector } from "@/components/ui/delivery-location-selector";
import { SmartSearch } from "@/components/search/smart-search";

export function ContentHeader() {
  const nav = useTranslations('navigation');
  const ts = useTranslations('search');
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="sticky top-0 lg:top-[10px] z-30 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 h-14 gap-4 bg-background/70 backdrop-blur-md">

        {/* Search Bar - Center - with autocomplete & intent detection */}
        <div className="flex-1 max-w-2xl mx-auto w-full">
          <SmartSearch
            placeholder={ts('searchPlaceholderLong')}
            className="w-full"
          />
        </div>

        {/* Login/Signup & Cart - Right */}
        <div className="flex items-center gap-6 ml-4 shrink-0">

          {/* Delivery Location & Currency Selector */}
          <div className="hidden xl:block">
            <DeliveryLocationSelector variant="header" />
          </div>

          <div className="h-8 w-px bg-border mx-2" />

          {/* User Nav */}
          <UserNav />

          {/* Cart */}
          <CartIcon />
        </div>
      </div>

      {/* Navigation Menu - Below Search Bar (Desktop Only) */}
      <div className="hidden lg:block border-t border-border/50">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-center gap-8 py-3">
            <Link
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {nav('shop')}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {nav('blog')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {nav('aboutUs')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {nav('contact')}
            </Link>

            {/* Delivery Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                {nav('deliveryInfo')}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/delivery-information"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {nav('stockholmDelivery')}
                  </Link>
                  <Link
                    href="/europe-delivery"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {nav('europeDelivery')}
                  </Link>
                  <Link
                    href="/delivery-goteborg-malmo"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {nav('goteborgMalmoDelivery')}
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col bg-background">
        {/* Top Row: Menu, Logo, Cart */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          {/* Menu Button */}
          <button
            onClick={toggle}
            className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-28 h-14 sm:w-32 sm:h-16">
              <Image
                src="https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png"
                alt="Ideal Livs"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Cart */}
          <CartIcon />
        </div>

        {/* Search Bar - Bottom Row - with autocomplete & intent detection */}
        <div className="px-4 py-3 bg-muted/20">
          <SmartSearch
            placeholder={ts('searchProducts')}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
}
