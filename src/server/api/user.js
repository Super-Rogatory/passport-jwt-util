const express = require("express");
const router = express.Router();
const utils = require("../../libs/utils");
const User = require("../db/User");

// Mounted on '/api/users
// router.get("/", (req, res, next) => {
//   res.send({ msg: "hello world" });
// });

router.get("/protected", (req, res, next) => {});
router.get("/login", (req, res, next) => {});
router.post("/register", async (req, res, next) => {
  try {
    // if a user comes to the application and register, we are going to store that new user in the database and issue them a new jwt
    // as long as the jwt is valid, the user is logged in.
    const saltHash = utils.generatePassword(req.body.password);
    // create a salt and a hash based on the password that the user entered in
    const hash = saltHash.hash;
    const salt = saltHash.salt;

    const newUser = {
      name: req.body.username,
      hash,
      salt,
    };
    const user = await User.create(newUser);
    const jwt = utils.issueJWT(user);
    res.json({ msg: "user created", user, token: jwt.token, expiresIn: jwt.expires });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
