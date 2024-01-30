const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');
const findOrCreateStripeCustomer = require('./findOrCreateStripeCustomer');

exports.handler = async (event) => {
  console.log('Requête reçue:', event);

  if (event.httpMethod !== 'POST') {
    console.error('Méthode HTTP non autorisée');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { setupIntentId, items, userUuid } = JSON.parse(event.body);
    console.log('Traitement du setupIntentId:', setupIntentId, 'pour l\'utilisateur:', userUuid);

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items are required and should be an array');
    }
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (!setupIntent) {
      console.error(`SetupIntent non trouvé pour l'ID: ${setupIntentId}`);
      throw new Error(`SetupIntent not found for ID: ${setupIntentId}`);
    }
    console.log('SetupIntent récupéré:', setupIntent.id);

    const paymentMethodId = setupIntent.payment_method;
    const formattedItems = items.map((item) => ({ price: item.stripePlanId }));
    console.log('Items formatés pour la souscription:', formattedItems);

    const customer = await findOrCreateStripeCustomer(userUuid);
    console.log('Client Stripe trouvé ou créé:', customer.id);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: formattedItems,
      default_payment_method: paymentMethodId,
    });
    console.log('Souscription créée avec succès:', subscription.id);

    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, items, user_uuid) VALUES (?, ?, ?)';
    const [result] = await conn.execute(insertQuery, [subscription.id, JSON.stringify(items), userUuid]);
    const { rows } = result; // Assurez-vous que c'est la structure correcte pour votre implémentation de base de données
    console.log('Souscription enregistrée dans la base de données:', rows);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subscription.id }),
    };
  } catch (error) {
    console.error('Erreur lors de la complétion de la souscription:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Error completing subscription: ${error.message}` }),
    };
  }
};
