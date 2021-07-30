const express = require("express");
const router = express.Router();

// Mounted on '/api/users
// router.get("/", (req, res, next) => {
//   res.send({ msg: "hello world" });
// });

router.get("/protected", (req, res, next) => {

});
router.get("/login", (req, res, next) => {

});
router.get("/register", (req, res, next) => {

});
module.exports = router;
