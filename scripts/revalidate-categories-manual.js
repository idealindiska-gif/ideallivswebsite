require('dotenv').config({ path: '.env.local' });
async function revalidate() {
    console.log('🔄 Triggering cache revalidation for categories...\n');
    const SITE_URL = 'https://www.ideallivs.com';
    const WEBHOOK_SECRET = 'test-secret-key'; // Note: In production this might be different, but let's try.

    try {
        const response = await fetch(`${SITE_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'x-webhook-secret': WEBHOOK_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentType: 'product_category' }),
        });

        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}
revalidate();
