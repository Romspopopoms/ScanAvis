const { conn } = require('../../utils/db');

async function getUserPayments(userUuid) {
  console.log('Fetching payments for user:', userUuid);
  try {
    const query = 'SELECT * FROM Transactions WHERE user_uuid = ?'; // Utilisez user_uuid pour la colonne correspondante dans la base de données
    const result = await conn.execute(query, [userUuid]);
    console.log('Result from conn.execute:', result);
    const { rows } = result; // Assurez-vous que c'est la structure correcte pour les résultats de votre base de données
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Aucune transaction trouvée pour userUuid: ${userUuid}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Aucune transaction trouvée' }),
      };
    }

    // Générer une réponse avec toutes les transactions
    const transactions = rows.map((transaction) => ({
      transactionId: transaction.transactionId,
      items: JSON.parse(transaction.items || '[]'),
      totalAmount: transaction.totalAmount,
      paymentIntentId: transaction.paymentIntentId,
      createdAt: transaction.createdAt,
      // Exclure les données sensibles comme clientSecret
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements utilisateur :', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Échec de la récupération des paiements utilisateur',
        details: error.message,
      }),
    };
  }
}

exports.handler = async (event) => {
  console.log('Received event:', event);
  if (event.httpMethod !== 'POST') {
    console.error('Non-POST method attempted');
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    console.log('Parsing request body');
    const body = JSON.parse(event.body);
    const { userUuid } = body;

    if (!userUuid) {
      console.error('User UUID is required');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User UUID is required' }),
      };
    }

    console.log('Fetching user payments');
    const userPayments = await getUserPayments(userUuid);

    return {
      statusCode: 200,
      body: JSON.stringify({ transactions: userPayments }),
    };
  } catch (err) {
    console.error('Error during fetching user payments:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch user payments',
        details: err.message,
      }),
    };
  }
};
