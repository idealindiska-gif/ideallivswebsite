/**
 * Organization Schema Generator
 * Framework-agnostic function for generating Organization/GroceryStore schema
 */

import type { Organization, OrganizationInput } from './types';
import { generateSchemaId, formatOpeningHours, cleanSchema } from './base';

/**
 * Generate Organization Schema (GroceryStore, LocalBusiness, etc.)
 *
 * @param config - Organization configuration
 * @returns Complete Organization schema object
 */
export function organizationSchema(config: OrganizationInput): Organization {
  const schema: Organization = {
    '@context': 'https://schema.org',
    '@type': config.types || ['Organization', 'GroceryStore', 'LocalBusiness'],
    '@id': generateSchemaId(config.url, 'organization'),
    name: config.name,
    url: config.url,
  };

  // Optional fields
  if (config.alternateName) {
    schema.alternateName = config.alternateName;
  }

  if (config.description) {
    schema.description = config.description;
  }

  if (config.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo,
    };
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.telephone) {
    schema.telephone = config.telephone;
  }

  if (config.email) {
    schema.email = config.email;
  }

  if (config.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: config.address.street,
      addressLocality: config.address.city,
      postalCode: config.address.postalCode,
      addressCountry: config.address.country,
      ...(config.address.region && { addressRegion: config.address.region }),
    };
  }

  if (config.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    };
  }

  if (config.openingHours && config.openingHours.length > 0) {
    schema.openingHoursSpecification = formatOpeningHours(config.openingHours);
  }

  if (config.cuisine && config.cuisine.length > 0) {
    schema.servesCuisine = config.cuisine;
  }

  if (config.priceRange) {
    schema.priceRange = config.priceRange;
  }

  if (config.socialMedia && config.socialMedia.length > 0) {
    schema.sameAs = config.socialMedia.filter(Boolean);
  }

  if (config.foundingDate) {
    schema.foundingDate = config.foundingDate;
  }

  return cleanSchema(schema);
}

/**
 * Pre-configured Ideal Indiska LIVS Organization Schema
 * Grocery Store focused schema with delivery services
 * Now includes Google Business Profile linking for Local SEO
 *
 * @param baseUrl - Base URL of the website
 * @param locale - Locale for language-specific content (default: 'en')
 */
export function idealIndiskaOrganizationSchema(baseUrl: string = 'https://www.ideallivs.com', locale: string = 'en'): Organization {
  const descriptions = {
    en: 'Indian & Pakistani Grocery Store in Stockholm, now delivering across Europe with DHL. Free delivery from 500kr in Stockholm (min. order 300kr with 30kr fee). Same-day delivery available.',
    sv: 'Indisk & Pakistansk livsmedelsbutik i Stockholm, nu med leverans över hela Europa via DHL. Fri leverans från 500kr i Stockholm (min. beställning 300kr med 30kr avgift). Samma dag leverans finns tillgänglig.'
  };

  const schema = organizationSchema({
    name: 'Ideal Indiska LIVS',
    alternateName: 'Ideal Livs',
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    url: baseUrl,
    logo: 'https://crm.ideallivs.com/wp-content/uploads/2025/04/final-new-logo-black.png',
    image: 'https://crm.ideallivs.com/wp-content/uploads/2025/07/ideal-indiska-livs-stockholm.jpg',
    telephone: '+46728494801',
    email: 'hello@ideallivs.com',
    address: {
      street: 'Bandhagsplan 4',
      city: 'Bandhagen',
      region: 'Stockholm County',
      postalCode: '124 32',
      country: 'SE',
    },
    geo: {
      latitude: 59.2700036,
      longitude: 18.0486904,
    },
    openingHours: [
      { day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '20:00' },
      { day: ['Saturday', 'Sunday'], opens: '11:00', closes: '19:00' },
    ],
    priceRange: '$$',
    socialMedia: [
      // Social Media Profiles
      'https://www.facebook.com/Ideal.indiska.livs',
      'https://www.instagram.com/ideal_indiska_livs/',
      'https://www.youtube.com/@Idealindiska',
      'https://x.com/idealindiska',
      'https://www.linkedin.com/in/ideal-indiska-596215378/',
      // Google Business Profile - Multiple formats for maximum linking
      'https://www.google.com/maps?cid=15139028879935821411',
      'https://www.google.com/maps/place/Ideal+Indiska+Livs+Bandhagen/@59.2700036,18.0486904,17z',
      'https://g.co/kgs/5e3Ufch',
    ],
    foundingDate: '2020',
    types: ['Organization', 'GroceryStore', 'LocalBusiness'],
  });

  // Add Google Business Profile specific properties
  return {
    ...schema,
    // Language
    inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
    // Direct link to Google Maps (hasMap property)
    hasMap: 'https://www.google.com/maps?cid=15139028879935821411',
    // Google Place identifier
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'GooglePlaceID',
        value: 'ChIJz4lYe9B3X0YRY5bgk7p3Dt0',
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'GoogleCID',
        value: '15139028879935821411',
      },
    ],
    // Note: aggregateRating and ReviewAction will be added once real reviews exist
  };
}

