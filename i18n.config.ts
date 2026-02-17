import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'sv'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];
export const localePrefix = 'as-needed' as const;

// Routing config used by middleware and navigation
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: false,
});
