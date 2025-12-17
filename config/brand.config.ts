/**
 * Brand Configuration
 *
 * Centralized branding for easy customization.
 * Change these values to rebrand the entire application.
 */

export const brandConfig = {
  // Business Information
  businessName: "Ideal Indiska LIVS",
  tagline: "Everything You Need. Just Around the Corner.",
  description: "Your trusted source for authentic Indian and Pakistani groceries in Stockholm. Premium Basmati rice, aromatic spices, halal products & more.",

  // Cuisine Type
  cuisineType: "Indian & Pakistani Groceries",
  cuisineDescription: "authentic Indian & Pakistani grocery products",

  // Contact Information
  contact: {
    address: "Bandhagsplan 4, 124 32 Bandhagen, Stockholm, Sweden",
    phone: "+46728494801",
    phoneSecondary: "+46728494801",
    whatsapp: "+46728494801",
    email: "hello@ideallivs.com",
    reservationEmail: "hello@ideallivs.com",
    privacyEmail: "hello@ideallivs.com",
    googleMapsUrl: "https://g.co/kgs/5e3Ufch",
    googleBusinessProfile: "https://g.co/kgs/5e3Ufch",
  },

  // Business Hours
  hours: {
    weekday: "Monday - Friday: 10:00 – 20:00",
    saturday: "Saturday: 11:00 – 19:00",
    sunday: "Sunday: 11:00 – 19:00",
    delivery: "Free delivery from 500kr in Stockholm",
    europe: "Europe-wide delivery with DHL",
  },

  // Features
  features: {
    hasHalalCertification: true,
    hasVegetarianOptions: true,
    hasVeganOptions: true,
    hasDelivery: true,
    hasOnlineOrdering: true,
    hasEuropeShipping: true,
  },

  // Dietary Options (for filters)
  dietaryOptions: [
    { id: 'halal', label: 'Halal', enabled: true },
    { id: 'vegetarian', label: 'Vegetarian', enabled: true },
    { id: 'vegan', label: 'Vegan', enabled: true },
    { id: 'organic', label: 'Organic', enabled: true },
    { id: 'gluten-free', label: 'Gluten Free', enabled: false },
  ],

  // Social Media
  social: {
    facebook: "https://www.facebook.com/Ideal.indiska.livs",
    instagram: "https://www.instagram.com/ideal_indiska_livs/",
    twitter: "",
    youtube: "https://www.youtube.com/@Idealindiska",
    tiktok: "",
  },

  // Currency
  currency: {
    code: "SEK",
    symbol: "kr",
  },

  // SEO
  seo: {
    defaultTitle: "Ideal Indiska LIVS - Indian & Pakistani Groceries Stockholm",
    titleTemplate: "%s | Ideal Indiska LIVS",
    defaultDescription: "Shop authentic Indian & Pakistani groceries online in Stockholm. Premium Basmati rice, spices, halal products, frozen foods & more. Free delivery from 500kr.",
    keywords: ["indian grocery", "pakistani groceries", "halal products", "basmati rice", "indian spices", "Stockholm", "Bandhagen", "online grocery", "asian supermarket"],
  },
} as const;

// Type export for TypeScript
export type BrandConfig = typeof brandConfig;
