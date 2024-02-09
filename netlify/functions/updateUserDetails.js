const fetch = require('node-fetch');
const { conn } = require('../../utils/db'); // Assure-toi que ce chemin est correct

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { userUuid, entreprise, googleBusiness, email } = JSON.parse(event.body);
    if (!userUuid || !email || !entreprise || !googleBusiness) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
    }

    // Mise à jour des informations de l'utilisateur
    await conn.execute('UPDATE users SET email = ?, entreprise = ?, google_business = ? WHERE uuid = ?', [email, entreprise, googleBusiness, userUuid]);

    // Récupération des informations de l'utilisateur après mise à jour
    const [userRows] = await conn.execute('SELECT name, google_business FROM users WHERE uuid = ?', [userUuid]);
    if (userRows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }
    const user = userRows[0];

    // Récupération des items d'abonnement
    const [subscriptionRows] = await conn.execute('SELECT items FROM subscriptions WHERE user_uuid = ?', [userUuid]);
    const subscriptionItems = subscriptionRows.map((sub) => sub.items).join(', ');

    // Envoi des données au webhook
    const webhookUrl = 'https://hook.eu2.make.com/gh2844ojmi6ux31e3pf9vapc92yw17tg';
    const payload = { name: user.name, googleBusiness: user.google_business, subscriptionItems };
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook call failed: ${webhookResponse.statusText}`);
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Data successfully updated and sent to webhook.' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
