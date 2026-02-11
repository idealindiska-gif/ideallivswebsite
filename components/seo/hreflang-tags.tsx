/**
 * Hreflang Tags for International SEO
 * Tells search engines which language/region versions exist
 */

interface HreflangTagsProps {
  canonicalUrl: string;
}

export function HreflangTags({ canonicalUrl }: HreflangTagsProps) {
  return (
    <>
      {/* Swedish version (main target) */}
      <link rel="alternate" hrefLang="sv-SE" href={canonicalUrl} />

      {/* Default/fallback for other regions */}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </>
  );
}
