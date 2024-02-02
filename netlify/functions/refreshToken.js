const { OAuth2Client } = require('google-auth-library');

// Configurez votre client OAuth2
const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

exports.handler = async (event) => {
  // Seules les requêtes POST sont acceptées
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parsez le corps de la requête
    const { refreshToken } = JSON.parse(event.body);
    if (!refreshToken) {
      return { statusCode: 400, body: 'Refresh token is required' };
    }

    // Utilisez le client OAuth2 pour rafraîchir le token
    const { credentials } = await client.refreshToken(refreshToken);

    // Répondez avec le nouveau token d'accès et l'heure d'expiration
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: credentials.access_token,
        expiresIn: credentials.expiry_date,
      }),
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
