const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  console.log('Événement reçu:', JSON.stringify(event));

  // Vérifiez si la méthode HTTP est GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Méthode non autorisée' }),
    };
  }

  // Nettoyez et validez le paymentIntentId
  const paymentIntentId = event.queryStringParameters?.paymentIntentId?.trim();
  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message:
          "L'ID de l'intention de paiement est requis et ne peut pas être vide",
      }),
    };
  }

  try {
    // Exécutez la requête SQL
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const result = await conn.execute(query, [paymentIntentId]);

    // Vérifiez le format du résultat et log pour le débogage
    console.log('Résultat de la requête:', result);
    if (!result || !Array.isArray(result) || result.length < 1) {
      console.error(
        'Le format du résultat de la requête est invalide:',
        result,
      );
      throw new Error('Le format du résultat de la requête est invalide.');
    }

    const [rows] = result;

    // Vérifiez si des transactions sont trouvées
    if (rows.length === 0) {
      console.log(
        `Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`,
      );
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    // Construisez l'objet transaction
    const transaction = {
      transactionId: rows[0].transactionId,
      items: JSON.parse(rows[0].items || '[]'),
      totalAmount: rows[0].totalAmount,
      paymentIntentId: rows[0].paymentIntentId,
      createdAt: rows[0].createdAt,
      // Excluez les données sensibles comme clientSecret
    };

    // Retournez les détails de la transaction
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: `Une erreur est survenue lors de la récupération de la transaction: ${error.message}`,
      }),
    };
  }
};
