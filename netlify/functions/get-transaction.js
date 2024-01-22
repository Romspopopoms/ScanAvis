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

  const paymentIntentId = event.queryStringParameters?.paymentIntentId?.replace(/\s/g, '');
  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'L\'ID de l\'intention de paiement est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const results = await conn.query(query, [paymentIntentId]);
    console.log('Résultats de la base de données:', JSON.stringify(results));

    if (!results || results.length === 0 || !results[0].rows || results[0].rows.length === 0) {
      console.log(`Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    const { rows } = results[0];
    const transaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items || '[]'),
      totalAmount: rows[0].totalAmount,
      paymentIntentId: rows[0].paymentIntentId,
      createdAt: rows[0].createdAt,
      // Exclure les données sensibles comme clientSecret
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction }),
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
