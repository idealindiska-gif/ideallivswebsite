/**
 * Update Content for Bikano Products with SEO Template
 * Run: node scripts/update-bikano-content.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

const PRODUCTS_METADATA = {
    // --- SNACKS (NAMKEEN) ---
    5113: { // Bikaneri Bhujia
        type: 'snack',
        swedishName: 'Kryddiga kikärtsnudlar',
        usage: 'Ready to eat snack',
        dish: 'Chai Time & Party Snacks',
        desc: 'Bikaneri Bhujia',
        benefits: 'Crispy, spicy, authentic Rajasthani flavor',
        swedishConnection: 'Think of this as a spicy, linear alternative to "Chips" for your Fredagsmys (Friday cozy time). Perfect with a cold beer or a hot cup of tea.',
        keywords: ['Bikaneri Bhujia Sweden', 'Spicy Indian Snacks Stockholm', 'Indian Namkeen']
    },
    5112: { // Agra Sev
        type: 'snack',
        swedishName: 'Kryddiga kikärtsnudlar (Mild)',
        usage: 'Ready to eat snack or topping',
        dish: 'Chaat Topping & Tea Snack',
        desc: 'Agra Sev',
        benefits: 'Mildly spicy, crunchy texture, gram flour based',
        swedishConnection: 'Similar to crispy noodles, this savory snack adds a perfect crunch to salads or can be enjoyed on its own, much like "Jordnötsringar" but with a chickpea twist.',
        keywords: ['Agra Sev Sweden', 'Indian Sev Stockholm', 'Bikano Snacks']
    },
    5111: { // Shahi Mixture
        type: 'snack',
        swedishName: 'Indisk Nötmix',
        usage: 'Ready to eat snack',
        dish: 'Festive Snacking',
        desc: 'Shahi Mixture',
        benefits: 'Rich mix of nuts, lentils & spices',
        swedishConnection: 'A royal version of the classic "Nötmix". Packed with cashews, peanuts, and pulses, it offers a complex flavor profile far beyond ordinary trail mix.',
        keywords: ['Shahi Mixture Sweden', 'Indian Trail Mix', 'Spicy Nut Mix']
    },
    5109: { // Bhakar Badi
        type: 'snack',
        swedishName: 'Kryddiga degknyten',
        usage: 'Ready to eat snack',
        dish: 'Tea Time Snack',
        desc: 'Bhakar Badi',
        benefits: 'Sweet & spicy filling, crispy outer layer',
        swedishConnection: 'Imagine a miniature, crispy, savory cinnamon bun ("Kanelbulle") but filled with spicy poppy seeds and coconut. A unique explosion of flavors!',
        keywords: ['Bhakar Badi Sweden', 'Maharashtrian Snacks Stockholm', 'Spicy Rolls']
    },
    5108: { // Matar Para
        type: 'snack',
        swedishName: 'Saltade degstrips',
        usage: 'Ready to eat snack',
        dish: 'Evening Tea Snack',
        desc: 'Matar Para',
        benefits: 'Savory, flaky, cumin flavored',
        swedishConnection: 'Reminiscent of salted crackers or "Salatpinnar", these fried flour strips are the ultimate dipper for pickles or chutneys during Fika.',
        keywords: ['Matar Para Sweden', 'Namak Para', 'Salted Snacks Indian']
    },
    519: { // Plain Dhokla
        type: 'snack',
        swedishName: 'Ångkokt kikärtskaka',
        usage: 'Ready to eat (Warm slightly)',
        dish: 'Breakfast or Light Snack',
        desc: 'Plain Dhokla',
        benefits: 'Steamed not fried, light, fluffy, low calorie',
        swedishConnection: 'A savory, steamed sponge cake made from chickpeas. Soft and airy like a "Sockerkaka" but savory, tangy, and garnished with mustard seeds.',
        keywords: ['Dhokla Sweden', 'Steamed Indian Snack', 'Healthy Indian Food']
    },

    // --- SWEETS (MITHAI) ---
    5110: { // Dry Petha
        type: 'sweet',
        swedishName: 'Kristalliserad Vinterpumpa',
        usage: 'Ready to eat sweet',
        dish: 'Dessert',
        desc: 'Dry Petha',
        benefits: 'Made from Ash Gourd, unique texture',
        swedishConnection: 'Similar to candied fruit or "Suckat", looking like frosted ice crystals outside with a soft, sweet vegetable heart.',
        keywords: ['Petha Sweden', 'Agra Petha Stockholm', 'Indian Candied Fruit']
    },
    4075: { // Besan Ladoo
        type: 'sweet',
        swedishName: 'Kikärtsbollar',
        usage: 'Ready to eat sweet',
        dish: 'Festivals & Celebrations',
        desc: 'Besan Ladoo',
        benefits: 'Rich in ghee, roasted nutty flavor, melt-in-mouth',
        swedishConnection: 'A classic "Lördagsgodis" for Indians. These golden spheres taste like roasted cookie dough made from chickpea flour and clarified butter.',
        keywords: ['Besan Ladoo Sweden', 'Indian Sweets Stockholm', 'Diwali Sweets']
    },
    3844: { // Soan Papdi
        type: 'sweet',
        swedishName: 'Indisk sockervadd',
        usage: 'Ready to eat sweet',
        dish: 'Gifting & Dessert',
        desc: 'Soan Papdi',
        benefits: 'Flaky, cardamom flavored, lightweight',
        swedishConnection: 'Often described as "Indian Cotton Candy" but in a solid, flaky cube form. It melts instantly on your tongue like a delicate meringue.',
        keywords: ['Soan Papdi Sweden', 'Flaky Indian Sweet', 'Bikano Sweets']
    },
    3841: { // Kaju Dhoda Burfi
        type: 'sweet',
        swedishName: 'Cashewkola',
        usage: 'Ready to eat sweet',
        dish: 'Premium Dessert',
        desc: 'Kaju Dhoda Burfi',
        benefits: 'Rich fudge texture, loaded with cashews',
        swedishConnection: 'A decadent fudge similar to "Gräddkola" but made with milk solids and roasted nuts. Chewy, grainy, and deeply satisfying.',
        keywords: ['Dhoda Burfi Sweden', 'Indian Fudge', 'Cashew Sweets']
    },
    3839: { // Besan Burfi
        type: 'sweet',
        swedishName: 'Kikärtsfudge',
        usage: 'Ready to eat sweet',
        dish: 'Dessert',
        desc: 'Besan Burfi',
        benefits: 'Dense, sweet, traditional taste',
        swedishConnection: 'Like Besan Ladoo but in a fudge square. The roasted gram flour gives it a nutty aroma similar to roasted almonds.',
        keywords: ['Besan Burfi Sweden', 'Gram Flour Fudge', 'Indian Dessert']
    },

    // --- RUSK (BAKERY) ---
    5107: { // Saunf Rusk
        type: 'rusk',
        swedishName: 'Skorpor med fänkål',
        usage: 'Dip in tea or coffee',
        dish: 'Morning Tea / Fika',
        desc: 'Saunf Rusk',
        benefits: 'Crunchy, hint of fennel, perfect for dipping',
        swedishConnection: 'The Indian equivalent of "Skorpor". Unlike plain Swedish crisprolls, these are sweet and infused with fennel seeds ("Fänkål") for a digestive kick.',
        keywords: ['Suanf Rusk Sweden', 'Fennel Rusk', 'Indian Tea Rusk']
    },
    5106: { // Gur Rusk
        type: 'rusk',
        swedishName: 'Skorpor med Jaggery (Råsocker)',
        usage: 'Dip in tea or coffee',
        dish: 'Healthy Tea Time',
        desc: 'Gur Rusk',
        benefits: 'Made with jaggery (unrefined sugar), iron-rich',
        swedishConnection: 'A healthier, rustic take on "Skorpor" sweetened with Jaggery (cane sugar) instead of white sugar, giving it a caramel-like molasses flavor.',
        keywords: ['Gur Rusk Sweden', 'Jaggery Rusk', 'Healthy Rusk']
    },
    474: { // Suji Tea Rusk
        type: 'rusk',
        swedishName: 'Skorpor av mannagryn',
        usage: 'Dip in tea or coffee',
        dish: 'Everyday Fika',
        desc: 'Suji Tea Rusk',
        benefits: 'Made from semolina, extra crunchy',
        swedishConnection: 'Classic "Skorpor" made from Semolina ("Mannagryn"). Perfectly baked to hold its crunch even after a quick dip in your coffee or Chai.',
        keywords: ['Suji Rusk Sweden', 'Semolina Rusk', 'Tea Time Biscuits']
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
    const defaultWeight = product.name.match(/(\d+\s*[kK]?[gG])/);
    const weight = defaultWeight ? defaultWeight[0] : '';

    // Intro
    let content = `<p>Experience the authentic taste of India with <strong>${product.name}</strong>. Brought to you by Bikano, a brand synonymous with quality and tradition, this product is a favorite in households across the globe. Now available at Ideal Indiska in Stockholm for your enjoyment.</p>`;

    // Type Specific Description
    if (metadata.type === 'snack') {
        content += `
<h3>The Perfect "Fredagsmys" Snack</h3>
<p>Looking for something different than chips? ${metadata.desc} offers a burst of flavor and texture.</p>
<ul>
    <li><strong>Crispy & Crunchy:</strong> ${metadata.benefits}.</li>
    <li><strong>Ready to Eat:</strong> ${metadata.usage}.</li>
    <li><strong>Authentic Flavor:</strong> Made with traditional Indian spices.</li>
</ul>`;
    } else if (metadata.type === 'sweet') {
        content += `
<h3>A Sweet Celebration</h3>
<p>Indulge in the richness of Indian confectionery with ${metadata.desc}.</p>
<ul>
    <li><strong>Rich & Decadent:</strong> ${metadata.benefits}.</li>
    <li><strong>Festive Favorite:</strong> Perfect for ${metadata.dish}.</li>
    <li><strong>Pure Ingredients:</strong> Made with high-quality dairy and nuts.</li>
</ul>`;
    } else if (metadata.type === 'rusk') {
        content += `
<h3>The Ultimate Tea-Time Companion</h3>
<p>Elevate your coffee break or "Fika" with these crunchy delights.</p>
<ul>
    <li><strong>Perfect Dunking:</strong> ${metadata.benefits}.</li>
    <li><strong>Daily Habit:</strong> Ideal for breakfast or evening tea.</li>
</ul>`;
    }

    // Swedish Connection
    content += `
<h3>A Swedish Connection: ${metadata.swedishName}</h3>
<p>${metadata.swedishConnection}</p>`;

    // Serving Suggestion
    content += `
<h3>Serving Suggestions</h3>
<p><strong>${metadata.dish}:</strong> ${metadata.usage}. Pair it with a hot cup of Masala Chai or Swedish coffee for the best experience.</p>`;

    // About Us
    content += `
<h3>Your Stockholm Source for Indian Delights</h3>
<p>At <strong>Ideal Indiska</strong>, we bring the best of Indian snacks and sweets to Sweden. Whether you are craving savory Bhujia or sweet Ladoo, we deliver authentic flavors right to your doorstep in Stockholm and across Europe.</p>`;

    // Product Details Table
    content += `
<hr />
<h4>Product Details</h4>
<ul>
    <li><strong>Brand:</strong> Bikano</li>
    <li><strong>Product:</strong> ${metadata.desc}</li>
    ${weight ? `<li><strong>Weight:</strong> ${weight}</li>` : ''}
    <li><strong>Type:</strong> ${metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1)}</li>
    <li><strong>Vegetarian:</strong> Yes</li>
    <li><strong>Origin:</strong> India</li>
    <li><strong>Storage:</strong> Store in a cool, dry place. ${metadata.type === 'sweet' ? 'Consume quickly after opening.' : 'Keep in an airtight container to maintain crispness.'}</li>
</ul>`;

    // Short Description
    const shortDescription = `<p>Buy ${product.name} at Ideal Indiska. ${metadata.benefits}. Perfect for ${metadata.dish}. Authentic Indian snacks & sweets delivery in Stockholm & Sweden.</p>`;

    return {
        short_description: shortDescription,
        description: content,
        meta_data: [
            { key: '_yoast_wpseo_metadesc', value: `Shop ${product.name} at Ideal Indiska, Stockholm. ${metadata.benefits}. Perfect for ${metadata.dish}.` },
            { key: '_yoast_wpseo_focuskw', value: `${metadata.desc}` }
        ]
    };
}

async function updateProducts() {
    console.log('🚀 Updating Bikano Products Content (HTML & SEO)...\n');

    for (const [id, meta] of Object.entries(PRODUCTS_METADATA)) {
        try {
            console.log(`Processing Product ID: ${id} (${meta.desc})...`);

            const current = await wcApi(`products/${id}`);
            if (!current || current.statusCode === 404) {
                console.log(`   Product ${id} not found.`);
                continue;
            }

            const content = generateHTMLDescription(current, meta);

            // Update - NOT CHANGING TITLE
            await wcApi(`products/${id}`, 'PUT', {
                short_description: content.short_description,
                description: content.description,
                meta_data: content.meta_data
            });

            console.log(`   ✅ Content Updated for: "${current.name}"`);
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`   ❌ Error updating ${id}:`, err.message);
        }
    }

    console.log('\n✅ All Bikano products updated.\n');
}

updateProducts().catch(console.error);