/**
 * Full-featured Ideal Indiska LIVS Organization Schema
 * Includes delivery services, payment methods, and service areas
 *
 * @param baseUrl - Base URL of the website
 * @param locale - Locale for language-specific content (default: 'en')
 */
export function idealIndiskaOrganizationSchemaFull(baseUrl: string = 'https://www.ideallivs.com', locale: string = 'en'): Organization {
  const baseSchema = idealIndiskaOrganizationSchema(baseUrl, locale);

  const slogans = {
    en: 'Everything You Need. Just Around the Corner.',
    sv: 'Allt du behöver. Precis runt hörnet.'
  };

  // Payment methods - Swish first for Swedish version
  const paymentMethods = locale === 'sv'
    ? [
        'Swish',
        'Klarna',
        'Credit Card',
        'Debit Card',
        'Visa',
        'MasterCard',
        'Apple Pay',
        'Google Pay',
        'Cash',
      ]
    : [
        'Credit Card',
        'Debit Card',
        'Visa',
        'MasterCard',
        'Apple Pay',
        'Google Pay',
        'Klarna',
        'Swish',
        'Cash',
      ];

  const catalogDescriptions = {
    en: 'Complete range of authentic Indian and Pakistani food products',
    sv: 'Komplett sortiment av autentiska indiska och pakistanska livsmedelsprodukter'
  };

  return {
    ...baseSchema,

    slogan: slogans[locale as keyof typeof slogans] || slogans.en,

    // Payment methods
    paymentAccepted: paymentMethods,
    currenciesAccepted: 'SEK',

    // Products/Categories offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'sv' ? 'Indiska & Pakistanska Livsmedel' : 'Indian & Pakistani Groceries',
      description: catalogDescriptions[locale as keyof typeof catalogDescriptions] || catalogDescriptions.en,
    },

    // Knowledge areas
    knowsAbout: [
      'Indian Groceries',
      'Pakistani Food Products',
      'Asian Spices',
      'Halal Products',
      'Basmati Rice',
      'Indian Sweets',
      'Frozen Indian Food',
    ],

    // Delivery Services
    makesOffer: [
      // Stockholm Delivery (300-499kr)
      {
        '@type': 'Offer',
        name: locale === 'sv' ? 'Stockholmsleverans' : 'Stockholm Delivery',
        description: locale === 'sv'
          ? 'Lokal leverans inom Stockholm för beställningar under 500kr'
          : 'Local delivery within Stockholm for orders under 500kr',
        priceSpecification: {
          '@type': 'DeliveryChargeSpecification',
          price: '30.00',
          priceCurrency: 'SEK',
          eligibleTransactionVolume: {
            '@type': 'PriceSpecification',
            minPrice: 300,
            maxPrice: 499.99,
            priceCurrency: 'SEK',
          },
        },
        areaServed: {
          '@type': 'DefinedRegion',
          addressCountry: 'SE',
          addressRegion: 'Stockholm County',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '30.00',
            currency: 'SEK',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            cutoffTime: '20:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
          doesNotShip: false,
          shippingLabel: 'Stockholm Delivery (Under 500kr)',
        },
      },
      // FREE Stockholm Delivery (500kr+)
      {
        '@type': 'Offer',
        name: locale === 'sv' ? 'GRATIS Stockholmsleverans' : 'FREE Stockholm Delivery',
        description: locale === 'sv'
          ? 'Gratis leverans för beställningar från 500kr och uppåt'
          : 'Free delivery for orders 500kr and above',
        priceSpecification: {
          '@type': 'DeliveryChargeSpecification',
          price: '0.00',
          priceCurrency: 'SEK',
          eligibleTransactionVolume: {
            '@type': 'PriceSpecification',
            minPrice: 500,
            priceCurrency: 'SEK',
          },
        },
        areaServed: {
          '@type': 'DefinedRegion',
          addressCountry: 'SE',
          addressRegion: 'Stockholm County',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'SEK',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            cutoffTime: '20:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
          doesNotShip: false,
          shippingLabel: 'FREE Stockholm Delivery (500kr+)',
        },
      },
      // Same-Day Delivery
      {
        '@type': 'Offer',
        name: locale === 'sv' ? 'Samma dag leverans' : 'Same-Day Local Delivery',
        description: locale === 'sv'
          ? 'Samma dag leverans till närliggande områden'
          : 'Same-day delivery to nearby areas',
        areaServed: [
          { '@type': 'Place', name: 'Bandhagen' },
          { '@type': 'Place', name: 'Hagsätra' },
          { '@type': 'Place', name: 'Högdalen' },
          { '@type': 'Place', name: 'Farsta' },
          { '@type': 'Place', name: 'Enskede' },
          { '@type': 'Place', name: 'Huddinge' },
          { '@type': 'Place', name: 'Solna' },
          { '@type': 'Place', name: 'Sundbyberg' },
        ],
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '30.00',
            currency: 'SEK',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            cutoffTime: '16:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 0,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 0,
              unitCode: 'DAY',
            },
          },
          doesNotShip: false,
          shippingLabel: 'Same Day Delivery',
        },
      },
      // DHL Europe Delivery
      {
        '@type': 'Offer',
        name: locale === 'sv' ? 'DHL Europaleverans' : 'DHL Europe Delivery',
        description: locale === 'sv'
          ? 'Leverans till hela Europa med DHL. Inget minimivärde. Priser beräknas i kassan.'
          : 'Delivery to all of Europe with DHL. No minimum order value. Rates calculated at checkout.',
        areaServed: {
          '@type': 'DefinedRegion',
          addressCountry: [
            'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
            'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
            'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'NO', 'CH',
          ],
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'SEK',
            description: 'DHL rates calculated at checkout',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            },
            cutoffTime: '20:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 7,
              unitCode: 'DAY',
            },
          },
          carrier: {
            '@type': 'Organization',
            name: 'DHL',
            url: 'https://www.dhl.com',
          },
          doesNotShip: false,
          shippingLabel: 'DHL Europe Delivery (Rates calculated at checkout)',
        },
      },
    ],

    // Service areas - emphasize Swedish market for Swedish version
    areaServed: locale === 'sv'
      ? [
          {
            '@type': 'City',
            name: 'Stockholm',
          },
          {
            '@type': 'Country',
            name: 'Sverige',
            alternateName: 'Sweden',
          },
          {
            '@type': 'AdministrativeArea',
            name: 'Stockholms län',
          },
          {
            '@type': 'Place',
            name: 'Skandinavien',
          },
          {
            '@type': 'Continent',
            name: 'Europa',
            alternateName: 'Europe',
          },
        ]
      : [
          {
            '@type': 'City',
            name: 'Stockholm',
          },
          {
            '@type': 'Country',
            name: 'Sweden',
          },
          {
            '@type': 'Continent',
            name: 'Europe',
          },
        ],

    // Amenities
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Halal Certified', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Fresh Produce', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Frozen Foods', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'International Brands', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Online Shopping', value: true },
    ],

    // Aggregate rating from Google Business Profile (real GBP reviews)
    // Last updated: 2026-01-21 - Update periodically from your GBP dashboard
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.7,
      reviewCount: 17,
      bestRating: 5,
      worstRating: 1,
    },

    // Direct link to Google Maps
    hasMap: 'https://www.google.com/maps?cid=15139028879935821411',

    // Google Place identifiers for linking with GBP
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'GooglePlaceID',
        value: 'ChIJz4lYe9B3X0YRY5bgk7p3Dt0',
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'GoogleCID',
        value: '15139028879935821411',
      },
    ],

    // Order action for shopping
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: baseUrl + '/shop/',
      },
      name: locale === 'sv' ? 'Handla Online' : 'Shop Online',
    },
  };
}

