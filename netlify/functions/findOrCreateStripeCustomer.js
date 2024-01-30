const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const { conn } = require('../../utils/db');

const findOrCreateStripeCustomer = async (userUuid) => {
  console.log('Début de findOrCreateStripeCustomer');

  try {
    const selectSql = 'SELECT stripe_customer_id FROM users WHERE uuid = ?';
    const { rows } = await conn.execute(selectSql, [userUuid]);

    let stripeCustomerId = rows.length > 0 ? rows[0].stripe_customer_id : null;

    if (!stripeCustomerId) {
      console.log('Aucun utilisateur trouvé, création d\'un nouveau client Stripe');
      const newCustomer = await stripe.customers.create({ metadata: { uuid: userUuid } });
      stripeCustomerId = newCustomer.id;

      const insertOrUpdateSql = rows.length === 0
        ? 'INSERT INTO users (uuid, stripe_customer_id) VALUES (?, ?)'
        : 'UPDATE users SET stripe_customer_id = ? WHERE uuid = ?';
      await conn.execute(insertOrUpdateSql, [userUuid, stripeCustomerId]);
    } else {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      if (!customer || customer.deleted) {
        console.log('Le client Stripe n\'existe pas ou a été supprimé, création d\'un nouveau client');
        const newCustomer = await stripe.customers.create({ metadata: { uuid: userUuid } });
        stripeCustomerId = newCustomer.id;

        const updateSql = 'UPDATE users SET stripe_customer_id = ? WHERE uuid = ?';
        await conn.execute(updateSql, [stripeCustomerId, userUuid]);
      }
    }

    return { id: stripeCustomerId };
  } catch (error) {
    console.error('Erreur lors de la recherche ou de la création du client Stripe:', error);
    throw error; // Propager l'erreur pour un traitement ultérieur
  }
};

module.exports = findOrCreateStripeCustomer;
