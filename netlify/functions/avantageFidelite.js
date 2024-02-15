const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

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
    // Assurez-vous que les noms des colonnes correspondent à ceux de votre table 'user'
    const query = 'SELECT avantages_fidelite FROM user WHERE uuid = ?';
    const result = await conn.execute(query, [userUuid]);
    console.log('Result from conn.execute:', result);
    const { rows } = result;
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Aucun utilisateur trouvé pour userUuid: ${userUuid}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Utilisateur non trouvé' }),
      };
    }

    // Supposons que `avantages_fidelite` est stocké sous forme de chaîne JSON dans la table
    const avantages = JSON.parse(rows[0].avantages_fidelite);

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
};
