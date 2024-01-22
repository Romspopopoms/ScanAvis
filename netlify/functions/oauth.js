const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

async function getUserData(accessToken) {
  console.log('Récupération des données utilisateur depuis Google API');
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    console.error('Erreur lors de la récupération des données utilisateur:', response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('Données utilisateur récupérées:', data);
  return data;
}

async function verifyIdToken(idToken) {
  console.log('Vérification du ID Token');
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
}

exports.handler = async (event) => {
  console.log('Début de la fonction handler, méthode HTTP:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    console.error('Méthode non autorisée:', event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Traitement de la requête:', event.body);
    const body = JSON.parse(event.body);
    const redirectURL = `${process.env.URLL}/oauth`;
    console.log('URL de redirection:', redirectURL);
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);
    console.log('Client OAuth2 initialisé');
    let userData;

    if (body.code) {
      console.log('Traitement avec le code d\'authentification');
      const code = decodeURIComponent(body.code);
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      userData = await getUserData(tokens.access_token);
    } else if (body.idToken) {
      console.log('Traitement avec le ID Token');
      userData = await verifyIdToken(body.idToken);
    } else {
      console.error('Ni code ni ID Token fourni');
      return { statusCode: 400, body: 'Code or ID Token is required' };
    }

    const { email, name } = userData;
    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;
    console.log('Exécution de la requête SQL');
    await conn.execute(insertQuery, [email, name, body.code || body.idToken]);
    console.log('Utilisateur inséré/mis à jour dans la base de données');

    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData }),
    };
  } catch (err) {
    console.error('Erreur lors du traitement de l\'authentification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
