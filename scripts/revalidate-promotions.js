/**
 * Trigger revalidation for promotions/price changes
 * Run: node scripts/revalidate-promotions.js
 */

require('dotenv').config({ path: '.env.local' });

const SITE_URL = 'https://www.ideallivs.com';
const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET || 'test-secret-key';

async function revalidate() {
    console.log('🔄 Triggering cache revalidation for promotions...\n');

    try {
        const response = await fetch(`${SITE_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'x-webhook-secret': WEBHOOK_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentType: 'promotion' }),
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
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

revalidate();
