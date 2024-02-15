const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
      return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }) };
    }

    const userUuid = event.queryStringParameters?.userUuid?.trim();
    if (!userUuid) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis.' }) };
    }

    if (event.httpMethod === 'GET') {
      const selectQuery = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const [rows] = await conn.execute(selectQuery, [userUuid]);

      if (rows.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé.' }) };
      }
      const avantages = rows[0].avantages_fidelite ? JSON.parse(rows[0].avantages_fidelite) : [];
      return { statusCode: 200, headers, body: JSON.stringify(avantages) };
    } if (event.httpMethod === 'POST') {
      const { avantages } = JSON.parse(event.body);
      const avantagesJson = JSON.stringify(avantages);

      const findUserQuery = 'SELECT uuid FROM users WHERE uuid = ?';
      const userRows = await conn.execute(findUserQuery, [userUuid]);

      if (userRows.length === 0) {
        // Insertion d'un nouvel utilisateur si non trouvé
        const insertQuery = 'INSERT INTO users (uuid, avantages_fidelite) VALUES (?, ?)';
        await conn.execute(insertQuery, [userUuid, avantagesJson]);
        console.log('Nouvel utilisateur avec avantages inséré.');
      } else {
        // Mise à jour des avantages si l'utilisateur existe déjà
        const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
        await conn.execute(updateQuery, [avantagesJson, userUuid]);
        console.log('Avantages mis à jour pour l\'utilisateur.');
      }

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Les avantages ont été traités avec succès.' }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode HTTP non autorisée.' }) };
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
