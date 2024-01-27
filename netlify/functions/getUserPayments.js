const { conn } = require('../../utils/db');

async function getUserPayments(userUuid) {
  console.log('Fetching payments for user:', userUuid);
  try {
    // Query to fetch transactions for the given user
    const query = `
      SELECT * FROM Transactions
      WHERE user_uuid = ?
    `;

    // Execute the query
    const [transactions] = await conn.execute(query, [userUuid]);

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
