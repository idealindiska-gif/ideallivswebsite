/**
 * Update Shan & National Products Content
 * Targeting Pakistani community in Sweden & Europe
 * Run: node scripts/update-shan-national-content.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

// SHAN PRODUCTS METADATA
const SHAN_METADATA = {
    // BIRYANI MASALAS
    130: { brand: 'Shan', desc: 'Biryani Masala', dish: 'Classic Chicken/Mutton Biryani', relatedDishes: 'Pulao, Yakhni', swedishConnection: 'Like the Swedish "Kryddpeppar" blend but specifically crafted for layered rice dishes. Biryani is Pakistan\'s answer to Sweden\'s beloved "Wallenbergare" - a special occasion dish that brings families together.', keywords: ['Shan Biryani Masala Sweden', 'Pakistani Biryani Stockholm', 'Authentic Biryani Spices'] },
    121: { brand: 'Shan', desc: 'Special Bombay Biryani Masala', dish: 'Bombay-Style Biryani', relatedDishes: 'Hyderabadi Biryani, Sindhi Biryani', swedishConnection: 'The Bombay version adds a tangy twist with dried plums, similar to how Swedes add lingonberry ("Lingonsylt") to meatballs for that sweet-sour balance.', keywords: ['Bombay Biryani Sweden', 'Shan Masala Stockholm'] },
    119: { brand: 'Shan', desc: 'Sindhi Biryani Masala', dish: 'Spicy Sindhi Biryani', relatedDishes: 'Karachi Biryani', swedishConnection: 'Known for its fiery heat and tangy yogurt marinade. For Swedes who love "Stark senap" (strong mustard), this brings that same bold kick to rice.', keywords: ['Sindhi Biryani Sweden', 'Spicy Pakistani Rice'] },
    138: { brand: 'Shan', desc: 'Malay Chicken Biryani', dish: 'Malaysian-Pakistani Fusion Biryani', relatedDishes: 'Nasi Goreng', swedishConnection: 'A fusion blend that Pakistani expats in Malaysia created, much like how Swedish-Asian fusion has become popular in Stockholm restaurants.', keywords: ['Malay Biryani Sweden', 'Fusion Pakistani Food'] },
    135: { brand: 'Shan', desc: 'Pilau Biryani', dish: 'Mild Aromatic Pilau', relatedDishes: 'Yakhni Pulao', swedishConnection: 'A gentler, aromatic rice dish similar to Swedish "Risgrynsgröt" (rice porridge) but savory. Perfect for those new to Pakistani cuisine.', keywords: ['Pilau Rice Sweden', 'Mild Biryani'] },
    133: { brand: 'Shan', desc: 'Vegetable Biryani', dish: 'Vegetarian Biryani', relatedDishes: 'Paneer Biryani', swedishConnection: 'For Sweden\'s growing vegetarian community, this offers the same aromatic experience without meat - like a spiced version of "Rotmos" (root vegetable mash).', keywords: ['Vegetarian Biryani Sweden', 'Vegan Pakistani Food'] },

    // MEAT MASALAS
    139: { brand: 'Shan', desc: 'Karahi Masala', dish: 'Karahi Chicken/Gosht', relatedDishes: 'Balti Curry', swedishConnection: 'Cooked in a wok-like "karahi" pan with tomatoes and green chilies. Similar to Swedish "Gryta" (stew) but with a smoky, charred flavor from high-heat cooking.', keywords: ['Karahi Masala Sweden', 'Pakistani Wok Curry'] },
    117: { brand: 'Shan', desc: 'Karahi Masala 50g', dish: 'Karahi Chicken/Gosht', relatedDishes: 'Balti Curry', swedishConnection: 'Cooked in a wok-like "karahi" pan with tomatoes and green chilies. Similar to Swedish "Gryta" (stew) but with a smoky, charred flavor from high-heat cooking.', keywords: ['Karahi Masala Sweden', 'Pakistani Wok Curry'] },
    126: { brand: 'Shan', desc: 'Chicken White Karahi', dish: 'Creamy White Karahi', relatedDishes: 'Korma', swedishConnection: 'A milder, cream-based curry that Swedes often prefer. Like "Gräddsås" (cream sauce) but with aromatic Pakistani spices.', keywords: ['White Karahi Sweden', 'Mild Pakistani Curry'] },
    118: { brand: 'Shan', desc: 'Korma Masala', dish: 'Shahi Korma', relatedDishes: 'Pasanda', swedishConnection: 'A royal Mughlai dish with nuts and cream. The Pakistani equivalent of Swedish "Kalops" - rich, slow-cooked, and fit for special occasions.', keywords: ['Korma Masala Sweden', 'Creamy Pakistani Curry'] },
    134: { brand: 'Shan', desc: 'Meat Masala', dish: 'General Meat Curry', relatedDishes: 'Salan, Qorma', swedishConnection: 'An all-purpose meat spice blend, as essential to Pakistani kitchens as "Köttbullar kryddor" is to Swedish homes.', keywords: ['Meat Masala Sweden', 'Pakistani Curry Spices'] },
    115: { brand: 'Shan', desc: 'Achar Gosht Masala', dish: 'Pickle-Flavored Meat Curry', relatedDishes: 'Achari Chicken', swedishConnection: 'Combines curry with pickle spices. Like adding "Inlagd gurka" (pickled cucumber) flavor to your stew - tangy and addictive.', keywords: ['Achar Gosht Sweden', 'Pickle Curry'] },
    120: { brand: 'Shan', desc: 'Paya Masala', dish: 'Slow-Cooked Trotters Soup', relatedDishes: 'Nihari', swedishConnection: 'A traditional breakfast soup, similar to Swedish "Ärtsoppa" (pea soup) but made with meat trotters. Rich, gelatinous, and deeply nourishing.', keywords: ['Paya Masala Sweden', 'Pakistani Soup'] },

    // GRILLED & BBQ
    122: { brand: 'Shan', desc: 'Tikka Masala', dish: 'Chicken Tikka', relatedDishes: 'Tandoori Chicken', swedishConnection: 'Marinated and grilled chunks, perfect for Swedish summer BBQs. Like "Grillspett" (kebabs) but with Pakistani flair.', keywords: ['Tikka Masala Sweden', 'BBQ Spices Pakistani'] },
    419: { brand: 'Shan', desc: 'Chicken Tikka 50g', dish: 'Chicken Tikka', relatedDishes: 'Tandoori Chicken', swedishConnection: 'Marinated and grilled chunks, perfect for Swedish summer BBQs. Like "Grillspett" (kebabs) but with Pakistani flair.', keywords: ['Tikka Masala Sweden', 'BBQ Spices Pakistani'] },
    123: { brand: 'Shan', desc: 'Tandoori Masala', dish: 'Tandoori Chicken', relatedDishes: 'Tikka, Seekh Kebab', swedishConnection: 'The iconic red-orange marinade for clay oven cooking. Swedes can achieve similar results using their "Grill" or oven.', keywords: ['Tandoori Masala Sweden', 'Pakistani BBQ'] },
    136: { brand: 'Shan', desc: 'Tikka Seekh Kebab', dish: 'Minced Meat Skewers', relatedDishes: 'Chapli Kebab', swedishConnection: 'Ground meat on skewers, similar to Swedish "Köttfärsspett" but with aromatic spices and herbs.', keywords: ['Seekh Kebab Sweden', 'Pakistani Grilled Meat'] },
    128: { brand: 'Shan', desc: 'Kofta Masala', dish: 'Meatball Curry', relatedDishes: 'Nargisi Kofta', swedishConnection: 'Pakistani meatballs in curry! Like Swedish "Köttbullar" but swimming in a spicy tomato gravy instead of cream sauce.', keywords: ['Kofta Masala Sweden', 'Pakistani Meatballs'] },
    125: { brand: 'Shan', desc: 'Lahori Charga Masala', dish: 'Whole Roasted Chicken', relatedDishes: 'Tandoori Chicken', swedishConnection: 'A Lahori street food specialty - whole chicken marinated and deep-fried. The Pakistani version of Swedish "Helstekt kyckling" (roast chicken).', keywords: ['Lahori Charga Sweden', 'Pakistani Fried Chicken'] },
    849: { brand: 'Shan', desc: 'Lahori Fish Masala', dish: 'Crispy Fried Fish', relatedDishes: 'Fish Tikka', swedishConnection: 'Perfect for Swedish fish like "Torsk" (cod) or "Lax" (salmon). Gives your fish fry a Pakistani street food twist.', keywords: ['Lahori Fish Sweden', 'Pakistani Fish Fry'] },

    // LENTILS & VEGETABLES
    127: { brand: 'Shan', desc: 'Chana Masala', dish: 'Chickpea Curry', relatedDishes: 'Chole', swedishConnection: 'Spiced chickpeas, similar to how Swedes enjoy "Kikärtor" in salads, but transformed into a hearty curry.', keywords: ['Chana Masala Sweden', 'Chickpea Curry Pakistani'] },
    925: { brand: 'Shan', desc: 'Easy Cook Haleem Mix', dish: 'Lentil & Meat Porridge', relatedDishes: 'Daleem', swedishConnection: 'A thick, porridge-like dish combining lentils and meat. Like Swedish "Gröt" (porridge) but savory, spicy, and protein-packed.', keywords: ['Haleem Sweden', 'Pakistani Porridge'] },
    416: { brand: 'Shan', desc: 'Special Shahi Haleem', dish: 'Royal Haleem', relatedDishes: 'Daleem', swedishConnection: 'A thick, porridge-like dish combining lentils and meat. Like Swedish "Gröt" (porridge) but savory, spicy, and protein-packed.', keywords: ['Haleem Sweden', 'Pakistani Porridge'] },

    // CHAT & SNACKS
    116: { brand: 'Shan', desc: 'Chaat Masala', dish: 'Fruit/Vegetable Chaat', relatedDishes: 'Dahi Bhalla, Samosa Chaat', swedishConnection: 'A tangy spice mix for salads and snacks. Sprinkle on Swedish "Fruktsallad" (fruit salad) for an unexpected flavor bomb!', keywords: ['Chaat Masala Sweden', 'Pakistani Salad Spice'] },
    137: { brand: 'Shan', desc: 'Fruit Chat Masala', dish: 'Fruit Chaat', relatedDishes: 'Vegetable Chaat', swedishConnection: 'A tangy spice mix for salads and snacks. Sprinkle on Swedish "Fruktsallad" (fruit salad) for an unexpected flavor bomb!', keywords: ['Chaat Masala Sweden', 'Pakistani Salad Spice'] },

    // PICKLES & CONDIMENTS
    325: { brand: 'Shan', desc: 'Mango Pickle 300g', dish: 'Side condiment', relatedDishes: 'Mixed Pickle', swedishConnection: 'Like Swedish "Inlagd gurka" (pickled cucumber) but with mangoes and Pakistani spices. Essential with every meal.', keywords: ['Mango Pickle Sweden', 'Pakistani Achaar'] },
    327: { brand: 'Shan', desc: 'Mango Pickle in Oil 1kg', dish: 'Side condiment', relatedDishes: 'Mixed Pickle', swedishConnection: 'Like Swedish "Inlagd gurka" (pickled cucumber) but with mangoes and Pakistani spices. Essential with every meal.', keywords: ['Mango Pickle Sweden', 'Pakistani Achaar'] },
    310: { brand: 'Shan', desc: 'Mixed Pickle 300g', dish: 'Side condiment', relatedDishes: 'Mango Pickle', swedishConnection: 'A medley of pickled vegetables, similar to "Blandade pickles" but with Pakistani heat and tang.', keywords: ['Mixed Pickle Sweden', 'Pakistani Condiments'] },
    308: { brand: 'Shan', desc: 'Mixed Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Mango Pickle', swedishConnection: 'A medley of pickled vegetables, similar to "Blandade pickles" but with Pakistani heat and tang.', keywords: ['Mixed Pickle Sweden', 'Pakistani Condiments'] },
    297: { brand: 'Shan', desc: 'Lemon Pickle 300gm', dish: 'Side condiment', relatedDishes: 'Lime Pickle', swedishConnection: 'Preserved lemons with spices, adding a citrus punch like "Citronpeppar" but more intense.', keywords: ['Lemon Pickle Sweden', 'Pakistani Achaar'] },
    322: { brand: 'Shan', desc: 'Lemon Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Lime Pickle', swedishConnection: 'Preserved lemons with spices, adding a citrus punch like "Citronpeppar" but more intense.', keywords: ['Lemon Pickle Sweden', 'Pakistani Achaar'] },
    309: { brand: 'Shan', desc: 'Chilli Pickle 300g', dish: 'Side condiment', relatedDishes: 'Green Chilli Pickle', swedishConnection: 'For those who love "Stark mat" (spicy food). Pure heat in a jar!', keywords: ['Chilli Pickle Sweden', 'Spicy Pakistani Pickle'] },
    321: { brand: 'Shan', desc: 'Chilli Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Green Chilli Pickle', swedishConnection: 'For those who love "Stark mat" (spicy food). Pure heat in a jar!', keywords: ['Chilli Pickle Sweden', 'Spicy Pakistani Pickle'] },
    296: { brand: 'Shan', desc: 'Garlic Pickle 300gm', dish: 'Side condiment', relatedDishes: 'Mixed Pickle', swedishConnection: 'For garlic lovers! Like "Vitlök" (garlic) but pickled and spiced. Perfect with "Rotmos" or rice.', keywords: ['Garlic Pickle Sweden', 'Pakistani Achaar'] },

    // PASTES
    287: { brand: 'Shan', desc: 'Ginger Garlic Paste 700gm', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'A time-saver for Pakistani cooking, like having "Vitlökspasta" (garlic paste) but combined with ginger. Essential for authentic flavor.', keywords: ['Ginger Garlic Paste Sweden', 'Pakistani Cooking Base'] },
    288: { brand: 'Shan', desc: 'Ginger Garlic Paste 310gm', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'A time-saver for Pakistani cooking, like having "Vitlökspasta" (garlic paste) but combined with ginger. Essential for authentic flavor.', keywords: ['Ginger Garlic Paste Sweden', 'Pakistani Cooking Base'] },
    317: { brand: 'Shan', desc: 'Garlic Paste 700g', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'Pure garlic paste for cooking. Like "Vitlökspasta" but fresher and more pungent.', keywords: ['Garlic Paste Sweden', 'Pakistani Ingredients'] },
    295: { brand: 'Shan', desc: 'Garlic Paste 310gm', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'Pure garlic paste for cooking. Like "Vitlökspasta" but fresher and more pungent.', keywords: ['Garlic Paste Sweden', 'Pakistani Ingredients'] },
    318: { brand: 'Shan', desc: 'Ginger Paste 700g', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'Fresh ginger paste, essential for Pakistani cooking. Like having "Ingefära" (ginger) ready to use.', keywords: ['Ginger Paste Sweden', 'Pakistani Cooking'] },
    294: { brand: 'Shan', desc: 'Ginger Paste 310gm', dish: 'Cooking base', relatedDishes: 'All curries', swedishConnection: 'Fresh ginger paste, essential for Pakistani cooking. Like having "Ingefära" (ginger) ready to use.', keywords: ['Ginger Paste Sweden', 'Pakistani Cooking'] },

    // VERMICELLI
    540: { brand: 'Shan', desc: 'Vermicelli (Seviyan)', dish: 'Sweet Seviyan', relatedDishes: 'Kheer', swedishConnection: 'Thin noodles used for sweet dishes, like Swedish "Ris à la Malta" but with roasted vermicelli instead of rice.', keywords: ['Seviyan Sweden', 'Pakistani Dessert'] },
};

// NATIONAL PRODUCTS METADATA  
const NATIONAL_METADATA = {
    // BIRYANI MASALAS
    102: { brand: 'National', desc: 'Biryani Masala', dish: 'Classic Chicken/Mutton Biryani', relatedDishes: 'Pulao, Yakhni', swedishConnection: 'National\'s signature blend for Pakistan\'s national dish. Like the Swedish "Kryddpeppar" but for layered rice perfection.', keywords: ['National Biryani Sweden', 'Pakistani Biryani Spices'] },
    103: { brand: 'National', desc: 'Bombay Biryani', dish: 'Bombay-Style Biryani', relatedDishes: 'Sindhi Biryani', swedishConnection: 'Adds dried plums for sweetness, like adding "Lingonsylt" to balance rich flavors.', keywords: ['Bombay Biryani National Sweden'] },
    132: { brand: 'National', desc: 'Mutton Biryani', dish: 'Mutton Biryani', relatedDishes: 'Lamb Biryani', swedishConnection: 'Specifically for lamb/mutton, like Swedish "Lammgryta" (lamb stew) but with aromatic rice.', keywords: ['Mutton Biryani Sweden', 'Lamb Biryani'] },
    131: { brand: 'National', desc: 'Beef Biryani', dish: 'Beef Biryani', relatedDishes: 'Beef Pulao', swedishConnection: 'For beef lovers, transforming Swedish "Oxfilé" (beef tenderloin) into Pakistani royalty.', keywords: ['Beef Biryani Sweden', 'Pakistani Beef Rice'] },
    847: { brand: 'National', desc: 'Sindhi Biryani Masala', dish: 'Spicy Sindhi Biryani', relatedDishes: 'Karachi Biryani', swedishConnection: 'Extra spicy with yogurt and potatoes. For those who love "Stark senap" with everything!', keywords: ['Sindhi Biryani National Sweden'] },
    848: { brand: 'National', desc: 'Chicken Biryani Masala', dish: 'Chicken Biryani', relatedDishes: 'Chicken Pulao', swedishConnection: 'Specially balanced for chicken, like Swedish "Kycklinggryta" (chicken stew) elevated to festive status.', keywords: ['Chicken Biryani National Sweden'] },

    // MEAT MASALAS
    129: { brand: 'National', desc: 'Karahi Gosht', dish: 'Karahi Mutton/Beef', relatedDishes: 'Balti', swedishConnection: 'Wok-cooked meat with tomatoes, like Swedish "Gryta" but with charred, smoky notes.', keywords: ['Karahi Gosht Sweden', 'Pakistani Meat Curry'] },
    112: { brand: 'National', desc: 'Qeema Masala', dish: 'Minced Meat Curry', relatedDishes: 'Keema Matar', swedishConnection: 'Spiced ground meat, the Pakistani version of Swedish "Köttfärssås" (meat sauce) but with peas and aromatic spices.', keywords: ['Qeema Masala Sweden', 'Pakistani Minced Meat'] },
    100: { brand: 'National', desc: 'Achar Gosht', dish: 'Pickle-Flavored Meat', relatedDishes: 'Achari Chicken', swedishConnection: 'Meat cooked with pickle spices, like adding "Inlagd gurka" flavor to your stew.', keywords: ['Achar Gosht National Sweden'] },
    104: { brand: 'National', desc: 'Butter Chicken', dish: 'Butter Chicken', relatedDishes: 'Tikka Masala', swedishConnection: 'Creamy tomato-based curry, similar to Swedish "Gräddsås" (cream sauce) but with tandoori spices.', keywords: ['Butter Chicken National Sweden'] },
    107: { brand: 'National', desc: 'Chicken Jalfrezi Masala', dish: 'Chicken Jalfrezi', relatedDishes: 'Kadhai Chicken', swedishConnection: 'Stir-fried chicken with peppers, like Swedish "Wok" but with Pakistani flair.', keywords: ['Jalfrezi Sweden', 'Pakistani Stir Fry'] },
    108: { brand: 'National', desc: 'Chicken Tikka', dish: 'Chicken Tikka', relatedDishes: 'Tandoori Chicken', swedishConnection: 'Perfect for Swedish BBQ season, like "Grillspett" with Pakistani marinade.', keywords: ['Chicken Tikka National Sweden'] },
    109: { brand: 'National', desc: 'Chicken White Karahi', dish: 'Creamy White Karahi', relatedDishes: 'Korma', swedishConnection: 'Mild and creamy, perfect for Swedish palates used to "Gräddsås".', keywords: ['White Karahi National Sweden'] },

    // GRILLED & BBQ
    114: { brand: 'National', desc: 'Tandoori Masala', dish: 'Tandoori Chicken', relatedDishes: 'Tikka', swedishConnection: 'The iconic red marinade, perfect for Swedish "Grill" or oven.', keywords: ['Tandoori National Sweden'] },
    101: { brand: 'National', desc: 'Bihari Kebab', dish: 'Bihari Kebab', relatedDishes: 'Seekh Kebab', swedishConnection: 'Thin-sliced marinated meat, like Swedish "Skivat kött" but for grilling.', keywords: ['Bihari Kebab Sweden'] },
    106: { brand: 'National', desc: 'Chapli Kebab', dish: 'Chapli Kebab', relatedDishes: 'Seekh Kebab', swedishConnection: 'Flat, spiced meat patties from Peshawar, like Swedish "Biffar" (patties) but with Pakistani spices.', keywords: ['Chapli Kebab Sweden'] },
    110: { brand: 'National', desc: 'Fried Fish Masala', dish: 'Crispy Fried Fish', relatedDishes: 'Fish Tikka', swedishConnection: 'Perfect for Swedish fish like "Abborre" (perch) or "Torsk" (cod).', keywords: ['Fried Fish National Sweden'] },
    846: { brand: 'National', desc: 'Tikka Boti Masala', dish: 'BBQ Meat Chunks', relatedDishes: 'Tikka', swedishConnection: 'For grilling meat chunks, like Swedish "Grillspett" with Pakistani spices.', keywords: ['Tikka Boti Sweden'] },

    // LENTILS & VEGETABLES
    417: { brand: 'National', desc: 'Shahi Daal', dish: 'Royal Lentils', relatedDishes: 'Dal Makhani', swedishConnection: 'Creamy lentils, like Swedish "Ärtsoppa" (pea soup) but richer and more aromatic.', keywords: ['Shahi Dal Sweden'] },
    415: { brand: 'National', desc: 'Daal Makhni', dish: 'Butter Lentils', relatedDishes: 'Shahi Dal', swedishConnection: 'Black lentils in butter and cream, the ultimate comfort food like Swedish "Ärtsoppa".', keywords: ['Dal Makhani National Sweden'] },
    418: { brand: 'National', desc: 'Chana Masala', dish: 'Chickpea Curry', relatedDishes: 'Chole', swedishConnection: 'Spiced chickpeas, transforming Swedish "Kikärtor" into a hearty curry.', keywords: ['Chana Masala National Sweden'] },
    414: { brand: 'National', desc: 'Pav/Sabzi Masala', dish: 'Vegetable Curry', relatedDishes: 'Mixed Vegetables', swedishConnection: 'For all vegetables, like Swedish "Rotmos" (root vegetable mash) but as a curry.', keywords: ['Sabzi Masala Sweden'] },
    845: { brand: 'National', desc: 'Haleem Spice Mix', dish: 'Lentil & Meat Porridge', relatedDishes: 'Daleem', swedishConnection: 'Thick porridge with lentils and meat, like Swedish "Gröt" but savory and protein-rich.', keywords: ['Haleem National Sweden'] },
    111: { brand: 'National', desc: 'Delhi Nihari Masala', dish: 'Slow-Cooked Meat Stew', relatedDishes: 'Paya', swedishConnection: 'Overnight-cooked meat stew, like Swedish "Kalops" (beef stew) but with bone marrow richness.', keywords: ['Nihari Sweden', 'Pakistani Stew'] },
    873: { brand: 'National', desc: 'Nihari Masala 120g', dish: 'Slow-Cooked Meat Stew', relatedDishes: 'Paya', swedishConnection: 'Overnight-cooked meat stew, like Swedish "Kalops" (beef stew) but with bone marrow richness.', keywords: ['Nihari Sweden', 'Pakistani Stew'] },
    124: { brand: 'National', desc: 'Nihari Masala 60g', dish: 'Slow-Cooked Meat Stew', relatedDishes: 'Paya', swedishConnection: 'Overnight-cooked meat stew, like Swedish "Kalops" (beef stew) but with bone marrow richness.', keywords: ['Nihari Sweden', 'Pakistani Stew'] },
    113: { brand: 'National', desc: 'Pulao Masala', dish: 'Aromatic Rice', relatedDishes: 'Biryani, Yakhni', swedishConnection: 'Mild aromatic rice, like Swedish "Ris" but with whole spices and flavor.', keywords: ['Pulao Sweden'] },

    // SNACKS & CHAT
    105: { brand: 'National', desc: 'Chaat Masala', dish: 'Fruit/Vegetable Chaat', relatedDishes: 'Samosa Chaat', swedishConnection: 'Tangy spice for salads and snacks. Try on Swedish "Fruktsallad"!', keywords: ['Chaat Masala National Sweden'] },
    420: { brand: 'National', desc: 'Chatt Pata Pakora Mix', dish: 'Vegetable Fritters', relatedDishes: 'Bhajia', swedishConnection: 'Batter for crispy fritters, like Swedish "Fiskbullar" (fish balls) but vegetarian.', keywords: ['Pakora Mix Sweden'] },

    // PICKLES & SAUCES
    291: { brand: 'National', desc: 'Mango Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Mixed Pickle', swedishConnection: 'Like "Inlagd gurka" but with mangoes and Pakistani spices.', keywords: ['Mango Pickle National Sweden'] },
    289: { brand: 'National', desc: 'Mixed Pickle 320gm', dish: 'Side condiment', relatedDishes: 'Mango Pickle', swedishConnection: 'Mixed vegetables in spices, like Swedish pickles but spicier.', keywords: ['Mixed Pickle National Sweden'] },
    290: { brand: 'National', desc: 'Mixed Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Mango Pickle', swedishConnection: 'Mixed vegetables in spices, like Swedish pickles but spicier.', keywords: ['Mixed Pickle National Sweden'] },
    292: { brand: 'National', desc: 'Lemon Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Lime Pickle', swedishConnection: 'Preserved lemons, like "Citronpeppar" but more intense.', keywords: ['Lemon Pickle National Sweden'] },
    293: { brand: 'National', desc: 'Chilli Pickle 1kg', dish: 'Side condiment', relatedDishes: 'Green Chilli Pickle', swedishConnection: 'Pure heat in a jar for "Stark mat" lovers!', keywords: ['Chilli Pickle National Sweden'] },
    340: { brand: 'National', desc: 'Garlic Pickle 310g', dish: 'Side condiment', relatedDishes: 'Mixed Pickle', swedishConnection: 'Pickled garlic, like "Vitlök" but preserved and spiced.', keywords: ['Garlic Pickle National Sweden'] },
    316: { brand: 'National', desc: 'Red Chilli Sauce 300g', dish: 'Dipping sauce', relatedDishes: 'Green Chilli Sauce', swedishConnection: 'Spicy red sauce, like "Chilisås" but Pakistani-style.', keywords: ['Red Chilli Sauce National Sweden'] },
    346: { brand: 'National', desc: 'Green Chilli Sauce 300g', dish: 'Dipping sauce', relatedDishes: 'Red Chilli Sauce', swedishConnection: 'Tangy green sauce, perfect with samosas.', keywords: ['Green Chilli Sauce National Sweden'] },
    286: { brand: 'National', desc: 'Tamarind Sauce 325ml', dish: 'Sweet-sour sauce', relatedDishes: 'Chaat', swedishConnection: 'Sweet and tangy, like Swedish "Sötsur sås" but with tamarind.', keywords: ['Tamarind Sauce Sweden'] },

    // HERBS & INGREDIENTS
    877: { brand: 'National', desc: 'Kasuri Methi 50g', dish: 'Finishing herb', relatedDishes: 'All curries', swedishConnection: 'Dried fenugreek leaves, like Swedish "Dill" but for Pakistani curries. Adds aromatic finish.', keywords: ['Kasuri Methi Sweden', 'Fenugreek Leaves'] },
    878: { brand: 'National', desc: 'Kasuri Methi 100g', dish: 'Finishing herb', relatedDishes: 'All curries', swedishConnection: 'Dried fenugreek leaves, like Swedish "Dill" but for Pakistani curries. Adds aromatic finish.', keywords: ['Kasuri Methi Sweden', 'Fenugreek Leaves'] },
    83: { brand: 'National', desc: 'Cornflour 300g', dish: 'Thickening agent', relatedDishes: 'Soups, Gravies', swedishConnection: 'For thickening sauces, like Swedish "Majsstärkelse" (cornstarch).', keywords: ['Cornflour National Sweden'] },
};

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const options = { method, headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
}

function generateHTMLDescription(product, metadata) {
    const weight = (product.name.match(/(\d+\s*[kK]?[gG]|\d+\s*gm?s?)/i) || [''])[0];
    const brand = metadata.brand;

    let content = `<p>Bring the authentic taste of Pakistan to your Swedish kitchen with <strong>${product.name}</strong>. ${brand} is Pakistan's most trusted spice brand, beloved by millions of Pakistani families worldwide. Now available at Ideal Indiska in Stockholm for the Pakistani community across Sweden and Europe.</p>`;

    content += `
<h3>Why ${brand} ${metadata.desc}?</h3>
<ul>
    <li><strong>Authentic Pakistani Flavor:</strong> Trusted recipe perfected over generations.</li>
    <li><strong>Perfect for ${metadata.dish}:</strong> ${metadata.relatedDishes ? `Also great for ${metadata.relatedDishes}.` : 'A kitchen essential.'}</li>
    <li><strong>Easy to Use:</strong> Just follow the simple instructions on the pack for restaurant-quality results at home.</li>
</ul>`;

    content += `
<h3>A Swedish Connection</h3>
<p>${metadata.swedishConnection}</p>`;

    if (metadata.relatedDishes) {
        content += `
<h3>Perfect Pairings</h3>
<p>This masala works beautifully with <strong>${metadata.relatedDishes}</strong>. Stock up on multiple ${brand} spices to create a complete Pakistani feast!</p>`;
    }

    content += `
<h3>For the Pakistani Community in Sweden</h3>
<p>We understand the longing for home-cooked Pakistani food. At <strong>Ideal Indiska</strong>, we stock the complete range of ${brand} products so you can recreate your favorite dishes from Karachi, Lahore, Islamabad, or Peshawar right here in Stockholm. We deliver across Sweden and all of Europe.</p>`;

    content += `
<hr />
<h4>Product Details</h4>
<ul>
    <li><strong>Brand:</strong> ${brand}</li>
    <li><strong>Product:</strong> ${metadata.desc}</li>
    ${weight ? `<li><strong>Weight:</strong> ${weight}</li>` : ''}
    <li><strong>Best For:</strong> ${metadata.dish}</li>
    <li><strong>Origin:</strong> Pakistan</li>
    <li><strong>Storage:</strong> Store in a cool, dry place away from direct sunlight.</li>
</ul>`;

    const shortDescription = `<p>Buy ${brand} ${metadata.desc} at Ideal Indiska. Perfect for authentic ${metadata.dish}. Pakistani grocery delivery across Sweden & Europe.</p>`;

    return {
        short_description: shortDescription,
        description: content,
        meta_data: [
            { key: '_yoast_wpseo_metadesc', value: `Shop ${brand} ${metadata.desc} at Ideal Indiska, Stockholm. Perfect for ${metadata.dish}. Pakistani grocery delivery in Sweden.` },
            { key: '_yoast_wpseo_focuskw', value: `${brand} ${metadata.desc}` }
        ]
    };
}

async function updateProducts() {
    console.log('🚀 Updating Shan & National Products...\n');

    const allMetadata = { ...SHAN_METADATA, ...NATIONAL_METADATA };
    let updated = 0;
    let failed = 0;

    for (const [id, meta] of Object.entries(allMetadata)) {
        try {
            console.log(`Processing ${id}: ${meta.brand} ${meta.desc}`);
            const current = await wcApi(`products/${id}`);
            const content = generateHTMLDescription(current, meta);

            await wcApi(`products/${id}`, 'PUT', {
                short_description: content.short_description,
                description: content.description,
                meta_data: content.meta_data
            });

            console.log(`   ✅ Updated`);
            updated++;
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`   ❌ Error ${id}:`, err.message);
            failed++;
        }
    }

    console.log(`\n✅ Complete! Updated: ${updated}, Failed: ${failed}\n`);
}

updateProducts().catch(console.error);
