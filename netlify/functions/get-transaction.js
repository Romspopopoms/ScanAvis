const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const paymentIntentId = event.queryStringParameters?.paymentIntentId;
  console.log('Received queryStringParameters:', JSON.stringify(event.queryStringParameters));
  console.log('Received paymentIntentId:', paymentIntentId);

  if (!paymentIntentId || paymentIntentId.trim() === '') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'PaymentIntentId is required and cannot be empty' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const results = await conn.execute(query, [paymentIntentId.trim()]);
    const rows = results[0];

    if (!rows || rows.length === 0) {
      console.log(`Transaction not found for paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction not found' }),
      };
    }

    // We expect `rows` to be an array of objects. If it's not, log an error and return a generic error message.
    if (!Array.isArray(rows) || typeof rows[0] !== 'object') {
      console.error('Unexpected response format from the database:', rows);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'An error occurred while retrieving the transaction. Data format is incorrect.' }),
      };
    }

    const transaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items || '[]'), // Assuming items is a JSON string.
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
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `An error occurred while retrieving the transaction: ${error.message}` }),
    };
  }
};
