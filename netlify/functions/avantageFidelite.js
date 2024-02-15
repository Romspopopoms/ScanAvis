const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (event.httpMethod === 'GET') {
      const userUuid = event.queryStringParameters?.userUuid?.trim();
      if (!userUuid) {
        console.error('Le userUuid est requis et ne peut pas être vide.');
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid est requis et ne peut pas être vide.' }) };
      }

      const query = 'SELECT avantages_fidelite FROM users WHERE uuid = ?';
      const rows = await conn.execute(query, [userUuid]);

      if (rows.length === 0) {
        console.error('Utilisateur non trouvé.');
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Utilisateur non trouvé.' }) };
      }

      const avantages = JSON.parse(rows[0].avantages_fidelite || '[]');
      return { statusCode: 200, headers, body: JSON.stringify(avantages) };
    } if (event.httpMethod === 'POST') {
      const { userUuid, avantages } = JSON.parse(event.body);

      if (!userUuid || !avantages) {
        console.error('Le userUuid et les avantages sont requis.');
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }) };
      }

      const avantagesJson = JSON.stringify(avantages);
      const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
      const { affectedRows } = await conn.execute(updateQuery, [avantagesJson, userUuid]);

      if (affectedRows === 0) {
        console.error('Mise à jour échouée.');
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Mise à jour échouée, utilisateur non trouvé.' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode non autorisée.' }) };
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
