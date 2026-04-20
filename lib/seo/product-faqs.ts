export interface ProductFAQ {
  question: string;
  answer: string;
}

function getCategoryFAQs(categorySlugs: string[], productName: string): ProductFAQ[] {
  const isRice = categorySlugs.some(s => s.includes('rice') || s.includes('ris') || s.includes('basmati'));
  const isSpice = categorySlugs.some(s => s.includes('spice') || s.includes('masala') || s.includes('krydda') || s.includes('spices'));
  const isLentil = categorySlugs.some(s => s.includes('lentil') || s.includes('dal') || s.includes('linser') || s.includes('beans'));
  const isFlour = categorySlugs.some(s => s.includes('flour') || s.includes('atta') || s.includes('mjöl'));
  const isFrozen = categorySlugs.some(s => s.includes('frozen') || s.includes('fryst'));
  const isSnack = categorySlugs.some(s => s.includes('snack') || s.includes('biscuit') || s.includes('cookie'));
  const isGhee = categorySlugs.some(s => s.includes('ghee') || s.includes('butter') || s.includes('oil'));
  const isBeverage = categorySlugs.some(s => s.includes('drink') || s.includes('juice') || s.includes('tea') || s.includes('coffee'));

  const deliveryFAQ: ProductFAQ = {
    question: `How fast can I get ${productName} delivered in Sweden?`,
    answer: `We offer same-day or next-day delivery in Stockholm, and DHL shipping to Gothenburg, Malmö, and the rest of Sweden within 1–3 business days. Orders over 499 kr qualify for free delivery in Stockholm.`,
  };

  const halalFAQ: ProductFAQ = {
    question: `Is ${productName} halal-certified?`,
    answer: `All applicable products at Ideal Indiska LIVS are sourced from trusted halal-certified suppliers. Check the product label or contact us via WhatsApp for certification details on specific items.`,
  };

  const returnFAQ: ProductFAQ = {
    question: 'Can I return food products if I am not satisfied?',
    answer: `We accept returns on unopened, non-perishable items within 14 days of delivery. If you received a damaged or incorrect item, contact us immediately and we will arrange a replacement or full refund.`,
  };

  if (isRice) {
    return [
      {
        question: `How do I cook ${productName} perfectly?`,
        answer: `Rinse the rice 2–3 times until the water runs clear. Use a 1:1.5 ratio (rice:water). Soak for 20–30 minutes before cooking for fluffier, extra-long grains. Bring to a boil, reduce heat, and simmer covered for 15 minutes. Rest for 5 minutes before fluffing.`,
      },
      {
        question: `What dishes can I make with ${productName}?`,
        answer: `Basmati rice is ideal for biryani, pulao, jeera rice, dum aloo, and as a plain accompaniment to curries and dals. Its long, aromatic grains stay separate after cooking, making it perfect for layered rice dishes.`,
      },
      deliveryFAQ,
      halalFAQ,
    ];
  }

  if (isSpice) {
    return [
      {
        question: `How should I store ${productName} to keep it fresh?`,
        answer: `Store in a cool, dry place away from direct sunlight. Keep the packet tightly sealed after opening, or transfer to an airtight container. Properly stored, ground spices retain peak flavour for 12–18 months.`,
      },
      {
        question: `How much ${productName} should I use per serving?`,
        answer: `For most masala blends, start with 1–2 teaspoons per 500g of meat or vegetables. Adjust to your heat and flavour preference. Always fry the spice blend briefly in oil before adding liquid for maximum aroma release.`,
      },
      deliveryFAQ,
      returnFAQ,
    ];
  }

  if (isLentil) {
    return [
      {
        question: `Do I need to soak ${productName} before cooking?`,
        answer: `Split lentils (moong dal, masoor dal, chana dal) generally do not require soaking and cook in 20–30 minutes. Whole lentils and chickpeas benefit from overnight soaking to reduce cooking time and improve digestibility.`,
      },
      {
        question: `How do I make a simple dal with ${productName}?`,
        answer: `Rinse well, then pressure cook with water, turmeric, and salt. In a separate pan, heat oil and add cumin seeds, garlic, onion, and tomato for the tadka. Pour the tadka over the cooked lentils and simmer for 5 minutes. Serve with rice or roti.`,
      },
      deliveryFAQ,
      halalFAQ,
    ];
  }

  if (isFlour) {
    return [
      {
        question: `What is the difference between chakki atta and regular flour?`,
        answer: `Chakki atta is stone-ground whole wheat flour that retains the bran and germ, giving it higher fibre content and a nuttier flavour compared to refined white flour. It is the traditional base for Indian rotis, chapatis, and parathas.`,
      },
      {
        question: `How many rotis can I make from 1kg of ${productName}?`,
        answer: `Approximately 25–30 medium-sized rotis per kilogram of atta, depending on thickness. A 5kg bag yields around 125–150 rotis — suitable for a family over several weeks.`,
      },
      deliveryFAQ,
      returnFAQ,
    ];
  }

  if (isFrozen) {
    return [
      {
        question: `How should I store and reheat ${productName}?`,
        answer: `Keep frozen at -18°C or below. Once thawed, do not refreeze. Reheat thoroughly until piping hot throughout before serving. Oven reheating at 180°C for 15–20 minutes typically gives the best texture compared to microwave.`,
      },
      {
        question: `Is ${productName} suitable for vegetarians or vegans?`,
        answer: `Check the product label for specific dietary information. We carry a wide range of vegetarian and vegan frozen foods including samosas, parathas, and vegetable starters. Contact us if you need clarification on a specific item.`,
      },
      deliveryFAQ,
      halalFAQ,
    ];
  }

  if (isGhee) {
    return [
      {
        question: `What is the difference between ghee and regular butter?`,
        answer: `Ghee is clarified butter with the milk solids and water removed, giving it a higher smoke point (250°C vs 175°C for butter), longer shelf life without refrigeration, and a richer, nuttier flavour. It is suitable for high-heat cooking and is a staple in Indian cuisine.`,
      },
      {
        question: `How long does ${productName} last once opened?`,
        answer: `Pure ghee can be stored at room temperature for up to 3 months after opening when kept in a sealed container away from moisture and light. Refrigeration extends shelf life to 12 months.`,
      },
      deliveryFAQ,
      returnFAQ,
    ];
  }

  if (isBeverage) {
    return [
      {
        question: `How should I prepare ${productName}?`,
        answer: `Follow the instructions on the packaging. For most instant mixes and powdered drinks, dissolve in hot or cold water as directed and adjust sweetness to taste. Store in a cool, dry place after opening.`,
      },
      deliveryFAQ,
      halalFAQ,
      returnFAQ,
    ];
  }

  // Generic fallback FAQs for any product
  return [
    deliveryFAQ,
    halalFAQ,
    {
      question: `Is ${productName} authentic and imported?`,
      answer: `Yes — we source directly from trusted importers to ensure you receive genuine, authentic Indian and Pakistani products, the same brands you would find in South Asian grocery stores worldwide.`,
    },
    returnFAQ,
  ];
}

export function getProductFAQs(
  productName: string,
  categories: Array<{ slug: string; name: string }> = []
): ProductFAQ[] {
  const categorySlugs = categories.map(c => c.slug);
  return getCategoryFAQs(categorySlugs, productName);
}

export function faqPageSchema(faqs: ProductFAQ[], baseId?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(baseId ? { '@id': `${baseId}#faq` } : {}),
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
