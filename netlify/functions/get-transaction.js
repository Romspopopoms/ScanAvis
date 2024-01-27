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

  const paymentIntentId = event.queryStringParameters?.paymentIntentId?.trim();
  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Le paymentIntentId est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const result = await conn.execute(query, [paymentIntentId]);
    console.log('Result from conn.execute:', result);
    const rows = result[0]; // Assurez-vous que c'est la structure correcte pour les résultats de votre base de données
    console.log('Query results:', rows);

    if (!rows || rows.length === 0) {
      console.log(`Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    const transaction = rows[0]; // En supposant que paymentIntentId est unique et renvoie une seule transaction
    const response = {
      transactionId: transaction.transactionId,
      items: JSON.parse(transaction.items || '[]'),
      totalAmount: transaction.totalAmount,
      paymentIntentId: transaction.paymentIntentId,
      createdAt: transaction.createdAt,
      // Exclure les données sensibles comme clientSecret
    };

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
