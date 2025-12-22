import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      currency = 'sek',
      customerEmail,
      customerName,
      billingAddress,
      shippingAddress,
      metadata
    } = await request.json();

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured on the server. Please contact support.' },
        { status: 500 }
      );
    }

    // Build PaymentIntent params
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount), // Ensure it's an integer (öre/cents)
      currency: currency.toLowerCase(),
      // Enable automatic payment methods with redirect support for Klarna
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always', // Required for Klarna and other redirect-based methods
      },
      receipt_email: customerEmail || undefined,
      metadata: {
        integration: 'headless-woocommerce',
        source: 'nextjs-frontend',
        ...metadata,
      },
    };

    // Add shipping address if provided (required for some payment methods)
    if (shippingAddress) {
      paymentIntentParams.shipping = {
        name: shippingAddress.name || customerName || '',
        address: {
          line1: shippingAddress.address_1 || shippingAddress.line1 || '',
          line2: shippingAddress.address_2 || shippingAddress.line2 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          postal_code: shippingAddress.postcode || shippingAddress.postal_code || '',
          country: shippingAddress.country || 'SE',
        },
      };
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log(`PaymentIntent created: ${paymentIntent.id}, status: ${paymentIntent.status}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      // Return available payment method types for frontend debugging
      paymentMethodTypes: paymentIntent.payment_method_types,
    });
  } catch (error) {
    console.error('PaymentIntent creation error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent. Please try again.' },
      { status: 500 }
    );
  }
}
