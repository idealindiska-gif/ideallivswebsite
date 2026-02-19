import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

/**
 * GET /api/admin/lost-orders?date=2026-02-20
 *
 * Finds Stripe payments that succeeded but have no linked WooCommerce order.
 * These are "lost" orders caused by the pre-fix checkout bug where redirect-based
 * payments (Klarna, Apple Pay, Google Pay) completed without creating a WC order.
 *
 * Secured with ADMIN_SECRET env var — pass as ?secret=xxx or Authorization: Bearer xxx
 *
 * Query params:
 *   date    - ISO date string (defaults to today UTC)  e.g. 2026-02-20
 *   secret  - admin secret (alternative to Authorization header)
 */
export async function GET(request: NextRequest) {
  // Simple auth check
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  if (adminSecret) {
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    if (authHeader !== `Bearer ${adminSecret}` && querySecret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });
  const auth = getWooCommerceAuthHeader();

  // Determine the date range (default: today UTC)
  const dateParam = request.nextUrl.searchParams.get('date');
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  const startOfDay = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate())
  );
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  try {
    // 1. Fetch all succeeded payment intents for the target date
    const paymentIntents = await stripe.paymentIntents.list({
      created: {
        gte: Math.floor(startOfDay.getTime() / 1000),
        lt: Math.floor(endOfDay.getTime() / 1000),
      },
      limit: 100,
    });

    const succeeded = paymentIntents.data.filter((pi) => pi.status === 'succeeded');

    // 2. For each payment, check if there is a linked WC order
    const results = await Promise.all(
      succeeded.map(async (pi) => {
        const wcOrderId = pi.metadata?.wc_order_id;
        let wcOrder: any = null;
        let wcStatus: string | null = null;
        let isLost = false;

        if (wcOrderId) {
          // Try to fetch the WC order
          try {
            const res = await fetch(getWooCommerceUrl(`/orders/${wcOrderId}`), {
              headers: { Authorization: auth },
              cache: 'no-store',
            });
            if (res.ok) {
              wcOrder = await res.json();
              wcStatus = wcOrder.status;
            } else {
              // Order ID in metadata but order doesn't exist in WC
              isLost = true;
            }
          } catch {
            isLost = true;
          }
        } else {
          // No wc_order_id in metadata at all — classic pre-fix lost order
          isLost = true;
        }

        const charge = pi.latest_charge as Stripe.Charge | null;
        const billingDetails = charge?.billing_details;
        const paymentMethod = pi.payment_method_types?.[0] ?? 'unknown';

        return {
          stripePaymentIntentId: pi.id,
          amount: (pi.amount / 100).toFixed(2),
          currency: pi.currency.toUpperCase(),
          paidAt: new Date(pi.created * 1000).toISOString(),
          customer: {
            email: billingDetails?.email ?? pi.receipt_email ?? null,
            name: billingDetails?.name ?? null,
            phone: billingDetails?.phone ?? null,
          },
          paymentMethod,
          wcOrderId: wcOrderId ?? null,
          wcStatus,
          isLost,
          stripeReceiptUrl: charge?.receipt_url ?? null,
        };
      })
    );

    const lost = results.filter((r) => r.isLost);
    const linked = results.filter((r) => !r.isLost);

    return NextResponse.json({
      date: startOfDay.toISOString().split('T')[0],
      summary: {
        totalSucceededPayments: succeeded.length,
        linkedToWcOrder: linked.length,
        lost: lost.length,
      },
      lostOrders: lost,
      linkedOrders: linked,
    });
  } catch (error) {
    console.error('Lost orders check failed:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
