const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      console.log('Méthode HTTP non autorisée:', event.httpMethod);
      console.log('Traitement d\'une requête GET');

      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }),
      };
    }

    // Traitement des requêtes GET
    if (event.httpMethod === 'GET') {
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      console.log('userUuid extrait:', userUuid);

      if (!userUuid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Le userUuid est requis.' }),
        };
      }

      const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      console.log('Exécution de la requête SELECT:', selectQuery, userUuid);

      const result = await conn.execute(selectQuery, [userUuid]);
      console.log(`Résultats obtenus pour ${userUuid}:`, JSON.stringify(result));

      // Si aucune donnée n'est trouvée, renvoie une liste vide sans générer d'erreur
      if (!result[0] || result[0].length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ avantages: Array(10).fill('') }),
        };
      }

      const avantages = result[0][0].avantages_fidelite ? result[0][0].avantages_fidelite.split(';') : Array(10).fill('');
      // Supprimer les guillemets doubles au début et à la fin de la chaîne
      const avantagesSansGuillemets = avantages.map((avantage) => avantage.replace(/^"|"$/g, ''));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ avantages: avantagesSansGuillemets }),

      };
    } if (event.httpMethod === 'POST') {
      console.log('Traitement d\'une requête POST');

      const { userUuid, avantages } = JSON.parse(event.body);
      console.log('Données extraites du corps de la requête:', userUuid, avantages);

      if (!userUuid || !Array.isArray(avantages)) {
        console.log('Données manquantes ou format incorrect dans la requête POST');

        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Données manquantes ou format incorrect.' }) };
      }

      const avantagesString = avantages.join(';');
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      console.log('Exécution de la requête UPDATE:', updateQuery, avantagesString, userUuid);

      await conn.execute(updateQuery, [avantagesString, userUuid]);
      console.log('Avantages mis à jour avec succès pour userUuid:', userUuid);

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Avantages mis à jour avec succès.' }) };
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
