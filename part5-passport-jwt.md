# Passport JSON Web Token

## We can start by creating our private and public keys. Examine our generate key pair function.
```
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generateKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // standard bits for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    // Create the public key file
    fs.writeFileSync(path.join(__dirname, '/keys/id_rsa_pub.pem'), keyPair.publicKey);

    // Create the private key 
    fs.writeFileSync(path.join(__dirname, '/keys/id_rsa_priv.pem'), keyPair.privateKey);

}
generateKeyPair();

```
- ### Notice that we are generating a public and private key with rsa (rsa is the public-key encryption technology, public key referring to asymmetric cryptography with private and public keys)
- ### We want to keep the private key. We will use the private key to sign the JWT that will be sent to the client.
- ### Recall, we are keeping the private key as an environment variable - referenced by process.env & require('dotenv').config(path) .
<hr />

## Our database should be set up
```
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

User.sync()
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

```

# Signing the JWT with the private key occurs in our utils.js file
- ### Recall, we must specify utf8 encoding to read the information correctly.
- ### Our issueJWT (issuance) expects to receive the user from the database. It will then use jwt.sign() to sign the jsonwebtoken
- ### We want the format to be 'Authorization: Bearer <token>'. Our ExtractJwt.fromAuthHeaderAsBearerToken EXPECTS that format (in passport.js)
- ### Our utils.js also holds the logic for generating a hashed password and verifying a hashed password. We will not sign a JWT unless credentials are verified.
```
const PRIV_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_priv.pem'), 'utf8');

function issueJWT(user) {
    const id = user.id;

    const expiresIn = '1d';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    return {
        token: 'Bearer ' + signedToken,
        expires: expiresIn
    }

}
```

# Verifying the JWT with the public key occurs in the passport.js file
## Similarly to Passport Local Strategy, we need to define functionality for when there are
- ## 1.) Database Errors -> done(err, false)
- ## 2.) User is found -> done(null, user)
- ## 3.) User is not found -> done(null, false)
## **secretOrKey** is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature. 
## Passport is the verifcation step, that's why we pass in the public key.
## **Sign issuance with private key, Verify identity with public key.**
- ## **Options object** is an object literal containing options to control how the token is extracted from the request or verified. Most of these come from the jsonwebtoken module.
```
const PUB_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_pub.pem'), 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const verifyCallback = async (payload, done) => {
    try {
        const user = await User.findByPk(payload.sub);
        if(user) return done(null, user);

        return done(null, false);
    } catch (err) {
        done(err, null);
    }
}

const strategy = new JwtStrategy(options, verifyCallback);
```
## Keep in mind, JwtStrategy is verifying the json token with jwt under the hood.
## If we make it inside the verifyCallback, that means the jwt is already verified.



# Don't forget: JWT is the RESULT of a successful user authentication with a username and password.


# To protect any route
```
passport.authenticate('jwt', {session: false})
```
# In passport session, we only had to authenticate during login because we created a session.
## JSON Web Tokens are stateless by nature so we would need to have an authenticate on every route that we wish to protect.
