const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      console.log('Méthode HTTP non autorisée:', event.httpMethod);
      return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }) };
    }

    const userUuid = event.queryStringParameters?.userUuid?.trim();
    console.log('userUuid:', userUuid);

    if (!userUuid) {
      console.log('userUuid manquant dans les paramètres de la requête');
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis.' }) };
    }

    if (event.httpMethod === 'GET') {
      console.log('Traitement d\'une requête GET');
      const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';

      // Exécutez la requête et attendez les résultats
      const [results] = await conn.execute(selectQuery, [userUuid]);
      console.log(results);
      // Vérifiez si des résultats ont été trouvés
      if (!results.length) {
        console.log(`Aucun avantage trouvé pour l'UUID: ${userUuid}`);
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Aucun avantage trouvé.' }) };
      }

      // Extrait les avantages et les divise en tableau
      const avantages = results[0].avantages_fidelite.split('; ');
      console.log('Avantages récupérés:', avantages);
      return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
    } if (event.httpMethod === 'POST') {
      console.log('Traitement d\'une requête POST');
      const { avantages } = JSON.parse(event.body);
      const avantagesString = avantages.join('; ');
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';

      await conn.execute(updateQuery, [avantagesString, userUuid]);
      console.log('Avantages mis à jour pour l\'utilisateur:', userUuid);
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Avantages mis à jour avec succès.' }) };
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
