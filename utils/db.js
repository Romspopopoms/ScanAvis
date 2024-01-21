// db.js
const { connect } = require('@planetscale/database');

const config = {
  host: process.env.host, // L'adresse du serveur de la base de données
  username: process.env.username, // Le nom d'utilisateur de la base de données
  password: process.env.password, // Le mot de passe pour la base de données
  database: process.env.database, // Le nom de la base de données
};

const conn = connect(config);

module.exports = { conn };
