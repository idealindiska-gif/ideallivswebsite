/**
 * Delivery Service Schema Generator
 * Creates DeliveryService and Service schemas for delivery information pages
 */

import type { Organization, Service } from './types';
import { cleanSchema } from './base';

/**
 * Generate Stockholm Delivery Service Schema
 * For /delivery-information page
 */
export function stockholmDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#stockholm-delivery-service`,
    name: 'Bandhagen & Area Grocery Delivery Service',
    description: 'Same-day delivery in Bandhagen and nearby southern Stockholm districts (min. 500 SEK). Weekend delivery to Järfälla, Kungsängen & Upplands-Bro (min. 1,000 SEK). Free delivery to Södertälje on orders 1,000 SEK+.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'Grocery Delivery',
    areaServed: [
      {
        '@type': 'City',
        name: 'Stockholm',
      },
      {
        '@type': 'Place',
        name: 'Södermalm',
      },
      {
        '@type': 'Place',
        name: 'Kungsholmen',
      },
      {
        '@type': 'Place',
        name: 'Norrmalm',
      },
      {
        '@type': 'Place',
        name: 'Vasastan',
      },
      {
        '@type': 'Place',
        name: 'Östermalm',
      },
      {
        '@type': 'Place',
        name: 'Gamla Stan',
      },
      {
        '@type': 'Place',
        name: 'Solna',
      },
      {
        '@type': 'Place',
        name: 'Sundbyberg',
      },
      {
        '@type': 'Place',
        name: 'Huddinge',
      },
      {
        '@type': 'Place',
        name: 'Nacka',
      },
      {
        '@type': 'City',
        name: 'Södertälje',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Södertälje',
          postalCode: '151 00',
          addressCountry: 'SE',
        },
      },
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Same-Day Delivery — Bandhagen & Surroundings',
        description: 'Same-day evening delivery to Bandhagen and nearby districts. Order before 4 PM (16:00). Minimum order 500 SEK. Delivery fee applies.',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          minPrice: 500,
          priceCurrency: 'SEK',
        },
        areaServed: [
          { '@type': 'Place', name: 'Bandhagen' },
          { '@type': 'Place', name: 'Högdalen' },
          { '@type': 'Place', name: 'Hagsätra' },
          { '@type': 'Place', name: 'Rågsved' },
          { '@type': 'Place', name: 'Farsta' },
          { '@type': 'Place', name: 'Enskede' },
          { '@type': 'Place', name: 'Huddinge' },
          { '@type': 'Place', name: 'Älvsjö' },
          { '@type': 'Place', name: 'Hägersten' },
          { '@type': 'Place', name: 'Skärholmen' },
        ],
      },
      {
        '@type': 'Offer',
        name: 'Weekend Delivery — Järfälla, Kungsängen & Upplands-Bro',
        description: 'Weekend delivery (Saturday & Sunday) to Järfälla, Kungsängen and Upplands-Bro. Minimum order 1,000 SEK. Delivery fee applies.',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          minPrice: 1000,
          priceCurrency: 'SEK',
        },
        areaServed: [
          { '@type': 'Place', name: 'Järfälla' },
          { '@type': 'Place', name: 'Kungsängen' },
          { '@type': 'Place', name: 'Upplands-Bro' },
        ],
      },
      {
        '@type': 'Offer',
        name: 'Free Delivery to Södertälje',
        description: 'Free delivery to Södertälje (postcodes 151 00–152 99) on orders of 1,000 SEK or more.',
        price: '0',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          minPrice: 1000,
          priceCurrency: 'SEK',
        },
        areaServed: {
          '@type': 'City',
          name: 'Södertälje',
          address: {
            '@type': 'PostalAddress',
            postalCode: '151 00',
            addressCountry: 'SE',
          },
        },
      },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Europe Delivery Service Schema
 * For /europe-delivery page
 */
