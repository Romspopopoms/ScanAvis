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
    const query = 'SELECT email, entreprise, google_business FROM users WHERE uuid = ?';
    // Correction: Destructuration correcte du résultat pour obtenir les lignes
    const { rows } = await conn.execute(query, [userUuid]);
    console.log('Result from conn.execute:', rows);

    if (rows.length === 0) {
      console.log(`Aucun détail trouvé pour userUuid: ${userUuid}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Détails de l\'utilisateur non trouvés' }),
      };
    }

    const userDetails = rows[0];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userDetails.email, // Ajout de l'email à la réponse
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
