// Import Stripe and PlanetScale DB
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utilisez des variables d'environnement pour les clés API
const { conn } = require('../../utils/db'); // Assurez-vous que le chemin est correct

exports.handler = async (event) => {
  // Allow only POST method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    // Parse the body to get items
    const { items } = JSON.parse(event.body);
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    // Calculate the total amount
    const totalAmount = items.reduce((total, item) => {
      if ((!Number.isInteger(item.id) && typeof item.id !== 'string') || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
      return total + item.price * item.quantity;
    }, 0);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    // Execute the database insertion using PlanetScale
    const result = await conn.execute(
      'INSERT INTO Transactions (items, totalAmount, paymentIntentId, clientSecret) VALUES (?, ?, ?, ?)',
      [JSON.stringify(items), totalAmount, paymentIntent.id, paymentIntent.client_secret],
    );

    // Check if the result object is as expected
    if (!result || !result.insertId) {
      throw new Error('Database insertion failed');
    }

    console.log(`Insertion into database successful, insertId: ${result.insertId}`);

    // Return success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    // Log the detailed error
    console.error('Error:', error);

    // Return error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
