const fetch = require('node-fetch');
const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin est correct

exports.envoyerMessage = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { userUuid, titre, message } = JSON.parse(event.body);

    if (!userUuid || !titre || !message) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
    }

    // Récupération des informations de l'utilisateur
    const userQuery = 'SELECT name, entreprise FROM users WHERE uuid = ? LIMIT 1';
    const userResult = await conn.execute(userQuery, [userUuid]);
    if (userResult.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }
    const user = userResult.rows[0];

    // Récupération des éléments d'abonnement
    const subscriptionQuery = 'SELECT items FROM Subscriptions WHERE user_uuid = ?';
    const subscriptionResult = await conn.execute(subscriptionQuery, [userUuid]);
    const subscriptionItems = subscriptionResult.rows.map((sub) => sub.items).join(', ');

    // Préparation et envoi des données au webhook
    const webhookUrl = 'https://hook.eu2.make.com/ifknchx9h9banxrnyau6ahqpgz099rp1'; // Utilisez votre URL de webhook
    const payload = {
      titre,
      message,
      entreprise: user.entreprise,
      subscriptionItems,
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook call failed: ${webhookResponse.statusText}`);
    }

    // Traitement de la réponse du webhook
    const responseData = await webhookResponse.json(); // Supposons que la réponse est en JSON

    return { statusCode: 200, body: JSON.stringify({ message: 'Data successfully sent to webhook.', responseData }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error', error: error.message }) };
  }
};
