/**
 * Locale-aware metadata helpers for SEO
 */

const BASE_URL = 'https://www.ideallivs.com';

/**
 * Get canonical and alternate language URLs for a given path
 */
export function getAlternates(path: string) {
  const cleanPath = path === '/' ? '' : path;
  return {
    canonical: `${BASE_URL}${cleanPath}`,
    languages: {
      'en': `${BASE_URL}${cleanPath}`,
      'sv': `${BASE_URL}/sv${cleanPath}`,
      'x-default': `${BASE_URL}${cleanPath}`,
    },
  };
}

/**
 * Get the full URL for a given path and locale
 */
export function getLocalizedUrl(path: string, locale: string): string {
  const cleanPath = path === '/' ? '' : path;
  if (locale === 'sv') return `${BASE_URL}/sv${cleanPath}`;
  return `${BASE_URL}${cleanPath}`;
}
