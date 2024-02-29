const { conn } = require('../../utils/db');

// Définition préalable des fonctions pour éviter l'erreur ESLint no-use-before-define
async function handleGetRequest(userUuid, headers) {
  console.log('Traitement d\'une requête GET');
  const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';

  const results = await conn.query(selectQuery, [userUuid]);
  console.log('Résultats de la requête:', results);

  if (results.length === 0 || !results[0].avantages_fidelite) {
    console.log('Utilisateur non trouvé ou aucun avantage pour le uuid:', userUuid);
    return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé ou aucun avantage disponible.' }) };
  }

  const avantages = results[0].avantages_fidelite.split('; ');
  console.log('Avantages récupérés:', avantages);
  return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
}

async function handlePostRequest(userUuid, body, headers) {
  console.log('Traitement d\'une requête POST');
  const { avantages } = JSON.parse(body);
  const avantagesString = avantages.join('; ');

  const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
  await conn.query(updateQuery, [avantagesString, userUuid]);
  console.log('Avantages mis à jour pour l\'utilisateur:', userUuid);

  return { statusCode: 200, headers, body: JSON.stringify({ message: 'Avantages mis à jour avec succès.' }) };
}

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    console.log('Méthode HTTP non autorisée:', event.httpMethod);
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }) };
  }

  const userUuid = event.queryStringParameters?.userUuid?.trim();
  if (!userUuid) {
    console.log('userUuid manquant dans les paramètres de la requête');
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis.' }) };
  }
  console.log('userUuid:', userUuid);

  try {
    if (event.httpMethod === 'GET') {
      return await handleGetRequest(userUuid, headers);
    } if (event.httpMethod === 'POST') {
      return await handlePostRequest(userUuid, event.body, headers);
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
