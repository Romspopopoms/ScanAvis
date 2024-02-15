const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // Définition des headers JSON pour toutes les réponses
  const headers = { 'Content-Type': 'application/json' };

  try {
    switch (event.httpMethod) {
      case 'GET': {
        // Crée un nouveau scope lexical pour les déclarations
        const userUuid = event.queryStringParameters?.userUuid?.trim();
        if (!userUuid) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide.' }) };
        }

        const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
        const [rows] = await conn.execute(query, [userUuid]);

        if (rows.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé.' }) };
        }

        const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
        return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
      }

      case 'POST': {
        // Crée un nouveau scope lexical pour les déclarations
        const { userUuid: uuidPost, avantages: avantagesPost } = JSON.parse(event.body);
        if (!uuidPost || !avantagesPost) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }) };
        }

        const avantagesJson = JSON.stringify(avantagesPost);
        const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
        await conn.execute(updateQuery, [avantagesJson, uuidPost]);

        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }) };
      }

      default:
        // Gère les méthodes non supportées
        return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode non autorisée.' }) };
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
