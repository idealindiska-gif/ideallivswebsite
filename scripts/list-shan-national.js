/**
 * List all Shan and National products
 * Run: node scripts/list-shan-national.js
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
    console.log('Fetching Shan & National products...');
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    // Fetch Shan
    console.log('Fetching Shan...');
    while (hasMore) {
        const products = await wcApi(`products?search=Shan&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            allProducts = [...allProducts, ...products];
            page++;
        } else {
            hasMore = false;
        }
    }

    // Fetch National
    console.log('Fetching National...');
    page = 1;
    hasMore = true;
    while (hasMore) {
        const products = await wcApi(`products?search=National&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            // Avoid duplicates
            const newProducts = products.filter(p => !allProducts.find(ap => ap.id === p.id));
            allProducts = [...allProducts, ...newProducts];
            page++;
        } else {
            hasMore = false;
        }
    }

    const shanProducts = allProducts.filter(p => p.name.toLowerCase().includes('shan'));
    const nationalProducts = allProducts.filter(p => p.name.toLowerCase().includes('national'));

    console.log(`\nFound ${shanProducts.length} Shan products:`);
    shanProducts.forEach(p => console.log(`- [${p.id}] ${p.name}`));

    console.log(`\nFound ${nationalProducts.length} National products:`);
    nationalProducts.forEach(p => console.log(`- [${p.id}] ${p.name}`));
}

main().catch(console.error);
