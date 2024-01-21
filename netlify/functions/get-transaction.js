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
  console.log('Received paymentIntentId:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'PaymentIntentId is required' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const [rows] = await conn.execute(query, [paymentIntentId]);
    console.log('Database response:', JSON.stringify(rows));

    if (rows.length === 0) {
      console.log(`Transaction not found for paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction not found' }),
      };
    }

    const transaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items),
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
      body: JSON.stringify({ error: `An error occurred while retrieving the transaction. ${error.message}` }),
    };
  }
};
