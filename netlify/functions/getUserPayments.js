const { conn } = require('../../utils/db');

async function getUserPayments(userUuid) {
  console.log('Fetching payments for user:', userUuid);
  try {
    const query = 'SELECT * FROM Transactions WHERE user_uuid = ?';
    const [rows] = await conn.query(query, [userUuid]);
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Aucune transaction trouvée pour userUuid: ${userUuid}`);
      return [];
    }

    // Transforme les transactions pour enlever les données sensibles
    const transactions = rows.map((transaction) => ({
      transactionId: transaction.transactionId,
      items: JSON.parse(transaction.items),
      totalAmount: transaction.totalAmount,
      paymentIntentId: transaction.paymentIntentId,
      createdAt: transaction.createdAt,
      // Exclure clientSecret pour la sécurité
    }));

    return transactions;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements utilisateur :', error);
    throw new Error('Échec de la récupération des paiements utilisateur');
  }
}

exports.handler = async (event) => {
  console.log('Received event:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { userUuid } = JSON.parse(event.body);

    if (!userUuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User UUID is required' }),
      };
    }

    const transactions = await getUserPayments(userUuid);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
    };
  } catch (error) {
    console.error('Error during fetching user payments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
