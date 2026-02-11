require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${auth}` }
    });
    return response.json();
}

async function searchAndLog(term) {
    const products = await wcApi(`products?search=${encodeURIComponent(term)}&per_page=10`);
    console.log(`\n🔍 Searching: "${term}"`);
    if (products.length === 0) console.log('   ❌ No products found');
    products.forEach(p => {
        console.log(`   [${p.id}] ${p.name} | Regular: ${p.regular_price} | Sale: ${p.sale_price} | OnSale: ${p.on_sale}`);
    });
}

async function main() {
    const queries = [
        'Rooh Afza',
        'Shirin', // Jam-e-Shirin
        'Gram Flour', // For TRS and Alibaba
        'Alwaid', // Cooking Oil
        'Phulki',
        'Elephant Atta',
        'Tang', // Orange and Mango
        'Dates', // 900g
        'TYJ', // Spring Rolls Patti
        'Crown Samosa',
        'Crown Kebab'
    ];

    console.log('--- Searching for Products ---');
    for (const q of queries) {
        await searchAndLog(q);
    }
}

main();
