import nodemailer from 'nodemailer';

interface AbandonedCartEmailParams {
  to: string;
  firstName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  cartTotal: number;
  recoveryUrl: string;
  whatsappPhone: string;
}

function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(amount);
}

export async function sendAbandonedCartEmail(params: AbandonedCartEmailParams): Promise<void> {
  const { to, firstName, items, cartTotal, recoveryUrl, whatsappPhone } = params;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,      // STARTTLS on port 587 (not SSL/465)
    requireTLS: true,   // enforce TLS upgrade
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const cleanPhone = whatsappPhone.replace(/\D/g, '');
  const waMessage = encodeURIComponent(
    `Hi! I need help completing my order at Ideal Indiska LIVS. Can you assist me?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#1a1a1a;font-size:15px;">
          ${item.name}
          <div style="color:#888;font-size:13px;margin-top:2px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:15px;color:#1a1a1a;white-space:nowrap;">
          ${formatSEK(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td style="background:#2d5a27;padding:28px 40px;text-align:center;">
        <div style="color:#fff;font-size:22px;font-weight:700;">🛒 Ideal Indiska LIVS</div>
        <div style="color:#a8d5a2;font-size:13px;margin-top:4px;">Indian Grocery Store in Sweden</div>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:40px 40px 32px;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">
          ${firstName ? `${firstName}, you left something behind! 🛍️` : 'You left something behind! 🛍️'}
        </h1>
        <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.6;">
          Your cart is saved and ready. Come back and complete your order before your items sell out.
        </p>

        <!-- Cart Items -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          ${itemsHtml}
          <tr>
            <td style="padding:16px 0 0;font-size:17px;font-weight:700;color:#1a1a1a;">Total</td>
            <td style="padding:16px 0 0;text-align:right;font-size:17px;font-weight:700;color:#2d5a27;">${formatSEK(cartTotal)}</td>
          </tr>
        </table>

        <!-- WhatsApp CTA (primary) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 16px;background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;">
          <tr>
            <td style="padding:20px 24px;text-align:center;">
              <div style="font-size:16px;font-weight:700;color:#15803d;margin-bottom:6px;">💬 Need help? Chat with us first</div>
              <p style="margin:0 0 16px;color:#166534;font-size:14px;line-height:1.5;">
                Our team can answer questions, check stock, or help you complete your order.
              </p>
              <a href="${whatsappUrl}"
                 style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:12px 32px;border-radius:25px;font-weight:700;font-size:15px;">
                Open WhatsApp →
              </a>
            </td>
          </tr>
        </table>

        <!-- Complete Order CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="text-align:center;padding:8px 0;">
              <a href="${recoveryUrl}"
                 style="display:inline-block;background:#2d5a27;color:#fff;text-decoration:none;padding:15px 44px;border-radius:30px;font-weight:700;font-size:16px;">
                Complete My Order
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0;color:#aaa;font-size:12px;text-align:center;line-height:1.5;">
          This link restores your exact cart. It expires in 7 days.<br>
          If you've already placed your order, you can ignore this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0 0 4px;color:#999;font-size:12px;">Ideal Indiska LIVS — Indian Grocery Store in Sweden</p>
        <p style="margin:0;color:#ccc;font-size:11px;">You received this because you started a checkout on our website.</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: `${firstName ? firstName + ', you' : 'You'} left something in your cart 🛒`,
    html,
  });
}
