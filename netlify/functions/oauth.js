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
  console.log('Données utilisateur récupérées pour: ', data.email); // Ne loggez que l'email pour éviter d'exposer des informations sensibles
  return data;
}

async function verifyIdToken(idToken) {
  console.log('Vérification du ID Token');
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log('Token vérifié pour: ', payload.email); // Ne loggez que l'email
  return payload;
}

exports.handler = async (event) => {
  console.log('Début de la fonction handler, méthode HTTP:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    console.error('Méthode non autorisée:', event.httpMethod);
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    console.log('Traitement de la requête');
    const body = JSON.parse(event.body);
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    console.log('Client OAuth2 initialisé');
    let userData;

    if (body.code) {
      console.log('Traitement avec le code d\'authentification');
      const { tokens } = await oAuth2Client.getToken(decodeURIComponent(body.code));
      oAuth2Client.setCredentials(tokens);
      userData = await getUserData(tokens.access_token);
    } else if (body.idToken) {
      console.log('Traitement avec le ID Token');
      userData = await verifyIdToken(body.idToken);
    } else {
      console.error('Ni code ni ID Token fourni');
      return { statusCode: 400, body: JSON.stringify({ error: 'Code or ID Token is required' }) };
    }

    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;
    console.log('Exécution de la requête SQL pour: ', userData.email); // Ne loggez que l'email
    await conn.execute(insertQuery, [userData.email, userData.name, body.code || body.idToken]);
    console.log('Utilisateur inséré/mis à jour dans la base de données pour: ', userData.email); // Ne loggez que l'email

    return {
      statusCode: 200,
      body: JSON.stringify({ user: { email: userData.email, name: userData.name } }), // Ne renvoyez pas le access_token au client
    };
  } catch (err) {
    console.error('Erreur lors du traitement de l\'authentification:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed', details: err.message }),
    };
  }
};
