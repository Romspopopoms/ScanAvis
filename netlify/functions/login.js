const bcrypt = require('bcrypt');
const { conn } = require('../../utils/db');

async function verifyCredentials(email, password) {
  console.log('Vérification des identifiants');

  const [rows] = await conn.execute('SELECT user_id, email, name, password_hash, access_token FROM users WHERE email = ?', [email]);

  if (rows.length === 0) {
    console.error('Aucun utilisateur trouvé avec cet e-mail');
    return null;
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    console.error('Mot de passe invalide');
    return null;
  }

  return user;
}

exports.loginHandler = async (event) => {
  console.log('Début de la fonction handler, méthode HTTP:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    console.error('Méthode non autorisée:', event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Traitement de la requête:', event.body);
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      console.error('E-mail et mot de passe sont requis');
      return { statusCode: 400, body: 'Email and password are required' };
    }

    const user = await verifyCredentials(email, password);
    if (!user) {
      return { statusCode: 401, body: 'Invalid credentials' };
    }

    console.log('Identifiants validés');

    // Utilisateur authentifié avec succès, renvoyer les données utilisateur
    return {
      statusCode: 200,
      body: JSON.stringify({ user: { email: user.email, name: user.name, access_token: user.access_token } }),
    };
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Login failed', details: err.message }),
    };
  }
};
