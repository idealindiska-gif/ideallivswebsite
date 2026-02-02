require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function checkPrice(id, expectedSalePrice) {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${id}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const product = await response.json();

        const isOnSale = product.on_sale;
        const currentPrice = product.price;
        const salePrice = product.sale_price;


        const image = product.images && product.images.length > 0 ? product.images[0].src : 'No image';

        console.log(`Product ${id} (${product.name}):`);
        console.log(`   On Sale: ${isOnSale}`);
        console.log(`   Current Price: ${currentPrice}`);
        console.log(`   Sale Price: ${salePrice}`);
        console.log(`   Expected Sale Price: ${expectedSalePrice}`);
        console.log(`   Image URL: ${image}`);

        if (String(salePrice) === String(expectedSalePrice)) {
            // Check status, but sometimes sale_price is set without on_sale being true YET if dates are finicky
            if (isOnSale) {
                console.log('   ✅ VERIFIED: Price matches and product is on sale.');
                return true;
            } else {
                console.log('   ⚠️ PRICE MATCHES BUT NOT ON SALE (Check date range/timezone?)');
                return true;
            }
        } else {
            console.log('   ❌ MISMATCH');
            return false;
        }
    } catch (e) {
        console.error(`Error checking ${id}:`, e.message);
        return false;
    }
}

async function verify() {
    console.log('Verifying promotions...');
    // Check key items from the NEW weekly offers list (feb 02)
    // 4943: Annam Peanut Oil
    // 76: Aashirvaad Atta 10kg
    await checkPrice(4943, '69');
    await checkPrice(76, '199');
}

verify();
