// db.js
const { connect } = require('@planetscale/database');

const config = {
  host: process.env.PLANETSCALE_HOST, // ou DATABASE_HOST selon la configuration de Netlify
  username: process.env.PLANETSCALE_USERNAME, // ou DATABASE_USERNAME
  password: process.env.PLANETSCALE_PASSWORD, // ou DATABASE_PASSWORD
};

const conn = connect(config);

module.exports = { conn };
