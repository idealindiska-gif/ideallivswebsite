require('dotenv').config({ path: '.env.local' });
async function run() {
    const auth = Buffer.from(process.env.WORDPRESS_CONSUMER_KEY + ':' + process.env.WORDPRESS_CONSUMER_SECRET).toString('base64');
    const terms = ['Haldiram', 'Punjabi', 'Samosa', 'Pickle'];
    for (const term of terms) {
        console.log(`--- Searching for: ${term} ---`);
        const res = await fetch(`https://crm.ideallivs.com/wp-json/wc/v3/products?search=${term}&per_page=100`, {
            headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': 'Mozilla/5.0' }
        });
        const ps = await res.json();
        ps.forEach(p => console.log(`${p.id} | ${p.name} | ${p.regular_price}`));
    }
}
run().catch(console.error);
