const fetch = require('node-fetch');

exports.envoyerMessage = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { titre, message } = JSON.parse(event.body);
    if (!titre || !message) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
    }

    const webhookUrl = 'VOTRE_WEBHOOK_URL'; // Remplacez par l'URL de votre webhook
    const payload = { titre, message };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook call failed: ${webhookResponse.statusText}`);
    }

    const responseData = await webhookResponse.json(); // Supposons que la réponse est en JSON

    return { statusCode: 200, body: JSON.stringify({ message: 'Message successfully sent to webhook.', responseData }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error', error: error.message }) };
  }
};
