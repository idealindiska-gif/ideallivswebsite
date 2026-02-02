/**
 * Force Revalidate Deals Page Cache
 * Run: node scripts/revalidate-deals.js
 */

require('dotenv').config({ path: '.env.local' });

async function revalidateDeals() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ideallivs.com';
    const revalidateSecret = process.env.REVALIDATE_SECRET || 'your-secret-key';

    console.log('🔄 Revalidating deals page cache...\n');

    try {
        const response = await fetch(`${baseUrl}/api/revalidate?secret=${revalidateSecret}&path=/deals`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Deals page cache revalidated successfully!');
            console.log('Response:', data);
        } else {
            console.error('❌ Failed to revalidate:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

revalidateDeals();
