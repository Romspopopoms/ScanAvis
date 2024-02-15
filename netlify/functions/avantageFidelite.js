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
      const [rows] = await conn.execute(query, [userUuid]);

      // Si aucun utilisateur trouvé, on renvoie une réponse vide (ou une logique par défaut)
      if (rows.length === 0) {
        console.log('Utilisateur non trouvé, prêt à être créé après soumission.');
        return { statusCode: 200, headers, body: JSON.stringify({ avantages: [] }) }; // Retourne une structure vide ou par défaut
      }

      const avantages = rows[0].avantages_fidelite ? JSON.parse(rows[0].avantages_fidelite) : [];
      return { statusCode: 200, headers, body: JSON.stringify({ avantages }) };
    } if (event.httpMethod === 'POST') {
      const { userUuid, avantages } = JSON.parse(event.body);

      if (!userUuid || !avantages) {
        console.error('Le userUuid et les avantages sont requis.');
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Le userUuid et les avantages sont requis.' }) };
      }

      const avantagesJson = JSON.stringify(avantages);
      const findUserQuery = 'SELECT uuid FROM users WHERE uuid = ?';
      const [userRows] = await conn.execute(findUserQuery, [userUuid]);

      if (userRows.length === 0) {
        // Si l'utilisateur n'existe pas, insérez un nouvel utilisateur avec les avantages_fidelite
        const insertQuery = 'INSERT INTO users (uuid, avantages_fidelite) VALUES (?, ?)';
        await conn.execute(insertQuery, [userUuid, avantagesJson]);
        console.log('Nouvel utilisateur créé avec avantages.');
      } else {
        // Si l'utilisateur existe, mettez à jour les avantages_fidelite
        const updateQuery = 'UPDATE users SET avantages_fidelite = ? WHERE uuid = ?';
        await conn.execute(updateQuery, [avantagesJson, userUuid]);
        console.log('Avantages mis à jour pour l\'utilisateur existant.');
      }

      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Les avantages de fidélité ont été mis à jour avec succès.' }) };
    }
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Méthode non autorisée.' }) };
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: `Erreur serveur: ${error.message}` }) };
  }
};
