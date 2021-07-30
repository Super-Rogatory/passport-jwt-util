const fs = require('fs');
const path = require('path');
const User = require('../server/db/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const PUB_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_pub.pem'), 'utf8');

// ExtractJwt.fromAuthHeaderAsBearerToken EXPECTS that the following format
// Authorization: Bearer <token>
// secretOrKey is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature. 
// REQUIRED unless secretOrKeyProvider is provided.

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

// Passport is the verifcation step, that's why we pass in the public key.
// Sign issuance with private key, Verify identity with public key


// The strategy will first check the request for the standard Authorization header. 
// If this header is present and the scheme matches options.authScheme or 'JWT' if no auth scheme was specified then the token will be retrieved from it. e.g.
const verifyCallback = async (payload, done) => {
    try {
        const user = await User.findByPk(payload.sub);
        if(user) return done(null, user);

        return done(null, false);
    } catch (err) {
        done(err, null);
    }
}
// Keep in mind, JwtStrategy is verifying the json token with jwt under the hood.
// If we make it inside the verifyCallback, that means the jwt is already verified.
const strategy = new JwtStrategy(options, verifyCallback);

module.exports = (passport) => {
    passport.use(strategy);
};