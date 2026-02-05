/**
 * Diagnostic Script: Check Stripe Payment for Order Status Issue
 * 
 * This script checks:
 * 1. If the PaymentIntent has the wc_order_id in metadata
 * 2. The webhook configuration in Stripe
 * 3. The order status in WooCommerce
 * 
 * Usage: node scripts/check-stripe-order.js <ORDER_ID>
 */

require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// WooCommerce API configuration
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://crm.ideallivs.com';
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

async function fetchWCOrder(orderId) {
    const url = `${WC_URL}/wp-json/wc/v3/orders/${orderId}`;
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    const response = await fetch(url, {
        headers: {
            'Authorization': `Basic ${auth}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function findPaymentIntentForOrder(orderId) {
    console.log(`\n🔍 Searching for PaymentIntent with wc_order_id: ${orderId}...\n`);

    // Search recent PaymentIntents
    const paymentIntents = await stripe.paymentIntents.list({
        limit: 50,
        created: {
            // Last 7 days
            gte: Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
        },
    });

    const matchingPIs = paymentIntents.data.filter(pi =>
        pi.metadata?.wc_order_id === orderId.toString()
    );

    return matchingPIs;
}

async function checkWebhookEndpoints() {
    console.log('\n📡 Checking Stripe Webhook Endpoints...\n');

    const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });

    for (const endpoint of endpoints.data) {
        console.log(`• ${endpoint.url}`);
        console.log(`  Status: ${endpoint.status}`);
        console.log(`  Events: ${endpoint.enabled_events.join(', ')}`);
        console.log('');
    }

    return endpoints.data;
}

async function checkOrder(orderId) {
    console.log('='.repeat(60));
    console.log(`STRIPE + WOOCOMMERCE ORDER DIAGNOSTIC`);
    console.log(`Order ID: ${orderId}`);
    console.log('='.repeat(60));

    // 1. Check WooCommerce order
    console.log('\n📦 Fetching WooCommerce Order...\n');

    try {
        const order = await fetchWCOrder(orderId);
        console.log(`Order #${order.id}`);
        console.log(`  Status: ${order.status}`);
        console.log(`  Payment Method: ${order.payment_method} (${order.payment_method_title})`);
        console.log(`  Date Paid: ${order.date_paid || 'NOT PAID'}`);
        console.log(`  Transaction ID: ${order.transaction_id || 'None'}`);
        console.log(`  Total: ${order.total} ${order.currency}`);

        // Check order notes for Stripe info
        console.log('\n📝 Order Notes:');
        const notesUrl = `${WC_URL}/wp-json/wc/v3/orders/${orderId}/notes`;
        const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
        const notesRes = await fetch(notesUrl, {
            headers: { 'Authorization': `Basic ${auth}` },
        });
        if (notesRes.ok) {
            const notes = await notesRes.json();
            notes.slice(0, 5).forEach(note => {
                console.log(`  - ${note.note.substring(0, 100)}${note.note.length > 100 ? '...' : ''}`);
            });
        }
    } catch (error) {
        console.error(`❌ Failed to fetch order: ${error.message}`);
    }

    // 2. Find PaymentIntents for this order
    try {
        const pis = await findPaymentIntentForOrder(orderId);

        if (pis.length === 0) {
            console.log('\n⚠️ No PaymentIntent found with wc_order_id metadata matching this order!');
            console.log('   This is likely the root cause - the order ID is not being passed to Stripe.');
        } else {
            console.log(`\n💳 Found ${pis.length} PaymentIntent(s) for this order:\n`);

            for (const pi of pis) {
                console.log(`PaymentIntent: ${pi.id}`);
                console.log(`  Status: ${pi.status}`);
                console.log(`  Amount: ${(pi.amount / 100).toFixed(2)} ${pi.currency.toUpperCase()}`);
                console.log(`  Created: ${new Date(pi.created * 1000).toISOString()}`);
                console.log(`  Metadata:`, pi.metadata);

                // Check if payment succeeded but webhook didn't trigger
                if (pi.status === 'succeeded') {
                    console.log('\n  ⚠️ Payment SUCCEEDED in Stripe but WooCommerce order may not be updated!');
                    console.log('     Possible causes:');
                    console.log('     1. Webhook not configured in Stripe Dashboard');
                    console.log('     2. STRIPE_WEBHOOK_SECRET env var not set/incorrect');
                    console.log('     3. Webhook endpoint URL is wrong');
                }
            }
        }
    } catch (error) {
        console.error(`❌ Failed to search PaymentIntents: ${error.message}`);
    }

    // 3. Check webhook configuration
    try {
        await checkWebhookEndpoints();
    } catch (error) {
        console.error(`❌ Failed to list webhooks: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('RECOMMENDATIONS:');
    console.log('='.repeat(60));
    console.log(`
1. Verify STRIPE_WEBHOOK_SECRET is set in Vercel environment variables
2. Ensure webhook URL is: https://www.ideallivs.com/api/stripe/webhook
3. Required webhook events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - payment_intent.canceled
   - payment_intent.processing
4. Check Vercel logs for webhook errors: vercel logs
5. Test webhook delivery in Stripe Dashboard > Developers > Webhooks
`);
}

// Get order ID from command line
const orderId = process.argv[2];

if (!orderId) {
    console.log('Usage: node scripts/check-stripe-order.js <ORDER_ID>');
    console.log('Example: node scripts/check-stripe-order.js 5133');
    process.exit(1);
}

checkOrder(orderId).catch(console.error);
