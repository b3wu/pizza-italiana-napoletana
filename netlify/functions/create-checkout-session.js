
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const { cart = [], delivery = 0, currency = 'pln' } = JSON.parse(event.body || '{}');
    if (!Array.isArray(cart) || cart.length === 0) return { statusCode: 400, body: 'Cart is empty' };
    const line_items = cart.map(it => ({
      price_data: { currency, product_data: { name: it.name }, unit_amount: Math.round(it.price * 100) },
      quantity: it.qty || 1
    }));
    if (delivery > 0) line_items.push({ price_data: { currency, product_data: { name: 'Dostawa' }, unit_amount: Math.round(delivery * 100) }, quantity: 1 });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: process.env.SUCCESS_URL || 'https://pizza-italiana-napoletana.netlify.app/success.html',
      cancel_url: process.env.CANCEL_URL || 'https://pizza-italiana-napoletana.netlify.app/cancel.html'
    });
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server error' };
  }
};
