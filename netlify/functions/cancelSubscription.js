const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  const { subscriptionId } = JSON.parse(event.body);

  if (!subscriptionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'L’ID de l’abonnement est requis' }),
    };
  }

  try {
    // Annuler l'abonnement sur Stripe immédiatement
    await stripe.subscriptions.cancel(subscriptionId);

    // Mettre à jour l'abonnement dans la base de données
    const query = 'UPDATE Subscriptions SET status = ? WHERE subscriptionId = ?';
    await conn.execute(query, ['cancelled', subscriptionId]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Abonnement annulé avec succès' }),
    };
  } catch (error) {
    console.error('Erreur lors de l’annulation de l’abonnement:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
    };
  }
};
