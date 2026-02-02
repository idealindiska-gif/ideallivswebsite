/**
 * List all Bikano brand products
 * Run: node scripts/list-bikano-products.js
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
    console.log('Fetching Bikano products...');
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    while (hasMore) {
        const products = await wcApi(`products?search=Bikano&per_page=100&page=${page}&status=publish`);
        if (products.length > 0) {
            allProducts = [...allProducts, ...products];
            page++;
        } else {
            hasMore = false;
        }
    }

    // Filter strictly for "Bikano" in name (search can be fuzzy)
    const bikanoProducts = allProducts.filter(p => p.name.toLowerCase().includes('bikano'));

    console.log(`Found ${bikanoProducts.length} Bikano products:`);
    bikanoProducts.forEach(p => {
        console.log(`- [${p.id}] ${p.name}`);
    });
}

main().catch(console.error);
