const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

async function verifyToken(idToken, userData = null, accessToken = null) {
  console.log('Début de verifyToken');

  try {
    let payload;
    const client = new OAuth2Client(process.env.CLIENT_ID);

    if (idToken) {
      console.log('Vérification du ID token');
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.CLIENT_ID });
      payload = ticket.getPayload();
      console.log('ID token vérifié:', payload);
    } else if (userData && accessToken) {
      console.log('Utilisation des données utilisateur et de l\'access token fournis');
      payload = { ...userData, access_token: accessToken };
      console.log('Données utilisateur et access token:', payload);
    } else {
      console.log('Erreur: Aucun ID token ou données utilisateur fournis');
      throw new Error('No ID token or user data provided');
    }

    console.log('Vérification de l\'utilisateur dans la base de données');
    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [results] = await conn.execute(checkUserQuery, [payload.email]);

    let userUuid;
    if (results.length > 0) {
      userUuid = results[0].uuid;
      console.log('Utilisateur existant trouvé:', userUuid);
    } else {
      console.log('Création d\'un nouvel utilisateur');
      userUuid = uuidv4();
      const insertUserQuery = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name, payload.access_token]);
      console.log('Nouvel utilisateur créé:', userUuid);
    }

    console.log('Fin de verifyToken avec succès');
    return {
      statusCode: 200,
      body: JSON.stringify({ user: { uuid: userUuid, email: payload.email, name: payload.name, access_token: payload.access_token } }),
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return { statusCode: 401, body: JSON.stringify({ error: 'Token verification failed', details: error.message }) };
  }
}

module.exports = verifyToken;
