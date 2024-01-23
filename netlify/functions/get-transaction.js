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

  // Supposons que l'ID de l'utilisateur soit transmis en tant que paramètre de requête
  const userId = event.queryStringParameters?.userId?.trim();
  console.log('userId nettoyé:', userId);

  if (!userId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'L\'ID de l\'utilisateur est requis et ne peut pas être vide' }),
    };
  }

  try {
    // Modifier la requête pour récupérer les transactions basées sur l'ID de l'utilisateur
    const query = 'SELECT * FROM Transactions WHERE user_id = ?';
    const [transactions] = await conn.execute(query, [userId]);
    console.log('Résultat de la requête:', transactions);

    if (transactions.length === 0) {
      console.log(`Transactions non trouvées pour userId: ${userId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transactions non trouvées' }),
      };
    }

    // Créer une réponse contenant toutes les transactions de l'utilisateur
    const response = transactions.map((transaction) => ({
      transactionId: transaction.transactionId,
      items: JSON.parse(transaction.items || '[]'),
      totalAmount: transaction.totalAmount,
      paymentIntentId: transaction.paymentIntentId,
      createdAt: transaction.createdAt,
      // Exclure les données sensibles comme clientSecret
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: response }),
    };
  } catch (error) {
    console.error('Erreur de la base de données:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération des transactions: ${error.message}` }),
    };
  }
};
