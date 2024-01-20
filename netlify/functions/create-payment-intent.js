const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');

// Assurez-vous que cette structure correspond à la structure des produits dans votre frontend.
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

    // Vérifier si les items sont dans un format valide
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    // Calculer le montant total à partir des items
    const totalAmount = items.reduce((total, item) => {
      const itemPrice = productPrices[item.id];
      if (itemPrice === undefined) {
        throw new Error(`Price not found for item: ${item.id}`);
      }
      return total + itemPrice * item.quantity;
    }, 0);

    // Créer une intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    // Réponse en cas de succès
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    // Journaliser l'erreur pour le debugging
    console.error('Error:', error);

    // Réponse en cas d'erreur
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
