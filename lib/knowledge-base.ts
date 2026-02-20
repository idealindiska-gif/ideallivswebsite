import knowledgeBase from '@/data/knowledge-base.json';
import { brandConfig } from '@/config/brand.config';

interface KnowledgeBaseResponse {
    answer: string;
    confidence: 'high' | 'medium' | 'low';
    category?: string;
}

/**
 * Search the knowledge base for relevant information
 */
export function searchKnowledgeBase(query: string): KnowledgeBaseResponse {
    const lowerQuery = query.toLowerCase();

    // Check for keyword matches
    const matchedKeywords = findMatchingKeywords(lowerQuery);

    // Check for specific intents based on keywords
    if (matchedKeywords.includes('spicy') || matchedKeywords.includes('heat')) {
        return getSpiceInfo(lowerQuery);
    }

    if (matchedKeywords.includes('sweet') || matchedKeywords.includes('dessert')) {
        return getSweetsInfo();
    }

    if (matchedKeywords.includes('vegetarian') || matchedKeywords.includes('veg')) {
        return getDietaryInfo('vegetarian');
    }

    if (matchedKeywords.includes('vegan')) {
        return getDietaryInfo('vegan');
    }

    if (matchedKeywords.includes('halal')) {
        return getDietaryInfo('halal');
    }

    if (matchedKeywords.includes('gluten')) {
        return getDietaryInfo('gluten_free');
    }

    if (matchedKeywords.includes('buffet')) {
        return getBuffetInfo();
    }

    if (matchedKeywords.includes('catering') || matchedKeywords.includes('event') || matchedKeywords.includes('party')) {
        return getCateringInfo();
    }

    if (matchedKeywords.includes('reservation') || matchedKeywords.includes('book') || matchedKeywords.includes('table')) {
        return getReservationInfo();
    }

    if (matchedKeywords.includes('location') || matchedKeywords.includes('where') || matchedKeywords.includes('address')) {
        return getLocationInfo();
    }

    if (matchedKeywords.includes('hours') || matchedKeywords.includes('open') || matchedKeywords.includes('timing')) {
        return getHoursInfo();
    }

    if (matchedKeywords.includes('menu') || matchedKeywords.includes('dishes')) {
        return getMenuInfo();
    }

    if (matchedKeywords.includes('delivery')) {
        return getDeliveryInfo();
    }

    if (matchedKeywords.includes('price') || matchedKeywords.includes('cost')) {
        return getPriceInfo();
    }

    // Try to find FAQ match
    const faqMatch = findFAQMatch(lowerQuery);
    if (faqMatch) {
        return {
            answer: faqMatch.answer,
            confidence: 'high',
            category: faqMatch.category
        };
    }

    // Check for specific dish mentions
    const dishMatch = findDishMatch(lowerQuery);
    if (dishMatch) {
        return dishMatch;
    }

    // Default response
    return getDefaultResponse();
}

function findMatchingKeywords(query: string): string[] {
    const matched: string[] = [];
    Object.entries(knowledgeBase.keywords).forEach(([category, keywords]) => {
        if (keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
            matched.push(category);
        }
    });
    return matched;
}

function findFAQMatch(query: string): any {
    return knowledgeBase.faqs.find(faq =>
        query.includes(faq.question.toLowerCase()) ||
        faq.question.toLowerCase().includes(query) ||
        calculateSimilarity(query, faq.question.toLowerCase()) > 0.6
    );
}

function findDishMatch(query: string): KnowledgeBaseResponse | null {
    const dish = knowledgeBase.popular_dishes.find(d =>
        query.includes(d.name.toLowerCase())
    );

    if (dish) {
        const dietaryInfo = dish.dietary.length > 0 ? ` (${dish.dietary.join(', ')})` : '';
        return {
            answer: `**${dish.name}** - ${dish.description}. Spice level: ${dish.spice_level}${dietaryInfo}. Would you like to see our full menu?`,
            confidence: 'high',
            category: 'dish'
        };
    }

    return null;
}

function getSpiceInfo(query: string): KnowledgeBaseResponse {
    if (query.includes('not spicy') || query.includes('mild')) {
        return {
            answer: "Looking for mild spices? We carry **MDH Mild Curry**, **Shaan Korma Mix**, and **TRS Coriander Powder** — great for gentle flavours. Browse all spices in our [Shop](/shop).",
            confidence: 'high',
            category: 'spice'
        };
    }
    return {
        answer: "For bold heat, check out **MDH Chilli Powder**, **Shaan Karahi Mix**, or **TRS Hot Curry Powder**. We stock a wide range of whole and ground spices. Browse our [spice collection](/shop)!",
        confidence: 'high',
        category: 'spice'
    };
}

