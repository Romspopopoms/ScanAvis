const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin est correct et que `conn` est bien configuré

exports.handler = async (event) => {
  console.log('Début de la fonction checkUserPage.');

  try {
    // Vérification de la méthode HTTP
    if (event.httpMethod !== 'GET') {
      console.error('Méthode HTTP non autorisée:', event.httpMethod);
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    // Récupération de l'ID utilisateur depuis les paramètres de requête
    const { userId } = event.queryStringParameters;
    console.log('userID reçu:', userId);

    if (!userId) {
      console.error('ID utilisateur non fourni.');
      return { statusCode: 400, body: JSON.stringify({ error: 'User ID not provided' }) };
    }

    const sqlQuery = 'SELECT pageUrl FROM UserPages WHERE user_uuid = ?';
    console.log('Exécution de la requête SQL pour rechercher la page de l\'utilisateur:', sqlQuery, 'avec userId:', userId);

    const result = await conn.execute(sqlQuery, [userId]);
    const { rows } = result;
    console.log('Résultat de la requête SQL:', rows);

    if (rows.length === 0) {
      console.log('Aucune page correspondante trouvée pour cet utilisateur.');
      return { statusCode: 200, body: JSON.stringify({ hasPage: false }) };
    }
    console.log('Page utilisateur trouvée avec URL:', rows[0].pageUrl);
    return {
      statusCode: 200,
      body: JSON.stringify({
        hasPage: true,
        pageUrl: rows[0].pageUrl,
      }),
    };
  } catch (error) {
    console.error('Erreur lors de la fonction checkUserPage:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
