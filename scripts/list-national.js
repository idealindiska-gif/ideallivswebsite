require('dotenv').config({ path: '.env.local' });
async function run() {
    const auth = Buffer.from(process.env.WORDPRESS_CONSUMER_KEY + ':' + process.env.WORDPRESS_CONSUMER_SECRET).toString('base64');
    let allNational = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
        const res = await fetch(`https://crm.ideallivs.com/wp-json/wc/v3/products?search=National&per_page=100&page=${page}`, {
            headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': 'Mozilla/5.0' }
        });
        const ps = await res.json();
        if (ps.length > 0) {
            allNational = [...allNational, ...ps];
            page++;
        } else {
            hasMore = false;
        }
    }

    console.log('--- ALL NATIONAL PRODUCTS ---');
    allNational.forEach(p => {
        if (p.name.includes('National')) {
            console.log(`${p.id} | ${p.name} | ${p.regular_price}`);
        }
    });
}
run().catch(console.error);
