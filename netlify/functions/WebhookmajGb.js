const fetch = require('node-fetch');
const { conn } = require('../../utils/db'); // Assurez-vous que le chemin d'accès est correct

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  try {
    const { userUuid, webhookUrl } = JSON.parse(event.body);

    if (!userUuid || !webhookUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Le userUuid et le webhookUrl sont requis' }),
      };
    }

    const userDetailsResult = await conn.execute('SELECT name, google_business FROM users WHERE uuid = ?', [userUuid]);
    if (userDetailsResult[0].length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Utilisateur non trouvé' }),
      };
    }
    const user = userDetailsResult[0][0];

    const subscriptionsResult = await conn.execute('SELECT items FROM subscriptions WHERE user_uuid = ?', [userUuid]);
    if (subscriptionsResult[0].length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Abonnement non trouvé' }),
      };
    }
    const subscriptionItems = subscriptionsResult[0].map((s) => s.items).join(', ');

    const payload = {
      name: user.name,
      googleBusiness: user.google_business,
      subscriptionItems,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de l'envoi au webhook: ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Données envoyées avec succès au webhook.' }),
    };
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erreur interne du serveur' }),
    };
  }
};
