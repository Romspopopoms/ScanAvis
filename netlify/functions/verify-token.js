const { OAuth2Client } = require('google-auth-library');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const verify = async (credential) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  };

  try {
    const { credential } = event.queryStringParameters;
    console.log('Credential', credential);

    const payload = await verify(credential);
    const { sub: userid, email, name } = payload;
    console.log('payload', payload);
    console.log('userid', userid);

    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = ?, access_token = ?
    `;

    // Utilisez conn.execute avec async/await pour la cohérence
    await conn.execute(insertQuery, [email, name, credential, name, credential]);

    console.log('User data inserted/updated successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token verified and user data updated', user: payload }),
    };
  } catch (error) {
    console.error('Error verifying token or inserting data', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
