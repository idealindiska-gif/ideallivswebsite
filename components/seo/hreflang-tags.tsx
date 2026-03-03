/**
 * Hreflang Tags for International SEO
 * Links English and Swedish versions of each page
 */

const BASE_URL = 'https://www.ideallivs.com';

interface HreflangTagsProps {
  path: string; // current path e.g. "/about" or "/sv/about" or "/product/rice"
}

export function HreflangTags({ path }: HreflangTagsProps) {
  // Strip any locale prefix to get the clean path
  const cleanPath = path
    .replace(/^\/sv(\/|$)/, '/')
    .replace(/^\/no(\/|$)/, '/')
    .replace(/^\/da(\/|$)/, '/')
    .replace(/\/$/, '') || '/';
  const pathSuffix = cleanPath === '/' ? '' : cleanPath;

  const enUrl = `${BASE_URL}${pathSuffix}`;
  const svUrl = `${BASE_URL}/sv${pathSuffix}`;
  const noUrl = `${BASE_URL}/no${pathSuffix}`;
  const daUrl = `${BASE_URL}/da${pathSuffix}`;

  return (
    <>
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="sv" href={svUrl} />
      <link rel="alternate" hrefLang="nb" href={noUrl} />
      <link rel="alternate" hrefLang="da" href={daUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
