const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

async function verifyToken(idToken, userData = null, accessToken = null) {
  try {
    let payload;
    const client = new OAuth2Client(process.env.CLIENT_ID);
    console.log('verifyToken called', { idToken, userData, accessToken });

    if (idToken) {
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.CLIENT_ID });
      payload = ticket.getPayload();
    } else if (userData && accessToken) {
      payload = { ...userData, access_token: accessToken };
    } else {
      throw new Error('No ID token or user data provided');
    }

    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [results] = await conn.execute(checkUserQuery, [payload.email]);

    let userUuid;
    if (results.length > 0) {
      // Supposons que la première ligne contient l'UUID que nous cherchons
      userUuid = results[0].uuid;
    } else {
      // Si l'utilisateur n'existe pas, créez-en un nouveau
      userUuid = uuidv4();
      const insertUserQuery = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name, payload.access_token]);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: { uuid: userUuid, email: payload.email, name: payload.name, access_token: payload.access_token } }),
    };
  } catch (error) {
    console.error('Error during token verification:', error);
    return { statusCode: 401, body: JSON.stringify({ error: 'Token verification failed', details: error.message }) };
  }
}

module.exports = verifyToken;
