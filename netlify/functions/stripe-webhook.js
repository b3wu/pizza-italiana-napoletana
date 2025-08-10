const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getClient } = require('./lib/supabase');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  try {
    const whSec = process.env.STRIPE_WEBHOOK_SECRET;
    if(!whSec) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    const evt = stripe.webhooks.constructEvent(event.body, sig, whSec);
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object;
      const supabase = getClient();
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('stripe_session_id', session.id);
    }
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('Webhook failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
};