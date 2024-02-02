// Importation des modules en haut du fichier
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const verifyTokenHandler = require('./verifyToken').handler; // Assurez-vous que ce chemin est correct

async function getUserData(accessToken) {
  console.log('Getting user data with access token:', accessToken);
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
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

    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    if (!body.code && !body.idToken) {
      console.error('No code or ID token provided');
      return { statusCode: 400, body: JSON.stringify({ error: 'Code or ID Token is required' }) };
    }

    if (body.code) {
      console.log('Exchanging code for tokens');
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: `${process.env.URLL}/oauth`,
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens received:', tokens);

      // Simule l'objet événement pour verifyToken
      const fakeEvent = {
        body: JSON.stringify({ userData: await getUserData(tokens.access_token), accessToken: tokens.access_token }),
        httpMethod: 'POST',
      };

      // Appelle verifyToken comme si c'était une fonction Netlify
      const verificationResult = await verifyTokenHandler(fakeEvent);
      return verificationResult;
    }
    // Simule l'objet événement pour verifyToken
    const fakeEvent = {
      body: JSON.stringify({ idToken: body.idToken }),
      httpMethod: 'POST',
    };

    // Appelle verifyToken comme si c'était une fonction Netlify
    const verificationResult = await verifyTokenHandler(fakeEvent);
    return verificationResult;
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};

