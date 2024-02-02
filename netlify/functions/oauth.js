const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const verifyTokenHandler = require('./verifyToken').handler; // Vérifiez que le chemin d'accès est correct

// Fonction pour récupérer les données utilisateur à partir du token d'accès
async function getUserData(accessToken) {
  console.log('Récupération des données utilisateur avec le token d\'accès:', accessToken);
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    console.error(`Erreur HTTP! status: ${response.status}`);
    throw new Error(`Erreur HTTP! status: ${response.status}`);
  }
  return response.json();
}

exports.handler = async (event) => {
  console.log('Événement reçu:', event);
  // Vérifie si la méthode HTTP est POST
  if (event.httpMethod !== 'POST') {
    console.error('Tentative avec une méthode non-POST');
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  try {
    console.log('Analyse du corps de la requête');
    const body = JSON.parse(event.body);
    console.log('Corps de la requête analysé:', body);

    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    if (!body.code && !body.idToken) {
      console.error('Aucun code ou ID token fourni');
      return { statusCode: 400, body: JSON.stringify({ error: 'Un code ou un ID Token est requis' }) };
    }

    if (body.code) {
      console.log('Échange du code pour des tokens');
      const { tokens } = await oAuth2Client.getToken({
        code: decodeURIComponent(body.code),
        redirect_uri: `${process.env.URL}/oauth`, // Assurez-vous que cette URL de redirection est correcte
      });
      oAuth2Client.setCredentials(tokens);
      console.log('Tokens reçus:', tokens);

      // Simuler l'objet événement pour verifyToken
      const fakeEvent = {
        body: JSON.stringify({ userData: await getUserData(tokens.access_token), accessToken: tokens.access_token }),
        httpMethod: 'POST',
      };

      // Appeler verifyToken comme si c'était une fonction Netlify
      const verificationResult = await verifyTokenHandler(fakeEvent);
      console.log('Résultat de la vérification:', verificationResult);
      return verificationResult;
    } if (body.idToken) {
      console.log('Traitement de l\'ID Token');
      const fakeEvent = {
        body: JSON.stringify({ idToken: body.idToken }),
        httpMethod: 'POST',
      };

      const verificationResult = await verifyTokenHandler(fakeEvent);
      console.log('Résultat de la vérification:', verificationResult);
      return verificationResult;
    }
  } catch (err) {
    console.error('Erreur pendant l\'authentification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Échec de l\'authentification', details: err.message }),
    };
  }
};
