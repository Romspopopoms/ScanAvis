const { conn } = require('../../utils/db');

async function getUserPayments(userId) {
  console.log('Fetching payments for user:', userId);
  try {
    // Query to fetch transactions for the given user
    const query = `
            SELECT * FROM Transactions
            WHERE user_id = ?
        `;

    // Execute the query
    const [transactions] = await conn.execute(query, [userId]);

    console.log('Transactions retrieved:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching user payments:', error);
    throw error; // Rethrow the error to handle it in the calling function
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
    const { userId } = body;

    if (!userId) {
      console.error('User ID is required');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }

    console.log('Fetching user payments');
    const userPayments = await getUserPayments(userId);

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
