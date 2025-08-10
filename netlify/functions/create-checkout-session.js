const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getClient } = require('./lib/supabase');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const { cart = [], delivery = 0, currency = 'pln', customer = {} } = JSON.parse(event.body || '{}');
    if (!Array.isArray(cart) || cart.length === 0) return { statusCode: 400, body: 'Cart is empty' };

    const line_items = cart.map(it => ({
      price_data: { currency, product_data: { name: it.name }, unit_amount: Math.round(it.price * 100) },
      quantity: it.qty || 1
    }));
    if (delivery > 0) line_items.push({ price_data: { currency, product_data: { name: 'Dostawa' }, unit_amount: Math.round(delivery * 100) }, quantity: 1 });

    const success_url = (process.env.SUCCESS_URL || '/success.html') + '?session_id={CHECKOUT_SESSION_ID}';
    const cancel_url = process.env.CANCEL_URL || '/cancel.html';

    const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items, success_url, cancel_url });

    // Save pending order
    const total_price = cart.reduce((s,i)=>s+(i.price*(i.qty||1)),0) + (delivery||0);
    const supabase = getClient();
    const { error } = await supabase.from('orders').insert({
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || '',
      items: cart,
      total_price,
      payment_status: 'pending',
      stripe_session_id: session.id
    });
    if(error) console.error('Supabase insert error:', error);

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server error' };
  }
};