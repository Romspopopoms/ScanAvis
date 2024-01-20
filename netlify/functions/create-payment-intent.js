const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');

const productPrices = {
  base: 2000, // 20 euros en centimes
  bronze: 4000, // 40 euros en centimes
  silver: 6000, // 60 euros en centimes
  gold: 10000, // 100 euros en centimes
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid items format');
    }

    const totalAmount = items.reduce((total, item) => {
      const itemPrice = productPrices[item.id];
      if (!itemPrice) {
        throw new Error(`Prix non trouvé pour l'article: ${item.id}`);
      }
      return total + itemPrice * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
