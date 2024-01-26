const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

async function verifyToken(idToken, userData = null, accessToken = null) {
  try {
    let payload;
    const client = new OAuth2Client(process.env.CLIENT_ID);

    if (idToken) {
      console.log('Verifying ID token:', idToken);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
      });
      payload = ticket.getPayload();
      console.log('ID token verified, payload:', payload);
    } else if (userData && accessToken) {
      if (typeof userData === 'object' && userData !== null && !Array.isArray(userData)) {
        payload = { ...userData, access_token: accessToken };
      } else {
        throw new Error('Invalid user data structure');
      }
    } else {
      throw new Error('No ID token or user data provided');
    }

    if (!payload || !payload.email) {
      throw new Error('Payload is invalid or email is missing');
    }

    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [queryResults] = await conn.execute(checkUserQuery, [payload.email]);
    console.log('Query results:', queryResults);
    let userUuid;
    if (queryResults && queryResults.length > 0) {
      const firstRow = queryResults[0];
      if (firstRow && firstRow.uuid) {
        userUuid = firstRow.uuid;
      } else {
        console.log('User does not exist, creating new user');
        userUuid = uuidv4();
        const insertUserQuery = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
        await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name, payload.access_token]);
      }
    } else {
      throw new Error('No results returned from database query');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          uuid: userUuid,
          email: payload.email,
          name: payload.name,
          access_token: payload.access_token,
        },
      }),
    };
  } catch (error) {
    console.error('Error during token verification:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token verification failed', details: error.message }),
    };
  }
}

module.exports = verifyToken;
