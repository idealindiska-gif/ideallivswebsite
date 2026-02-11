require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Basic ${auth}` }
    });
    return response.json();
}

async function searchProducts() {
    const queries = [
        "Rooh Afza", "Jam-e-Shirin", "TRS Gram Flour", "Alibaba Gram Flour",
        "Cooking Oil", "Phulki", "Elephant Atta", "Tang", "Dates",
        "Spring Roll Pastry", "Crown Samosa", "Crown Kebab"
    ];

    console.log("Searching for promo products...");

    for (const q of queries) {
        try {
            const products = await wcApi(`products?search=${encodeURIComponent(q)}&per_page=5`);
            if (products.length > 0) {
                console.log(`\n--- Results for "${q}" ---`);
                products.forEach(p => {
                    console.log(`ID: ${p.id} | Name: ${p.name} | Slug: ${p.slug} | Price: ${p.price}`);
                });
            } else {
                console.log(`\n❌ No results for "${q}"`);
            }
        } catch (e) {
            console.error(`Error searching ${q}:`, e.message);
        }
    }
}

searchProducts();
