// db.js
const { connect } = require('@planetscale/database');

const config = {
  DATABASE_HOST: 'aws.connect.psdb.cloud',
  DATABASE_USERNAME: 'tguw58se95itlmrzv5aj',
  DATABASE_PASSWORD: 'pscale_pw_mfVEFjFfNWTtLKy7m0Oxj2JSqWCdsR7fiSgNUprJeYx',
};

const conn = connect(config);

module.exports = { conn };

