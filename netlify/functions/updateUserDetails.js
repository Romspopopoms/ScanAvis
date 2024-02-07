const { conn } = require('../../utils/db'); // Assurez-vous que le chemin d'accès est correct

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // La méthode devrait être POST car nous allons mettre à jour les informations
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  // Extraire les données du corps de la requête
  const { userUuid, entreprise, googleBusiness } = JSON.parse(event.body);
  console.log('Mise à jour des informations pour userUuid:', userUuid);

  if (!userUuid || !entreprise || !googleBusiness) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Les champs userUuid, entreprise et googleBusiness sont requis' }),
    };
  }

  try {
    // Mettre à jour les informations d'entreprise et Google Business pour l'utilisateur spécifié
    const query = 'UPDATE users SET entreprise = ?, google_business = ? WHERE uuid = ?';
    await conn.execute(query, [entreprise, googleBusiness, userUuid]);
    console.log('Informations mises à jour avec succès pour userUuid:', userUuid);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Mise à jour réussie' }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la mise à jour: ${error.message}` }),
    };
  }
};
