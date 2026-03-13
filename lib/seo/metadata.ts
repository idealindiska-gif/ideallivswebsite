/**
 * Locale-aware metadata helpers for SEO
 */

const BASE_URL = 'https://www.ideallivs.com';

const LOCALE_PREFIXES: Record<string, string> = {
  en: '',
  sv: '/sv',
  no: '/no',
  da: '/da',
};

/**
 * Get canonical and alternate language URLs for a given path.
 * Pass the current locale so the canonical self-references the current locale's URL.
 */
export function getAlternates(path: string, locale: string = 'en') {
  const cleanPath = path === '/' ? '' : path;
  const prefix = LOCALE_PREFIXES[locale] ?? '';
  return {
    canonical: `${BASE_URL}${prefix}${cleanPath}`,
    languages: {
      'en': `${BASE_URL}${cleanPath}`,
      'sv': `${BASE_URL}/sv${cleanPath}`,
      'nb': `${BASE_URL}/no${cleanPath}`,
      'da': `${BASE_URL}/da${cleanPath}`,
      'x-default': `${BASE_URL}${cleanPath}`,
    },
  };
}

/**
 * Get the full URL for a given path and locale
 */
export function getLocalizedUrl(path: string, locale: string): string {
  const cleanPath = path === '/' ? '' : path;
  const prefix = LOCALE_PREFIXES[locale] ?? '';
  return `${BASE_URL}${prefix}${cleanPath}`;
}
