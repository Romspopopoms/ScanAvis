const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

async function getUserData(accessToken) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  const data = await response.json();
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let code;
  if (event.body) {
    const body = JSON.parse(event.body);
    code = body.code;
  }

  if (!code) {
    return { statusCode: 400, body: 'Code is required' };
  }

  try {
    const redirectURL = `${process.env.URLL}/oauth`;
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const userData = await getUserData(tokens.access_token);
    const { email, name } = userData;

    const insertQuery = `
      INSERT INTO users (email, name, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), access_token = VALUES(access_token)
    `;

    // Run the promisified query without assigning it to 'result'
    await conn.execute(insertQuery, [email, name, tokens.access_token]);
    return {
      statusCode: 200,
      body: JSON.stringify({ user: userData }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
