/**
 * Check Sale Dates for Weekly Offers
 * Run: node scripts/check-sale-dates.js
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

async function checkSaleDates() {
    console.log('🔍 Checking sale dates for weekly offers...\n');
    console.log(`Current time: ${new Date().toISOString()}\n`);

    const productIds = [4943, 204, 85, 84, 76, 4947, 4949, 4951, 195, 5112];

    for (const id of productIds) {
        try {
            const product = await wcApi(`products/${id}`);
            console.log(`[${id}] ${product.name}`);
            console.log(`  Regular: ${product.regular_price} Kr | Sale: ${product.sale_price} Kr`);
            console.log(`  Sale From: ${product.date_on_sale_from || 'Not set'}`);
            console.log(`  Sale To: ${product.date_on_sale_to || 'Not set'}`);
            console.log(`  On Sale: ${product.on_sale ? 'YES ✅' : 'NO ❌'}`);
            console.log('');
        } catch (error) {
            console.error(`  ❌ Error fetching product ${id}`);
        }
    }
}

checkSaleDates();
