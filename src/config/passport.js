const fs = require('fs');
const path = require('path');
const User = require('../server/db/User');

const PUB_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_pub.pem'));


module.exports = (passport) => {};