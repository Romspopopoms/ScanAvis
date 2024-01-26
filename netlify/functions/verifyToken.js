const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

async function verifyToken(idToken, userData = null, accessToken = null) {
  console.log('Début de verifyToken');

  const client = new OAuth2Client(process.env.CLIENT_ID);
  let payload;

  try {
    if (idToken) {
      console.log('Vérification du ID token');
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.CLIENT_ID });
      payload = ticket.getPayload();
    } else if (userData && typeof userData === 'object' && accessToken) {
      console.log('Utilisation des données utilisateur et de l\'access token fournis');
      payload = { ...userData, access_token: accessToken };
    } else {
      throw new Error('No ID token or user data provided');
    }

    console.log('Payload:', payload);

    if (typeof payload.email !== 'string') {
      throw new Error('Email is not provided or not a string in payload');
    }

    const [results] = await conn.execute('SELECT uuid FROM users WHERE email = ?', [payload.email]);
    if (!Array.isArray(results)) {
      throw new Error('Database query did not return an array');
    }

    const userUuid = results.length > 0 ? results[0].uuid : uuidv4();

    if (results.length === 0) {
      console.log('Inserting new user into the database');
      await conn.execute('INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)', [userUuid, payload.email, payload.name, payload.access_token]);
      console.log('New user created:', userUuid);
    } else {
      console.log('Existing user found:', userUuid);
    }

    console.log('User processed:', userUuid);

    const responseBody = {
      user: {
        uuid: userUuid,
        ...payload,
      },
    };

    console.log('Response Body:', responseBody);
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token verification failed', details: error.message }),
    };
  }
}

module.exports = verifyToken;
