import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { productId, productName, price, quantity, imageUrl, fulfillment, creativehubSku } =
      JSON.parse(event.body || '{}');

    if (!productName || !price) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'productName and price are required' }),
      };
    }

    if (fulfillment === 'theprintspace' && !creativehubSku) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Product is missing a print SKU — please contact us.' }),
      };
    }

    // Netlify sets URL to the primary site URL; fall back for local dev
    const siteUrl = process.env.URL || 'http://localhost:8888';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(price * 100), // pence
          },
          quantity: quantity || 1,
        },
      ],
      shipping_address_collection: { allowed_countries: ['GB'] },
      metadata: {
        productId: productId || '',
        fulfillment: fulfillment || 'studio',
        quantity: String(quantity || 1),
        ...(creativehubSku ? { creativehubSku } : {}),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
