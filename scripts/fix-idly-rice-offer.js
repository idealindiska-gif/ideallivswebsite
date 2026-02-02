/**
 * Fix Weekly Offer for India Gate Idly Rice
 * 
 * The main script missed this because of spelling difference (Idly vs Idli).
 * Target Product ID: 204 (from previous logs)
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

const SALE_START = '2026-02-02';
const SALE_END = '2026-02-08';
const PRODUCT_ID = 204;
const SALE_PRICE = '99';

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
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function fixOffer() {
    console.log(`\n🛠️ Fixing Offer for Product ID: ${PRODUCT_ID}\n`);

    try {
        const product = await wcApi(`products/${PRODUCT_ID}`);
        console.log(`   Found: "${product.name}" - Current Price: ${product.price}`);

        await wcApi(`products/${PRODUCT_ID}`, 'PUT', {
            sale_price: SALE_PRICE,
            date_on_sale_from: SALE_START,
            date_on_sale_to: SALE_END
        });

        console.log(`   ✅ Updated to ${SALE_PRICE} Kr (Sale: ${SALE_START} to ${SALE_END})`);

    } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
    }
}

fixOffer();
