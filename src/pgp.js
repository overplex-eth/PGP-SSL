const openpgp = require('openpgp');

// Function to generate PGP keys using ECC with a passphrase
async function generatePGPKeyPair(name, email, passphrase) {
    try {
        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc', 
            curve: 'curve25519', // Curve to use for ECC
            userIDs: [{ name: name, email: email }], // User identity
            passphrase: passphrase || undefined, // Use the provided passphrase or leave undefined if empty
        });

        console.log('ECC PGP Key Pair Generated:');
        console.log('Public Key:', publicKey);
        console.log('Private Key:', privateKey);

        return { privateKey, publicKey };
    } catch (error) {
        console.error('Error generating PGP keypair:', error.message);
        throw error;
    }
}

module.exports = { generatePGPKeyPair };
