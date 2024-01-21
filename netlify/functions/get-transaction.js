// netlify/functions/get-transaction.js
const { conn } = require('../../utils/db'); // Assurez-vous que le chemin est correct

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  // Allow only GET method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  const paymentIntentId = event.queryStringParameters?.paymentIntentId;
  console.log('Received paymentIntentId:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'PaymentIntentId is required' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const [rows] = await conn.execute(query, [paymentIntentId]);
    console.log('Database response:', JSON.stringify(rows));

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    // Create a filtered transaction object to send back to the client
    const filteredTransaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items), // Assuming items is stored as a JSON string in the DB
      totalAmount: rows[0].totalAmount,
      paymentIntentId: rows[0].paymentIntentId,
      createdAt: rows[0].createdAt,
      // Do not include the clientSecret or any other sensitive data
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction: filteredTransaction }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
