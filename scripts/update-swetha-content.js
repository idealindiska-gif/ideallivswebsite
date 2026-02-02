/**
 * Update Swetha-Telugu Products Content
 * Run: node scripts/update-swetha-content.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

const PRODUCTS_METADATA = {
    // --- PICKLES (Traditional Spicy Condiments) ---
    5030: { // Gongura Pickle
        type: 'pickle',
        swedishName: 'Chutney / Stark sås',
        desc: 'Gongura Pickle (With Garlic)',
        usage: 'Mix with hot rice & ghee',
        benefits: 'Rich in iron, tangy sorrel leaves, spicy kick',
        swedishConnection: 'Comparable to a very spicy, tangy rhubarb relish ("Rabarber") but savory. Gongura leaves provide a unique sourness that is iconic to Andhra cuisine.',
        keywords: ['Gongura Pickle Sweden', 'Andhra Pickles Stockholm', 'Sorrel Leaf Pickle']
    },
    5029: { // Mango Thoku
        type: 'pickle',
        swedishName: 'Riven mangopickles',
        desc: 'Mango Thoku Pickle (With Garlic)',
        usage: 'Side dish for Curd Rice or Idli',
        benefits: 'Grated mango, intense flavor, easy to mix',
        swedishConnection: 'Think of this as an intense, spicy mango relish. Unlike "Mangochutney" which is often sweet, this is salty, spicy, and savory – a true flavor explosion.',
        keywords: ['Mango Thoku Sweden', 'Grated Mango Pickle', 'Spicy Mango Relish']
    },
    5028: { // Mango Avakaya
        type: 'pickle',
        swedishName: 'Klassisk Mango Pickles',
        desc: 'Mango Avakaya Pickle (With Garlic)',
        usage: 'Staple with rice and dal',
        benefits: 'Traditional recipe, sun-dried mangoes, aromatic spices',
        swedishConnection: 'The King of Indian Pickles. It plays the same role as "Inlagd gurka" (pickled cucumber) in Swedish meals – a crunchy, acidic, and spicy contrast to creamy dishes.',
        keywords: ['Mango Avakaya Sweden', 'Andhra Mango Pickle', 'Spicy Indian Pickle']
    },

    // --- RICE & MILLETS (Grains) ---
    5025: { // Ponni Raw Rice
        type: 'rice',
        swedishName: 'Vitt ris (Sydindiskt)',
        desc: 'Ponni Raw Rice',
        usage: 'Everyday steamed rice, Pongal, Fried Rice',
        benefits: 'High starch, fluffy texture, versatile',
        swedishConnection: 'A staple white rice similar to regular "Långkornigt ris" but with a distinct aroma and texture preferred for South Indian curries and gravies.',
        keywords: ['Ponni Rice Sweden', 'South Indian Rice', 'Raw Rice Stockholm']
    },
    5024: { // Kerala Matta Rice
        type: 'rice',
        swedishName: 'Rött råris',
        desc: 'Kerala Matta Rice (Red Rice)',
        usage: 'Serve with Fish Curry or Sambar',
        benefits: 'Whole grain, high fiber, lower GI',
        swedishConnection: 'A robust, red grain rice that is nutrient-dense like "Råris". It has a nutty flavor and chewy texture, making it a hearty, healthy alternative to white rice.',
        keywords: ['Kerala Matta Rice Sweden', 'Red Rice Stockholm', 'Rosematta Rice']
    },
    5027: { // Kodo Millet
        type: 'millet',
        swedishName: 'Hirs (Variant)',
        desc: 'Kodo Millet (Varagu)',
        usage: 'Substitute for rice or quinoa',
        benefits: 'Gluten-free, high fiber, diabetic friendly',
        swedishConnection: 'An ancient grain similar to "Hirs" or Quinoa. Perfect for health-conscious Swedes looking for gluten-free ("Glutenfri") alternatives to couscous or rice.',
        keywords: ['Kodo Millet Sweden', 'Varagu Rice', 'Gluten Free Grains']
    },
    5026: { // Barnyard Millet
        type: 'millet',
        swedishName: 'Hirs (Variant)',
        desc: 'Barnyard Millet (Kuthiraivali)',
        usage: 'Upma, Porridge, or Rice substitute',
        benefits: 'Low calorie, high fiber, cooks quickly',
        swedishConnection: 'Another superfood millet. It cooks fast like "Polenta" or fine bulgur and is excellent for light meals and salads.',
        keywords: ['Barnyard Millet Sweden', 'Sanwa Rice', 'Millet Grains Stockholm']
    },

    // --- SPICES & INGREDIENTS ---
    5035: { // Guntur Red Chilli
        type: 'spice',
        swedishName: 'Torkad röd chili',
        desc: 'Guntur Red Chilli Long',
        usage: 'Tempering (Tadka) & Spicy Curries',
        benefits: 'High heat, vibrant red color',
        swedishConnection: 'Famous worldwide for its heat, this is the "Piri Piri" of India. Essential for adding that signature kick to your "Gryta" or stew.',
        keywords: ['Guntur Chilli Sweden', 'Dry Red Chilli', 'Spicy Indian Food']
    },
    5034: { // Desiccated Coconut
        type: 'baking',
        swedishName: 'Kokosflingor',
        desc: 'Desiccated Coconut Powder Fine',
        usage: 'Chutneys, Baking, Curries',
        benefits: 'Rich coconut flavor, fine texture, convenient',
        swedishConnection: 'Standard "Kokosflingor" used in baking (like Kokostoppar). In Indian cooking, it\'s also a quick base for thickening curries and making chutneys.',
        keywords: ['Desiccated Coconut Sweden', 'Coconut Powder', 'Baking Ingredients']
    },
    5033: { // Mishri
        type: 'sugar',
        swedishName: 'Kandisocker',
        desc: 'Mishri Kalkandam (Sugar Cubes)',
        usage: 'Sweetener for tea, offering to deities',
        benefits: 'Unrefined, pure sugar crystals, cooling effect',
        swedishConnection: 'Known as "Kandisocker" in Sweden. Often used to sweeten tea or coffee slowly, or enjoyed as a simple sweet candy after meals.',
        keywords: ['Mishri Sweden', 'Rock Sugar', 'Kalkandam']
    },
    5032: { // Sea Salt
        type: 'salt',
        swedishName: 'Havssalt',
        desc: 'Sea Salt (Crystal)',
        usage: 'Daily cooking, preserving pickles',
        benefits: 'Natural trace minerals, pure taste',
        swedishConnection: 'Everyday "Havssalt". Essential for drawing out moisture in pickling or simply seasoning your potatoes ("Potatis") to perfection.',
        keywords: ['Sea Salt Sweden', 'Havssalt Stockholm', 'Natural Salt']
    },
    5031: { // Roasted Dalia Splits
        type: 'dal',
        swedishName: 'Rostade kikärter',
        desc: 'Roasted Dalia Splits (Pottukadalai)',
        usage: 'Coconut Chutney, Snacks',
        benefits: 'Ready to eat, high protein, crunchy',
        swedishConnection: 'Pre-roasted chickpeas used like "Ströbröd" (breadcrumbs) for thickening or ground into a powder. Also a great protein-rich snack on its own.',
        keywords: ['Roasted Gram Sweden', 'Fried Gram', 'Chutney Dal']
    },
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
    const weight = (product.name.match(/(\d+\s*[kK]?[gG])/) || [''])[0];

    let content = `<p>Bring the authentic taste of Andhra and South India to your kitchen with <strong>${product.name}</strong>. Swetha-Telugu Foods is renowned for its traditional recipes and high-quality ingredients, now available in Stockholm at Ideal Indiska.</p>`;

    content += `
<h3>Why Choose Swetha-Telugu ${metadata.desc}?</h3>
<ul>
    <li><strong>Authentic Flavor:</strong> ${metadata.benefits}.</li>
    <li><strong>Versatile Usage:</strong> Perfect for <em>${metadata.usage}</em>.</li>
    <li><strong>Premium Quality:</strong> Sourced directly to ensure freshness and taste.</li>
</ul>`;

    content += `
<h3>A Swedish Connection: ${metadata.swedishName}</h3>
<p>${metadata.swedishConnection}</p>`;

    content += `
<h3>How to Use</h3>
<p><strong>Suggestion:</strong> ${metadata.usage}. Pair it with traditional South Indian dishes or experiment in your local Swedish favorites.</p>`;

    content += `
<h3>Your Stockholm Source for South Indian Groceries</h3>
<p>At <strong>Ideal Indiska</strong>, we specialize in bringing regional Indian specialties to Sweden. From the spicy pickles of Guntur to the wholesome millets of the Deccan plateau, we deliver authentic flavors to your door.</p>`;

    content += `
<hr />
<h4>Product Details</h4>
<ul>
    <li><strong>Brand:</strong> Swetha-Telugu Foods</li>
    <li><strong>Product:</strong> ${metadata.desc}</li>
    ${weight ? `<li><strong>Weight:</strong> ${weight}</li>` : ''}
    <li><strong>Type:</strong> ${metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1)}</li>
    <li><strong>Origin:</strong> India</li>
    <li><strong>Storage:</strong> Store in a cool, dry place.</li>
</ul>`;

    return {
        short_description: `<p>Buy ${metadata.desc} at Ideal Indiska. ${metadata.benefits}. Authentic South Indian grocery delivery in Stockholm & Sweden.</p>`,
        description: content,
        meta_data: [
            { key: '_yoast_wpseo_metadesc', value: `Shop ${metadata.desc} ${weight} at Ideal Indiska, Stockholm. ${metadata.benefits}. Perfect for ${metadata.usage}.` },
            { key: '_yoast_wpseo_focuskw', value: `${metadata.desc}` }
        ]
    };
}

async function updateProducts() {
    console.log('🚀 Updating Swetha-Telugu Content...\n');
    for (const [id, meta] of Object.entries(PRODUCTS_METADATA)) {
        try {
            console.log(`Processing ${id}: ${meta.desc}`);
            const current = await wcApi(`products/${id}`);
            const content = generateHTMLDescription(current, meta);
            await wcApi(`products/${id}`, 'PUT', {
                short_description: content.short_description,
                description: content.description,
                meta_data: content.meta_data
            });
            console.log(`   ✅ Updated Content`);
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`   ❌ Error ${id}:`, err.message);
        }
    }
    console.log('\n✅ Done.\n');
}

updateProducts().catch(console.error);
