/**
 * Email helper — uses Resend REST API.
 * Set RESEND_API_KEY in Replit Secrets to enable sending.
 * If the key is absent the function logs a warning and returns silently.
 */

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;       // buyer's email (logged-in or guest)
  items: { name: string; quantity: number; price: string }[];
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  total: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  couponCode?: string;
  notes?: string;
}

export async function sendNewOrderEmail(data: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping order notification email.");
    return;
  }

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${i.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right">₹${i.price}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr>
          <td style="background:#0d1f2d;padding:24px 32px">
            <h1 style="margin:0;color:#4ade80;font-size:22px">🛒 New Order Received</h1>
            <p style="margin:4px 0 0;color:#94a3b8;font-size:13px">Crispy N Snacky — Internal Notification</p>
          </td>
        </tr>

        <!-- Order meta -->
        <tr>
          <td style="padding:24px 32px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:50%;vertical-align:top">
                  <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Order Number</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#111827">${data.orderNumber}</p>
                </td>
                <td style="width:50%;vertical-align:top;text-align:right">
                  <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Order Total</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#4ade80">₹${data.total}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Customer -->
        <tr>
          <td style="padding:0 32px 24px">
            <h3 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Customer</h3>
            <p style="margin:0;font-size:14px;color:#111827">${data.customerName}</p>
            <p style="margin:2px 0 0;font-size:13px;color:#4b5563">${data.customerEmail}</p>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:0 32px 24px">
            <h3 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Items</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
              <thead>
                <tr style="background:#f9fafb">
                  <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280">Product</th>
                  <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280">Qty</th>
                  <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:0 32px 24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280">Subtotal</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;text-align:right">₹${data.subtotal}</td>
              </tr>
              ${data.couponCode ? `<tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280">Coupon (${data.couponCode})</td>
                <td style="padding:4px 0;font-size:13px;color:#16a34a;text-align:right">−₹${data.discountAmount}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280">Shipping</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;text-align:right">${parseFloat(data.shippingAmount) === 0 ? "FREE" : "₹" + data.shippingAmount}</td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;font-size:15px;font-weight:700;color:#111827;border-top:2px solid #e5e7eb">Total</td>
                <td style="padding:8px 0 4px;font-size:15px;font-weight:700;color:#4ade80;text-align:right;border-top:2px solid #e5e7eb">₹${data.total}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Shipping address -->
        <tr>
          <td style="padding:0 32px 24px">
            <h3 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Ship To</h3>
            <p style="margin:0;font-size:14px;color:#111827;line-height:1.6">
              ${data.shippingAddress.name}<br/>
              ${data.shippingAddress.line1}${data.shippingAddress.line2 ? "<br/>" + data.shippingAddress.line2 : ""}<br/>
              ${data.shippingAddress.city}, ${data.shippingAddress.state} — ${data.shippingAddress.pincode}
            </p>
          </td>
        </tr>

        ${data.notes ? `<!-- Notes -->
        <tr>
          <td style="padding:0 32px 24px">
            <h3 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Customer Notes</h3>
            <p style="margin:0;font-size:14px;color:#374151;font-style:italic">"${data.notes}"</p>
          </td>
        </tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
              Payment status: <strong>UNPAID</strong> — collect payment before dispatch.<br/>
              Log in to the <a href="https://crispynsnacky.in/admin" style="color:#4ade80">Admin Dashboard</a> to process this order.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const plain = [
    `NEW ORDER — ${data.orderNumber}`,
    `Customer: ${data.customerName} <${data.customerEmail}>`,
    `Total: ₹${data.total} (UNPAID)`,
    ``,
    `Items:`,
    ...data.items.map((i) => `  ${i.name} × ${i.quantity} — ₹${i.price}`),
    ``,
    `Ship to: ${data.shippingAddress.name}, ${data.shippingAddress.line1}, ${data.shippingAddress.city} ${data.shippingAddress.pincode}`,
    data.notes ? `Notes: ${data.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Crispy N Snacky Orders <orders@crispynsnacky.com>",
      to: ["support@crispynsnacky.com"],
      subject: `[New Order] ${data.orderNumber} — ₹${data.total}`,
      html,
      text: plain,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[email] Resend API error ${res.status}: ${body}`);
  } else {
    console.info(`[email] Order notification sent for ${data.orderNumber}`);
  }
}
