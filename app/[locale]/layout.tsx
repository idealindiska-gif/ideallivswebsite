import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

/**
 * Generate locale-specific metadata for SEO
 * English and Swedish have different meta tags for better search results
 */
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
    const { locale } = await params;

    // Swedish metadata for /sv/* pages
    if (locale === 'sv') {
        return {
            title: {
                default: 'Ideal Indiska LIVS - Indiska & Pakistanska Livsmedel i Stockholm',
                template: `%s | Ideal Indiska LIVS`,
            },
            description: 'Köp indiska och pakistanska livsmedel online i Stockholm. 1500+ produkter med snabb leverans över Sverige & Europa. Basmatris, kryddor, linser och mer.',
            keywords: [
                'indisk mataffär stockholm',
                'pakistanska livsmedel sverige',
                'köp indiska livsmedel online',
                'indiska kryddor stockholm',
                'indisk fryst mat stockholm',
                'basmatris sverige',
                'indisk mat online',
                'pakistansk mat stockholm',
                'asiatisk mataffär',
                'indiska livsmedel leverans',
                'basmati ris stockholm',
                'indiska produkter sverige',
            ],
            openGraph: {
                type: 'website',
                locale: 'sv_SE',
                alternateLocale: ['en_SE', 'nb_NO', 'da_DK'],
                url: `${siteConfig.site_domain}/sv`,
                siteName: 'Ideal Indiska LIVS',
                title: 'Ideal Indiska LIVS - Indiska & Pakistanska Livsmedel i Stockholm',
                description: 'Köp indiska och pakistanska livsmedel online i Stockholm. 1500+ produkter med snabb leverans över Sverige & Europa. Basmatris, kryddor, linser och mer.',
                images: [
                    {
                        url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Ideal Indiska LIVS - Indiska & Pakistanska Livsmedel i Stockholm',
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Ideal Indiska LIVS - Indiska & Pakistanska Livsmedel i Stockholm',
                description: 'Köp indiska och pakistanska livsmedel online i Stockholm. 1500+ produkter med snabb leverans över Sverige & Europa.',
                images: ['https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg'],
            },
            metadataBase: new URL(siteConfig.site_domain),
            icons: {
                icon: [
                    { url: `${siteConfig.site_domain}/favicon.svg?v=4`, type: "image/svg+xml" },
                    { url: `${siteConfig.site_domain}/favicon-32x32.png?v=4`, type: "image/png", sizes: "32x32" },
                    { url: `${siteConfig.site_domain}/favicon-16x16.png?v=4`, type: "image/png", sizes: "16x16" },
                    { url: `${siteConfig.site_domain}/favicon.ico?v=4`, sizes: "any" },
                ],
                shortcut: `${siteConfig.site_domain}/favicon.ico?v=4`,
                apple: [{ url: `${siteConfig.site_domain}/apple-icon.png?v=4`, sizes: "180x180", type: "image/png" }],
            },
            alternates: {
                canonical: `/sv`,
                languages: {
                    'en': '/',
                    'sv': '/sv',
                    'nb': '/no',
                    'da': '/da',
                },
            },
        };
    }

    // Norwegian metadata for /no/* pages
    if (locale === 'no') {
        return {
            title: {
                default: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                template: `%s | Ideal Indiska LIVS`,
            },
            description: 'Kjøp indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med rask levering over hele Sverige og Europa. Basmatiris, krydder, linser og mer.',
            keywords: [
                'indisk dagligvarebutikk stockholm',
                'pakistanske dagligvarer sverige',
                'kjøp indiske dagligvarer online',
                'indiske krydder stockholm',
                'indisk fryst mat stockholm',
                'basmatiris sverige',
                'indisk mat online',
                'pakistansk mat stockholm',
                'asiatisk dagligvarebutikk',
                'indiske dagligvarer levering',
                'basmatiris stockholm',
                'indiske produkter sverige',
            ],
            openGraph: {
                type: 'website',
                locale: 'nb_NO',
                alternateLocale: ['en_SE', 'sv_SE', 'da_DK'],
                url: `${siteConfig.site_domain}/no`,
                siteName: 'Ideal Indiska LIVS',
                title: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                description: 'Kjøp indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med rask levering over hele Sverige og Europa.',
                images: [
                    {
                        url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                description: 'Kjøp indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med rask levering over hele Sverige og Europa.',
                images: ['https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg'],
            },
            metadataBase: new URL(siteConfig.site_domain),
            icons: {
                icon: [
                    { url: `${siteConfig.site_domain}/favicon.svg?v=4`, type: "image/svg+xml" },
                    { url: `${siteConfig.site_domain}/favicon-32x32.png?v=4`, type: "image/png", sizes: "32x32" },
                    { url: `${siteConfig.site_domain}/favicon-16x16.png?v=4`, type: "image/png", sizes: "16x16" },
                    { url: `${siteConfig.site_domain}/favicon.ico?v=4`, sizes: "any" },
                ],
                shortcut: `${siteConfig.site_domain}/favicon.ico?v=4`,
                apple: [{ url: `${siteConfig.site_domain}/apple-icon.png?v=4`, sizes: "180x180", type: "image/png" }],
            },
            alternates: {
                canonical: `/no`,
                languages: {
                    'en': '/',
                    'sv': '/sv',
                    'nb': '/no',
                    'da': '/da',
                },
            },
        };
    }

    // Danish metadata for /da/* pages
    if (locale === 'da') {
        return {
            title: {
                default: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                template: `%s | Ideal Indiska LIVS`,
            },
            description: 'Køb indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med hurtig levering over hele Sverige og Europa. Basmatiris, krydderier, linser og mere.',
            keywords: [
                'indisk dagligvarebutik stockholm',
                'pakistanske dagligvarer sverige',
                'køb indiske dagligvarer online',
                'indiske krydderier stockholm',
                'indisk frossen mad stockholm',
                'basmatiris sverige',
                'indisk mad online',
                'pakistansk mad stockholm',
                'asiatisk dagligvarebutik',
                'indiske dagligvarer levering',
                'basmatiris stockholm',
                'indiske produkter sverige',
            ],
            openGraph: {
                type: 'website',
                locale: 'da_DK',
                alternateLocale: ['en_SE', 'sv_SE', 'nb_NO'],
                url: `${siteConfig.site_domain}/da`,
                siteName: 'Ideal Indiska LIVS',
                title: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                description: 'Køb indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med hurtig levering over hele Sverige og Europa.',
                images: [
                    {
                        url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Ideal Indiska LIVS - Indiske og Pakistanske Dagligvarer i Stockholm',
                description: 'Køb indiske og pakistanske dagligvarer online i Stockholm. 1500+ produkter med hurtig levering over hele Sverige og Europa.',
                images: ['https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg'],
            },
            metadataBase: new URL(siteConfig.site_domain),
            icons: {
                icon: [
                    { url: `${siteConfig.site_domain}/favicon.svg?v=4`, type: "image/svg+xml" },
                    { url: `${siteConfig.site_domain}/favicon-32x32.png?v=4`, type: "image/png", sizes: "32x32" },
                    { url: `${siteConfig.site_domain}/favicon-16x16.png?v=4`, type: "image/png", sizes: "16x16" },
                    { url: `${siteConfig.site_domain}/favicon.ico?v=4`, sizes: "any" },
                ],
                shortcut: `${siteConfig.site_domain}/favicon.ico?v=4`,
                apple: [{ url: `${siteConfig.site_domain}/apple-icon.png?v=4`, sizes: "180x180", type: "image/png" }],
            },
            alternates: {
                canonical: `/da`,
                languages: {
                    'en': '/',
                    'sv': '/sv',
                    'nb': '/no',
                    'da': '/da',
                },
            },
        };
    }

    // English metadata for /en/* pages (matches root layout for consistency)
    return {
        metadataBase: new URL(siteConfig.site_domain),
        title: {
            default: siteConfig.site_name,
            template: `%s | ${siteConfig.site_name}`,
        },
        description: siteConfig.site_description,
        icons: {
            icon: [
                { url: `${siteConfig.site_domain}/favicon.svg?v=4`, type: "image/svg+xml" },
                { url: `${siteConfig.site_domain}/favicon-32x32.png?v=4`, type: "image/png", sizes: "32x32" },
                { url: `${siteConfig.site_domain}/favicon-16x16.png?v=4`, type: "image/png", sizes: "16x16" },
                { url: `${siteConfig.site_domain}/favicon.ico?v=4`, sizes: "any" },
            ],
            shortcut: `${siteConfig.site_domain}/favicon.ico?v=4`,
            apple: [{ url: `${siteConfig.site_domain}/apple-icon.png?v=4`, sizes: "180x180", type: "image/png" }],
        },
        keywords: [
            'Indian grocery store Stockholm',
            'Pakistani grocery online Sweden',
            'buy Indian groceries online',
            'Indian spices Stockholm',
            'Indian frozen food Stockholm',
            'basmati rice Sweden',
            'Indian food online',
            'Pakistani food Stockholm',
            'Asian grocery store',
            'Indian groceries delivery',
            'basmati rice Stockholm',
            'Indian products Sweden',
        ],
        openGraph: {
            type: 'website',
            locale: 'en_SE',
            alternateLocale: ['sv_SE', 'nb_NO', 'da_DK'],
            url: siteConfig.site_domain,
            siteName: siteConfig.site_name,
            title: siteConfig.site_name,
            description: siteConfig.site_description,
            images: [
                {
                    url: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Ideal Indiska LIVS - Indian & Pakistani Groceries in Stockholm',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: siteConfig.site_name,
            description: siteConfig.site_description,
            images: ['https://crm.ideallivs.com/wp-content/uploads/2025/07/rice-and-flours-e1752149384409.jpg'],
        },
        alternates: {
            canonical: `/`,
            languages: {
                'en': '/',
                'sv': '/sv',
                'nb': '/no',
                'da': '/da',
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;

    // Validate locale
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // NextIntlClientProvider is in the root layout (app/layout.tsx)
    // This layout just validates the locale and enables static rendering
    return <>{children}</>;
}
