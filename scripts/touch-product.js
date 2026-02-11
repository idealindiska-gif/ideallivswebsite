const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function touchProduct(id) {
    console.log(`🔧 Touching Product ID: ${id} to trigger lookup update...`);

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${id}`;

    try {
        // First get the product to know its current sale price
        const getRes = await fetch(url, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const product = await getRes.json();

        console.log(`   Current: ${product.name} | Sale: ${product.sale_price}`);

        // Update with the same sale price to trigger save
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sale_price: product.sale_price
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const updated = await response.json();
        console.log(`✅ Updated ID ${id}. On Sale Status: ${updated.on_sale}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// ID 80 is Elephant Atta which was missing from on_sale list
touchProduct(80);
