const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { conn } = require('../../utils/db');

const findOrCreateStripeCustomer = async (userUuid) => {
  console.log('Début de findOrCreateStripeCustomer');

  // Vérifier si l'utilisateur avec l'UUID donné existe dans la base de données
  const selectSql = 'SELECT stripe_customer_id FROM users WHERE uuid = ?';
  console.log('Exécution de la requête SQL:', selectSql);
  console.log('Avec les paramètres:', userUuid);

  const result = await conn.execute(selectSql, [userUuid]);
  console.log('Résultat de conn.execute:', result);
  const { rows } = result; // Assurez-vous que c'est la structure correcte pour les résultats de votre base de données
  console.log('Résultats de la requête:', rows);

  let stripeCustomerId;
  if (rows.length === 0) {
    console.log('Aucun utilisateur trouvé, création d\'un nouveau client Stripe');
    const newCustomer = await stripe.customers.create({ metadata: { uuid: userUuid } });
    stripeCustomerId = newCustomer.id;

    const insertSql = 'INSERT INTO users (uuid, stripe_customer_id) VALUES (?, ?)';
    console.log('Exécution de la requête SQL:', insertSql);
    console.log('Avec les paramètres:', [userUuid, stripeCustomerId]);
    await conn.execute(insertSql, [userUuid, stripeCustomerId]);
    console.log('Nouveau client Stripe créé:', stripeCustomerId);
  } else {
    console.log('Utilisateur existant trouvé:', rows[0].stripe_customer_id);
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
  }

  // Retourner l'ID du client Stripe
  return { id: stripeCustomerId };
};

module.exports = findOrCreateStripeCustomer;
