// db.js
const { connect } = require('@planetscale/database');

const config = {
  database: 'scanavis',
  username: 'lbb88a4ezq8w8g33i76t',
  host: 'aws.connect.psdb.cloud',
  password: 'pscale_pw_Xtndz1g3aIuU7X4imw3bkphOXPKUlQdUe3USgP7xCr1',
};

const conn = connect(config);

module.exports = { conn };