function getSweetsInfo(): KnowledgeBaseResponse {
    return {
        answer: `We stock a great range of Indian sweets and desserts! Look for **Haldiram's Sweets**, **Laziza Dessert Mixes**, **Rooh Afza**, and **Ahmed Custard Powder**. Browse our [Shop](/shop) for the full selection!`,
        confidence: 'high',
        category: 'sweets'
    };
}

function getDietaryInfo(type: string): KnowledgeBaseResponse {
    const info = knowledgeBase.dietary_options[type as keyof typeof knowledgeBase.dietary_options];
    if (info && info.available) {
        const examples = 'examples' in info ? (info.examples as string[]).join(', ') : '';
        let answer = info.description;
        if (examples) {
            answer += ` Try: ${examples}.`;
        }
        if ('note' in info) {
            answer += ` ${info.note}`;
        }
        return {
            answer,
            confidence: 'high',
            category: 'dietary'
        };
    }
    return getDefaultResponse();
}

function getBuffetInfo(): KnowledgeBaseResponse {
    return {
        answer: `We carry everything you need to cook a feast at home! From **Basmati rice** and **Shaan spice mixes** to **frozen halal meats** and **ready-to-cook sauces**. Browse our [Shop](/shop) to stock up!`,
        confidence: 'high',
        category: 'products'
    };
}

function getCateringInfo(): KnowledgeBaseResponse {
    return {
        answer: `Planning a large gathering? We stock bulk quantities of rice, spices, lentils, and more — perfect for cooking for big groups. Contact us at **${brandConfig.contact.email}** or call **${brandConfig.contact.phone}** for bulk orders!`,
        confidence: 'high',
        category: 'bulk-orders'
    };
}

function getReservationInfo(): KnowledgeBaseResponse {
    return {
        answer: `You can shop online at any time and we'll deliver to your door! For large or special orders, contact us at **${brandConfig.contact.reservationEmail}** or call **${brandConfig.contact.phone}**.`,
        confidence: 'high',
        category: 'orders'
    };
}

function getLocationInfo(): KnowledgeBaseResponse {
    return {
        answer: `We're located at **${brandConfig.contact.address}**.\n\nFind us on [Google Maps](${brandConfig.contact.googleMapsUrl}) for directions!`,
        confidence: 'high',
        category: 'location'
    };
}

function getHoursInfo(): KnowledgeBaseResponse {
    return {
        answer: `**Opening Hours:**\n\n${brandConfig.hours.weekday}\n${brandConfig.hours.saturday}\n${brandConfig.hours.sunday}`,
        confidence: 'high',
        category: 'hours'
    };
}

function getMenuInfo(): KnowledgeBaseResponse {
    const categories = ["Rice & Grains", "Spices & Masalas", "Lentils & Pulses", "Flours & Baking", "Frozen & Halal Meat", "Snacks & Drinks", "Oils & Ghee", "Personal Care"];

    return {
        answer: `We stock 1500+ products across categories: ${categories.join(', ')} and more.\n\nBrowse our full [Shop](/shop) or search for your favourite brands!`,
        confidence: 'high',
        category: 'products'
    };
}

function getDeliveryInfo(): KnowledgeBaseResponse {
    return {
        answer: `**Yes, we deliver!**\n\n🚚 **Stockholm:** Free delivery on orders over 500kr\n✈️ **Europe:** Worldwide shipping via DHL\n\nOrder online through our [Shop](/shop) or call us at **${brandConfig.contact.phone}** for more details!`,
        confidence: 'high',
        category: 'delivery'
    };
}

function getPriceInfo(): KnowledgeBaseResponse {
    return {
        answer: `We offer competitive prices on all ${brandConfig.cuisineDescription}! Prices are shown on each product page.\n\nFree delivery on Stockholm orders over **500kr**. Browse our [Shop](/shop) or contact us at **${brandConfig.contact.phone}** for bulk pricing!`,
        confidence: 'medium',
        category: 'pricing'
    };
}

function getDefaultResponse(): KnowledgeBaseResponse {
    return {
        answer: `I'd be happy to help! At **${brandConfig.businessName}** we stock 1500+ ${brandConfig.cuisineDescription} with delivery across Sweden & Europe.\n\nYou can:\n- 🛒 Browse our [Shop](/shop)\n- 🌶️ Explore [Spices & Masalas](/shop)\n- 🍚 Find [Rice & Grains](/shop)\n- 📍 Visit us at ${brandConfig.contact.address}\n- 📞 Call us: ${brandConfig.contact.phone}\n\nWhat can I help you find today?`,
        confidence: 'low'
    };
}

// Simple similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
}

export function getGreeting(): string {
    return `Hello! I'm your **Ideal Indiska Assistant**. I can help you with:\n\n🛒 Finding products & brands\n🌶️ Spices, rice & grocery recommendations\n🚚 Delivery & shipping info\n📍 Store location & opening hours\n💬 Any questions about our products\n\nWhat can I help you find today?`;
}
