/**
 * Fix Fortune Content: Restore Titles & Convert Markdown to HTML
 * Run: node scripts/fix-fortune-content.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

// Original Titles from logs
const RESTORE_TITLES = {
    5122: "Fortune Unpolished Arhar Dal 1Kg",
    5121: "Fortune Unpolished Masoor Dal Washed 1Kg",
    5120: "Fortune Unpolished Kabuli Channa White 1Kg",
    5119: "Fortune Unpolished Kala Channa Whole 1Kg",
    5118: "Fortune Unpolished Channa Dal 1kg",
    4998: "Fortune unpolished Chitra Rajma 1Kg",
    4930: "Fortune Gram Flour 1Kg – Premium Besan for Authentic Indian & Pakistani Cooking",
    3833: "Fortune Chakki Fresh Atta 10kg",
    927: "Fortune Thick Poha 1 Kg",
    254: "Fortune Kachi Ghani Pure Mustard Oil (Sarson ka Tel) 1L",
    85: "Fortune Chakki Fresh Atta (Whole Wheat Flour) 5kg - For Soft & Fluffy Rotis"
};

const PRODUCTS_METADATA = {
    // UNPOLISHED DALS & LEGUMES
    5122: { // Arhar Dal
        type: 'dal',
        swedishName: 'Gula ärtor',
        cookingTime: 'Pressure cook for 5-7 whistles',
        dish: 'Dal Tadka & Sambar',
        desc: 'Unpolished Arhar Dal (Toor Dal)',
        benefits: 'High protein, dietary fiber, authentic taste',
        swedishConnection: 'Just as ärtsoppa (yellow pea soup) is a Swedish Thursday tradition, Dal Tadka is the daily comfort food of India.',
        soak: true,
        keywords: ['Unpolished Arhar Dal', 'Toor Dal Sweden', 'Indian Grocery Stockholm', 'Dal Tadka Recipe']
    },
    5121: { // Masoor Dal Washed
        type: 'dal',
        swedishName: 'Röda linser',
        cookingTime: 'Boil for 15-20 minutes (No pressure cooker needed)',
        dish: 'Masoor Dal Curry & Soups',
        desc: 'Unpolished Masoor Dal (Red Lentils)',
        benefits: 'Quick cooking, protein-rich, easy to digest',
        swedishConnection: 'Similar to the Swedish favorite "Röda linser" (Red Lentils) used in hearty soups, Massor Dal is the quickest cooking lentil perfect for busy weeknights.',
        soak: false,
        keywords: ['Masoor Dal Stockholm', 'Red Lentils Sweden', 'Indian Red Split Lentils']
    },
    5120: { // Kabuli Channa
        type: 'legume',
        swedishName: 'Kikärtor',
        cookingTime: 'Pressure cook for 15-20 mins after overnight soaking',
        dish: 'Chole Masala & Hummus',
        desc: 'Unpolished Kabuli Chana (White Chickpeas)',
        benefits: 'Large size, creamy texture, versatile',
        swedishConnection: 'Known as "Kikärtor" in Sweden and loved in salads, these large white chickpeas are the star of the famous Indian dish Chole Bhature.',
        soak: true,
        keywords: ['Kabuli Chana Sweden', 'Chickpeas Stockholm', 'Chole Masala Ingredients']
    },
    5119: { // Kala Channa
        type: 'legume',
        swedishName: 'Kikärtor / Bruna bönor',
        cookingTime: 'Pressure cook for 20-25 mins after overnight soaking',
        dish: 'Kala Chana Chaat & Curry',
        desc: 'Unpolished Kala Chana (Black Chickpeas)',
        benefits: 'High iron, retain shape, nutty flavor',
        swedishConnection: 'A smaller, darker cousin to the "Kikärtor" found in Swedish stores, these Black Chickpeas have a firmer texture and earthier flavor, somewhat reminiscent of "Bruna bönor" in heartiness.',
        soak: true,
        keywords: ['Kala Chana Sweden', 'Black Chickpeas Stockholm', 'High Iron Food']
    },
    5118: { // Channa Dal
        type: 'dal',
        swedishName: 'Delade gula ärtor',
        cookingTime: 'Pressure cook for 3-4 whistles',
        dish: 'Chana Dal Fry & Puran Poli',
        desc: 'Unpolished Chana Dal (Split Chickpeas)',
        benefits: 'Low GI, nutty flavor, zinc & folate',
        swedishConnection: 'Comparable to split yellow peas but with a distinct nutty bite. While Swedes love pea soup, Indians turn this into a thick, savory "Dal Fry" enjoyed with roti.',
        soak: true,
        keywords: ['Chana Dal Sweden', 'Split Chickpeas Stockholm', 'Besan Source']
    },
    4998: { // Chitra Rajma
        type: 'legume',
        swedishName: 'Kidneybönor',
        cookingTime: 'Pressure cook for 15-20 mins after overnight soaking',
        dish: 'Rajma Chawal (Kidney Bean Curry & Rice)',
        desc: 'Unpolished Chitra Rajma (Speckled Kidney Beans)',
        benefits: 'Excellent source of molybdenum, high fiber',
        swedishConnection: 'Much like the "Kidneybönor" essential for Chili con Carne in Swedish homes, Rajma is the ultimate North Indian comfort food, best seasoned with aromatic spices.',
        soak: true,
        keywords: ['Rajma Chitra Sweden', 'Kidney Beans Stockholm', 'Indian Kidney Beans']
    },
    // FLOURS
    4930: { // Gram Flour / Besan
        type: 'flour',
        swedishName: 'Kikärtsmjöl',
        cookingTime: 'Use for batters, sweets, or thickening curries',
        dish: 'Pakoras, Besan Ladoo, Kadhi',
        desc: 'Premium Besan (Gram Flour)',
        benefits: 'Gluten-free, high protein, versatile batter',
        swedishConnection: 'Known as "Kikärtsmjöl" in health food aisles, this gluten-free flour is the secret behind crispy Indian fritters (Pakoras), much like using batter for fish, but with a savory, nutty kick.',
        soak: false,
        keywords: ['Besan Sweden', 'Gram Flour Stockholm', 'Gluten Free Flour Indian', 'Kikärtsmjöl']
    },
    3833: { // Atta 10kg
        type: 'flour',
        swedishName: 'Grahamsmjöl (Fint)',
        cookingTime: 'Knead into dough for Roti/Chapati',
        dish: 'Soft Rotis & Parathas',
        desc: 'Chakki Fresh Atta (Whole Wheat Flour)',
        benefits: '100% whole wheat, chakki ground, soft texture',
        swedishConnection: 'Similar to Swedish "Grahamsmjöl" but stone-ground to a much finer consistency, making it perfect for rolling out thin, soft flatbreads (Rotis), akin to a soft Tunnbröd.',
        soak: false,
        keywords: ['Atta 10kg Sweden', 'Indian Wheat Flour Stockholm', 'Fortune Atta Price']
    },
    85: { // Atta 5kg
        type: 'flour',
        swedishName: 'Grahamsmjöl (Fint)',
        cookingTime: 'Knead into dough for Roti/Chapati',
        dish: 'Soft Rotis & Parathas',
        desc: 'Chakki Fresh Atta (Whole Wheat Flour)',
        benefits: '100% whole wheat, chakki ground, soft texture',
        swedishConnection: 'Similar to Swedish "Grahamsmjöl" but stone-ground to a much finer consistency, making it perfect for rolling out thin, soft flatbreads (Rotis), akin to a soft Tunnbröd.',
        soak: false,
        keywords: ['Atta 5kg Sweden', 'Indian Wheat Flour Stockholm', 'Buy Atta Online']
    },
    // OTHERS
    927: { // Poha
        type: 'grain',
        swedishName: 'Havregryn (Comparison)',
        cookingTime: 'Rinse and sauté with spices (5-7 mins)',
        dish: 'Kanda Poha & Snacks',
        desc: 'Thick Poha (Flattened Rice)',
        benefits: 'Gluten-free, probiotic, easily digestible breakfast',
        swedishConnection: 'Think of Poha as the "Indian Oatmeal" ("Havregryn"). While Swedes boil oats for porridge, Indians rinse and sauté flattened rice with spices for a savory, fluffy breakfast.',
        soak: true, // actually rinse
        keywords: ['Poha Sweden', 'Flattened Rice Stockholm', 'Indian Breakfast']
    },
    254: { // Mustard Oil
        type: 'oil',
        swedishName: 'Rapsolja (Comparison)',
        cookingTime: 'Heat until smoking point before cooking',
        dish: 'Pickles, fish fries, and curries',
        desc: 'Kachi Ghani Pure Mustard Oil',
        benefits: 'Rich in Omega-3, antibacterial properties',
        swedishConnection: 'Mustard oil comes from seeds related to the Rapeseed ("Raps") plant used for famous Swedish Rapsolja. However, this cold-pressed version packs a powerful Wasabi-like punch ("Pepparrot") essential for authentic Bengali cooking.',
        soak: false,
        keywords: ['Mustard Oil Sweden', 'Sarson Ka Tel Stockholm', 'Kachi Ghani Oil']
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

function generateHTMLDescription(product, metadata, originalTitle) {
    const isUnpolished = product.name.toLowerCase().includes('unpolished');
    const weight = (product.name.match(/(\d+\s*[kK]?[gG])/) || ['1kg'])[0];
    const plainName = product.name.replace(/\d+\s*[kK]?[gG]/gi, '').replace('Fortune', '').replace('unpolished', '').trim();

    // Intro
    let content = `<p>Discover the superior taste and nutritional goodness of <strong>Fortune ${metadata.desc}</strong> in a convenient ${weight} pack. This essential ingredient from one of India's most trusted brands, Fortune, is a staple in kitchens across the subcontinent. Available at Ideal Indiska in Stockholm, this product brings authentic flavor to your home cooking.</p>`;

    // Unpolished Section
    if (isUnpolished) {
        content += `
<h3>What Does "Unpolished" Mean and Why is it Better?</h3>
<p>When you see "unpolished" on a pack of dal, it signifies a more natural and wholesome product.</p>
<ul>
    <li><strong>Retains Nutrients:</strong> The polishing process can strip away the outer layer containing valuable fiber and nutrients.</li>
    <li><strong>Authentic Flavour:</strong> Many cooks believe unpolished dal has a richer, earthier flavor.</li>
    <li><strong>Healthier Choice:</strong> Higher in fiber, it aids digestion and provides sustained energy.</li>
</ul>`;
    }

    // Versatility
    content += `
<h3>The Versatility of ${plainName}</h3>
<p>${metadata.dish} is just the beginning.</p>
<ul>
    <li><strong>Perfect for Daily Meals:</strong> A foundation for wholesome vegetarian dinners.</li>
    <li><strong>Rich in Nutrients:</strong> ${metadata.benefits}.</li>
    <li><strong>Trusted Fortune Quality:</strong> Processed with care to ensure purity and taste.</li>
</ul>`;

    // Swedish Connection
    content += `
<h3>A Swedish Connection: ${metadata.swedishName || 'Global Tastes'}</h3>
<p>${metadata.swedishConnection}</p>`;

    // Cooking
    content += `
<h3>How to Use Fortune ${plainName}</h3>
<ol>
    <li><strong>Preparation:</strong> ${metadata.soak ? (metadata.type === 'grain' ? 'Rinse thoroughly in a sieve.' : 'Rinse well. For best results, soak for 30 minutes to an hour.') : 'Ready to use.'}</li>
    <li><strong>Cooking:</strong> ${metadata.cookingTime}.</li>
    <li><strong>Serving:</strong> Enjoy hot with steamed Basmati rice, Roti, or fresh Swedish bread.</li>
</ol>`;

    // About Us
    content += `
<h3>Your Stockholm Source for Nutritious Indian Staples</h3>
<p>At <strong>Ideal Indiska</strong>, your dedicated Indian and Pakistani grocery store in Stockholm, we are proud to offer essential pantry staples from trusted brands like Fortune. With our convenient local Stockholm delivery and DHL shipping across Sweden and all of Europe, you can easily stock your kitchen with wholesome and authentic ingredients.</p>`;

    // Product Details Table
    content += `
<hr />
<h4>Product Details</h4>
<ul>
    <li><strong>Brand:</strong> Fortune</li>
    <li><strong>Product:</strong> ${metadata.desc}</li>
    <li><strong>Weight:</strong> ${weight}</li>
    <li><strong>Key Features:</strong> ${metadata.benefits}</li>
    <li><strong>Dietary:</strong> Vegetarian, Vegan${metadata.type === 'flour' && metadata.desc.includes('Besan') ? ', Gluten-Free' : ''}</li>
    <li><strong>Origin:</strong> India</li>
    <li><strong>Storage:</strong> Store in a cool, dry place in an airtight container.</li>
</ul>`;

    // Short Description
    const shortDescription = `<p>Buy Fortune ${metadata.desc} (${weight}) at Ideal Indiska. ${metadata.benefits}. Perfect for ${metadata.dish}. Authentic Indian grocery delivery in Stockholm & Sweden.</p>`;

    return {
        name: originalTitle, // RESTORING ORIGINAL TITLE
        short_description: shortDescription,
        description: content,
        // We keep the SEO meta data, that doesn't affect visual display
        meta_data: [
            { key: '_yoast_wpseo_title', value: `Buy Fortune ${metadata.desc} ${weight} | Ideal Indiska Stockholm` },
            { key: '_yoast_wpseo_metadesc', value: `Shop Fortune ${metadata.desc} ${weight} at Ideal Indiska, Stockholm. ${metadata.benefits}. Perfect for ${metadata.dish}.` },
            { key: '_yoast_wpseo_focuskw', value: `Fortune ${plainName}` }
        ]
    };
}

async function updateProducts() {
    console.log('🚀 Fixing Fortune Products Content (HTML & Titles)...\n');

    for (const [id, meta] of Object.entries(PRODUCTS_METADATA)) {

        // Check if we have an original title to restore
        const originalTitle = RESTORE_TITLES[id];
        if (!originalTitle) {
            console.warn(`⚠️ Warning: No original title found for ID ${id}. Skipping title update.`);
        }

        try {
            console.log(`Processing Product ID: ${id}...`);

            const current = await wcApi(`products/${id}`);
            if (!current || current.statusCode === 404) {
                console.log(`   Product ${id} not found.`);
                continue;
            }

            const content = generateHTMLDescription(current, meta, originalTitle || current.name);

            // Update
            await wcApi(`products/${id}`, 'PUT', {
                name: content.name,
                short_description: content.short_description,
                description: content.description,
                meta_data: content.meta_data
            });

            console.log(`   ✅ Restored Title: "${content.name}"`);
            console.log(`   ✅ Content Converted to HTML`);
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`   ❌ Error updating ${id}:`, err.message);
        }
    }

    console.log('\n✅ All Fortune products Content Fixed.\n');
}

updateProducts().catch(console.error);
