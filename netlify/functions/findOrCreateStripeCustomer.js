const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

const findOrCreateStripeCustomer = async (userUuid, paymentMethodId) => {
  console.log('Début de findOrCreateStripeCustomer');

  const selectSql = 'SELECT stripe_customer_id FROM users WHERE uuid = ?';
  console.log('Exécution de la requête SQL:', selectSql);
  console.log('Avec les paramètres:', userUuid);

  const result = await conn.execute(selectSql, [userUuid]);
  console.log('Résultat de conn.execute:', result);
  const { rows } = result;
  console.log('Résultats de la requête:', rows);

  let stripeCustomerId;
  if (rows.length === 0 || rows[0].stripe_customer_id == null) {
    console.log('Aucun client Stripe trouvé ou stripe_customer_id est null, création d\'un nouveau client Stripe');
    const newCustomer = await stripe.customers.create({ metadata: { uuid: userUuid } });
    stripeCustomerId = newCustomer.id;

    const upsertSql = rows.length === 0
      ? 'INSERT INTO users (uuid, stripe_customer_id) VALUES (?, ?)'
      : 'UPDATE users SET stripe_customer_id = ? WHERE uuid = ?';
    const params = rows.length === 0 ? [userUuid, stripeCustomerId] : [stripeCustomerId, userUuid];
    await conn.execute(upsertSql, params);
    console.log('Client Stripe créé ou mis à jour:', stripeCustomerId);
  } else {
    console.log('Client Stripe existant trouvé:', rows[0].stripe_customer_id);
    stripeCustomerId = rows[0].stripe_customer_id;
  }

  // Vérifier si le stripe_customer_id existe dans Stripe
  const customer = await stripe.customers.retrieve(stripeCustomerId);
  if (!customer || customer.deleted) {
    console.log('Le client Stripe n\'existe pas ou a été supprimé, création d\'un nouveau client');
    const newCustomer = await stripe.customers.create({ metadata: { uuid: userUuid } });
    stripeCustomerId = newCustomer.id;

    const updateSql = 'UPDATE users SET stripe_customer_id = ? WHERE uuid = ?';
    console.log('Exécution de la requête SQL:', updateSql);
    console.log('Avec les paramètres:', [stripeCustomerId, userUuid]);
    await conn.execute(updateSql, [stripeCustomerId, userUuid]);
    console.log('Client Stripe mis à jour:', stripeCustomerId);
  } else if (paymentMethodId) {
    try {
      // Vérification si la méthode de paiement est déjà attachée au client
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      if (paymentMethod.customer !== stripeCustomerId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId,
        });
        console.log(`Méthode de paiement ${paymentMethodId} attachée au client Stripe ${stripeCustomerId}`);
      } else {
        console.log(`Méthode de paiement ${paymentMethodId} est déjà attachée au client Stripe ${stripeCustomerId}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'attachement de la méthode de paiement au client Stripe: ${error.message}`);
      throw error;
    }
  }

  return { stripeCustomerId, paymentMethodId };
};

module.exports = findOrCreateStripeCustomer;
