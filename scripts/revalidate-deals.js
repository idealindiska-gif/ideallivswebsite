require('dotenv').config({ path: '.env.local' });

async function revalidateDeals() {
    console.log('🔄 Triggering cache revalidation for deals and promotions...\n');

    // Check if we have the site URL, default to localhost for development or prod URL
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ideallivs.com';
    const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET || 'test-secret-key';

    console.log(`Target: ${SITE_URL}`);

    try {
        const response = await fetch(`${SITE_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'x-webhook-secret': WEBHOOK_SECRET,
                'Content-Type': 'application/json',
            },
            // Using 'promotion' content type which we just updated to revalidate /deals
            body: JSON.stringify({ contentType: 'promotion' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Success:', data);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

revalidateDeals();
