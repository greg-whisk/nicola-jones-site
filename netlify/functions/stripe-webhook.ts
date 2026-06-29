import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function formatAddress(shipping: Stripe.Checkout.Session.ShippingDetails | null | undefined): string {
  if (!shipping) return 'No shipping address provided';
  const a = shipping.address;
  return [
    shipping.name,
    a?.line1,
    a?.line2,
    a?.city,
    a?.postal_code,
    a?.country,
  ]
    .filter(Boolean)
    .join(', ');
}

function formatItems(lineItems: Stripe.LineItem[]): string {
  if (!lineItems.length) return 'Items unavailable';
  return lineItems
    .map((item) => {
      const qty = item.quantity || 1;
      const amount = ((item.amount_total || 0) / 100).toFixed(2);
      return `${qty} x ${item.description} — £${amount}`;
    })
    .join('\n');
}

// Best-effort order emails. Never throws — email failures must not fail the webhook.
async function sendOrderEmails(session: Stripe.Checkout.Session): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping order emails');
    return;
  }

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name || session.shipping_details?.name || 'a customer';
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'nicolajonespaints@gmail.com';
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'Nicola Jones <noreply@nicolajonespaints.com>';
  const total = ((session.amount_total || 0) / 100).toFixed(2);

  let itemsText = 'Items unavailable';
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    itemsText = formatItems(lineItems.data);
  } catch (err) {
    console.error('Failed to list line items for order email:', err);
  }

  // A) Notify Nicola of the new order
  try {
    await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      ...(customerEmail ? { replyTo: customerEmail } : {}),
      subject: `New order from ${customerName}`,
      text: [
        `New order received.`,
        ``,
        `Customer: ${customerName}`,
        `Email: ${customerEmail || 'not provided'}`,
        ``,
        `Shipping address:`,
        formatAddress(session.shipping_details),
        ``,
        `Items:`,
        itemsText,
        ``,
        `Total: £${total}`,
      ].join('\n'),
    });
  } catch (err) {
    console.error('Failed to send order notification email to Nicola:', err);
  }

  // B) Confirmation to the customer
  if (customerEmail) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: 'Thank you for your order',
        text: [
          `Thank you for your order.`,
          ``,
          `Nicola will be in touch shortly with shipping details.`,
        ].join('\n'),
      });
    } catch (err) {
      console.error('Failed to send confirmation email to customer:', err);
    }
  } else {
    console.warn('No customer email on session — skipping customer confirmation');
  }
}

async function submitCreativeHubOrder(session: Stripe.Checkout.Session): Promise<void> {
  const { creativehubSku } = session.metadata || {};
  const shipping = session.shipping_details;

  const payload = {
    sku: creativehubSku,
    quantity: Number(session.metadata?.quantity) || 1,
    orderId: session.id,
    customerEmail: session.customer_details?.email,
    shippingAddress: {
      name: shipping?.name,
      line1: shipping?.address?.line1,
      line2: shipping?.address?.line2 || '',
      city: shipping?.address?.city,
      postcode: shipping?.address?.postal_code,
      country: shipping?.address?.country,
    },
  };

  const res = await fetch('https://api.creativehub.io/api/v1/orders/confirmed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CREATIVEHUB_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CreativeHub API error ${res.status}: ${text}`);
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'Missing stripe-signature header' };
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const { fulfillment } = session.metadata || {};

    console.log(`Order completed: session=${session.id} fulfillment=${fulfillment}`);

    if (fulfillment === 'theprintspace') {
      try {
        await submitCreativeHubOrder(session);
        console.log(`CreativeHub order submitted for session ${session.id}`);
      } catch (err) {
        // Return 500 so Stripe retries the webhook
        console.error('CreativeHub submission failed:', err);
        return { statusCode: 500, body: 'CreativeHub order submission failed' };
      }
    } else {
      // studio / handmade — Nicola ships manually
      console.log(
        `Manual fulfillment needed for session ${session.id} — customer: ${session.customer_details?.email}`
      );
    }

    // Best-effort order emails for both fulfilment paths. Never fails the webhook.
    await sendOrderEmails(session);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
