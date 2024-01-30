const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  const subscriptionId = event.queryStringParameters?.subscriptionId?.trim();
  console.log('subscriptionId nettoyé:', subscriptionId);

  if (!subscriptionId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Le subscriptionId est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Subscriptions WHERE subscriptionId = ?';
    const result = await conn.execute(query, [subscriptionId]);
    console.log('Result from conn.execute:', result);
    const { rows } = result; // Assurez-vous que c'est la structure correcte pour les résultats de votre base de données
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Abonnement non trouvé pour subscriptionId: ${subscriptionId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Abonnement non trouvé' }),
      };
    }

    const subscription = rows[0]; // En supposant que subscriptionId est unique et renvoie une seule ligne
    const response = {
      subscriptionId: subscription.subscriptionId,
      items: JSON.parse(subscription.items || '[]'),
      status: subscription.status, // Exemple de champ, dépend de votre structure de données
      createdAt: subscription.createdAt,
      // Exclure les données sensibles comme clientSecret
      // Ajoutez des champs comme nextPaymentDate, nextPaymentAmount si disponible
      nextPaymentDate: subscription.nextPaymentDate, // Exemple
      nextPaymentAmount: subscription.nextPaymentAmount, // Exemple
      // ... autres champs pertinents
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: response }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération de l'abonnement: ${error.message}` }),
    };
  }
};
