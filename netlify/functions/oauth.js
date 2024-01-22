const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

async function getUserData(accessToken) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('User data retrieved for:', data.email); // Log only the email
  return data;
}

async function verifyIdToken(idToken) {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log('Token verified for:', payload.email); // Log only the email
  return payload;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    let userData;

    if (body.code) {
      const { tokens } = await oAuth2Client.getToken(decodeURIComponent(body.code));
      oAuth2Client.setCredentials(tokens);
      userData = await getUserData(tokens.access_token);
    } else if (body.idToken) {
      userData = await verifyIdToken(body.idToken);
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Code or ID Token is required' }) };
    }

    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;
    await conn.execute(insertQuery, [userData.email, userData.name, body.code || body.idToken]);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: { email: userData.email, name: userData.name } }), // Do not return the access_token
    };
  } catch (err) {
    console.error('Error during authentication:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
