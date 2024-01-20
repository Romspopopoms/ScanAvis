const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { items } = JSON.parse(event.body);
    console.log('Received items:', items);

    // Vérifiez que 'items' est un tableau
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    // Valider la structure des articles
    items.forEach((item) => {
      if (typeof item.id !== 'string' || typeof item.quantity !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
    });

    // Calculer le montant total
    const totalAmount = items.reduce((total, item) => {
      // Assurez-vous que le prix est défini pour chaque article
      const itemPrice = item.price; // Utilisez le prix fourni par le frontend
      if (typeof itemPrice === 'undefined') {
        throw new Error(`Price not found for item ID: ${item.id}`);
      }
      return total + itemPrice * item.quantity;
    }, 0);

    // Créer l'intention de paiement
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
