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
      console.log('ID token verified, payload:', payload);
    } else if (userData && accessToken) {
      payload = { ...userData, access_token: accessToken };
      console.log('User data and access token provided:', payload);
    } else {
      throw new Error('No ID token or user data provided');
    }

    console.log('Checking user in DB with email:', payload.email);
    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [results] = await conn.execute(checkUserQuery, [payload.email]);
    console.log('DB query executed. Results:', results);

    let userUuid;
    // Vérification que results est bien un tableau et qu'il contient au moins un élément
    if (Array.isArray(results) && results.length > 0) {
      userUuid = results[0].uuid;
      console.log('User exists with UUID:', userUuid);
    } else {
      console.log('User does not exist, creating new user');
      userUuid = uuidv4();
      const insertUserQuery = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name, payload.access_token]);
      console.log('New user created with UUID:', userUuid);
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
