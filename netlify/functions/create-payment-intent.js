// Importez Stripe et PlanetScale DB
const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { items } = JSON.parse(event.body);
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    const totalAmount = items.reduce((total, item) => {
      if ((!Number.isInteger(item.id) && typeof item.id !== 'string') || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
      return total + item.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });
    console.log(`PaymentIntent created: ${paymentIntent.id}`);

    // Utilisez la connexion PlanetScale pour exécuter votre requête
    const [rows] = await conn.execute(
      'INSERT INTO Transactions (items, totalAmount, paymentIntentId, clientSecret) VALUES (?, ?, ?, ?)',
      [JSON.stringify(items), totalAmount, paymentIntent.id, paymentIntent.client_secret],
    );
    console.log('Insertion into database successful', rows);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.sqlMessage) {
      console.error('SQL Error:', error.sqlMessage);
    }
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
