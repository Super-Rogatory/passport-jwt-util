const express = require("express");
const router = express.Router();
const utils = require("../../libs/utils");
const User = require("../db/User");
const passport = require("passport")
// Mounted on '/api/users
// router.get("/", (req, res, next) => {
//   res.send({ msg: "hello world" });
// });

router.post("/protected", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.status(200).json({msg: "access granted"});
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { name: req.body.username }});
        if(!user) res.status(401).json( {msg: "could not find user"} );
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

        if(isValid) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({ user, token: tokenObject.token, expiresIn: tokenObject.expiresIn })
        } else {
            res.status(401).json({ msg: "You have entered the wrong password "});
        }
    } catch (err) {
        next(err);
    }
});

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
