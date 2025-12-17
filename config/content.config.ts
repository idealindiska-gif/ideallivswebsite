/**
 * Content Configuration
 *
 * All brand-specific content and copy centralized in one place.
 * To rebrand: Just update this file and brand.config.ts
 */

import { brandConfig } from './brand.config';

export const contentConfig = {
  // Homepage Content
  home: {
    hero: {
      badge: `Authentic ${brandConfig.cuisineType} Cuisine`,
      title: brandConfig.businessName,
      description: `Experience the rich flavors of traditional ${brandConfig.cuisineDescription}. From aromatic biryanis to delectable sweets, every dish is prepared with authentic spices and time-honored recipes.`,
      cta: {
        primary: 'View Menu',
        secondary: 'Order Online',
      },
    },
    features: [
      {
        title: 'Authentic Recipes',
        description: 'Traditional family recipes passed down through generations',
        icon: 'utensils',
      },
      {
        title: 'Fresh Ingredients',
        description: 'Sourced daily from trusted suppliers for the highest quality',
        icon: 'star',
      },
      {
        title: 'Fast Delivery',
        description: 'Quick and reliable delivery to your doorstep',
        icon: 'clock',
      },
      {
        title: 'Easy Ordering',
        description: 'Simple online ordering with secure payment options',
        icon: 'shopping-bag',
      },
    ],
    featuredSection: {
      title: 'Featured Dishes',
      description: 'Our most popular items, loved by customers',
      cta: 'View All Products',
    },
    callToAction: {
      title: `Ready to Experience ${brandConfig.businessName.replace('Royal Sweets & Restaurant', 'Royal Flavors')}?`,
      description: `Order now and enjoy authentic ${brandConfig.cuisineDescription} delivered to your home, or reserve a table for a memorable dining experience.`,
      buttons: {
        primary: 'Order Now',
        secondary: 'Reserve a Table',
      },
    },
    about: {
      badge: 'Our Story',
      title: 'Tradition Meets Excellence',
      paragraphs: [
        `For years, ${brandConfig.businessName} has been serving authentic ${brandConfig.cuisineDescription} to our community. Our chefs bring decades of experience and a passion for traditional flavors.`,
        `Every dish is prepared fresh using time-honored recipes and the finest ingredients. From our signature biryanis to our handcrafted sweets, we ensure that every bite takes you on a culinary journey to South Asia.`,
      ],
      cta: 'Learn More About Us',
    },
  },

  // Menu Page Content
  menu: {
    title: 'Our Menu',
    description: `Discover authentic ${brandConfig.cuisineDescription} prepared with traditional recipes and fresh ingredients. From savory curries to sweet delights, every dish tells a story.`,
    metadata: {
      title: `Menu - ${brandConfig.businessName}`,
      description: `Explore our authentic ${brandConfig.cuisineDescription} menu with delicious dishes and sweets`,
    },
  },

  // About Page Content
  about: {
    metadata: {
      title: `About Us - ${brandConfig.businessName}`,
      description: `Learn about our story, our passion for authentic ${brandConfig.cuisineDescription}, and our commitment to quality`,
    },
    hero: {
      title: `About ${brandConfig.businessName}`,
      subtitle: `Bringing authentic ${brandConfig.cuisineType} flavors to your table since [Year]`,
    },
    sections: {
      story: {
        title: 'Our Story',
        content: [
          `${brandConfig.businessName} was born from a passion for authentic ${brandConfig.cuisineDescription} and a desire to share these rich flavors with our community. Our journey began with traditional family recipes passed down through generations, each dish crafted with love and attention to detail.`,
          `From our signature sweets to our aromatic curries, every item on our menu represents the perfect blend of tradition and innovation. We source the finest ingredients and use traditional cooking methods to ensure that every bite transports you to the vibrant streets of Pakistan and India.`,
        ],
      },
      philosophy: {
        title: 'Our Philosophy',
        intro: `At ${brandConfig.businessName}, we believe that food is more than sustenance—it's a celebration of culture, heritage, and community. Our commitment to quality means:`,
        points: [
          {
            title: 'Authentic Recipes',
            description: 'Traditional cooking methods and family recipes passed down through generations',
          },
          {
            title: 'Fresh Ingredients',
            description: 'Sourced daily from trusted suppliers to ensure the highest quality',
          },
          {
            title: 'Handcrafted with Care',
            description: 'Every dish is prepared fresh to order by our experienced chefs',
          },
          {
            title: 'Halal Certified',
            description: 'All our meats are 100% halal-certified for your peace of mind',
          },
          {
            title: 'Vegetarian Options',
            description: 'Extensive selection of vegetarian and vegan dishes',
          },
        ],
      },
      special: {
        title: 'What Makes Us Special',
        content: [
          `Our menu features a carefully curated selection of dishes that represent the best of ${brandConfig.cuisineType} cuisine. From the rich, creamy textures of our biryanis to the delicate sweetness of our traditional desserts, each dish is a testament to our culinary expertise.`,
          `Whether you're joining us for a family dinner, celebrating a special occasion, or simply craving authentic flavors, ${brandConfig.businessName} offers an unforgettable dining experience that combines traditional hospitality with modern convenience.`,
        ],
      },
      visit: {
        title: 'Visit Us',
        content: [
          `Experience the warmth of traditional ${brandConfig.cuisineType} hospitality at our restaurant. Our team is dedicated to making every visit memorable, from the moment you step through our doors to the last bite of your meal.`,
          `Can't make it to us? We offer convenient online ordering and delivery services, bringing our authentic cuisine straight to your doorstep.`,
        ],
      },
    },
    values: [
      {
        emoji: '🍛',
        title: 'Authentic Flavors',
        description: 'Traditional recipes prepared with authentic spices and techniques',
      },
      {
        emoji: '👨‍🍳',
        title: 'Expert Chefs',
        description: 'Experienced culinary team with decades of combined expertise',
      },
      {
        emoji: '⭐',
        title: 'Quality Service',
        description: 'Committed to excellence in every dish and every interaction',
      },
    ],
    cta: {
      title: `Ready to Experience ${brandConfig.businessName}?`,
      description: 'Explore our menu and place your order today',
      buttons: {
        primary: 'View Menu',
        secondary: 'Make a Reservation',
      },
    },
  },

  // Contact Page Content
  contact: {
    metadata: {
      title: `Contact Us - ${brandConfig.businessName}`,
      description: 'Get in touch with us for inquiries, feedback, or catering services',
    },
    title: 'Get in Touch',
    description: `Have a question, feedback, or special request? We'd love to hear from you. Fill out the form below or reach out directly using our contact information.`,
  },

  // Reservations Page Content
  reservations: {
    metadata: {
      title: `Bookings at ${brandConfig.businessName}`,
      description: `Planning a visit to enjoy our authentic Indo-Pak cuisine? Book your table now and ensure a seamless dining experience! Whether it's a family gathering, a special celebration, or a casual meal, we're here to make your time with us memorable.`,
    },
    title: 'Bookings at Anmol Sweets & Restaurant',
    description: `Planning a visit to enjoy our authentic Indo-Pak cuisine? Book your table now and ensure a seamless dining experience! Whether it's a family gathering, a special celebration, or a casual meal, we're here to make your time with us memorable.`,
    benefits: {
      title: 'Why Book with Us?',
      items: [
        {
          title: 'Guaranteed Seating',
          description: 'Avoid waiting and secure your spot in advance.',
        },
        {
          title: 'Special Requests',
          description: 'Let us know if you have any dietary preferences or need arrangements for special occasions.',
        },
        {
          title: 'Exclusive Offers',
          description: 'Be the first to know about our seasonal promotions and discounts.',
        },
      ],
    },
    howToBook: {
      title: 'How to Book:',
      steps: [
        'Fill out the form below with your details.',
        'Select your preferred date, time, and party size.',
        'Add any special requests or notes in the comments section.',
        'Hit Submit, and we will confirm your reservation shortly!',
      ],
    },
    walkIns: {
      title: 'Walk-Ins Welcome!',
      description: 'If you are spontaneous, do not worry – we always keep some tables open for walk-in guests. However, booking in advance is recommended, especially during weekends and holidays.',
    },
    policy: {
      title: 'Reservation Policy',
      points: [
        '• Reservations are recommended, especially for groups of 6 or more',
        '• Please arrive within 15 minutes of your reservation time',
        '• For large parties (10+ guests), please call us directly',
        '• Cancellations should be made at least 2 hours in advance',
        '• Special dietary requirements can be accommodated with advance notice',
      ],
    },
    largeGroups: {
      description: 'For large group bookings, private events, or any questions, feel free to call us at',
    },
  },

  // Privacy Policy Content
  privacy: {
    metadata: {
      title: `Privacy Policy - ${brandConfig.businessName}`,
      description: 'Our privacy policy and data protection practices',
    },
    title: 'Privacy Policy',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.privacyEmail || brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
  },

  // Terms & Conditions Content
  terms: {
    metadata: {
      title: `Terms & Conditions - ${brandConfig.businessName}`,
      description: 'Terms and conditions for using our website and services',
    },
    title: 'Terms & Conditions',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
    location: 'Stockholm', // Can be added to brand config
    country: 'Sweden', // Can be added to brand config
  },

  // Common Phrases (used across multiple pages)
  common: {
    orderNow: 'Order Now',
    viewMenu: 'View Menu',
    makeReservation: 'Make a Reservation',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    readMore: 'Read More',
    viewAll: 'View All',
    backToHome: 'Back to Home',

    // Image placeholders
    imagePlaceholders: {
      hero: 'Feature Your Hero Image Here',
      heroSubtext: 'Add an appetizing photo of your signature dish',
      restaurant: 'Add Restaurant Image',
      restaurantSubtext: 'Showcase your restaurant interior or team',
    },
  },
} as const;

// Type export
export type ContentConfig = typeof contentConfig;
