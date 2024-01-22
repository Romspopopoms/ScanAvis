const { OAuth2Client } = require('google-auth-library');

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const redirectURL = `${process.env.URL}/oauth`;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL,
    );

    // Assurez-vous que le scope inclut toutes les données nécessaires
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email', // Ajout du scope pour l'email
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
    body: `Method ${event.httpMethod} Not Allowed`,
  };
};
