const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

async function getUserData(accessToken) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  const data = await response.json();
  return data;
}

async function verifyIdToken(idToken) {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let userData;
  try {
    const body = JSON.parse(event.body);
    const redirectURL = `${process.env.URLL}/oauth`;
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);

    if (body.code) {
      const code = decodeURIComponent(body.code);
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      userData = await getUserData(tokens.access_token);
    } else if (body.idToken) {
      userData = await verifyIdToken(body.idToken);
    } else {
      return { statusCode: 400, body: 'Code or ID Token is required' };
    }

    const { email, name } = userData;

    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;

    await conn.execute(insertQuery, [email, name, body.code || body.idToken]);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData }),
    };
  } catch (err) {
    console.error('Error processing authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' }),
    };
  }
};
