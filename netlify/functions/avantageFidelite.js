const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  try {
    // Gestion des requêtes GET pour récupérer les avantages
    if (event.httpMethod === 'GET') {
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      console.log('userUuid nettoyé:', userUuid);

      if (!userUuid) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide.' }),
        };
      }

      const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const [rows] = await conn.execute(query, [userUuid]); // Correction pour utiliser conn.execute

      if (rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Utilisateur non trouvé.' }),
        };
      }

      const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avantages),
      };
    }

    // Gestion des requêtes POST pour sauvegarder les avantages
    if (event.httpMethod === 'POST') {
      const { userUuid, avantages } = JSON.parse(event.body);

      if (!userUuid || !avantages) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }),
        };
      }

      const avantagesJson = JSON.stringify(avantages);
      const query = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      await conn.execute(query, [avantagesJson, userUuid]); // Correction pour utiliser conn.execute

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }),
      };
    }

    // Si la méthode HTTP n'est ni GET ni POST

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée.' }),
    };
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }),
    };
  }
};
