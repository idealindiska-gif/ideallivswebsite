/**
 * Add Weekly Offers for Feb 02 - Feb 08, 2026
 * 
 * Instructions:
 * 1. Search for products based on the user's list.
 * 2. Update sale_price.
 * 3. Set date_on_sale_from and date_on_sale_to.
 * 
 * Run: node scripts/add-weekly-offers-feb02.js
 */

require('dotenv').config({ path: '.env.local' });

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const CONSUMER_KEY = process.env.WORDPRESS_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WORDPRESS_CONSUMER_SECRET;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('❌ Error: Missing API credentials! Set WORDPRESS_CONSUMER_KEY and WORDPRESS_CONSUMER_SECRET.');
    process.exit(1);
}

const SALE_START = '2026-02-02';
const SALE_END = '2026-02-08';

const OFFERS = [
    { search: 'Annam Peanut Oil', size: '1', keywords: ['annam', 'peanut', 'oil', '1'], price: '69' },
    { search: 'India Gate Idly Rice', size: '5', keywords: ['india', 'gate', 'idly', 'rice', '5'], price: '99' },
    { search: 'Fortune Atta', size: '5', keywords: ['fortune', 'atta', '5'], price: '85' },
    { search: 'Deepak Multigrain Atta', size: '5', keywords: ['deepak', 'multigrain', 'atta', '5'], price: '125' },
    { search: 'Ashirvaad Atta', size: '10', keywords: ['ashirvaad', 'atta', '10'], price: '199', alternateSearch: 'Aashirvaad Atta' }, // Handling potential spelling diff
    { search: 'Chings Hot Garlic Noodles', size: '240', keywords: ['chings', 'hot', 'garlic', 'noodles'], price: '19' },
    { search: 'Chings Schezuan Noodles', size: '240', keywords: ['chings', 'schezuan', 'noodles'], price: '19' },
    { search: 'Chings Veg Hakka Noodles', size: '140', keywords: ['chings', 'veg', 'hakka', 'noodles'], price: '11' },
    { search: 'India Gate Exotic Basmati', size: '5', keywords: ['india', 'gate', 'exotic', 'basmati', '5'], price: '149' },
    { search: 'Bikano Agra Sev', size: '', keywords: ['bikano', 'agra', 'sev'], price: '27' },
];

async function wcApi(endpoint, method = 'GET', data = null) {
    const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const options = {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'User-Agent': 'NodeJS Script',
        },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url.toString(), options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function handleProduct(product, offer) {
    console.log(`   Found: "${product.name}" (ID: ${product.id}) - Regular: ${product.regular_price}`);

    // Update the product
    try {
        await wcApi(`products/${product.id}`, 'PUT', {
            sale_price: offer.price,
            date_on_sale_from: SALE_START,
            date_on_sale_to: SALE_END
        });
        console.log(`   ✅ Updated to ${offer.price} Kr (Sale: ${SALE_START} to ${SALE_END})`);
        return true;
    } catch (err) {
        console.error(`   ❌ Failed to update: ${err.message}`);
        return false;
    }
}

async function processOffers() {
    console.log(`\n🚀 Applying Weekly Offers (${SALE_START} to ${SALE_END})\n`);

    for (const offer of OFFERS) {
        console.log(`\n🔎 Searching for: ${offer.search} (${offer.size ? offer.size : 'Any'} size) @ ${offer.price} Kr`);

        // 1. Try search
        let products = await wcApi(`products?search=${encodeURIComponent(offer.search)}&status=publish`);

        // 2. If no results, try alternate search if available
        if (products.length === 0 && offer.alternateSearch) {
            console.log(`   No results. Trying alternate: ${offer.alternateSearch}`);
            products = await wcApi(`products?search=${encodeURIComponent(offer.alternateSearch)}&status=publish`);
        }

        // 3. Filter results to match keywords and size roughly
        // We'll trust the search mostly, but if we have multiple, pick best
        let matchedProduct = null;

        if (products.length === 0) {
            console.log('   ⚠️ No products found matching search terms.');
            continue;
        }

        if (products.length === 1) {
            matchedProduct = products[0];
        } else {
            // Fuzzy match logic
            console.log(`   Found ${products.length} candidates. Refining...`);

            // Filter by all keywords
            const candidates = products.filter(p => {
                const nameLower = p.name.toLowerCase();
                // Check matching keywords
                const matchesKeywords = offer.keywords.every(k => nameLower.includes(k.toLowerCase()));
                return matchesKeywords;
            });

            if (candidates.length === 1) {
                matchedProduct = candidates[0];
            } else if (candidates.length > 1) {
                // If still multiple, pick the one that looks most similar or just the first one 
                // Prioritize 'size' match if exact size string is in name
                const sizeMatch = candidates.find(p => offer.size && p.name.includes(offer.size));
                matchedProduct = sizeMatch || candidates[0];
                console.log(`   Multiple matches for keywords. Selected: ${matchedProduct.name}`);
            } else {
                // Fallback to raw search results if keyword filter was too strict
                // Try to find ANY match that has the brand atleast
                matchedProduct = products[0];
                console.log(`   Keyword filter failed. Falling back to first search result: ${matchedProduct.name}`);
            }
        }

        if (matchedProduct) {
            await handleProduct(matchedProduct, offer);
        }

        // Simple delay to be nice to API
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✅ Offers processing complete.\n');
}

processOffers().catch(console.error);
