/**
 * List all Swetha / Telugu Foods products
 * Run: node scripts/list-swetha-products.js
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
    console.log('Fetching Swetha/Telugu products...');
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    // Search for "Swetha"
    while (hasMore) {
        const products = await wcApi(`products?search=Swetha&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            allProducts = [...allProducts, ...products];
            page++;
        } else {
            hasMore = false;
        }
    }

    // Also search for "Telugu" just in case
    page = 1;
    hasMore = true;
    while (hasMore) {
        const products = await wcApi(`products?search=Telugu&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            // Avoid duplicates
            const newProducts = products.filter(p => !allProducts.find(ap => ap.id === p.id));
            allProducts = [...allProducts, ...newProducts];
            page++;
        } else {
            hasMore = false;
        }
    }

    console.log(`Found ${allProducts.length} Swetha/Telugu products:`);
    allProducts.forEach(p => {
        console.log(`- [${p.id}] ${p.name}`);
    });
}

main().catch(console.error);
