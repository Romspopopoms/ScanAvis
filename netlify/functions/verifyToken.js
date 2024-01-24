const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db');

// Cette fonction vérifie la validité du token ID, récupère/insère l'utilisateur dans la base de données, et renvoie les données de l'utilisateur
async function verifyToken(idToken) {
  try {
    console.log('Verifying ID token:', idToken);
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('ID token verified, payload:', payload);

    // Vérifier si l'utilisateur existe dans la base de données
    const checkUserQuery = 'SELECT uuid FROM users WHERE email = ?';
    const [userResults] = await conn.execute(checkUserQuery, [payload.email]);
    let userUuid = userResults.length > 0 ? userResults[0].uuid : null;

    if (!userUuid) {
      // L'utilisateur n'existe pas, créer un nouveau UUID et insérer l'utilisateur
      console.log('User does not exist, creating new user');
      userUuid = uuidv4();
      const insertUserQuery = 'INSERT INTO users (uuid, email, name) VALUES (?, ?, ?)';
      await conn.execute(insertUserQuery, [userUuid, payload.email, payload.name]);
    }

    // Renvoyer les données de l'utilisateur en tant que réponse
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          uuid: userUuid,
          email: payload.email,
          name: payload.name,
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

exports.handler = async (event) => {
  console.log('Received event:', event);
  if (event.httpMethod !== 'POST') {
    console.error('Non-POST method attempted');
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    console.log('Parsing request body');
    const body = JSON.parse(event.body);

    // Ici, nous supposons que le corps de la requête contient l'idToken
    if (body.idToken) {
      console.log('ID token provided');
      return await verifyToken(body.idToken);
    }
    console.error('No ID token provided');
    return { statusCode: 400, body: JSON.stringify({ error: 'ID Token is required' }) };
  } catch (err) {
    console.error('Error during the request processing:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
