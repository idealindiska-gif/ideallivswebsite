require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(url, { headers: { 'Authorization': `Basic ${auth}` } });
    return response.json();
}

async function searchAndLog(term) {
    console.log(`\n🔍 Searching: "${term}"`);
    const products = await wcApi(`products?search=${encodeURIComponent(term)}&per_page=10`);
    if (products.length === 0) console.log('   ❌ No products found');
    products.forEach(p => {
        console.log(`   [${p.id}] ${p.name} | Reg: ${p.regular_price} | Sale: ${p.sale_price}`);
    });
}

async function main() {
    const queries = [
        'Shireen', // Jam-e-Shireen
        'TRS Gram Flour',
        'Alibaba Gram Flour',
        'Alwaid',
        'Phulki',
        'Tang',
        'Dates', // Check for 900g
        'Rice' // User asked "Rice 5kg brand to be decided" - maybe I should list some options or just skip for now. I'll search for "5kg" 
    ];

    for (const q of queries) {
        await searchAndLog(q);
    }
}

main();
