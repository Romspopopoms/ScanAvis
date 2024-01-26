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

    // Nettoyage de payload pour éviter les propriétés non itérables
    const cleanedPayload = JSON.parse(JSON.stringify(payload));

    let results;
    try {
      [results] = await conn.execute('SELECT uuid FROM users WHERE email = ?', [cleanedPayload.email]);
      console.log('Database results:', results);
    } catch (error) {
      console.error('Erreur lors de la requête à la base de données:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database query failed', details: error.message }),
      };
    }

    if (!results || results.length === 0) {
      console.log('Aucun utilisateur trouvé, création d\'un nouveau utilisateur');
      const newUuid = uuidv4();
      await conn.execute('INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)', [newUuid, cleanedPayload.email, cleanedPayload.name, cleanedPayload.access_token]);
      console.log('New user created:', newUuid);
      payload.uuid = newUuid; // Mettre à jour le payload avec le nouveau uuid
    } else {
      console.log('Existing user found:', results[0].uuid);
      payload.uuid = results[0].uuid; // Mettre à jour le payload avec l'uuid trouvé
    }

    console.log('User processed:', payload.uuid);

    const responseBody = {
      user: payload, // Utilisation de la version nettoyée de payload
    };

    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
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
