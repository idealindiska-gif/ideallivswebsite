import "./globals.css";

import { Inter as FontSans, Montserrat as FontHeading } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TopInfoBar } from "@/components/layout/top-info-bar";
import { SchemaScript } from "@/lib/schema/schema-script";
import { idealIndiskaWebsiteSchema, schemaGraph, idealIndiskaOrganizationSchemaFull, idealLivsLocalBusinessSchema, siteNavigationSchema } from "@/lib/schema";
import { GoogleTagManager, GoogleTagManagerNoScript, FacebookPixel } from "@/components/analytics";
import { VerticalSidebar } from "@/components/layout/vertical-sidebar";
import { ContentHeader } from "@/components/layout/content-header";
import { Footer } from "@/components/layout/footer";
import { GeoMetaTags } from "@/components/seo/geo-meta-tags";
import { HreflangTags } from "@/components/seo/hreflang-tags";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { ExitSurveyWrapper } from "@/components/feedback/exit-survey-wrapper";

import { getProductCategories } from "@/lib/woocommerce";

import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true, // Better font fallback
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const fontHeading = FontHeading({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_name,
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "JHCIpEz_IWYNdnNQGCkUKVQ8tiUre1hcCOqcSNhKlmQ",
  },
  // OpenGraph with Swedish locale
  openGraph: {
    type: "website",
    locale: "en_SE",
    alternateLocale: ["sv_SE"],
    url: siteConfig.site_domain,
    siteName: siteConfig.site_name,
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [
      {
        url: "https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg",
        width: 1200,
        height: 630,
        alt: "Ideal Indiska LIVS - Indian & Pakistani Groceries in Stockholm",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: ["https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg"],
  },
  // Additional metadata
  keywords: [
    "Indian grocery store Stockholm",
    "Pakistani grocery online Sweden",
    "buy Indian groceries online",
    "halal meat delivery Stockholm",
    "basmati rice Stockholm",
    "Indian spices online Sweden",
    "grocery delivery Stockholm",
    "Indian food store near me",
    "Pakistani food Stockholm",
    "halal grocery delivery Europe",
  ],
  authors: [{ name: "Ideal Indiska LIVS" }],
  creator: "Ideal Indiska LIVS",
  publisher: "Ideal Indiska LIVS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Viewport configuration for mobile devices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getProductCategories({ parent: 0 });

  // Detect locale from next-intl (en = no prefix, sv = /sv/ prefix)
  const locale = await getLocale();
  const messages = await getMessages();

  // Get current path for hreflang tags
  const headersList = await headers();
  const currentPath = headersList.get('x-next-url') || headersList.get('x-invoke-path') || '/';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Critical preconnects - Most important first */}
        <link rel="preconnect" href="https://crm.ideallivs.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://crm.ideallivs.com" />

        {/* Font preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Analytics preconnects - Lower priority */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />

        {/* Preload critical hero image */}
        <link
          rel="preload"
          as="image"
          href="https://crm.ideallivs.com/wp-content/uploads/2025/08/delivery-cover-post.png"
          fetchPriority="high"
        />

        {/* Geo-Targeting Meta Tags */}
        <GeoMetaTags />

        {/* Hreflang Tags */}
        <HreflangTags path={currentPath} />

        {/* Google Tag Manager */}
        <GoogleTagManager />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontHeading.variable)} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <GoogleTagManagerNoScript />

        {/* Facebook Pixel */}
        <FacebookPixel />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            defaultColorTheme="freshGrocery"
          >
            {/* Top Green Info Bar - Desktop only */}
            <TopInfoBar />

            {/* Main Layout Container */}
            <div className="flex min-h-screen lg:min-h-[calc(100vh-40px)] overflow-x-hidden">
              {/* Vertical Sidebar - Fixed on left, hidden on mobile */}
              <VerticalSidebar categories={categories} />

              {/* Main Content Area - Responsive margin */}
              <div className="flex-1 lg:ml-64 flex flex-col overflow-x-hidden max-w-full">
                {/* Content Header - Search, Login, Cart */}
                <ContentHeader />

                {/* Page Content */}
                <main className="flex-1 w-full overflow-x-hidden">{children}</main>
                <Footer />
              </div>
            </div>

            <CartDrawer />
            <WishlistDrawer />
            <Toaster />
            <ExitSurveyWrapper />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        <AiChatWidget />

        {/* Global SEO Schemas - Locale-aware for Swedish/English */}
        <SchemaScript
          id="global-schema"
          schema={schemaGraph(
            idealIndiskaWebsiteSchema(siteConfig.site_domain, locale),
            idealIndiskaOrganizationSchemaFull(siteConfig.site_domain, locale),
            idealLivsLocalBusinessSchema(locale),
            siteNavigationSchema(siteConfig.site_domain)
          )}
        />
      </body>
    </html>
  );
}
