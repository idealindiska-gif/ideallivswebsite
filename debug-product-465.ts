import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;
const baseUrl = "https://crm.ideallivs.com/wp-json/wc/v3";

async function fetchDirect(endpoint: string) {
    const authHeader = 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }
    return response.json();
}

async function debugProduct() {
    console.log('--- WOOCOMMERCE DIRECT FETCH ---');

    const productId = 465;
    console.log(`Fetching product ${productId}...`);

    try {
        const product: any = await fetchDirect(`/products/${productId}`);
        console.log('Product Name:', product.name);
        console.log('Product Type:', product.type);
        console.log('Product Slug:', product.slug);
        console.log('Attributes:', JSON.stringify(product.attributes, null, 2));

        if (product.type === 'variable') {
            console.log('\n--- VARIATIONS ---');
            const variations: any[] = await fetchDirect(`/products/${productId}/variations`);
            console.log(`Found ${variations.length} variations`);

            variations.forEach(v => {
                console.log(`\nVariation ID: ${v.id}`);
                console.log(`  SKU: ${v.sku}`);
                console.log(`  Price: ${v.price}`);
                console.log(`  Stock: ${v.stock_status} (${v.stock_quantity ?? 'no quantity'})`);
                console.log(`  Status: ${v.status}`);
                console.log(`  Attributes:`, JSON.stringify(v.attributes, null, 2));
            });
        } else {
            console.log('\nThis is a simple product, not variable.');
        }
    } catch (err) {
        console.error('Failed:', err);
    }
}

debugProduct().catch(console.error);
