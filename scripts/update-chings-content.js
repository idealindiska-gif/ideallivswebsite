/**
 * Update Content for Ching's Secret Products
 * Run: node scripts/update-chings-content.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

const PRODUCTS_METADATA = {
    // --- SAUCES ---
    4957: { // Red Chilli Sauce
        type: 'sauce',
        swedishName: 'Stark Chilisås',
        desc: 'Red Chilli Sauce',
        usage: 'Dip, Stir-fry, & Marinade',
        benefits: 'Bold spicy kick, versatile condiment',
        swedishConnection: 'Think of this as an Indian-style "Sambal Oelek" or Sriracha. It adds a fiery punch to any dish, perfect for those who love their "Tacos" or "Gryta" with some serious heat.',
        keywords: ['Chings Red Chilli Sauce Sweden', 'Spicy Sauce Stockholm', 'Indo Chinese Condiments']
    },
    4955: { // Green Chilli Sauce
        type: 'sauce',
        swedishName: 'Grön Chilisås',
        desc: 'Green Chilli Sauce',
        usage: 'Cooking sauce & tangy dip',
        benefits: 'Tangy, spicy, made from fresh green chillies',
        swedishConnection: 'A tangy and spicy alternative to "Tabasco" or Jalapeño relishes. It brings a sharp, fresh heat that cuts through rich flavors, ideal for marinating chicken or spiking a salad dressing.',
        keywords: ['Chings Green Chilli Sauce Sweden', 'Green Chili Condiment', 'Desi Chinese Sauce']
    },

    // --- NOODLES ---
    4951: { // Veg Hakka Noodles
        type: 'noodle',
        swedishName: 'Vegenudlar (Wok)',
        desc: 'Veg Hakka Noodles',
        usage: 'Chowmein & Stir-fries',
        benefits: 'Non-sticky, authentic texture, 100% Vegetarian',
        swedishConnection: 'Similar to "Äggnudlar" (Egg noodles) but completely vegetarian. These noodles retain a perfect "al dente" bite, making them superior for high-heat wok cooking compared to standard instant noodles.',
        keywords: ['Hakka Noodles Sweden', 'Veg Chowmein Stockholm', 'Indo Chinese Noodles']
    },
    4949: { // Schezuan Noodles
        type: 'noodle',
        swedishName: 'Schezuan Nudlar',
        desc: 'Schezuan Noodles',
        usage: 'Spicy Stir-fry',
        benefits: 'Infused with fiery Schezuan spices',
        swedishConnection: 'For lovers of "Wok med hetta". These noodles come with a flavor profile that rivals the best Asian restaurants in Stockholm, offering that signature numbing and spicy Schezuan taste right at home.',
        keywords: ['Schezuan Noodles Sweden', 'Spicy Wok Noodles', 'Chings Secret Sweden']
    },
    4947: { // Hot Garlic Noodles
        type: 'noodle',
        swedishName: 'Vitlöksnudlar',
        desc: 'Hot Garlic Noodles',
        usage: 'Garlic Chowmein',
        benefits: 'Strong garlic aroma, spicy undertones',
        swedishConnection: 'Garlic lovers rejoice! Replicating the beloved "Vitlöksbröd" aroma but in a noodle form. These are aromatic, savory, and perfect for a quick, flavorful dinner.',
        keywords: ['Garlic Noodles Sweden', 'Hot Garlic Chowmein', 'Flavored Noodles']
    }
};

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'User-Agent': 'NodeJS Script',
        },
    };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
}

function generateHTMLDescription(product, metadata) {
    const weight = (product.name.match(/(\d+\s*[kK]?[gG]|\d+\s*gms)/i) || [''])[0];

    // Intro
    let content = `<p>Unleash the flavors of "Desi Chinese" cuisine with <strong>${product.name}</strong>. Ching's Secret is the undisputed leader in bringing authentic Indo-Chinese flavors from the streets of Mumbai to your kitchen in Stockholm. Available now at Ideal Indiska.</p>`;

    // Theme Specific
    if (metadata.type === 'sauce') {
        content += `
<h3>Spice Up Your Meals</h3>
<p>${metadata.desc} is more than just a condiment.</p>
<ul>
    <li><strong>Flavor Profile:</strong> ${metadata.benefits}.</li>
    <li><strong>Kitchen Essential:</strong> Use it as a dip, a marinade, or a cooking sauce.</li>
    <li><strong>Restaurant Style:</strong> The secret ingredient for authentic fried rice and noodles.</li>
</ul>`;
    } else {
        content += `
<h3>Street Style Noodles at Home</h3>
<p>Craving the taste of a bustling food bazaar? ${metadata.desc} delivers.</p>
<ul>
    <li><strong>Perfect Texture:</strong> ${metadata.benefits}.</li>
    <li><strong>Quick & Easy:</strong> Cooks in minutes, perfect for busy weeknights.</li>
    <li><strong>Versatilebase:</strong> Load it up with your favorite fresh Swedish vegetables for a healthy meal.</li>
</ul>`;
    }

    // Swedish Connection
    content += `
<h3>A Swedish Connection: ${metadata.swedishName}</h3>
<p>${metadata.swedishConnection}</p>`;

    // Cooking / Usage
    content += `
<h3>How to Enjoy</h3>
<p><strong>Suggestion:</strong> ${metadata.usage}. Create a fusion dish by adding it to your standard "Pyttipanna" for an Asian twist!</p>`;

    // About Us
    content += `
<h3>Your Stockholm Source for Indo-Chinese Flavors</h3>
<p>At <strong>Ideal Indiska</strong>, we understand the craving for bold, spicy flavors. We stock the full range of Ching's Secret products to help you recreate your favorite restaurant dishes at home in Sweden.</p>`;

    // Product Details Table
    content += `
<hr />
<h4>Product Details</h4>
<ul>
    <li><strong>Brand:</strong> Ching's Secret</li>
    <li><strong>Product:</strong> ${metadata.desc}</li>
    ${weight ? `<li><strong>Weight:</strong> ${weight}</li>` : ''}
    <li><strong>Type:</strong> ${metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1)}</li>
    <li><strong>Vegetarian:</strong> Yes</li>
    <li><strong>Origin:</strong> India</li>
    <li><strong>Storage:</strong> Store in a cool, dry place. ${metadata.type === 'sauce' ? 'Refrigerate after opening.' : ''}</li>
</ul>`;

    // Short Description
    const shortDescription = `<p>Buy ${metadata.desc} at Ideal Indiska. ${metadata.benefits}. Perfect for ${metadata.usage}. Indo-Chinese grocery delivery in Stockholm & Sweden.</p>`;

    return {
        short_description: shortDescription,
        description: content,
        meta_data: [
            { key: '_yoast_wpseo_metadesc', value: `Shop ${metadata.desc} at Ideal Indiska, Stockholm. ${metadata.benefits}. Perfect for ${metadata.usage}.` },
            { key: '_yoast_wpseo_focuskw', value: `${metadata.desc}` }
        ]
    };
}

async function updateProducts() {
    console.log("🚀 Updating Ching's Secret Content...\n");

    for (const [id, meta] of Object.entries(PRODUCTS_METADATA)) {
        try {
            console.log(`Processing ${id}: ${meta.desc}`);
            const current = await wcApi(`products/${id}`);
            if (!current || current.statusCode === 404) {
                console.log(`   Product ${id} not found.`);
                continue;
            }

            const content = generateHTMLDescription(current, meta);

            await wcApi(`products/${id}`, 'PUT', {
                short_description: content.short_description,
                description: content.description,
                meta_data: content.meta_data
            });

            console.log(`   ✅ Content Updated`);
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`   ❌ Error updating ${id}:`, err.message);
        }
    }

    console.log('\n✅ All Chings products updated.\n');
}

updateProducts().catch(console.error);
