const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function checkProduct(id) {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${id}`;

    try {
        const response = await fetch(url, { headers: { 'Authorization': `Basic ${auth}` } });
        const p = await response.json();
        console.log(`\n🔍 Checking ID ${id}: ${p.name}`);
        console.log(`   Regular: ${p.regular_price} | Sale: ${p.sale_price}`);
        console.log(`   On Sale: ${p.on_sale}`);
        console.log(`   Date From: ${p.date_on_sale_from}`);
        console.log(`   Date To: ${p.date_on_sale_to}`);
    } catch (err) {
        console.error(err);
    }
}

async function main() {
    await checkProduct(80); // Elephant Atta
    await checkProduct(489); // Crown Kebab
}

main();
