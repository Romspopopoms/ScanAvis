const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_...');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { items } = JSON.parse(event.body);
    console.log('Received items:', items);

    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    const totalAmount = items.reduce((total, item) => {
      // Vérifiez si l'ID est un nombre et si la quantité et le prix sont des nombres
      if ((!Number.isInteger(item.id) && typeof item.id !== 'string') || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
      return total + item.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    console.log(`PaymentIntent created: ${paymentIntent.id}`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
