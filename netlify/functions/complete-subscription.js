const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');
const findOrCreateStripeCustomer = require('./findOrCreateStripeCustomer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { setupIntentId, items, userUuid } = JSON.parse(event.body);

    // Vérifier et récupérer les détails du setupIntent
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (!setupIntent) {
      throw new Error(`SetupIntent not found for ID: ${setupIntentId}`);
    }

    // Utiliser le payment_method du setupIntent pour créer la souscription
    const paymentMethodId = setupIntent.payment_method;
    const formattedItems = items.map((item) => ({ price: item.stripePlanId }));
    const customer = await findOrCreateStripeCustomer(userUuid); // Assurez-vous que cette fonction est définie et importée correctement

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: formattedItems,
      default_payment_method: paymentMethodId,
    });

    // Enregistrer les détails de la souscription dans votre base de données
    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, items, user_uuid) VALUES (?, ?, ?)';
    await conn.execute(insertQuery, [subscription.id, JSON.stringify(items), userUuid]);

    // Renvoyer l'ID de la souscription
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subscription.id }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Error completing subscription: ${error.message}` }),
    };
  }
};
