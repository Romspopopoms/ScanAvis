const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  const { userUuid } = JSON.parse(event.body);

  if (!userUuid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Le userUuid est requis' }),
    };
  }

  try {
    // Récupérer les détails du dernier abonnement annulé de l'utilisateur
    const lastSubscriptionQuery = 'SELECT * FROM Subscriptions WHERE user_uuid = ? AND status = ? ORDER BY nextPaymentDate DESC LIMIT 1';
    const lastSubscriptionResult = await conn.execute(lastSubscriptionQuery, [userUuid, 'cancelled']);
    const lastSubscription = lastSubscriptionResult.rows[0];

    if (!lastSubscription) {
      throw new Error('Aucun abonnement annulé précédent trouvé');
    }

    // Trouver le client Stripe associé à l'utilisateur
    const customerQuery = 'SELECT stripe_customer_id FROM Users WHERE uuid = ?';
    const customerResult = await conn.execute(customerQuery, [userUuid]);
    const stripeCustomerId = customerResult.rows[0].stripe_customer_id;

    if (!stripeCustomerId) {
      throw new Error('Aucun client Stripe associé trouvé');
    }

    // Créer un nouvel abonnement pour l'utilisateur avec les mêmes paramètres que l'abonnement annulé
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: lastSubscription.priceId }],
    });

    // Ajouter l'abonnement dans la base de données
    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, user_uuid, priceId, status, nextPaymentDate, nextPaymentAmount) VALUES (?, ?, ?, ?, ?, ?)';
    const nextPaymentDate = new Date(); // Définir la date correctement selon la logique de votre application
    const amount = subscription.items.data[0].price.unit_amount / 100; // convertir de centimes en euros
    await conn.execute(insertQuery, [subscription.id, userUuid, lastSubscription.priceId, 'active', nextPaymentDate, amount]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Réabonnement effectué avec succès', subscriptionId: subscription.id }),
    };
  } catch (error) {
    console.error('Erreur lors du réabonnement:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
    };
  }
};
