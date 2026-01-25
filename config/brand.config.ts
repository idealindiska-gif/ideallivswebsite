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
    defaultDescription: "Shop Indian & Pakistani groceries in Stockholm. Premium Basmati rice, spices, halal products, frozen foods & more. Free delivery over 500kr.",
    keywords: ["indian grocery", "pakistani groceries", "halal products", "basmati rice", "indian spices", "Stockholm", "Bandhagen", "online grocery", "asian supermarket", "pakistani food stockholm", "national foods sweden", "halal delivery europe", "shan foods stockholm", "shan recipe mixes sweden", "guard rice sweden", "falak rice stockholm", "ahmed foods sweden", "laziza desserts stockholm", "hamdard rooh afza sweden", "qarshi jam e shirin europe", "shezan juices stockholm", "tapal tea sweden", "india gate basmati stockholm", "mdh masala sweden", "haldiram snacks europe", "trs spices stockholm", "aashirvaad atta sweden", "dabur honey stockholm", "vatika hair oil sweden", "annam groceries europe", "idhayam oil stockholm", "fortune oil sweden", "sona masoori rice 5kg sweden", "india gate sona masoori price", "best sona masoori rice stockholm", "colgate toothpaste sweden", "nestle maggi stockholm", "coca-cola delivery europe", "ali baba lentils sweden", "pataks curry paste stockholm", "pillsbury atta europe", "jabsons snacks sweden", "johnsons baby care stockholm", "vaseline lotion europe"],
  },
} as const;

// Type export for TypeScript
export type BrandConfig = typeof brandConfig;
