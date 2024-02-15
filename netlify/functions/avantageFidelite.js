const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // Définition des en-têtes de réponse
  const headers = { 'Content-Type': 'application/json' };

  // Vérifie si la méthode HTTP est supportée
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Méthode non autorisée.' }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      if (!userUuid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide.' }),
        };
      }

      const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const [rows] = await conn.execute(query, [userUuid]);

      if (rows.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Utilisateur non trouvé.' }),
        };
      }

      const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ avantages }),
      };
    } if (event.httpMethod === 'POST') {
      const { userUuid, avantages } = JSON.parse(event.body);

      if (!userUuid || !avantages) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }),
        };
      }

      const avantagesJson = JSON.stringify(avantages);
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      await conn.execute(updateQuery, [avantagesJson, userUuid]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }),
      };
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }),
    };
  }
};
