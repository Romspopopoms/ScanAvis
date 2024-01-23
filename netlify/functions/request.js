const { OAuth2Client } = require('google-auth-library');

exports.handler = async (event) => {
  console.log('Received event:', event);

  if (event.httpMethod === 'GET') {
    console.log('Processing GET request');

    // Utilisez des variables pour stocker vos configurations
    const redirectURL = `${process.env.URLL}/oauth`;
    const clientID = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    console.log('Redirect URL:', redirectURL);
    console.log('Client ID:', clientID);

    const oAuth2Client = new OAuth2Client(clientID, clientSecret, redirectURL);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
      prompt: 'consent',
    });

    console.log('Generated authorization URL:', authorizeUrl);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: authorizeUrl }),
    };
  }
  console.error('Non-GET method attempted:', event.httpMethod);
  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: `Method ${event.httpMethod} Not Allowed` }),
  };
};
