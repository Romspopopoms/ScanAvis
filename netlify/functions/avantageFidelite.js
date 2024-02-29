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
      console.log(`Exécution de la requête: ${selectQuery} avec uuid = ${userUuid}`);
      const results = await conn.execute(selectQuery, [userUuid]);
      console.log('Résultats de la requête:', results);

      if (!Array.isArray(results) || results.length === 0 || !Array.isArray(results[0]) || results[0].length === 0) {
        console.log('Utilisateur non trouvé ou aucun avantage pour le uuid:', userUuid);
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé ou aucun avantage disponible.' }) };
      }

      const rows = results[0];
      const avantages = rows[0]?.avantages_fidelite ? rows[0].avantages_fidelite.split('; ') : [];
      console.log('Avantages récupérés:', avantages);
      return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
    } if (event.httpMethod === 'POST') {
      console.log('Traitement d\'une requête POST');
      const { avantages } = JSON.parse(event.body);
      const avantagesString = avantages.join('; ');
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      try {
        await conn.execute(updateQuery, [avantagesString, userUuid]);
        console.log('Avantages mis à jour pour l\'utilisateur:', userUuid);
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Avantages mis à jour avec succès.' }) };
      } catch (updateError) {
        console.error('Erreur lors de la mise à jour des avantages:', updateError);
        return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur lors de la mise à jour des avantages: ${updateError.message}` }) };
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
