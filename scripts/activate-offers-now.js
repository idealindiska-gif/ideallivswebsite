/**
 * Activate Weekly Offers NOW (Remove future date restriction)
 * Run: node scripts/activate-offers-now.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

// Product IDs from weekly offers
const PRODUCT_IDS = [4943, 204, 85, 84, 76, 4947, 4949, 4951, 195, 5112];

// Set sale to start NOW and end on Feb 08
const SALE_START = null; // null = starts immediately
const SALE_END = '2026-02-08T23:59:59'; // End of Feb 08

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
    };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
}

async function activateOffers() {
    console.log('🚀 Activating Weekly Offers NOW...\n');
    console.log(`Current time: ${new Date().toISOString()}\n`);

    let updated = 0;
    let failed = 0;

    for (const id of PRODUCT_IDS) {
        try {
            const product = await wcApi(`products/${id}`);

            // Only update if it has a sale price
            if (!product.sale_price) {
                console.log(`[${id}] ${product.name} - No sale price, skipping`);
                continue;
            }

            console.log(`[${id}] ${product.name}`);
            console.log(`  Activating sale: ${product.sale_price} Kr (was: ${product.regular_price} Kr)`);

            await wcApi(`products/${id}`, 'PUT', {
                date_on_sale_from: SALE_START,
                date_on_sale_to: SALE_END
            });

            console.log(`  ✅ Sale activated!\n`);
            updated++;
            await new Promise(r => setTimeout(r, 300));

        } catch (error) {
            console.error(`  ❌ Failed: ${error.message}\n`);
            failed++;
        }
    }

    console.log(`\n✅ Complete!`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Failed: ${failed}`);
}

activateOffers();
