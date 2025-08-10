const { getClient } = require('./lib/supabase');
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const { id, status } = JSON.parse(event.body || '{}');
    if(!id || !status) return { statusCode: 400, body: 'Missing id or status' };
    const supabase = getClient();
    const { error } = await supabase.from('orders').update({ payment_status: status }).eq('id', id);
    if(error) return { statusCode: 500, body: error.message };
    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    return { statusCode: 500, body: 'Server error' };
  }
};