const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');
const findOrCreateStripeCustomer = require('./findOrCreateStripeCustomer');

exports.handler = async (event) => {
  console.log('Request received:', event);

  if (event.httpMethod !== 'POST') {
    console.error('HTTP Method not allowed');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { setupIntentId, item, userUuid } = JSON.parse(event.body);
    console.log('Processing setupIntentId:', setupIntentId, 'for user:', userUuid);

    if (!item || !item.priceId) {
      throw new Error('Item with priceId is required');
    }
    console.log('Received the following item for subscription:', item);

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (!setupIntent) {
      console.error(`SetupIntent not found for ID: ${setupIntentId}`);
      throw new Error(`SetupIntent not found for ID: ${setupIntentId}`);
    }
    console.log('SetupIntent retrieved:', setupIntent.id);

    const paymentMethodId = setupIntent.payment_method;

    // Find or create Stripe customer and attach the payment method
    const stripeCustomerId = await findOrCreateStripeCustomer(userUuid, paymentMethodId);
    if (!stripeCustomerId) {
      throw new Error('Failed to find or create Stripe customer.');
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: item.priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent', 'items.data.price.product'], // Expansion to get product details
    });
    console.log('Subscription created successfully:', subscription.id);

    // Get the service name and amount from the subscription data
    const serviceName = subscription.items.data[0].price.product.name;
    const amount = subscription.items.data[0].price.unit_amount / 100; // convert from cents to dollars

    const subscriptionStatus = subscription.status; // Get subscription status

    // Utiliser la date actuelle et ajouter 1 mois pour la date du prochain paiement
    const createdAt = new Date(subscription.created * 1000); // Convertir timestamp Unix en objet Date
    const nextPaymentDate = new Date(createdAt.setMonth(createdAt.getMonth() + 1)); // Ajouter 1 mois

    const paymentMethodIdUsed = subscription.default_payment_method; // Get the payment method used

    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, priceId, items, status, user_uuid, nextPaymentDate, nextPaymentAmount, stripe_customer_id, paymentMethodId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await conn.execute(insertQuery, [subscription.id, item.priceId, serviceName, subscriptionStatus, userUuid, nextPaymentDate, amount, stripeCustomerId, paymentMethodIdUsed]);
    console.log('Subscription data:', result);

    const subscriptionDetails = {
      subscriptionId: subscription.id,
      amount, // Utiliser la valeur récupérée de Stripe
      serviceName, // Assurez-vous que cette valeur est obtenue correctement
      nextPaymentDate: nextPaymentDate.toISOString(), // Convertir en string pour l'envoi dans la réponse
    };
    console.log(subscriptionDetails);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionDetails), // Retournez les détails de l'abonnement
    };
  } catch (error) {
    console.error('Error completing subscription:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Error completing subscription: ${error.message}` }),
    };
  }
};
