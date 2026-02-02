/**
 * Check Current Sale Products
 * Run: node scripts/check-sale-products.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Basic ${auth}` }
    });
    return response.json();
}

async function checkSaleProducts() {
    console.log('🔍 Checking products on sale...\n');

    try {
        // Fetch products with on_sale=true
        const saleProducts = await wcApi('products?on_sale=true&per_page=100&status=publish');

        console.log(`Found ${saleProducts.length} products on sale:\n`);

        if (saleProducts.length === 0) {
            console.log('❌ NO SALE PRODUCTS FOUND!');
            console.log('\nThis could mean:');
            console.log('1. Products don\'t have sale_price set');
            console.log('2. Sale dates are not active');
            console.log('3. Products are not published');
            return;
        }

        saleProducts.forEach((p, i) => {
            if (i < 20) { // Show first 20
                console.log(`${i + 1}. [${p.id}] ${p.name}`);
                console.log(`   Regular: ${p.regular_price} Kr | Sale: ${p.sale_price} Kr`);
                console.log(`   Date from: ${p.date_on_sale_from || 'Not set'}`);
                console.log(`   Date to: ${p.date_on_sale_to || 'Not set'}`);
                console.log('');
            }
        });

        if (saleProducts.length > 20) {
            console.log(`... and ${saleProducts.length - 20} more products on sale`);
        }

        console.log(`\n✅ Total: ${saleProducts.length} products on sale`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkSaleProducts();
