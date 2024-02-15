const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = { 'Content-Type': 'application/json' };

  try {
    // Vérification de la méthode HTTP utilisée dans la requête
    if (event.httpMethod === 'GET') {
      // Extraction et validation du userUuid depuis les paramètres de la requête
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      if (!userUuid) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide.' }) };
      }

      // Exécution de la requête SQL pour récupérer les avantages
      const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const [rows] = await conn.execute(query, [userUuid]);

      if (rows.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé.' }) };
      }

      // Envoi de la réponse avec les avantages récupérés
      const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
      return { statusCode: 200, headers, body: JSON.stringify(avantages) };
    } if (event.httpMethod === 'POST') {
      // Parsing et validation du corps de la requête pour un POST
      const { userUuid, avantages } = JSON.parse(event.body);
      if (!userUuid || !avantages) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }) };
      }

      // Mise à jour des avantages dans la base de données
      const avantagesJson = JSON.stringify(avantages);
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      await conn.execute(updateQuery, [avantagesJson, userUuid]);

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }) };
    }
    // Réponse pour les méthodes HTTP non gérées
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode non autorisée.' }) };
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
