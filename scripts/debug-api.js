require('dotenv').config({ path: '.env.local' });
// Fallback to .env if .env.local doesn't exist or is partial
require('dotenv').config({ path: '.env' });

const https = require('https');
const http = require('http');

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const consumerKey = process.env.WORDPRESS_CONSUMER_KEY;
const consumerSecret = process.env.WORDPRESS_CONSUMER_SECRET;

console.log('--- Debugging WooCommerce API Connection ---');
console.log('URL:', baseUrl);
console.log('Key exists:', !!consumerKey);
console.log('Secret exists:', !!consumerSecret);

if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('ERROR: Missing environment variables.');
    process.exit(1);
}

const endpoint = '/wp-json/wc/v3/products?per_page=1&page=1&orderby=date&order=desc&status=publish';
const fullUrl = `${baseUrl}/${endpoint}`; // Intentional double slash if baseUrl has no slash, or triple if it has.
// Actually, let's just make sure we insert a slash even if one exists, to force `//`.
// If baseUrl is `...com`, result `...com//wp-json...`

console.log(`Fetching: ${fullUrl}`);

const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'IdealLivs-Frontend/1.0'
    }
};

const protocol = fullUrl.startsWith('https') ? https : http;

const req = protocol.request(fullUrl, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    const headers = res.headers;
    console.log('Headers:', JSON.stringify(headers, null, 2));

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('--- Response Body Preview (First 1000 chars) ---');
        console.log(data.substring(0, 1000));
        console.log('--- End Response Body Preview ---');

        // Try parsing
        try {
            JSON.parse(data);
            console.log('✅ Response is valid JSON.');
        } catch (e) {
            console.error('❌ Response is NOT valid JSON.');
            console.error('Common causes:');
            console.error('1. URL is incorrect (hitting a 404 page).');
            console.error('2. Site is in maintenance mode.');
            console.error('3. Server error (500) returning HTML.');
            console.error('4. Cloudflare/Security challenge.');
        }
    });
});

req.on('error', (e) => {
    console.error(`Request Error: ${e.message}`);
});

req.end();
