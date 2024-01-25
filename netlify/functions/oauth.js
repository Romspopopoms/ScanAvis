const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const verifyToken = require('./verifyToken'); // Assurez-vous que le chemin est correct

async function getUserData(accessToken) {
  console.log('Récupération des données utilisateur avec le token:', accessToken);
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
  }
  const data = await response.json();
  console.log('Données utilisateur récupérées:', data);
  return data;
}

exports.handler = async (event) => {
  console.log('Événement reçu:', event);

  if (event.httpMethod !== 'POST') {
    console.error('Tentative avec une méthode non-POST');
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  try {
    console.log('Analyse du corps de la requête');
    const body = JSON.parse(event.body);
    console.log('Corps de la requête analysé:', body);

    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    if (body.code) {
      console.log('Échange du code contre des tokens');
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: `${process.env.URLL}/oauth`,
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens reçus:', tokens);

      const userData = await getUserData(tokens.access_token);
      return await verifyToken(null, userData, tokens.access_token);
    } if (body.idToken) {
      console.log('Traitement du ID token');
      return await verifyToken(body.idToken);
    }
    console.error('Aucun code ou ID token fourni');
    return { statusCode: 400, body: JSON.stringify({ error: 'Code ou ID Token requis' }) };
  } catch (err) {
    console.error('Erreur durant l\'authentification: ', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Échec de l\'authentification', details: err.message,
      }),
    };
  }
};
