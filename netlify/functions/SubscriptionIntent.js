const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const findOrCreateStripeCustomer = require('./findOrCreateStripeCustomer'); // Assurez-vous que le chemin est correct

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { userUuid } = JSON.parse(event.body);

    // Recherchez ou créez un client Stripe pour l'UUID de l'utilisateur
    const customer = await findOrCreateStripeCustomer(userUuid);

    // Créez un setupIntent ou paymentIntent avec Stripe
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      // Ajoutez ici d'autres paramètres selon vos besoins
    });

    // Retournez le clientSecret du setupIntent pour que le frontend puisse l'utiliser
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: setupIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Error creating subscription intent: ${error.message}` }),
    };
  }
};
