require('dotenv').config({ path: '.env.local' });
async function run() {
    const auth = Buffer.from(process.env.WORDPRESS_CONSUMER_KEY + ':' + process.env.WORDPRESS_CONSUMER_SECRET).toString('base64');
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
        const res = await fetch(`https://crm.ideallivs.com/wp-json/wc/v3/products?search=Swetha&per_page=100&page=${page}`, {
            headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': 'Mozilla/5.0' }
        });
        const ps = await res.json();
        if (ps.length > 0) {
            allProducts = [...allProducts, ...ps];
            page++;
        } else {
            hasMore = false;
        }
    }

    const swethaProducts = allProducts.filter(p => p.name.includes('Swetha') || p.name.includes('Telugu'));
    console.log(`Found ${swethaProducts.length} Swetha-Telugu products`);

    const fromDate = '2026-01-19T00:00:00';
    const toDate = '2026-01-25T23:59:59';

    for (const p of swethaProducts) {
        const regPrice = parseFloat(p.regular_price);
        if (isNaN(regPrice)) continue;

        const salePrice = Math.round(regPrice * 0.9); // 10% off

        try {
            await fetch(`https://crm.ideallivs.com/wp-json/wc/v3/products/${p.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + auth,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                body: JSON.stringify({
                    sale_price: salePrice.toString(),
                    date_on_sale_from: fromDate,
                    date_on_sale_to: toDate
                })
            });
            console.log(`✅ ${p.name} (ID: ${p.id}) -> ${regPrice} to ${salePrice}`);
        } catch (err) {
            console.error(`❌ Failed ${p.id}: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 200));
    }
}
run().catch(console.error);
