const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_6Dtm9zMSOnHeGLA3HbaUUtHYWE5DD46L';

exports.handler = async (event) => {
  const signature = event.headers['stripe-signature'];
  let webhookEvent;

  try {
    webhookEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (webhookEvent.type === 'invoice.payment_succeeded') {
    const invoice = webhookEvent.data.object;
    const subscriptionId = invoice.subscription;
    // Convertit le timestamp en millisecondes, puis en objet Date
    const nextPaymentAttempt = new Date(invoice.next_payment_attempt * 1000);

    try {
      const updateQuery = 'UPDATE Subscriptions SET nextPaymentDate = ? WHERE subscriptionId = ?';
      // Utilisez conn.execute pour les requêtes préparées
      await conn.execute(updateQuery, [nextPaymentAttempt.toISOString(), subscriptionId]);
      console.log('Next payment date updated successfully for subscription:', subscriptionId);
      return {
        statusCode: 200,
        body: 'Next payment date updated successfully',
      };
    } catch (dbError) {
      console.error('Database error when updating next payment date:', dbError.message);
      return {
        statusCode: 500,
        body: `Database Error: ${dbError.message}`,
      };
    }
  }

  console.log('Unhandled event type:', webhookEvent.type);
  return {
    statusCode: 200,
    body: '{ "received": true }',
  };
};
