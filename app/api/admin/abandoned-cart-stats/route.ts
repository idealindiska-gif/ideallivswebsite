import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';

export const dynamic = 'force-dynamic';

function getMeta(meta: any[], key: string): string {
  return meta?.find((m: any) => m.key === key)?.value ?? '';
}

function startOf(unit: 'day' | 'week' | 'month'): Date {
  const now = new Date();
  if (unit === 'day') {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (unit === 'week') {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - 6);
    return d;
  }
  // month
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function GET(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  if (adminSecret) {
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    if (authHeader !== `Bearer ${adminSecret}` && querySecret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const auth = getWooCommerceAuthHeader();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch pending orders from last 30 days (abandoned carts live as pending orders)
    const res = await fetch(
      getWooCommerceUrl(`/orders?status=pending&after=${thirtyDaysAgo}&per_page=100`),
      { headers: { Authorization: auth }, cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`WC fetch failed: ${res.status}`);
    const orders: any[] = await res.json();

    // Separate abandoned vs recovered
    const abandoned: any[] = [];
    const recovered: any[] = [];

    for (const order of orders) {
      const meta: any[] = order.meta_data ?? [];
      const isAbandoned = getMeta(meta, '_is_abandoned_cart');
      const recoveredAt = getMeta(meta, '_recovered_at');

      if (isAbandoned === '1') {
        abandoned.push(order);
      } else if (isAbandoned === '0' && recoveredAt) {
        recovered.push(order);
      }
    }

    // Build normalised cart objects
    const toCart = (order: any, status: string) => {
      const meta: any[] = order.meta_data ?? [];
      const abandonedAt = getMeta(meta, '_abandoned_at');
      const emailSent = getMeta(meta, '_recovery_email_sent') === '1';
      const recoveredAt = getMeta(meta, '_recovered_at');
      const emailSentAt = getMeta(meta, '_recovery_email_sent_at');

      let cartStatus = status;
      if (status === 'abandoned') {
        const age = abandonedAt ? Date.now() - new Date(abandonedAt).getTime() : 0;
        if (emailSent) cartStatus = 'emailed';
        else if (age < 60 * 60 * 1000) cartStatus = 'fresh';
        else cartStatus = 'awaiting_email';
      }

      return {
        id: order.id,
        email: order.billing?.email ?? '',
        name: [order.billing?.first_name, order.billing?.last_name].filter(Boolean).join(' ') || '—',
        phone: order.billing?.phone ?? '',
        value: parseFloat(order.total ?? '0'),
        itemCount: (order.line_items ?? []).length,
        items: (order.line_items ?? []).map((i: any) => i.name).join(', '),
        status: cartStatus,
        abandonedAt: abandonedAt || order.date_created,
        emailSentAt: emailSent ? emailSentAt : null,
        recoveredAt: recoveredAt || null,
        token: getMeta(meta, '_abandoned_cart_token'),
      };
    };

    const allCarts = [
      ...abandoned.map((o) => toCart(o, 'abandoned')),
      ...recovered.map((o) => toCart(o, 'recovered')),
    ].sort((a, b) => new Date(b.abandonedAt).getTime() - new Date(a.abandonedAt).getTime());

    // Time-range stats helper
    const statsFor = (since: Date) => {
      const sinceMs = since.getTime();
      const inRange = allCarts.filter(
        (c) => new Date(c.abandonedAt).getTime() >= sinceMs
      );
      const rec = inRange.filter((c) => c.status === 'recovered');
      const totalValue = inRange.reduce((s, c) => s + c.value, 0);
      const recoveredValue = rec.reduce((s, c) => s + c.value, 0);
      return {
        total: inRange.length,
        recovered: rec.length,
        rate: inRange.length > 0 ? Math.round((rec.length / inRange.length) * 100) : 0,
        totalValue: Math.round(totalValue),
        recoveredValue: Math.round(recoveredValue),
        lostValue: Math.round(totalValue - recoveredValue),
      };
    };

    return NextResponse.json({
      today: statsFor(startOf('day')),
      week: statsFor(startOf('week')),
      month: statsFor(startOf('month')),
      all30: statsFor(new Date(thirtyDaysAgo)),
      carts: allCarts,
    });
  } catch (error) {
    console.error('Abandoned cart stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
