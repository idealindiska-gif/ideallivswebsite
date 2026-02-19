import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { sendAbandonedCartEmail } from '@/lib/email/abandoned-cart';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * GET /api/cron/abandoned-cart
 * Scheduled via vercel.json (runs every hour).
 * Finds pending WooCommerce orders tagged _is_abandoned_cart=1 that:
 *   - were abandoned more than 1 hour ago
 *   - have not had a recovery email sent yet
 * Sends a recovery email with a WhatsApp CTA and marks the order as emailed.
 *
 * Secured with CRON_SECRET env var — Vercel passes it as a Bearer token.
 */
export async function GET(request: NextRequest) {
  // Validate the cron secret so this can't be triggered by random visitors
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auth = getWooCommerceAuthHeader();

    // Query pending orders from the last 48 hours (wide window to catch any
    // that were skipped in a previous run due to errors)
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const listRes = await fetch(
      getWooCommerceUrl(`/orders?status=pending&after=${fortyEightHoursAgo}&per_page=100`),
      { headers: { Authorization: auth }, cache: 'no-store' }
    );

    if (!listRes.ok) throw new Error(`WC orders fetch failed: ${listRes.status}`);

    const orders: any[] = await listRes.json();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      '';
    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';

    let sent = 0;
    let skipped = 0;

    for (const order of orders) {
      const meta: any[] = order.meta_data ?? [];

      const isAbandoned = meta.find((m) => m.key === '_is_abandoned_cart')?.value === '1';
      const emailAlreadySent = meta.find((m) => m.key === '_recovery_email_sent')?.value === '1';
      const abandonedAt = meta.find((m) => m.key === '_abandoned_at')?.value;
      const token = meta.find((m) => m.key === '_abandoned_cart_token')?.value;

      // Skip if not an abandoned cart, already emailed, missing required fields
      if (
        !isAbandoned ||
        emailAlreadySent ||
        !abandonedAt ||
        !token ||
        !order.billing?.email
      ) {
        skipped++;
        continue;
      }

      // Only send after the 1-hour grace period
      if (new Date(abandonedAt).getTime() > oneHourAgo) {
        skipped++;
        continue;
      }

      const recoveryUrl = `${siteUrl}/checkout/recover?token=${token}`;

      const items = (order.line_items ?? []).map((item: any) => ({
        name: item.name ?? 'Product',
        quantity: item.quantity ?? 1,
        // item.price is the unit price string from WC
        price: parseFloat(item.price || '0'),
      }));

      try {
        await sendAbandonedCartEmail({
          to: order.billing.email,
          firstName: order.billing.first_name ?? '',
          items,
          cartTotal: parseFloat(order.total ?? '0'),
          recoveryUrl,
          whatsappPhone,
        });

        // Mark recovery email as sent so we don't re-send
        await fetch(getWooCommerceUrl(`/orders/${order.id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: auth },
          body: JSON.stringify({
            meta_data: [
              { key: '_recovery_email_sent', value: '1' },
              { key: '_recovery_email_sent_at', value: new Date().toISOString() },
            ],
          }),
        });

        sent++;
        console.log(
          `✅ Abandoned cart email sent to ${order.billing.email} (order #${order.id})`
        );
      } catch (emailErr) {
        console.error(
          `❌ Failed to send abandoned cart email for order #${order.id}:`,
          emailErr
        );
        // Continue to the next order — don't let one failure block the rest
      }
    }

    console.log(`Abandoned cart cron done: ${sent} sent, ${skipped} skipped`);
    return NextResponse.json({ success: true, sent, skipped });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
