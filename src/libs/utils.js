const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


const PRIV_KEY = fs.readFileSync(
  path.resolve(__dirname, "../keys/id_rsa_priv.pem"),
  "utf8"
);
const PUB_KEY = fs.readFileSync(
    path.resolve(__dirname, "../keys/id_rsa_pub.pem"),
    "utf8"
)
function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function generatePassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt,
    hash: genHash,
  };
}

function issueJWT(user) {
  const id = user.id;

  const expiresIn = "1d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

function customAuthMiddleware(req, res, next) {
    // const tokenParts = req.headers.authorization.split(' ');
    const [bearer, jsonToken] = req.headers.authorization.split(' ');
    if(bearer === 'Bearer' && jsonToken.match(/\S+\.\S+\.\S+/) !== null) {
        try {
            const verification = jwt.verify(jsonToken, PUB_KEY, { algorithms: ['RS256'] });
            req.jwt = verification;
            next();
        } catch(err){
            res.status(401).json({ msg: "you are not authorized to visit this route" });
        }
    } else {
        res.status(401).json({ msg: "you are not authorized to visit this route" });
    }
}

module.exports = {
  validPassword,
  generatePassword,
  issueJWT,
  customAuthMiddleware,
};
