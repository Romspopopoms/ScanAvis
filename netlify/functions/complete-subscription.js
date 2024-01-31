const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');
const findOrCreateStripeCustomer = require('./findOrCreateStripeCustomer');

// Helper function to fetch price amount using the priceId
async function fetchPriceAmount(priceId) {
  const price = await stripe.prices.retrieve(priceId);
  return price.unit_amount; // Return the amount in smallest currency unit (like cents for USD)
}

exports.handler = async (event) => {
  console.log('Request received:', event);

  if (event.httpMethod !== 'POST') {
    console.error('HTTP method not allowed');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { priceId, userUuid } = JSON.parse(event.body);
    console.log('Processing payment for priceId:', priceId, 'for user:', userUuid);

    if (!priceId) {
      throw new Error('priceId is required');
    }

    const customer = await findOrCreateStripeCustomer(userUuid);
    console.log('Stripe customer found or created:', customer.id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: await fetchPriceAmount(priceId),
      currency: 'eur', // or 'usd' or any other currency
      customer: customer.id,
      payment_method_types: ['card'],
    });
    console.log('PaymentIntent created successfully:', paymentIntent.id);

    // Inserting PaymentIntent ID and related info into the database
    const insertQuery = 'INSERT INTO Payments (intentId, customerId, priceId, status) VALUES (?, ?, ?, ?)';
    await conn.execute(insertQuery, [paymentIntent.id, customer.id, priceId, 'created']);
    console.log('PaymentIntent recorded in the database:', paymentIntent.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Error creating payment intent: ${error.message}` }),
    };
  }
};
