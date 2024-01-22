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

  // Nettoyer le paymentIntentId pour enlever les espaces blancs et les caractères d'échappement
  const paymentIntentId = event.queryStringParameters?.paymentIntentId.replace(/\s/g, '');

  console.log('paymentIntentId nettoyé:', paymentIntentId);

  if (!paymentIntentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'L\'ID de l\'intention de paiement est requis et ne peut pas être vide' }),
    };
  }

  try {
    const query = 'SELECT * FROM Transactions WHERE paymentIntentId = ?';
    const [rows] = await conn.execute(query, [paymentIntentId]);

    if (!rows.length) {
      console.log(`Transaction non trouvée pour paymentIntentId: ${paymentIntentId}`);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Transaction non trouvée' }),
      };
    }

    // Assurez-vous que les données de l'article peuvent être analysées correctement
    let items;
    try {
      items = JSON.parse(rows[0].items || '[]');
    } catch (e) {
      console.error('Erreur lors de l\'analyse des articles:', e);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Erreur lors de l\'analyse des données de l\'article' }),
      };
    }

    const transaction = {
      transactionId: rows[0].transactionId,
      items,
      totalAmount: rows[0].totalAmount,
      paymentIntentId: rows[0].paymentIntentId,
      createdAt: rows[0].createdAt,
      // Assurez-vous de ne pas renvoyer le clientSecret
    };

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
      body: JSON.stringify({ error: `Une erreur est survenue lors de la récupération de la transaction: ${error.message}` }),
    };
  }
};
