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
