const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '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');

const productPrices = {
  base: 20, // 20 euros en centimes
  bronze: 40, // 40 euros en centimes
  silver: 60, // 60 euros en centimes
  gold: 100, // 100 euros en centimes
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    const totalAmount = items.reduce((total, item) => {
      const itemPrice = productPrices[item.name];
      if (!itemPrice) {
        throw new Error(`Prix non trouvé pour l'article: ${item.name}`);
      }
      return total + (itemPrice * item.quantity);
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};