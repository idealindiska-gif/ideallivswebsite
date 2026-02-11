const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function fetchOnSaleProducts() {
    console.log('🔍 Fetching ON SALE products from WooCommerce API...');

    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('❌ Missing API credentials in .env.local');
        return;
    }

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?on_sale=true&per_page=100&status=publish`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();
        console.log(`✅ Found ${products.length} products on sale.`);

        console.log('\n--- ON SALE PRODUCTS LIST ---');
        const ids = products.map(p => p.id);
        products.forEach(p => {
            console.log(`[${p.id}] ${p.name} (On sale: ${p.on_sale})`);
            if (p.id === 80) console.log('   FOUND ELEPHANT ATTA 80!');
        });

        if (ids.includes(80)) {
            console.log('\n✅ ID 80 (Elephant Atta) IS in the on-sale list.');
        } else {
            console.log('\n❌ ID 80 (Elephant Atta) IS NOT in the on-sale list.');
        }

    } catch (error) {
        console.error('❌ Error fetching products:', error.message);
    }
}

fetchOnSaleProducts();
