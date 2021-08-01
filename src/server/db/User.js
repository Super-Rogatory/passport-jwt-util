const Sequelize = require("sequelize");
const db = require("./index");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hash: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  },
});

User.sync({ force: true })
.then(() => console.log('db: table has been created'))
.catch((err) => console.log('error creating the table', err));

async function testingDb() {
  try {
    await db.authenticate();
    console.log("db: connection has been established successfully");
  } catch (err) {
    console.log(err);
  }
}
testingDb();

module.exports = User;
