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
    await conn.execute('UPDATE users SET email = ?, entreprise = ?, google_business = ? WHERE uuid = ?', [email, entreprise, googleBusiness, userUuid]);

    console.log(`Fetching updated user information for UUID: ${userUuid}`);
    const userResult = await conn.execute('SELECT name, google_business FROM users WHERE uuid = ?', [userUuid]);
    console.log('User result:', userResult);

    if (userResult.rows.length === 0) {
      console.log('User not found');
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }
    const user = userResult.rows[0];

    console.log(`Fetching subscription items for UUID: ${userUuid}`);
    const subscriptionResult = await conn.execute('SELECT items FROM Subscriptions WHERE user_uuid = ?', [userUuid]);
    const subscriptionItems = subscriptionResult.rows.map((sub) => sub.items).join(', ');

    console.log('Preparing to send data to webhook');
    const webhookUrl = 'https://hook.eu2.make.com/gh2844ojmi6ux31e3pf9vapc92yw17tg';
    const payload = { name: user.name, googleBusiness: user.google_business, subscriptionItems };
    console.log('Payload for webhook:', JSON.stringify(payload));

    // Modification here to use await instead of then()
    console.log('Sending data to webhook');
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log(`Webhook call response status: ${webhookResponse.status}`);
    if (!webhookResponse.ok) {
      const responseBody = await webhookResponse.text();
      console.error(`Webhook call failed with status: ${webhookResponse.status}, response: ${responseBody}`);
      throw new Error(`Webhook call failed: ${webhookResponse.statusText}`);
    }

    const responseData = await webhookResponse.json(); // Adjust based on expected response type
    console.log('Webhook response data:', responseData);

    return { statusCode: 200, body: JSON.stringify({ message: 'Data successfully updated and sent to webhook.' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error', error: error.message }) };
  }
};
