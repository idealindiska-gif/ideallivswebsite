const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

const ALLOWED_IDS = [
    545, // Rooh Afza
    78, 79, // TRS Gram Flour
    88, 89, // Alibaba Gram Flour
    249, // Alwaid Oil
    432, // Phulki
    80, // Elephant Atta
    3365, 3367, // Tang
    5148, // Dates
    532, 531, // TYJ
    492, 493, // Crown Samosa
    489, 488, 487, // Crown Kebabs
    490, 486, 494, 491 // Other Crown Kebabs just in case
];

async function cleanupPromotions() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    // Fetch all products currently marked as on sale
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?on_sale=true&per_page=100&status=publish`;

    try {
        const response = await fetch(url, { headers: { 'Authorization': `Basic ${auth}` } });
        const products = await response.json();

        console.log(`\n🧹 Cleaning up ${products.length} found 'on_sale' products...`);

        for (const p of products) {
            if (ALLOWED_IDS.includes(p.id)) {
                console.log(`   ✅ KEEPING [${p.id}] ${p.name}`);
            } else {
                console.log(`   🗑️ REMOVING SALE [${p.id}] ${p.name}`);
                await removeSalePrice(p.id, auth);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function removeSalePrice(id, auth) {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${id}`;
    try {
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sale_price: '',
                date_on_sale_from: null,
                date_on_sale_to: null
            })
        });
        console.log(`      -> Removed sale price for ID ${id}`);
    } catch (err) {
        console.error(`      -> Failed to remove ID ${id}: ${err.message}`);
    }
}

cleanupPromotions();
