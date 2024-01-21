// db.js
const { connect } = require('@planetscale/database');

const config = {
  host: 'aws.connect.psdb.cloud', // Assurez-vous que ceci est défini dans Netlify
  username: '4oawdjztq94gyl2cmu58', // Assurez-vous que ceci est défini dans Netlify
  password: 'pscale_pw_nnoQlMtmc2aVdVItG9Jz0COYdvRD6ghmmfvBQjmvZai', // Assurez-vous que ceci est défini dans Netlify
};

const conn = connect(config);

module.exports = { conn };

