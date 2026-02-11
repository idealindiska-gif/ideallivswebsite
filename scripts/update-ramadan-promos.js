const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

// Map of Product IDs to New Sale Prices
const UPDATES = [
    { id: 545, name: 'Rooh Afza', price: '30' },
    // Jam-e-Shirin not found, skipping
    { id: 78, name: 'TRS Gram Flour 1kg', price: '33' },
    { id: 79, name: 'TRS Gram Flour 2kg', price: '65' },
    { id: 88, name: 'Alibaba Gram Flour 1kg', price: '25' },
    { id: 89, name: 'Alibaba Gram Flour 2kg', price: '45' },
    { id: 249, name: 'Alwaid Sunflower Oil 5L', price: '99' },
    { id: 432, name: 'Phulki', price: '28' },
    { id: 80, name: 'Elephant Atta 25kg', price: '239' },
    { id: 3365, name: 'Tang Orange', price: '59' },
    { id: 3367, name: 'Tang Mango', price: '59' },
    { id: 5148, name: 'Dates 900g', price: '99' },
    { id: 532, name: 'TYJ Spring Roll 30 Sheets', price: '39' },
    { id: 531, name: 'TYJ Spring Roll 40 Sheets', price: '39' },
    { id: 492, name: 'Crown Veg Samosa', price: '59' },
    { id: 493, name: 'Crown Chicken Samosa', price: '59' },
    // Crown Kebabs
    { id: 489, name: 'Crown Reshmi Kebab', price: '129' },
    { id: 488, name: 'Crown Special Seekh Kebab', price: '129' },
    { id: 487, name: 'Crown Seekh Kebab Chicken', price: '129' },
    { id: 490, name: 'Crown Green Chilli Seekh Kebab', price: '129' },
];

async function updateProduct(item) {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${item.id}`;

    try {
        console.log(`🚀 Updating [${item.id}] ${item.name} to ${item.price} kr...`);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sale_price: item.price,
                date_on_sale_from: '2026-02-10T00:00:00', // Set to yesterday to handle timezone delays
                date_on_sale_to: '2026-03-31T23:59:59' // Valid through end of March
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const updated = await response.json();
        console.log(`   ✅ Success! New Price: ${updated.sale_price} (On Sale: ${updated.on_sale})`);

    } catch (error) {
        console.error(`   ❌ Failed to update ${item.name}:`, error.message);
    }
}

async function main() {
    console.log(`\n📦 Bulk Updating ${UPDATES.length} Ramadan Promotions...\n`);

    // Process in sequence to avoid rate limits
    for (const item of UPDATES) {
        await updateProduct(item);
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ All updates completed.');
}

main();
