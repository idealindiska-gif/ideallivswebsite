/**
 * Trigger revalidation for product categories
 * Run: node scripts/revalidate-categories.js
 */

const SITE_URL = 'http://localhost:3000';
const WEBHOOK_SECRET = 'test-secret-key';

async function revalidate() {
    console.log('🔄 Triggering cache revalidation for product categories...\n');

    try {
        // Revalidate categories specifically
        const response = await fetch(`${SITE_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'x-webhook-secret': WEBHOOK_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentType: 'product_category' }),
        });

        const data = await response.json();

        if (response.ok && data.revalidated) {
            console.log('✅ Revalidation successful!');
            console.log(`   Message: ${data.message}`);
            console.log(`   Timestamp: ${data.timestamp}`);
        } else {
            console.log('❌ Revalidation failed');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${data.message || 'Unknown error'}`);
            if (response.status === 404) {
                console.log('   Hint: Check if the API route exists on the target server.');
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

revalidate();
