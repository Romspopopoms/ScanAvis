const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');
const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  let connection;

  try {
    const { items } = JSON.parse(event.body);
    if (!Array.isArray(items)) {
      throw new Error('Invalid items format: Items should be an array');
    }

    const totalAmount = items.reduce((total, item) => {
      if ((!Number.isInteger(item.id) && typeof item.id !== 'string') || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
      return total + item.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });
    console.log(`PaymentIntent created: ${paymentIntent.id}`);

    connection = await mysql.createConnection('mysql://d2d9kdyzzf7i6ygptr6i:pscale_pw_2NKpsTdtQAzaztcXO40IHXd87zJ1oGQJUiqe8bzE3Yk@aws.connect.psdb.cloud/scanavis?ssl={"rejectUnauthorized":true}');
    const [rows] = await connection.execute(
      'INSERT INTO Transactions (items, totalAmount, paymentIntentId, clientSecret) VALUES (?, ?, ?, ?)',
      [JSON.stringify(items), totalAmount, paymentIntent.id, paymentIntent.client_secret],
    );
    console.log('Insertion into database successful', rows);

    await connection.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.sqlMessage) {
      console.error('SQL Error:', error.sqlMessage);
    }
    if (connection) {
      await connection.end();
    }
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
