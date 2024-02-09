const fetch = require('node-fetch');
const { conn } = require('../../utils/db'); // Assurez-vous que ce chemin est correct

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.log('Request method not allowed');
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    console.log('Parsing request body');
    const { userUuid, entreprise, googleBusiness, email } = JSON.parse(event.body);
    if (!userUuid || !email || !entreprise || !googleBusiness) {
      console.log('Missing fields in the request');
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing fields' }) };
    }

    console.log(`Updating user information for UUID: ${userUuid}`);
    // Mise à jour des informations de l'utilisateur
    await conn.execute('UPDATE users SET email = ?, entreprise = ?, google_business = ? WHERE uuid = ?', [email, entreprise, googleBusiness, userUuid]);

    console.log(`Fetching updated user information for UUID: ${userUuid}`);
    // Récupération des informations de l'utilisateur après mise à jour
    const userResult = await conn.execute('SELECT name, google_business FROM users WHERE uuid = ?', [userUuid]);
    console.log('User result:', userResult);

    if (userResult.rows.length === 0) {
      console.log('User not found');
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }
    const user = userResult.rows[0];

    console.log(`Fetching subscription items for UUID: ${userUuid}`);
    // Récupération des items d'abonnement
    const subscriptionResult = await conn.execute('SELECT items FROM Subscriptions WHERE user_uuid = ?', [userUuid]);
    const subscriptionItems = subscriptionResult.rows.map((sub) => sub.items).join(', ');

    console.log('Preparing to send data to webhook');
    // Envoi des données au webhook
    const webhookUrl = 'https://hook.eu2.make.com/gh2844ojmi6ux31e3pf9vapc92yw17tg';
    const payload = { name: user.name, googleBusiness: user.google_business, subscriptionItems };
    console.log('Payload for webhook:', payload);

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((webhookResponse) => {
        console.log(`Webhook call response status: ${webhookResponse.status}`);
        if (!webhookResponse.ok) {
          return webhookResponse.text().then((text) => Promise.reject(new Error(`Webhook call failed: ${webhookResponse.statusText}, Body: ${text}`)));
        }
        return webhookResponse.json(); // Adjust based on expected response type
      })
      .then((data) => {
        console.log('Webhook response data:', data);
        // Handle successful webhook response here
      })
      .catch((error) => {
        console.error('Webhook call error:', error);
        // Handle webhook call error here
      });

    // Note: This return might execute before the webhook call is completed due to the asynchronous nature of fetch
    return { statusCode: 200, body: JSON.stringify({ message: 'Data successfully updated and sent to webhook.' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
