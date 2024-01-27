// Import Stripe and PlanetScale DB
const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { items, userUuid } = JSON.parse(event.body);

    // Valider les items et userUuid
    if (!userUuid) {
      throw new Error('User UUID is required');
    }
    if (!Array.isArray(items) || items.some((item) => !item.id || typeof item.quantity !== 'number' || typeof item.price !== 'number')) {
      throw new Error('Invalid items format');
    }

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    const result = await conn.execute(
      'INSERT INTO Transactions (items, totalAmount, paymentIntentId, clientSecret, user_uuid) VALUES (?, ?, ?, ?, ?)',
      [JSON.stringify(items), totalAmount, paymentIntent.id, paymentIntent.client_secret, userUuid],
    );

    if (!result || !result.insertId) {
      throw new Error('Database insertion failed');
    }

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
