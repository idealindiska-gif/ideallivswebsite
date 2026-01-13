require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function search(term) {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(term)}&per_page=10`, {
        headers: { 'Authorization': `Basic ${auth}` },
    });
    return response.json();
}

async function main() {
    // Search for India Gate Idli Rice
    console.log('\n--- India Gate Idli ---');
    const idli = await search('India Gate Idli');
    idli.forEach(p => console.log(`ID: ${p.id} | ${p.name} | Reg: ${p.regular_price}`));

    console.log('\n--- Sago 1kg ---');
    const sago = await search('Sago 1kg');
    sago.forEach(p => console.log(`ID: ${p.id} | ${p.name} | Reg: ${p.regular_price}`));

    console.log('\n--- Alibaba Pesi ---');
    const alibaba = await search('Alibaba Pesi');
    alibaba.forEach(p => console.log(`ID: ${p.id} | ${p.name} | Reg: ${p.regular_price}`));

    console.log('\n--- Alibaba Gur ---');
    const gur = await search('Alibaba Gur');
    gur.forEach(p => console.log(`ID: ${p.id} | ${p.name} | Reg: ${p.regular_price}`));
}

main().catch(console.error);
