const fetch = require('node-fetch');
const { conn } = require('../../utils/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Méthode non autorisée' }) };
  }

  const { userUuid, entreprise, googleBusiness, email } = JSON.parse(event.body);
  if (!userUuid || !email || !entreprise || !googleBusiness) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Informations manquantes' }) };
  }

  try {
    await conn.execute('UPDATE users SET email = ?, entreprise = ?, google_business = ? WHERE uuid = ?', [email, entreprise, googleBusiness, userUuid]);

    const userResult = await conn.query('SELECT name, google_business FROM users WHERE uuid = ?', [userUuid]);
    const subscriptionResult = await conn.query('SELECT items FROM subscriptions WHERE user_uuid = ?', [userUuid]);

    const payload = {
      name: userResult[0].name,
      googleBusiness: userResult[0].google_business,
      subscriptionItems: subscriptionResult.map((s) => s.items).join(', '),
    };

    const webhookResponse = await fetch('https://hook.eu2.make.com/m2qm1gp3ev3p2ftcw62cw69p30bfubrm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error('Failed to send data to the webhook');
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Update and webhook notification succeeded' }) };
  } catch (error) {
    console.error('Update or webhook error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
