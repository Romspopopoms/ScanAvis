const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

async function getUserData(accessToken) {
  console.log('Getting user data with access token:', accessToken);
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('User data retrieved:', data);
  return data;
}

async function verifyIdToken(idToken) {
  console.log('Verifying ID token:', idToken);
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log('ID token verified, payload:', payload);
  return payload;
}

exports.handler = async (event) => {
  console.log('Received event:', event);
  if (event.httpMethod !== 'POST') {
    console.error('Non-POST method attempted');
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    console.log('Parsing request body');
    const body = JSON.parse(event.body);
    console.log('Request body parsed:', body);
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    let userData;

    // Define the redirect URI
    const redirectUri = `${process.env.URLL}/oauth`;

    if (body.code) {
      console.log('Exchanging code for tokens');
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: redirectUri, // Add the redirect URI here
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens received:', tokens);
      userData = await getUserData(tokens.access_token);
    } else if (body.idToken) {
      console.log('Processing ID token');
      userData = await verifyIdToken(body.idToken);
    } else {
      console.error('No code or ID token provided');
      return { statusCode: 400, body: JSON.stringify({ error: 'Code or ID Token is required' }) };
    }

    console.log('Inserting user data into database');
    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;
    await conn.execute(insertQuery, [userData.email, userData.name, body.code || body.idToken]);
    console.log('User data inserted/updated in database');

    // Nouvelle requête pour obtenir user_id en utilisant email
    const selectQuery = 'SELECT user_id FROM users WHERE email = ?';
    const [rows] = await conn.execute(selectQuery, [userData.email]);

    // Vérifiez que l'utilisateur a été trouvé avant d'essayer d'accéder à `user_id`
    if (rows.length > 0) {
      const userId = rows[0].user_id;
      console.log('User ID retrieved:', userId);

      // Inclure l'ID de l'utilisateur dans la réponse
      return {
        statusCode: 200,
        body: JSON.stringify({ user: { email: userData.email, name: userData.name, userId } }),
      };
    }
    console.error('User not found after insert/update');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'User not found after insert/update' }),
    };
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
