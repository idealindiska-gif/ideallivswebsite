/**
 * Geo-Targeting Meta Tags
 * Helps search engines understand your geographic focus
 */

interface GeoMetaTagsProps {
  locale?: string;
}

export function GeoMetaTags({ locale = 'en' }: GeoMetaTagsProps) {
  const contentLanguage = locale === 'sv' ? 'sv-SE' : 'en-GB';

  return (
    <>
      {/* Geographic Targeting */}
      <meta name="geo.region" content="SE-AB" />
      <meta name="geo.placename" content="Stockholm" />
      <meta name="geo.position" content="59.2700036;18.0486904" />
      <meta name="ICBM" content="59.2700036, 18.0486904" />

      {/* Language and Region */}
      <meta httpEquiv="content-language" content={contentLanguage} />

      {/* Robots - Allow indexing but be clear about region */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Country Targeting */}
      <meta name="country" content="Sweden" />
      <meta name="target_country" content="SE" />

      {/* Distribution - Regional focus */}
      <meta name="distribution" content="local" />
      <meta name="coverage" content="Sweden" />
    </>
  );
}
