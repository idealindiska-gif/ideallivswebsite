/**
 * Remove Sale Prices from All Products
 * Ends promotions by clearing sale_price field from all WooCommerce products
 */

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com',
    consumerKey: process.env.WORDPRESS_CONSUMER_KEY || '',
    consumerSecret: process.env.WORDPRESS_CONSUMER_SECRET || '',
    version: 'wc/v3',
});

interface WooProduct {
    id: number;
    name: string;
    regular_price: string;
    sale_price: string;
    price: string;
    type: string;
}

async function removeSalePrices() {
    try {
        console.log('🔍 Fetching products with sale prices...\n');

        // Fetch all products (paginated)
        let page = 1;
        let allProducts: WooProduct[] = [];
        let hasMore = true;

        while (hasMore) {
            const response = await api.get('products', {
                per_page: 100,
                page: page,
                status: 'publish',
            });

            const products: WooProduct[] = response.data;

            if (products.length > 0) {
                allProducts = [...allProducts, ...products];
                page++;
                console.log(`   Fetched page ${page - 1}: ${products.length} products`);
            } else {
                hasMore = false;
            }
        }

        console.log(`\n✅ Total products found: ${allProducts.length}\n`);

        // Filter products that have sale prices
        const productsWithSales = allProducts.filter(
            (product) => product.sale_price && product.sale_price !== ''
        );

        console.log(`📊 Products with sale prices: ${productsWithSales.length}\n`);

        if (productsWithSales.length === 0) {
            console.log('✅ No products have sale prices. Nothing to update.\n');
            return;
        }

        // Display products that will be updated
        console.log('Products to update:');
        console.log('─'.repeat(80));
        productsWithSales.forEach((product) => {
            console.log(
                `ID: ${product.id.toString().padEnd(6)} | ${product.name.substring(0, 40).padEnd(42)} | Regular: ${product.regular_price.padEnd(8)} | Sale: ${product.sale_price}`
            );
        });
        console.log('─'.repeat(80));
        console.log('');

        // Confirm before proceeding
        console.log('⚠️  WARNING: This will remove sale prices from all products above.\n');

        // Update products in batches
        console.log('🔄 Updating products...\n');

        const batchSize = 10;
        let updated = 0;
        let failed = 0;

        for (let i = 0; i < productsWithSales.length; i += batchSize) {
            const batch = productsWithSales.slice(i, i + batchSize);

            const updatePromises = batch.map(async (product) => {
                try {
                    await api.put(`products/${product.id}`, {
                        sale_price: '', // Clear sale price
                    });
                    console.log(`   ✓ Updated: ${product.name} (ID: ${product.id})`);
                    updated++;
                } catch (error) {
                    console.error(`   ✗ Failed: ${product.name} (ID: ${product.id})`, error);
                    failed++;
                }
            });

            await Promise.all(updatePromises);

            // Small delay between batches
            if (i + batchSize < productsWithSales.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('\n' + '═'.repeat(80));
        console.log('📊 Summary:');
        console.log(`   ✅ Successfully updated: ${updated} products`);
        if (failed > 0) {
            console.log(`   ❌ Failed: ${failed} products`);
        }
        console.log('═'.repeat(80));
        console.log('\n✅ Sale prices removed successfully!\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Also handle variations
async function removeSalePricesFromVariations() {
    try {
        console.log('\n🔍 Checking variable products for variations with sale prices...\n');

        // Get all variable products
        let page = 1;
        let allVariableProducts: WooProduct[] = [];
        let hasMore = true;

        while (hasMore) {
            const response = await api.get('products', {
                per_page: 100,
                page: page,
                type: 'variable',
                status: 'publish',
            });

            const products: WooProduct[] = response.data;

            if (products.length > 0) {
                allVariableProducts = [...allVariableProducts, ...products];
                page++;
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ Found ${allVariableProducts.length} variable products\n`);

        let totalVariationsUpdated = 0;

        for (const product of allVariableProducts) {
            try {
                // Get variations for this product
                const variationsResponse = await api.get(`products/${product.id}/variations`, {
                    per_page: 100,
                });

                const variations = variationsResponse.data;
                const variationsWithSales = variations.filter(
                    (v: any) => v.sale_price && v.sale_price !== ''
                );

                if (variationsWithSales.length > 0) {
                    console.log(`📦 ${product.name} - ${variationsWithSales.length} variations with sales`);

                    for (const variation of variationsWithSales) {
                        await api.put(`products/${product.id}/variations/${variation.id}`, {
                            sale_price: '',
                        });
                        totalVariationsUpdated++;
                        console.log(`   ✓ Cleared variation ID: ${variation.id}`);
                    }
                }
            } catch (error) {
                console.error(`   ✗ Error processing ${product.name}:`, error);
            }
        }

        console.log(`\n✅ Total variations updated: ${totalVariationsUpdated}\n`);

    } catch (error) {
        console.error('❌ Error processing variations:', error);
    }
}

// Run the script
async function main() {
    console.log('\n🚀 Starting Sale Price Removal\n');
    console.log('═'.repeat(80));

    await removeSalePrices();
    await removeSalePricesFromVariations();

    console.log('\n✅ All done!\n');
}

main();
