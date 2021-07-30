const Sequelize  = require('sequelize');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const db = new Sequelize(process.env.DB_STRING, {
    logging: false
});

module.exports = db;
