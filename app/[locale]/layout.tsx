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
            description: 'Köp indiska och pakistanska livsmedel online i Stockholm. 1500+ produkter med snabb leverans över Sverige & Europa. Basmatris, kryddor, halalkött och mer.',
            keywords: [
                'indisk mataffär stockholm',
                'pakistanska livsmedel sverige',
                'köp indiska livsmedel online',
                'indiska kryddor stockholm',
                'halal kött stockholm',
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
                alternateLocale: ['en_SE'],
                url: `${siteConfig.site_domain}/sv`,
                siteName: 'Ideal Indiska LIVS',
                title: 'Ideal Indiska LIVS - Indiska & Pakistanska Livsmedel i Stockholm',
                description: 'Köp indiska och pakistanska livsmedel online i Stockholm. 1500+ produkter med snabb leverans över Sverige & Europa. Basmatris, kryddor, halalkött och mer.',
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
            icons: {
                icon: [
                    { url: "/favicon.svg", type: "image/svg+xml" },
                    { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
                    { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
                    { url: "/favicon.ico", sizes: "any" },
                ],
                shortcut: "/favicon.ico",
                apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
            },
            alternates: {
                canonical: `/sv`,
                languages: {
                    'en': '/',
                    'sv': '/sv',
                },
            },
        };
    }

    // English metadata for /en/* pages (matches root layout for consistency)
    return {
        title: {
            default: siteConfig.site_name,
            template: `%s | ${siteConfig.site_name}`,
        },
        description: siteConfig.site_description,
        keywords: [
            'Indian grocery store Stockholm',
            'Pakistani grocery online Sweden',
            'buy Indian groceries online',
            'Indian spices Stockholm',
            'halal meat Stockholm',
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
            alternateLocale: ['sv_SE'],
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
        icons: {
            icon: [
                { url: "/favicon.svg", type: "image/svg+xml" },
                { url: "/favicon.ico", sizes: "any" },
            ],
            shortcut: "/favicon.ico",
            apple: "/favicon.svg",
        },
        alternates: {
            canonical: `/en`,
            languages: {
                'en': '/',
                'sv': '/sv',
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
