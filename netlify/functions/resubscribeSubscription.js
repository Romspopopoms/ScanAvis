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

    // Définir la méthode de paiement par défaut du client sur Stripe
    await stripe.customers.update(
      lastSubscription.stripe_customer_id,
      { invoice_settings: { default_payment_method: lastSubscription.paymentMethodId } },
    );

    // Créer un nouvel abonnement pour l'utilisateur avec les mêmes paramètres que l'abonnement annulé
    const subscription = await stripe.subscriptions.create({
      customer: lastSubscription.stripe_customer_id,
      items: [{ price: lastSubscription.priceId }],
      default_payment_method: lastSubscription.paymentMethodId,
    });

    // Ajouter l'abonnement dans la base de données
    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, user_uuid, priceId, status, nextPaymentDate, nextPaymentAmount) VALUES (?, ?, ?, ?, ?, ?)';
    const nextPaymentDate = new Date(subscription.current_period_end * 1000); // Utiliser la date de fin de la période actuelle de l'abonnement
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
