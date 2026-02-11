/**
 * Find Products for New Promotion
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
            'User-Agent': 'Mozilla/5.0'
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

async function searchProducts(searchTerm) {
    const products = await wcApi(`products?search=${encodeURIComponent(searchTerm)}&per_page=20`);
    return products.map(p => ({
        id: p.id,
        name: p.name,
        regular_price: p.regular_price,
        sale_price: p.sale_price,
        date_on_sale_from: p.date_on_sale_from,
        date_on_sale_to: p.date_on_sale_to,
        status: p.status,
        on_sale: p.on_sale,
    }));
}

async function main() {
    const searchTerms = [
        'Elephant Atta 25',
        'National Spices',
        'National Mango Pickle 1 kg',
        'National Mixed Pickle 1 kg',
        'National Hot Punjabi Mixed Pickle 1 kg',
        'Shan Ginger Garlic Paste 700',
        'Kaalar Rice 5',
        'Haldirams Punjabi Samosa',
        'Haldirams Cocktail Samosa',
        'India Gate Idli Rice 5',
        'India Gate Sona Masoori Rice 5',
    ];

    console.log('\n🔍 Searching for NEW promotional products...\n');
    console.log('═'.repeat(80));

    for (const term of searchTerms) {
        console.log(`\n📦 Searching: "${term}"`);
        try {
            const results = await searchProducts(term);
            if (results.length === 0) {
                console.log('   ❌ No products found');
            } else {
                results.forEach(p => {
                    console.log(`   ID: ${p.id} | ${p.name}`);
                    console.log(`      Regular: ${p.regular_price} | Sale: ${p.sale_price}`);
                    if (p.date_on_sale_from) console.log(`      Sale Start: ${p.date_on_sale_from}`);
                    if (p.date_on_sale_to) console.log(`      Sale End: ${p.date_on_sale_to}`);
                    console.log(`      Status: ${p.status} | On Sale: ${p.on_sale}`);
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
