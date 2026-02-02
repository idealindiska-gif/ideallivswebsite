/**
 * List all Fortune brand products
 * Run: node scripts/list-fortune-products.js
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
    console.log('Fetching Fortune products...');
    const products = await wcApi(`products?search=Fortune&per_page=100&status=publish`);

    // Filter strictly for "Fortune" in name (search is fuzzy)
    const fortuneProducts = products.filter(p => p.name.toLowerCase().includes('fortune'));

    console.log(`Found ${fortuneProducts.length} Fortune products:`);
    fortuneProducts.forEach(p => {
        console.log(`- [${p.id}] ${p.name}`);
    });
}

main().catch(console.error);
