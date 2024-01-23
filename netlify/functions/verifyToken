const { OAuth2Client } = require('google-auth-library');

// Cette fonction vérifie la validité du token ID et renvoie les données de l'utilisateur
async function verifyToken(idToken) {
  try {
    console.log('Verifying ID token:', idToken);
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, // Spécifiez l'ID client attendu de l'application frontend
    });

    const payload = ticket.getPayload();
    console.log('ID token verified, payload:', payload);

    // Renvoyez les données de l'utilisateur en tant que réponse
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          email: payload.email,
          name: payload.name,
        },
      }),
    };
  } catch (error) {
    console.error('Error during token verification:', error);
    return {
      statusCode: 401, // Non autorisé
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
