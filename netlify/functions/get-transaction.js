const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // Vérifier si la méthode HTTP est GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  // Nettoyer et valider le paymentIntentId
  const paymentIntentId = event.queryStringParameters?.paymentIntentId?.trim();
  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'L\'ID de l\'intention de paiement est requis et ne peut pas être vide' }),
    };
  }

  try {
    // Exécuter la requête SQL
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const result = await conn.execute(query, [paymentIntentId]);
    console.log('Résultat de la requête:', result);

    // Vérifier que le résultat contient les lignes
    if (!result || typeof result !== 'object' || !Array.isArray(result.rows) || result.rows.length === 0) {
      console.log(`Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    const transaction = result.rows[0];

    // Construire l'objet transaction
    const response = {
      transactionId: transaction.transactionId,
      items: JSON.parse(transaction.items || '[]'),
      totalAmount: transaction.totalAmount,
      paymentIntentId: transaction.paymentIntentId,
      createdAt: transaction.createdAt,
      // Exclure les données sensibles comme clientSecret
    };

    // Retourner les détails de la transaction
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: response }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération de la transaction: ${error.message}` }),
    };
  }
};
