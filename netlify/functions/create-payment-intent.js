// Import Stripe and PlanetScale DB
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utilisez des variables d'environnement pour les clés API
const { conn } = require('../../utils/db'); // Assurez-vous que le chemin est correct

exports.handler = async (event) => {
  // Autoriser uniquement la méthode POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    // Analyser le corps pour obtenir les articles
    const { items } = JSON.parse(event.body);
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    // Calculer le montant total
    const totalAmount = items.reduce((total, item) => {
      if ((!Number.isInteger(item.id) && typeof item.id !== 'string') || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
      return total + item.price * item.quantity;
    }, 0);

    // Créer une intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    // Exécuter l'insertion dans la base de données en utilisant PlanetScale
    const result = await conn.execute(
      'INSERT INTO Transactions (items, totalAmount, paymentIntentId, clientSecret) VALUES (?, ?, ?, ?)',
      [JSON.stringify(items), totalAmount, paymentIntent.id, paymentIntent.client_secret],
    );

    // Vérifier si l'objet de résultat est comme prévu
    if (!result || !result.insertId) {
      throw new Error('Database insertion failed');
    }

    console.log(`Insertion into database successful, insertId: ${result.insertId}`);

    // Retourner une réponse de succès
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    // Journaliser l'erreur détaillée
    console.error('Error:', error);

    // Retourner une réponse d'erreur
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
