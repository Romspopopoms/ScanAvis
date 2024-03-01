const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = {
    'Content-Type': 'application/json',
  };

  let userUuid; // Déclaration unique de userUuid au début

  try {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      console.log('Méthode HTTP non autorisée:', event.httpMethod);
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }),
      };
    }

    // Traitement des requêtes GET
    if (event.httpMethod === 'GET') {
      userUuid = event.queryStringParameters?.userUuid?.trim(); // Utilisation directe de userUuid
      if (!userUuid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Le userUuid est requis.' }),
        };
      }

      const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const result = await conn.execute(selectQuery, [userUuid]);

      if (!result || result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Aucun avantage fidélité trouvé.' }),
        };
      }

      const avantages = result[0].avantages_fidelite ? result[0].avantages_fidelite.split(';') : [];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ avantages }),
      };

    // Traitement des requêtes POST pour mettre à jour les avantages
    } if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      userUuid = body.userUuid; // Réassignation de userUuid sans re-déclaration

      if (!userUuid || !body.avantages || !Array.isArray(body.avantages)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Données manquantes ou format incorrect.' }),
        };
      }

      const avantagesString = body.avantages.join(';');
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      await conn.execute(updateQuery, [avantagesString, userUuid]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Avantages mis à jour avec succès.' }),
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