export function europeDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#europe-delivery-service`,
    name: 'Europe-Wide Grocery Delivery Service',
    description: 'Authentic Indian & Pakistani groceries delivered across Europe via DHL. No minimum order, no customs hassle within EU.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'International Grocery Delivery',
    areaServed: {
      '@type': 'Continent',
      name: 'Europe',
    },
    offers: {
      '@type': 'Offer',
      name: 'DHL Europe Delivery',
      description: 'DHL shipping to all European countries. Rates calculated at checkout based on weight and destination.',
      priceCurrency: 'SEK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'SEK',
        description: 'DHL rates calculated at checkout based on weight and destination',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
    additionalType: 'https://schema.org/DeliveryEvent',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Göteborg & Malmö Delivery Service Schema
 * For /delivery-goteborg-malmo page
 */
export function goteborgMalmoDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#goteborg-malmo-delivery-service`,
    name: 'Göteborg & Malmö Grocery Delivery Service',
    description: 'Scheduled delivery of Indian & Pakistani groceries to Göteborg and Malmö via DHL.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'Scheduled Grocery Delivery',
    areaServed: [
      {
        '@type': 'City',
        name: 'Göteborg',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Göteborg',
          addressRegion: 'Västra Götaland County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'City',
        name: 'Malmö',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Malmö',
          addressRegion: 'Skåne County',
          addressCountry: 'SE',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      name: 'DHL Delivery to Göteborg & Malmö',
      description: 'Scheduled delivery on specific days. Göteborg: Tuesday, Thursday, Saturday. Malmö: Wednesday, Saturday.',
      priceCurrency: 'SEK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'SEK',
        description: 'DHL delivery rates calculated at checkout',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Norway Delivery Service Schema
 * For /norway-delivery page
 */
export function norwayDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#norway-delivery-service`,
    name: 'Norway Grocery Delivery via DHL',
    description: 'Authentic Indian & Pakistani groceries delivered to Norway via DHL. No minimum order, fully tracked shipments.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'International Grocery Delivery',
    areaServed: {
      '@type': 'Country',
      name: 'Norway',
    },
    offers: {
      '@type': 'Offer',
      name: 'DHL Delivery to Norway',
      description: 'DHL shipping to Norway. Rates calculated at checkout based on weight. No minimum order.',
      priceCurrency: 'NOK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'NOK',
        description: 'DHL rates calculated at checkout based on weight',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Norwegian', 'Swedish', 'English'],
    },
    additionalType: 'https://schema.org/DeliveryEvent',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Denmark Delivery Service Schema
 * For /denmark-delivery page
 */
export function denmarkDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#denmark-delivery-service`,
    name: 'Denmark Grocery Delivery via DHL',
    description: 'Authentic Indian & Pakistani groceries delivered to Denmark via DHL. No minimum order, fully tracked shipments.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'International Grocery Delivery',
    areaServed: {
      '@type': 'Country',
      name: 'Denmark',
    },
    offers: {
      '@type': 'Offer',
      name: 'DHL Delivery to Denmark',
      description: 'DHL shipping to Denmark. Rates calculated at checkout based on weight. No minimum order.',
      priceCurrency: 'DKK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'DKK',
        description: 'DHL rates calculated at checkout based on weight',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Danish', 'Swedish', 'English'],
    },
    additionalType: 'https://schema.org/DeliveryEvent',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate FAQ Page Schema for Delivery
 */
export function deliveryFAQSchema(baseUrl: string = 'https://www.ideallivs.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the minimum order for local delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Minimum order for same-day delivery in Bandhagen and surroundings is 500 SEK (delivery fee applies). For weekend delivery to Järfälla, Kungsängen and Upplands-Bro the minimum is 1,000 SEK (delivery fee applies). Free delivery to Södertälje (postcodes 151–152) requires a minimum of 1,000 SEK.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer same-day delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer same-day evening delivery to Bandhagen and nearby areas including Hagsätra, Högdalen, Rågsved, Farsta, Enskede, Huddinge, Älvsjö, Hägersten and Skärholmen. Minimum order is 500 SEK. Place your order before 4 PM (16:00) to receive delivery the same evening.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver to Södertälje?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We deliver to Södertälje and surrounding areas (postcodes 151 00–152 99). Orders of 1,000 SEK or more qualify for free delivery — no extra charge. For orders below 1,000 SEK, our standard delivery fee applies. Enter your postcode at checkout and the correct delivery option is calculated automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver to all of Europe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we deliver to all European countries via DHL. There is no minimum order amount for European deliveries. Shipping costs are calculated at checkout based on weight and destination. Since we ship from Sweden (an EU member), customers in EU countries will not face additional customs fees or import duties.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For Stockholm: 1-2 days for standard delivery, same-day for nearby areas. For rest of Sweden via DHL: 2-5 business days. For Europe: 2-4 business days for nearby countries (Denmark, Germany), 4-7 business days for further destinations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I track my delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all orders are trackable. You will receive a tracking number via email once your order is dispatched. DHL deliveries include full DHL tracking.',
        },
      },
    ],
  };
}

/**
 * Generate Kalmar Delivery Service Schema
 * For /delivery-kalmar page
 */
export function kalmarDeliveryServiceSchema(baseUrl: string = 'https://www.ideallivs.com') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#kalmar-delivery-service`,
    name: 'Indian & Pakistani Grocery Delivery to Kalmar via DHL',
    description: 'Authentic Indian & Pakistani groceries shipped to Kalmar, Nybro, Borgholm and all of Kalmar County via DHL. Home delivery and DHL Service Point pickup available.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ideal Indiska LIVS',
    },
    serviceType: 'DHL Grocery Delivery',
    areaServed: [
      {
        '@type': 'City',
        name: 'Kalmar',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kalmar',
          addressRegion: 'Kalmar County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'Place',
        name: 'Nybro',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Nybro',
          addressRegion: 'Kalmar County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'Place',
        name: 'Borgholm',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Borgholm',
          addressRegion: 'Kalmar County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'Place',
        name: 'Emmaboda',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Emmaboda',
          addressRegion: 'Kalmar County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'Place',
        name: 'Mönsterås',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mönsterås',
          addressRegion: 'Kalmar County',
          addressCountry: 'SE',
        },
      },
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'DHL Home Delivery to Kalmar',
        description: 'DHL Paket home delivery to Kalmar city and all Kalmar County postcodes (390–398xx). 2–4 business days.',
        priceCurrency: 'SEK',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.00',
          priceCurrency: 'SEK',
          description: 'DHL shipping costs calculated at checkout based on order weight',
        },
      },
      {
        '@type': 'Offer',
        name: 'DHL Service Point Pickup in Kalmar',
        description: 'Pick up your parcel at a DHL Service Point near you in Kalmar — ICA Berga Centrum, Mekonomen, or Direkten Tobaksboden.',
        priceCurrency: 'SEK',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.00',
          priceCurrency: 'SEK',
          description: 'DHL shipping costs calculated at checkout based on order weight',
        },
      },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46728494801',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu'],
    },
    additionalType: 'https://schema.org/DeliveryEvent',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  };

  return cleanSchema(schema);
}


