/**
 * List all Chings products
 * Run: node scripts/list-chings-products.js
 */

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

async function main() {
    console.log('Fetching Chings products...');
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    while (hasMore) {
        const products = await wcApi(`products?search=Chings&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            allProducts = [...allProducts, ...products];
            page++;
        } else {
            hasMore = false;
        }
    }

    // Filter strictly for "Chings" or "Ching's" in name
    const chingsProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes('chings') ||
        p.name.toLowerCase().includes("ching's")
    );

    console.log(`Found ${chingsProducts.length} Chings products:`);
    chingsProducts.forEach(p => {
        console.log(`- [${p.id}] ${p.name}`);
    });
}

main().catch(console.error);
