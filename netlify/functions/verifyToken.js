const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin est correct et que `conn` est bien configuré

exports.handler = async (event) => {
  console.log('Début de la fonction verifyToken.');

  try {
    // Vérification de la méthode HTTP
    if (event.httpMethod !== 'POST') {
      console.error('Méthode HTTP non autorisée:', event.httpMethod);
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    // Parsing du corps de la requête
    const { idToken, userData, accessToken } = JSON.parse(event.body);
    console.log('idToken:', idToken, 'userData:', userData, 'accessToken:', accessToken);

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

    // Logique de gestion des utilisateurs (extraction, insertion, mise à jour)
    const { email } = payload;
    const sqlQuery = 'SELECT uuid FROM users WHERE email = ?';
    console.log('Exécution de la requête SQL pour rechercher l\'utilisateur:', sqlQuery, 'avec email:', email);

    const result = await conn.execute(sqlQuery, [email]);
    const { rows } = result;
    console.log('Résultat de la requête SQL:', rows);

    if (rows.length === 0) {
      console.log('Aucun utilisateur correspondant trouvé, création d\'un nouveau.');
      const newUuid = uuidv4();
      const insertSql = 'INSERT INTO users (uuid, email, name, access_token) VALUES (?, ?, ?, ?)';
      const insertParams = [newUuid, email, payload.name, accessToken];
      console.log('Exécution de la requête SQL pour insérer un nouvel utilisateur:', insertSql, 'avec paramètres:', insertParams);

      await conn.execute(insertSql, insertParams);
      console.log('Nouvel utilisateur créé avec UUID:', newUuid);
      payload.uuid = newUuid;
    } else {
      console.log('Utilisateur existant trouvé avec UUID:', rows[0].uuid);
      payload.uuid = rows[0].uuid;
    }

    console.log('Préparation de la réponse avec les données de l\'utilisateur:', payload);
    return {
      statusCode: 200,
      body: JSON.stringify({ user: payload }),
    };
  } catch (error) {
    console.error('Erreur lors de la fonction verifyToken:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
