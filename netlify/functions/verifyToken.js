const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

async function verifyToken(idToken, userData = null, accessToken = null) {
  try {
    let payload;
    const client = new OAuth2Client(process.env.CLIENT_ID);

    // Log pour voir si on entre dans les différentes branches
    console.log('verifyToken called', { idToken, userData, accessToken });

    if (idToken) {
      console.log('Verifying ID token:', idToken);
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.CLIENT_ID });
      payload = ticket.getPayload();
      console.log('ID token verified, payload:', payload);
    } else if (userData && accessToken) {
      payload = { ...userData, access_token: accessToken };
      console.log('User data and access token provided:', payload);
    } else {
      throw new Error('No ID token or user data provided');
    }

    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const queryResult = await conn.execute(checkUserQuery, [payload.email]);

    // Log pour inspecter la structure des résultats
    console.log('Query result:', queryResult);

    if (!Array.isArray(queryResult) || queryResult.length === 0 || !Array.isArray(queryResult[0])) {
      throw new Error('Unexpected structure of database query results');
    }

    const userResults = queryResult[0];
    let userUuid;
    if (userResults.length > 0 && userResults[0].uuid) {
      userUuid = userResults[0].uuid;
    } else {
      console.log('User does not exist, creating new user');
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
