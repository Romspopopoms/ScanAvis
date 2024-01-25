const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const verifyToken = require('./verifyToken'); // Vérifiez le chemin d'accès

async function getUserData(accessToken) {
  console.log('Getting user data with access token:', accessToken);
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('User data retrieved:', data);
  return data;
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
    console.log('Request body parsed:', body);

    // Initialisation du client OAuth2 avec les identifiants de l'application
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    if (body.code) {
      console.log('Exchanging code for tokens');
      // Échange du code contre des tokens
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: `${process.env.URLL}/oauth`,
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens received:', tokens);

      // Récupération des données utilisateur et vérification du token
      const userData = await getUserData(tokens.access_token);
      return await verifyToken(null, userData, tokens.access_token);
    } if (body.idToken) {
      console.log('Processing ID token');
      // Vérification directe du ID token
      return await verifyToken(body.idToken);
    }
    console.error('No code or ID token provided');
    return { statusCode: 400, body: JSON.stringify({ error: 'Code or ID Token is required' }) };
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
