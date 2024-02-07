const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin est correct

exports.handler = async (event) => {
  console.log('Début de la fonction.');

  try {
    // Vérification de la méthode HTTP
    if (event.httpMethod !== 'POST') {
      console.error('Méthode HTTP non autorisée:', event.httpMethod);
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    // Parsing du corps de la requête
    const { idToken, userData, accessToken, entreprise, googleBusiness } = JSON.parse(event.body);
    console.log('idToken:', idToken, 'userData:', userData, 'accessToken:', accessToken, 'entreprise:', entreprise, 'googleBusiness:', googleBusiness);

    if (!idToken && (!userData || !accessToken)) {
      console.error('Données nécessaires non fournies dans le corps de la requête.');
      return { statusCode: 400, body: JSON.stringify({ error: 'No ID token or user data with access token provided' }) };
    }

    const client = new OAuth2Client(process.env.CLIENT_ID);
    let payload;

    if (idToken) {
      console.log('Vérification de l\'ID token.');
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.CLIENT_ID });
      payload = ticket.getPayload();
      console.log('ID Token vérifié avec succès:', payload);
    } else {
      console.log('Traitement des données utilisateur fournies avec access token.');
      payload = { ...userData, access_token: accessToken };
    }

    const { email } = payload;
    const userQuery = 'SELECT uuid FROM users WHERE email = ?';
    console.log('Exécution de la requête SQL pour rechercher l\'utilisateur:', userQuery, 'avec email:', email);

    const userResult = await conn.execute(userQuery, [email]);
    const userRows = userResult[0];
    console.log('Résultat de la requête SQL:', userRows);

    let userUuid;

    if (userRows.length === 0) {
      console.log('Aucun utilisateur correspondant trouvé, création d\'un nouveau.');
      userUuid = uuidv4();
      const insertUserSql = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      const userParams = [userUuid, email, payload.name, accessToken];
      console.log('Exécution de la requête SQL pour insérer un nouvel utilisateur:', insertUserSql, 'avec paramètres:', userParams);

      await conn.execute(insertUserSql, userParams);
      console.log('Nouvel utilisateur créé avec UUID:', userUuid);
    } else {
      userUuid = userRows[0].uuid;
      console.log('Utilisateur existant trouvé avec UUID:', userUuid);
    }

    // Mise à jour ou insertion des informations d'entreprise et Google Business
    const businessQuery = 'INSERT INTO users (user_uuid, entreprise, google_business) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE entreprise = ?, google_business = ?';
    const businessParams = [userUuid, entreprise, googleBusiness, entreprise, googleBusiness];
    console.log('Exécution de la requête SQL pour insérer ou mettre à jour les informations d\'entreprise et Google Business:', businessQuery, 'avec paramètres:', businessParams);

    await conn.execute(businessQuery, businessParams);
    console.log('Informations d\'entreprise et Google Business mises à jour pour l\'utilisateur UUID:', userUuid);

    payload.entreprise = entreprise;
    payload.googleBusiness = googleBusiness;

    console.log('Préparation de la réponse avec les données de l\'utilisateur:', payload);
    return {
      statusCode: 200,
      body: JSON.stringify({ user: payload }),
    };
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la fonction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
