const { conn } = require('../../utils/db'); // Assurez-vous que le chemin d'accès est correct

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
    // Définissez la variable query avec votre requête SQL
    const query = 'SELECT entreprise, google_business FROM users WHERE uuid = ?';

    const result = await conn.execute(query, [userUuid]);
    console.log('Result from conn.execute:', result);

    if (!result[0] || result[0].length === 0) {
      console.log(`Aucun détail trouvé pour userUuid: ${userUuid}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Détails de l\'utilisateur non trouvés' }),
      };
    }

    // Accéder directement aux résultats
    const { rows } = result;
    const userDetails = rows[0];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entreprise: userDetails.entreprise,
        googleBusiness: userDetails.google_business,
      }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération des détails de l'utilisateur: ${error.message}` }),
    };
  }
};
