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

  const paymentIntentId = event.queryStringParameters?.paymentIntentId?.trim();
  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Le paymentIntentId est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const [transaction] = await conn.execute(query, [paymentIntentId]);
    console.log('Résultat de la requête:', transaction);

    if (transaction.length === 0) {
      console.log(`Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    const response = {
      transactionId: transaction[0].transactionId,
      items: JSON.parse(transaction[0].items || '[]'),
      totalAmount: transaction[0].totalAmount,
      paymentIntentId: transaction[0].paymentIntentId,
      createdAt: transaction[0].createdAt,
      // Exclure les données sensibles comme clientSecret
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: response }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération de la transaction: ${error.message}` }),
    };
  }
};
