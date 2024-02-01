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
    });
    console.log('Subscription created successfully:', subscription.id);

    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, priceId, user_uuid, stripe_customer_id) VALUES (?, ?, ?, ?)';
    const result = await conn.execute(insertQuery, [subscription.id, item.priceId, userUuid, stripeCustomerId]);
    console.log('Subscription data:', result);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subscription.id }),
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
