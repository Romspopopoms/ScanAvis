const { OAuth2Client } = require('google-auth-library');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') { // Changez ici pour autoriser GET
    const redirectURL = `${process.env.URL}/oauth`;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL,
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ],
      prompt: 'consent',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: authorizeUrl }),
    };
  }

  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json', // Assurez-vous que le content-type est application/json
    },
    body: JSON.stringify({ error: `Method ${event.httpMethod} Not Allowed` }), // Retourner un JSON valide
  };
};
