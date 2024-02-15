const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // Gestion des requêtes GET pour récupérer les avantages
  if (event.httpMethod === 'GET') {
    const userUuid = event.queryStringParameters?.userUuid?.trim();
    console.log('userUuid nettoyé:', userUuid);

    if (!userUuid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide' }),
      };
    }

    try {
      const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const [rows] = await conn.query(query, [userUuid]);
      console.log('Query results:', rows);

      if (!rows || rows.length === 0) {
        console.log(`Aucun utilisateur trouvé pour userUuid: ${userUuid}`);
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Utilisateur non trouvé' }),
        };
      }

      const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avantages }),
      };
    } catch (error) {
      console.error('Erreur de la base de données:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération des avantages de fidélité: ${error.message}` }),
      };
    }
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

    try {
      const avantagesJson = JSON.stringify(avantages);
      const query = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      await conn.query(query, [avantagesJson, userUuid]);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }),
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des avantages de fidélité:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Erreur lors de la mise à jour des avantages de fidélité: ${error.message}` }),
      };
    }
  }

  // Si la méthode HTTP n'est ni GET ni POST
  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Méthode non autorisée' }),
  };
};
