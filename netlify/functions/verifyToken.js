const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

// Cette fonction vérifie la validité du token ID, récupère/insère l'utilisateur dans la base de données, et renvoie les données de l'utilisateur
async function verifyToken(idToken, userData = null, accessToken = null) {
  try {
    let payload;
    if (idToken) {
      console.log('Verifying ID token:', idToken);
      const client = new OAuth2Client(process.env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
      });
      payload = ticket.getPayload();
      console.log('ID token verified, payload:', payload);
    } else if (userData && accessToken) {
      // Si l'ID token n'est pas fourni, utilisez les données de l'utilisateur et l'access token fournis
      payload = userData;
      payload.access_token = accessToken;
    } else {
      throw new Error('No ID token or user data provided');
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [userResults] = await conn.execute(checkUserQuery, [payload.email]);
    let userUuid = userResults.length > 0 ? userResults[0].uuid : null;

    if (!userUuid) {
      // L'utilisateur n'existe pas, créer un nouveau UUID et insérer l'utilisateur
      console.log('User does not exist, creating new user');
      userUuid = uuidv4();
      const insertUserQuery = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name, payload.access_token]);
    }

    // Renvoyer les données de l'utilisateur en tant que réponse
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
