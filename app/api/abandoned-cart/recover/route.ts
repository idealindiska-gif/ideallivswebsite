import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

/**
 * GET /api/abandoned-cart/recover?token=xxx
 * Looks up an abandoned cart by its recovery token, fetches full product data
 * for each line item, and returns everything the recovery page needs to restore
 * the cart and pre-fill the checkout form.
 */
export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'token required' }, { status: 400 });
    }

    const auth = getWooCommerceAuthHeader();

    // Scan pending orders from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const listRes = await fetch(
      getWooCommerceUrl(`/orders?status=pending&after=${sevenDaysAgo}&per_page=100`),
      { headers: { Authorization: auth }, cache: 'no-store' }
    );

    if (!listRes.ok) throw new Error('Failed to fetch orders from WooCommerce');

    const orders: any[] = await listRes.json();

    // Find the order whose meta matches this token
    const order = orders.find((o) => {
      const meta = o.meta_data ?? [];
      const matchesToken = meta.find((m: any) => m.key === '_abandoned_cart_token')?.value === token;
      const isAbandoned = meta.find((m: any) => m.key === '_is_abandoned_cart')?.value === '1';
      return matchesToken && isAbandoned;
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Cart not found or already recovered' },
        { status: 404 }
      );
    }

    // Fetch full product + variation data for each line item in parallel
    const cartItems = await Promise.all(
      (order.line_items ?? []).map(async (item: any) => {
        try {
          const [productRes, variationRes] = await Promise.all([
            fetch(getWooCommerceUrl(`/products/${item.product_id}`), {
              headers: { Authorization: auth },
              cache: 'no-store',
            }),
            item.variation_id
              ? fetch(
                  getWooCommerceUrl(
                    `/products/${item.product_id}/variations/${item.variation_id}`
                  ),
                  { headers: { Authorization: auth }, cache: 'no-store' }
                )
              : null,
          ]);

          if (!productRes.ok) return null;
          const product = await productRes.json();
          const variation = variationRes?.ok ? await variationRes.json() : null;

          return {
            productId: item.product_id,
            variationId: item.variation_id || null,
            quantity: item.quantity,
            price: variation ? parseFloat(variation.price) : parseFloat(product.price),
            product,
            variation,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({
      orderId: order.id,
      billingData: {
        email: order.billing?.email ?? '',
        first_name: order.billing?.first_name ?? '',
        last_name: order.billing?.last_name ?? '',
        phone: order.billing?.phone ?? '',
        address_1: order.billing?.address_1 ?? '',
        address_2: order.billing?.address_2 ?? '',
        city: order.billing?.city ?? '',
        state: order.billing?.state ?? '',
        postcode: order.billing?.postcode ?? '',
        country: order.billing?.country ?? 'SE',
      },
      items: cartItems.filter(Boolean),
    });
  } catch (error) {
    console.error('Abandoned cart recover GET error:', error);
    return NextResponse.json({ error: 'Failed to recover cart' }, { status: 500 });
  }
}
