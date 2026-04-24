import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

async function submitCreativeHubOrder(session: Stripe.Checkout.Session): Promise<void> {
  const { creativehubSku } = session.metadata || {};
  const shipping = session.shipping_details;

  const payload = {
    sku: creativehubSku,
    quantity: 1,
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
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
