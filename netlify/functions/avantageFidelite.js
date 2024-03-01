const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = {
    'Content-Type': 'application/json',
  };

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
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      if (!userUuid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Le userUuid est requis.' }),
        };
      }

      const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const result = await conn.execute(selectQuery, [userUuid]);

      // Si aucune donnée n'est trouvée, renvoie une liste vide sans générer d'erreur
      if (!result[0] || result[0].length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ avantages: Array(10).fill('') }),
        };
      }

      const avantages = result[0][0].avantages_fidelite ? result[0][0].avantages_fidelite.split(';') : Array(10).fill('');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ avantages }),
      };
    } if (event.httpMethod === 'POST') { // Traitement des requêtes POST pour mettre à jour les avantages
      const body = JSON.parse(event.body);
      const { userUuid } = body;

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
