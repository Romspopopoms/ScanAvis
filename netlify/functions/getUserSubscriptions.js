// getUserSubscriptions.js
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  const userUuid = event.queryStringParameters?.userUuid?.trim();
  console.log('userUuid nettoyé:', userUuid);

  if (!userUuid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Subscriptions WHERE user_uuid = ?';
    const result = await conn.execute(query, [userUuid]);
    console.log('Result from conn.execute:', result);
    const { rows } = result;
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Aucune souscription trouvée pour userUuid: ${userUuid}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Souscriptions non trouvées' }),
      };
    }

    const subscriptions = rows.map((subscription) => ({
      subscriptionId: subscription.subscriptionId,
      items: subscription.items,
      status: subscription.status,
      createdAt: subscription.createdAt,
      nextPaymentDate: subscription.nextPaymentDate,
      nextPaymentAmount: subscription.nextPaymentAmount,
      // ... autres champs pertinents
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptions }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération des souscriptions: ${error.message}` }),
    };
  }
};
