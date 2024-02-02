const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Event received:', event);

  if (event.httpMethod !== 'POST') {
    console.error('HTTP Method not allowed');
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  try {
    const { userUuid } = JSON.parse(event.body);
    console.log('userUuid:', userUuid);

    if (!userUuid) {
      console.error('userUuid is required');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Le userUuid est requis' }),
      };
    }

    // Fetch last cancelled subscription details
    const lastSubscriptionQuery = 'SELECT * FROM Subscriptions WHERE user_uuid = ? AND status = ? ORDER BY nextPaymentDate DESC LIMIT 1';
    console.log('Executing lastSubscriptionQuery:', lastSubscriptionQuery);
    const lastSubscriptionResult = await conn.execute(lastSubscriptionQuery, [userUuid, 'cancelled']);
    const lastSubscription = lastSubscriptionResult.rows[0];
    console.log('Last subscription:', lastSubscription);

    if (!lastSubscription) {
      console.error('No previous cancelled subscription found');
      throw new Error('Aucun abonnement annulé précédent trouvé');
    }

    // Find Stripe customer associated with the user
    const customerQuery = 'SELECT stripe_customer_id FROM users WHERE uuid = ?';
    console.log('Executing customerQuery:', customerQuery);
    const customerResult = await conn.execute(customerQuery, [userUuid]);
    const stripeCustomerId = customerResult.rows[0].stripe_customer_id;
    console.log('Stripe Customer ID:', stripeCustomerId);

    if (!stripeCustomerId) {
      console.error('No Stripe customer associated found');
      throw new Error('Aucun client Stripe associé trouvé');
    }

    // Create a new subscription for the user with the same settings as the cancelled subscription
    console.log('Creating new subscription with Stripe...');
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: lastSubscription.priceId }],
    });
    console.log('New subscription created:', subscription);

    // Insert subscription into the database
    const insertQuery = 'INSERT INTO Subscriptions (subscriptionId, user_uuid, priceId, status, nextPaymentDate, nextPaymentAmount) VALUES (?, ?, ?, ?, ?, ?)';
    const nextPaymentDate = new Date(); // Properly define this date according to your application's logic
    const amount = subscription.items.data[0].price.unit_amount / 100; // convert from cents to euros
    console.log('Executing insertQuery:', insertQuery);
    await conn.execute(insertQuery, [subscription.id, userUuid, lastSubscription.priceId, 'active', nextPaymentDate, amount]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Réabonnement effectué avec succès', subscriptionId: subscription.id }),
    };
  } catch (error) {
    console.error('Error while resubscribing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
    };
  }
};
