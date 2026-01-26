/**
 * Force Cache Refresh for Promotions
 * Triggers Next.js revalidation via the webhook endpoint
 */

require('dotenv').config({ path: '.env.local' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ideallivs.com';
const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET;

async function triggerRevalidation() {
    console.log('\n🔄 Triggering cache revalidation...\n');

    const revalidations = [
        { contentType: 'promotion', description: 'All promotions/sales' },
        { contentType: 'product', description: 'All products' },
    ];

    for (const revalidation of revalidations) {
        try {
            const response = await fetch(`${SITE_URL}/api/revalidate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': WEBHOOK_SECRET,
                },
                body: JSON.stringify({
                    contentType: revalidation.contentType,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(`   ✅ ${revalidation.description}: ${result.message}`);
            } else {
                console.error(`   ❌ ${revalidation.description}: ${result.message || response.statusText}`);
            }
        } catch (err) {
            console.error(`   ❌ ${revalidation.description}: ${err.message}`);
        }

        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✅ Cache revalidation complete!');
    console.log('🌐 Visit your site to see updated promotions.');
}

triggerRevalidation().catch(console.error);
