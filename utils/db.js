// db.js
const { connect } = require('@planetscale/database');

const config = {
  host: 'aws.connect.psdb.cloud', // Vérifiez que c'est le bon hôte pour votre base de données
  username: 'tguw58se95itlmrzv5aj', // Nom d'utilisateur
  password: 'pscale_pw_mfVEFjFfNWTtLKy7m0Oxj2JSqWCdsR7fiSgNUprJeYx', // Mot de passe
};

const conn = connect(config);

module.exports = { conn };
