import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStatus, addOrderNote } from '@/lib/woocommerce/orders';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Stripe sends raw body, we need to read it as text for signature verification
export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        console.error('❌ Stripe webhook: Missing signature');
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('❌ Stripe webhook: STRIPE_WEBHOOK_SECRET not configured');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('❌ Stripe webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`📩 Stripe webhook received: ${event.type}`);

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSucceeded(paymentIntent);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentCanceled(paymentIntent);
                break;
            }

            case 'payment_intent.processing': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentProcessing(paymentIntent);
                break;
            }

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('❌ Stripe webhook handler error:', error);
        // Return 200 to prevent Stripe from retrying (we've logged the error)
        // In production, you might want a dead-letter queue for failed events
        return NextResponse.json({ received: true, error: 'Handler error' });
    }
}

/**
 * Handle successful payment - update WooCommerce order to processing
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.wc_order_id;
    const paymentIntentId = paymentIntent.id;

    console.log(`✅ Payment succeeded for PaymentIntent: ${paymentIntentId}`);

    if (!orderId) {
        console.warn('⚠️ No wc_order_id in PaymentIntent metadata, cannot update WooCommerce order');
        console.log('   Metadata:', paymentIntent.metadata);
        return;
    }

    console.log(`📝 Updating WooCommerce order #${orderId} to processing...`);

    try {
        // Update order status to processing and mark as paid
        await updateOrderStatus(parseInt(orderId), 'processing', {
            set_paid: true,
            transaction_id: paymentIntentId,
        });

        // Add order note for admin reference
        await addOrderNote(parseInt(orderId), `Payment received via Stripe. PaymentIntent ID: ${paymentIntentId}`);

        console.log(`✅ WooCommerce order #${orderId} updated to processing`);
    } catch (error) {
        console.error(`❌ Failed to update WooCommerce order #${orderId}:`, error);
        throw error; // Re-throw to be handled by the main handler
    }
}

/**
 * Handle failed payment - update WooCommerce order to failed
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.wc_order_id;
    const paymentIntentId = paymentIntent.id;
    const lastError = paymentIntent.last_payment_error?.message || 'Unknown error';

    console.log(`❌ Payment failed for PaymentIntent: ${paymentIntentId}`);

    if (!orderId) {
        console.warn('⚠️ No wc_order_id in PaymentIntent metadata');
        return;
    }

    console.log(`📝 Updating WooCommerce order #${orderId} to failed...`);

    try {
        await updateOrderStatus(parseInt(orderId), 'failed');
        await addOrderNote(parseInt(orderId), `Payment failed. Reason: ${lastError}. PaymentIntent ID: ${paymentIntentId}`);

        console.log(`✅ WooCommerce order #${orderId} marked as failed`);
    } catch (error) {
        console.error(`❌ Failed to update WooCommerce order #${orderId}:`, error);
        throw error;
    }
}

/**
 * Handle canceled payment - update WooCommerce order to cancelled
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.wc_order_id;
    const paymentIntentId = paymentIntent.id;

    console.log(`🚫 Payment canceled for PaymentIntent: ${paymentIntentId}`);

    if (!orderId) {
        console.warn('⚠️ No wc_order_id in PaymentIntent metadata');
        return;
    }

    console.log(`📝 Updating WooCommerce order #${orderId} to cancelled...`);

    try {
        await updateOrderStatus(parseInt(orderId), 'cancelled');
        await addOrderNote(parseInt(orderId), `Payment was canceled. PaymentIntent ID: ${paymentIntentId}`);

        console.log(`✅ WooCommerce order #${orderId} marked as cancelled`);
    } catch (error) {
        console.error(`❌ Failed to update WooCommerce order #${orderId}:`, error);
        throw error;
    }
}

/**
 * Handle payment processing (async payment methods like bank transfers)
 */
async function handlePaymentProcessing(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.wc_order_id;
    const paymentIntentId = paymentIntent.id;

    console.log(`⏳ Payment processing for PaymentIntent: ${paymentIntentId}`);

    if (!orderId) {
        console.warn('⚠️ No wc_order_id in PaymentIntent metadata');
        return;
    }

    try {
        // Keep order as on-hold while payment is processing
        await updateOrderStatus(parseInt(orderId), 'on-hold');
        await addOrderNote(parseInt(orderId), `Payment is processing (async payment method). PaymentIntent ID: ${paymentIntentId}`);

        console.log(`✅ WooCommerce order #${orderId} set to on-hold (processing)`);
    } catch (error) {
        console.error(`❌ Failed to update WooCommerce order #${orderId}:`, error);
        throw error;
    }
}
