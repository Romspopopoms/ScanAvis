const { OAuth2Client } = require('google-auth-library');
const { conn } = require('../../utils/db'); // Assurez-vous d'avoir le bon chemin d'accès

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
    return ticket.getPayload(); // Renvoyer le payload directement
  };

  try {
    const { credential } = event.queryStringParameters;
    console.log('Credential', credential);

    const payload = await verify(credential);
    const { sub: userid, email, name } = payload;
    console.log('payload', payload);
    console.log('userid', userid);

    const insertQuery = 'INSERT INTO users (email, name, access_token) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, access_token = ?';
    await new Promise((resolve, reject) => {
      conn.query(insertQuery, [email, name, credential, name, credential], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

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
