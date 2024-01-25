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

    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    let verificationResult;

    if (body.code) {
      console.log('Exchanging code for tokens');
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: `${process.env.URLL}/oauth`,
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens received:', tokens);

      const userData = await getUserData(tokens.access_token);
      verificationResult = await verifyToken(null, userData, tokens.access_token);
    } else if (body.idToken) {
      console.log('Processing ID token');
      verificationResult = await verifyToken(body.idToken);
    } else {
      throw new Error('No code or ID token provided');
    }

    if (verificationResult.statusCode === 200) {
      return {
        statusCode: 200,
        body: verificationResult.body,
      };
    }
    return {
      statusCode: verificationResult.statusCode,
      body: JSON.stringify({ error: 'Token verification failed' }),
    };
  } catch (err) {
    console.error('Error during authentication:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
