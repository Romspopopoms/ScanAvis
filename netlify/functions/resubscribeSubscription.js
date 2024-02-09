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
    const lastSubscriptionQuery = 'SELECT * FROM Subscriptions WHERE user_uuid = ? AND status = ? ORDER BY createdAt DESC LIMIT 1';
    const lastSubscriptionResult = await conn.execute(lastSubscriptionQuery, [userUuid, 'cancelled']);
    const lastSubscription = lastSubscriptionResult.rows[0];

    if (!lastSubscription) {
      throw new Error('Aucun abonnement annulé précédent trouvé');
    }

    const updatedCustomer = await stripe.customers.update(
      lastSubscription.stripe_customer_id,
      { invoice_settings: { default_payment_method: lastSubscription.paymentMethodId } },
    );

    const newSubscription = await stripe.subscriptions.create({
      customer: updatedCustomer.id,
      items: [{ price: lastSubscription.priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    const paymentIntent = newSubscription.latest_invoice.payment_intent;
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Le paiement pour le nouvel abonnement a échoué');
    }

    const updateQuery = `
      UPDATE Subscriptions
      SET subscriptionId = ?, status = 'active', nextPaymentDate = ?, nextPaymentAmount = ?
      WHERE user_uuid = ? AND status = 'cancelled'
    `;
    const nextPaymentDate = new Date(newSubscription.current_period_end * 1000);
    const amount = newSubscription.items.data[0].price.unit_amount / 100;

    await conn.execute(updateQuery, [
      newSubscription.id,
      nextPaymentDate,
      amount,
      userUuid,
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Réabonnement effectué avec succès', subscriptionId: newSubscription.id }),
    };
  } catch (error) {
    console.error('Erreur lors du réabonnement:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
    };
  }
};
