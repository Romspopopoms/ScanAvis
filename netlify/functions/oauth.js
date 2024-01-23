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
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, `${process.env.URLL}/oauth`);
    let userData;

    if (body.code) {
      console.log('Exchanging code for tokens');
      const decodedCode = decodeURIComponent(body.code);
      console.log('Decoded code:', decodedCode);
      const { tokens } = await oAuth2Client.getToken(decodedCode);
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
    const insertUserQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token);
    `;
    const [userResult] = await conn.execute(insertUserQuery, [userData.email, userData.name, body.code || body.idToken]);

    // Récupérer l'ID de l'utilisateur (soit nouvellement inséré, soit existant)
    let userId;
    if (userResult.insertId) {
      userId = userResult.insertId; // Nouvel utilisateur, utiliser l'ID inséré
    } else {
      // Utilisateur existant, récupérer son ID
      const [rows] = await conn.execute('SELECT user_id FROM users WHERE email = ?', [userData.email]);
      userId = rows[0].user_id;
    }
    console.log('User data inserted/updated in database with user_id:', userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: { email: userData.email, name: userData.name, user_id: userId } }),
    };
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
