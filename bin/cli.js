#!/usr/bin/env node

const inquirer = require('inquirer');
const { generatePGPKeyPair } = require('../src/pgp');
const { createSSLCertificate } = require('../src/ssl');

// Helper function to display help message
function showHelp() {
    console.log(`
Usage: pgp-ssl [command]

Commands:
  start     Start the program and generate SSL certificates
  help      Display this help message
`);
}

// Function to start the main program
async function startProgram() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
            validate: input => input !== '' || 'Name is required!' // Name validation
        },
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email:',
            validate: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || 'Please enter a valid email address!' // Email validation
        },
        {
            type: 'password',
            name: 'passphrase',
            message: 'Enter a passphrase to protect your private key (leave empty for no passphrase):',
            mask: '*',
            validate: input => true, // Passphrase is optional
        },
        {
            type: 'input',
            name: 'domain',
            message: 'Enter the domain for the SSL certificate:',
            validate: input => input !== '' || 'Domain is required!' // Domain validation
        },
        {
            type: 'list',
            name: 'os',
            message: 'Which operating system are you using?',
            choices: ['Debian', 'Ubuntu', 'CentOS', 'Other'],
            validate: input => input !== '' || 'Operating system selection is required!' // OS validation
        },
        {
            type: 'list',
            name: 'webServer',
            message: 'Which web server are you using?',
            choices: ['Apache', 'Nginx'],
            validate: input => input !== '' || 'Web server selection is required!' // Web server validation
        },
        {
            type: 'list',
            name: 'keyType',
            message: 'Choose key type for SSL certificate:',
            choices: ['RSA', 'ECC'],
            validate: input => input !== '' || 'Key type selection is required!' // Key type validation
        },
        {
            type: 'list',
            name: 'rsaBits',
            message: 'Choose RSA bit size:',
            choices: ['2048', '3072', '4096'],
            when: (answers) => answers.keyType === 'RSA', // Only ask if RSA is selected
            validate: input => input !== '' || 'RSA bit size selection is required!' // RSA bit size validation
        },
        {
            type: 'list',
            name: 'eccCurve',
            message: 'Choose ECC curve:',
            choices: ['prime256v1', 'secp384r1', 'secp521r1'],
            when: (answers) => answers.keyType === 'ECC', // Only ask if ECC is selected
            validate: input => input !== '' || 'ECC curve selection is required!' // ECC curve validation
        }
    ]);

    // Generate PGP key pair with passphrase
    const { publicKey } = await generatePGPKeyPair(answers.name, answers.email, answers.passphrase);

    // Create SSL certificate using the provided options
    const sslCert = createSSLCertificate(publicKey, answers.domain, answers.keyType, answers.rsaBits, answers.eccCurve, answers.webServer, answers.os);

    console.log('\nSSL Certificate Generated:\n');
    console.log(sslCert);
}

// Main CLI logic to handle commands
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === 'help') {
    showHelp();
} else if (args[0] === 'start') {
    startProgram();
} else {
    console.log('Invalid command. Use "pgp-ssl help" for available commands.');
}
