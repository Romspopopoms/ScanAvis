const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db'); // Importez la connexion à la base de données à partir du fichier db.js

async function getUserData(accessToken) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  const data = await response.json();
  console.log('data', data);
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code } = event.queryStringParameters;
  console.log(code);

  try {
    const redirectURL = process.env.URLL ? `${process.env.URLL}/oauth` : 'Votre URL de redirection manquante';

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL,
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    console.info('Tokens acquired.');

    const userData = await getUserData(tokens.access_token);

    const { email, name } = userData;
    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;

    // Ajustement de la requête pour utiliser async/await
    const result = await conn.execute(insertQuery, [email, name, tokens.access_token, name, tokens.access_token]);
    console.log('User data inserted/updated successfully', result);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData }),
    };
  } catch (err) {
    console.error('Error logging in with OAuth2 user or inserting data', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
