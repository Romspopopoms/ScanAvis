// netlify/functions/get-transaction.js
const { conn } = require('../../utils/db'); // Vérifiez que le chemin d'accès est correct.

exports.handler = async (event) => {
  // Afficher l'événement reçu pour le débogage.
  console.log('Received event:', JSON.stringify(event));

  // Autoriser uniquement la méthode GET.
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Extraire l'ID de l'intention de paiement des paramètres de la chaîne de requête.
  const paymentIntentId = event.queryStringParameters?.paymentIntentId;
  console.log('Received paymentIntentId:', paymentIntentId);

  // Vérifier que l'ID de l'intention de paiement est présent.
  if (!paymentIntentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'PaymentIntentId is required' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
    // Requête SQL pour obtenir les détails de la transaction.
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const [rows] = await conn.execute(query, [paymentIntentId]);
    console.log('Database response:', JSON.stringify(rows));

    // Vérifier si la transaction existe.
    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Filtrer la transaction pour exclure les données sensibles avant de les envoyer au client.
    const filteredTransaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items), // En supposant que les articles sont stockés sous forme de chaîne JSON.
      totalAmount: rows[0].totalAmount,
      paymentIntentId: rows[0].paymentIntentId,
      createdAt: rows[0].createdAt,
      // N'incluez pas clientSecret ou d'autres données sensibles.
    };

    // Répondre avec les détails de la transaction filtrée.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: filteredTransaction }),
    };
  } catch (error) {
    // Loguer l'erreur de la base de données et répondre avec une erreur 500.
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'An error occurred while retrieving the transaction.' }),
    };
  }
};
