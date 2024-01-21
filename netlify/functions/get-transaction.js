// netlify/functions/get-transaction.js
const { conn } = require('../../utils/db'); // Assurez-vous que le chemin est correct

exports.handler = async (event) => {
  console.log('Received event:', event); // Log pour voir l'événement reçu

  // Only allow GET method
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  const { paymentIntentId } = event.queryStringParameters;
  console.log('Received paymentIntentId:', paymentIntentId); // Log pour voir le paymentIntentId reçu

  if (!paymentIntentId) {
    return { statusCode: 400, body: JSON.stringify({ message: 'PaymentIntentId is required' }) };
  }

  try {
    const [rows] = await conn.execute('SELECT * FROM Transactions WHERE paymentIntentId = ?', [paymentIntentId]);
    console.log('Database response:', rows); // Log pour voir la réponse de la base de données

    if (rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Transaction not found' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: rows[0] }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
