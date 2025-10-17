// supabase/functions/create-cashfree-order/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY')!; // Set this in Supabase Dashboard > Settings > Secrets
const CASHFREE_APP_ID = Deno.env.get('CASHFREE_APP_ID')!; // Set this in Supabase Dashboard > Settings > Secrets

serve(async (req) => {
  try {
    const { amount, currency, description } = await req.json();

    // Create order via Cashfree API
    const response = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_amount: amount,
        order_currency: currency,
        order_note: description,
        customer_details: {
          customer_id: 'user123', // Customize with user data if available
          customer_email: 'user@example.com', // Pull from auth if possible
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cashfree API Error: ${errorData.message}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify({ orderToken: data.payment_session_id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Cashfree order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
