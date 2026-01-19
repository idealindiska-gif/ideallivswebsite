/**
 * Apply New Promotions
 * Monday 19 Jan - Sunday 25 Jan 2026
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        },
    };

    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url.toString(), options);
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error ${response.status}: ${err}`);
    }
    return response.json();
}

const promotions = [
    { id: 80, price: '249', name: 'Elephant Atta 25 Kg' },
    { id: 291, price: '35', name: 'National Mango Pickle 1 kg' },
    { id: 290, price: '35', name: 'National Mixed Pickle 1 kg' },
    { id: 287, price: '42', name: 'Shan Ginger Garlic Paste 700g' },
    { id: 210, price: '155', name: 'Kaalar 1121 Basmati Sella Rice 5kg' },
    { id: 199, price: '155', name: 'Kaalar Extra Long Grain Steam Basmati Rice 5kg' },
    { id: 188, price: '155', name: 'Kaalar Super Kernal Premium Basmati Rice 5kg' },
    { id: 510, price: '129', name: 'HaldiRam Punjabi Samosa Value Pack 1.4 Kg' },
    { id: 511, price: '129', name: 'Haldiram\'s Frozen Cocktail Samosa Value Pack 1.4kg' },
    { id: 204, price: '99', name: 'India gate Idli Rice 5 Kg' },
    { id: 215, price: '99', name: 'India Gate Sona Masoori Rice 5kg' },
    // National Spices (15 kr each for 2 for 30 kr deal)
    { id: 848, price: '15', name: 'National Chicken Biryani Masala 82g' },
    { id: 847, price: '15', name: 'National Sindhi Biryani Masala 82g' },
    { id: 846, price: '15', name: 'National Tikka Boti Masala 88g' },
    { id: 845, price: '15', name: 'National Haleem Spice Mix' },
    { id: 418, price: '15', name: 'National Chana Masala 90gx2' },
    { id: 417, price: '15', name: 'National Shahi Daal 90gx2' },
    { id: 415, price: '15', name: 'National Daal Makhni 74g' },
    { id: 414, price: '15', name: 'National Pav/Sabzi Masala' },
    { id: 132, price: '15', name: 'National Mutton Biryani 78g' },
    { id: 131, price: '15', name: 'National Beef Biryani 78g' },
    { id: 129, price: '15', name: 'National Karahi Gosht 94gm' },
    { id: 114, price: '15', name: 'National Tandoori Masala' },
    { id: 113, price: '15', name: 'National Pulao Masala' },
    { id: 112, price: '15', name: 'National Qeema Masala' },
    { id: 111, price: '15', name: 'National Delhi Nihari Masala' },
    { id: 110, price: '15', name: 'National Fried Fish Masala' },
    { id: 109, price: '15', name: 'National Chicken White Karahi' },
    { id: 108, price: '15', name: 'National Chicken Tikka 88g' },
    { id: 107, price: '15', name: 'National Chicken Jalfrezi' },
    { id: 106, price: '15', name: 'National Chapli Kebab' },
    { id: 105, price: '15', name: 'National Chaat Masala' },
    { id: 104, price: '15', name: 'National Butter Chicken' },
    { id: 103, price: '15', name: 'National Bombay Biryani' },
    { id: 102, price: '15', name: 'National Biryani Masala' },
    { id: 101, price: '15', name: 'National Bihari Kebab' },
    { id: 100, price: '15', name: 'National Achar Gosht' },
];

async function applyPromotions() {
    const fromDate = '2026-01-19T00:00:00';
    const toDate = '2026-01-25T23:59:59';

    console.log(`\n🚀 Applying ${promotions.length} promotions...\n`);

    for (const promo of promotions) {
        try {
            await wcApi(`products/${promo.id}`, 'PUT', {
                sale_price: promo.price,
                date_on_sale_from: fromDate,
                date_on_sale_to: toDate
            });
            console.log(`   ✅ Success: ${promo.name} (ID: ${promo.id}) -> ${promo.price} kr`);
        } catch (err) {
            console.error(`   ❌ Failed: ${promo.name} (ID: ${promo.id}): ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n✅ All promotions applied!');
}

applyPromotions().catch(console.error);
