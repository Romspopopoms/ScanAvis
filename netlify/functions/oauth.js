const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
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

    console.log('Checking if user exists and getting UUID');
    const checkUserQuery = `
      SELECT uuid FROM users WHERE email = ?
    `;
    const [userResults] = await conn.execute(checkUserQuery, [userData.email]);
    let userUuid = userResults.length > 0 ? userResults[0].uuid : null;

    if (!userUuid) {
      console.log('User does not exist, creating new UUID');
      userUuid = uuidv4();

      console.log('Inserting new user data into database');
      const insertUserQuery = `
        INSERT INTO users (uuid, email, name, access_token)
        VALUES (?, ?, ?, ?)
      `;
      await conn.execute(insertUserQuery, [userUuid, userData.email, userData.name, body.code || body.idToken]);
      console.log('New user inserted with UUID:', userUuid);
    } else {
      console.log('User exists, UUID:', userUuid);
      // Here you can update user data if necessary
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          uuid: userUuid,
          email: userData.email,
          name: userData.name,
          access_token: body.code || body.idToken, // Include the access_token if needed
        },
      }),
    };
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
