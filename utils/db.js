// db.js
const { connect } = require('@planetscale/database');

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const conn = connect(config);

module.exports = { conn }; // Utilisez module.exports pour exporter
