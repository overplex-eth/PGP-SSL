// Import the key functionality from pgp.js and ssl.js
const { generatePGPKeyPair } = require('./pgp');
const { createSSLCertificate } = require('./ssl');

// Export the functionality for external use
module.exports = {
    generatePGPKeyPair,
    createSSLCertificate
};
