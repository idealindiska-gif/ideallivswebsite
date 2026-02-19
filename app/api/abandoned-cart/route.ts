import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

/**
 * POST /api/abandoned-cart
 * Called on email-field blur with minimal data, then again after Step 1 submit
 * with full customer details. Stores as a WooCommerce pending order tagged with
 * _is_abandoned_cart meta so the cron job can find and email it.
 *
 * Body: { email, firstName?, lastName?, phone?, items, abandonedCartId? }
 * - abandonedCartId: if present, UPDATE that order instead of creating a new one
 */
export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone, items, abandonedCartId } = await request.json();

    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'email and items are required' }, { status: 400 });
    }

    const auth = getWooCommerceAuthHeader();
    const now = new Date().toISOString();

    // ── UPDATE existing abandoned-cart order ─────────────────────────────────
    if (abandonedCartId) {
      const updatePayload: Record<string, any> = {
        meta_data: [
          { key: '_is_abandoned_cart', value: '1' },
          { key: '_abandoned_at', value: now },
          { key: '_recovery_email_sent', value: '0' },
        ],
      };

      if (firstName || lastName || phone) {
        updatePayload.billing = {
          email,
          first_name: firstName || '',
          last_name: lastName || '',
          phone: phone || '',
        };
        updatePayload.shipping = {
          first_name: firstName || '',
          last_name: lastName || '',
        };
      }

      const res = await fetch(getWooCommerceUrl(`/orders/${abandonedCartId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('WC update failed:', err);
        // Non-fatal — don't block the user
        return NextResponse.json({ success: false, id: abandonedCartId });
      }

      return NextResponse.json({ success: true, id: abandonedCartId });
    }

    // ── CREATE new abandoned-cart order ──────────────────────────────────────
    const token = randomUUID();

    const orderPayload = {
      status: 'pending',
      billing: {
        email,
        first_name: firstName || '',
        last_name: lastName || '',
        phone: phone || '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'SE',
      },
      shipping: {
        first_name: firstName || '',
        last_name: lastName || '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'SE',
      },
      line_items: items.map((item: any) => ({
        product_id: item.productId,
        ...(item.variationId ? { variation_id: item.variationId } : {}),
        quantity: item.quantity,
      })),
      meta_data: [
        { key: '_is_abandoned_cart', value: '1' },
        { key: '_abandoned_cart_token', value: token },
        { key: '_abandoned_at', value: now },
        { key: '_recovery_email_sent', value: '0' },
      ],
    };

    const res = await fetch(getWooCommerceUrl('/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('WC abandoned cart create failed:', err);
      // Non-fatal — silently ignore so checkout UX isn't impacted
      return NextResponse.json({ success: false });
    }

    const order = await res.json();
    return NextResponse.json({ success: true, id: order.id, token });
  } catch (error) {
    console.error('Abandoned cart POST error:', error);
    // Non-fatal — never block checkout for this
    return NextResponse.json({ success: false });
  }
}

/**
 * DELETE /api/abandoned-cart?id=xxx
 * Called when a real order is placed, to remove the abandoned-cart flag so the
 * cron job doesn't email the customer after they've already checked out.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    if (!orderId) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const auth = getWooCommerceAuthHeader();

    await fetch(getWooCommerceUrl(`/orders/${orderId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        meta_data: [
          { key: '_is_abandoned_cart', value: '0' },
          { key: '_recovered_at', value: new Date().toISOString() },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Abandoned cart DELETE error:', error);
    return NextResponse.json({ success: false });
  }
}
