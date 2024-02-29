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
      console.log(`Exécution de la requête avec UUID: ${userUuid}`);

      // La structure attendue de results était incorrecte dans votre code original
      const results = await conn.execute(selectQuery, [userUuid]);
      console.log(results);

      if (!results || results.length === 0) {
        console.log('Aucun résultat trouvé ou structure des résultats inattendue');
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Aucun avantage trouvé.' }) };
      }

      // Correction ici: accès direct aux rows retournés par la requête
      const rows = results;
      console.log('Première ligne des résultats:', rows[0]);

      const avantages = rows[0].avantages_fidelite ? rows[0].avantages_fidelite.split('; ') : [];
      console.log('Avantages récupérés:', avantages);
      return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
    } if (event.httpMethod === 'POST') {
      console.log('Traitement d\'une requête POST');
      const { avantages } = JSON.parse(event.body);
      console.log('Avantages reçus dans la requête:', avantages);

      const avantagesString = avantages.join('; ');
      console.log('Chaine des avantages à enregistrer:', avantagesString);

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
