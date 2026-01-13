/**
 * Find Products for Promotion
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

async function searchProducts(searchTerm) {
    const products = await wcApi(`products?search=${encodeURIComponent(searchTerm)}&per_page=10`);
    return products.map(p => ({
        id: p.id,
        name: p.name,
        regular_price: p.regular_price,
    }));
}

async function main() {
    const searchTerms = [
        'Idli Rice 5',
        'Garima Gold Basmati',
        'Aashirvaad Chakki Atta 5',
        'Gulab Jamun',
        'Rasgulla',
        'Sago Seeds 1 kg',
        'Sago Seeds 400',
        'Pesi Gur',
    ];

    console.log('\n🔍 Searching for promotional products...\n');
    console.log('═'.repeat(80));

    for (const term of searchTerms) {
        console.log(`\n📦 Searching: "${term}"`);
        try {
            const results = await searchProducts(term);
            if (results.length === 0) {
                console.log('   ❌ No products found');
            } else {
                results.forEach(p => {
                    console.log(`   ID: ${p.id} | ${p.name} | Regular: ${p.regular_price} kr`);
                });
            }
        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n' + '═'.repeat(80));
}

main().catch(console.error);
