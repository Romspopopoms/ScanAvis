const { connect } = require('@planetscale/database');

const config = {
  host: process.env.DATABASE_HOST, // Assurez-vous que ceci est défini dans Netlify
  username: process.env.DATABASE_USERNAME, // Assurez-vous que ceci est défini dans Netlify
  password: process.env.DATABASE_PASSWORD, // Assurez-vous que ceci est défini dans Netlify
};

const conn = connect(config);

module.exports = { conn };

