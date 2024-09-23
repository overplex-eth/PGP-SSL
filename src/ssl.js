const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to create SSL Certificate and store them based on web server and OS
function createSSLCertificate(pgppubkey, domain, keyType, rsaBits = '2048', eccCurve = 'prime256v1', webServer, os) {
    let privateKeyDir, publicCertDir, configDir, reloadCommand;

    // Define paths and reload commands based on the OS
    switch (os) {
        case 'Debian':
        case 'Ubuntu':
            privateKeyDir = '/etc/ssl/private';
            publicCertDir = '/etc/ssl/certs';
            configDir = webServer === 'Apache' ? '/etc/apache2/sites-available' : '/etc/nginx/sites-available';
            reloadCommand = webServer === 'Apache' ? 'systemctl reload apache2' : 'systemctl reload nginx';
            break;
        case 'CentOS':
            privateKeyDir = '/etc/pki/tls/private';
            publicCertDir = '/etc/pki/tls/certs';
            configDir = webServer === 'Apache' ? '/etc/httpd/conf.d' : '/etc/nginx/conf.d';
            reloadCommand = webServer === 'Apache' ? 'systemctl reload httpd' : 'systemctl reload nginx';
            break;
        default:
            console.error('Unsupported operating system');
            return null;
    }

    const keyFile = path.join(privateKeyDir, `${domain}-ssl-key.pem`);
    const certFile = path.join(publicCertDir, `${domain}-ssl-cert.pem`);
    const configFile = path.join(configDir, `${domain}.conf`);

    try {
        // Step 1: Generate Private Key based on selected key type
        if (keyType === 'RSA') {
            execSync(`openssl genpkey -algorithm RSA -out ${keyFile} -pkeyopt rsa_keygen_bits:${rsaBits}`);
            console.log(`Generated RSA private key with ${rsaBits} bits and saved to ${keyFile}`);
        } else if (keyType === 'ECC') {
            execSync(`openssl ecparam -genkey -name ${eccCurve} -out ${keyFile}`);
            console.log(`Generated ECC private key with curve ${eccCurve} and saved to ${keyFile}`);
        }

        // Step 2: Generate CSR (Certificate Signing Request)
        const csrFile = path.join('/tmp', `${domain}-csr.pem`);
        execSync(`openssl req -new -key ${keyFile} -out ${csrFile} -subj "/CN=${domain}"`);
        console.log('Generated CSR for domain:', domain);

        // Step 3: Generate SSL Certificate (self-signed for 1 year)
        execSync(`openssl req -x509 -key ${keyFile} -in ${csrFile} -out ${certFile} -days 365`);
        console.log(`Generated self-signed SSL certificate and saved to ${certFile}`);

        // Step 4: Set proper permissions for the key and cert
        execSync(`chmod 600 ${keyFile}`);
        execSync(`chmod 644 ${certFile}`);

        // Step 5: Create Apache or Nginx configuration
        let configContent;
        if (webServer === 'Apache') {
            configContent = `
<VirtualHost *:443>
    ServerName ${domain}

    SSLEngine on
    SSLCertificateFile ${certFile}
    SSLCertificateKeyFile ${keyFile}

    DocumentRoot /var/www/${domain}
    ErrorLog \${APACHE_LOG_DIR}/${domain}_error.log
    CustomLog \${APACHE_LOG_DIR}/${domain}_access.log combined

    <Directory /var/www/${domain}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
            `;
        } else if (webServer === 'Nginx') {
            configContent = `
server {
    listen 443 ssl;
    server_name ${domain};

    ssl_certificate ${certFile};
    ssl_certificate_key ${keyFile};

    root /var/www/${domain};
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    access_log /var/log/nginx/${domain}_access.log;
    error_log /var/log/nginx/${domain}_error.log;
}
            `;
        }

        fs.writeFileSync(configFile, configContent);
        console.log(`${webServer} configuration file created at ${configFile}`);

        // Step 6: Enable the site and reload the web server
        if (webServer === 'Apache') {
            execSync(`a2ensite ${domain}.conf`);
        } else if (webServer === 'Nginx') {
            execSync(`ln -s ${configFile} /etc/nginx/sites-enabled/`);
        }
        execSync(reloadCommand);
        console.log(`${webServer} configuration enabled for ${domain} and server reloaded.`);

        return { certFile, keyFile };

    } catch (error) {
        console.error(`Error generating SSL certificate and ${webServer} configuration:`, error.message);
        return null;
    }
}

module.exports = { createSSLCertificate };
