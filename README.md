# PGP-SSL: SSL Certificates with PGP Key Generation

`pgp-ssl` is a Node.js CLI tool that generates PGP keys using ECC or RSA and creates SSL certificates for use with Apache or Nginx web servers. The tool supports different operating systems such as Debian, Ubuntu, and CentOS.

## Features

- **PGP Key Generation**: Secure PGP key generation using Elliptic Curve Cryptography (ECC) or RSA.
- **Passphrase Protection**: Optionally encrypt the PGP private key with a passphrase.
- **SSL Certificate Creation**: Automatically generate and configure SSL certificates for Apache or Nginx.
- **Cross-Platform Support**: Supports different Linux distributions like Debian, Ubuntu, and CentOS.

## Installation

1. Clone the repository or navigate to your project folder.
2. Install the package globally:

   ```bash
   npm install -g .
   ```

This will register the `pgp-ssl` command globally.

## Usage

### Command Line Interface (CLI)

To display the help menu with available commands:

```bash
pgp-ssl help
```

### Generate PGP Keys and SSL Certificates

To start generating PGP keys and SSL certificates, use the `start` command:

```bash
pgp-ssl start
```

You will be prompted to provide the following information:

- **Name**: Your name (required)
- **Email**: Your email (required)
- **Passphrase**: An optional passphrase to protect your PGP private key (leave empty for no passphrase)
- **Domain**: The domain name for the SSL certificate (required)
- **Operating System**: Choose your operating system (Debian, Ubuntu, CentOS, Other)
- **Web Server**: Choose the web server you are using (Apache or Nginx)
- **Key Type**: Choose either RSA or ECC for the SSL certificate
  - If RSA is selected, you'll be asked to choose the RSA bit size (2048, 3072, 4096)
  - If ECC is selected, you'll be asked to choose the ECC curve (`prime256v1`, `secp384r1`, `secp521r1`)

After providing all inputs, the tool will:
- Generate PGP keys (public and private).
- Create an SSL certificate and private key.
- Generate a configuration file for your chosen web server (Apache or Nginx).
- Enable the configuration and reload the web server.

### Example Output

```bash
pgp-ssl start
```

```text
Enter your name: John Doe
Enter your email: john@example.com
Enter a passphrase to protect your private key (leave empty for no passphrase):
Enter the domain for the SSL certificate: example.com
Which operating system are you using? Debian
Which web server are you using? Nginx
Choose key type for SSL certificate: ECC
Choose ECC curve: prime256v1

SSL Certificate Generated:
<Your certificate details>
```

## Dependencies

- **Node.js**: The tool is built with Node.js and requires version 12.x or above.
- **OpenPGP.js**: For PGP key generation.
- **OpenSSL**: Used to generate SSL certificates.

Make sure **OpenSSL** is installed and accessible from the command line.

### Installing OpenSSL on Debian/Ubuntu:

```bash
sudo apt-get install openssl
```

### Installing OpenSSL on CentOS:

```bash
sudo yum install openssl
```

## Security Considerations

- **Passphrase Protection**: Always use a strong passphrase when generating PGP keys to protect the private key.
- **Certificate Location**: SSL certificates are stored in `/etc/ssl/` and configuration files in `/etc/apache2/` (for Apache) or `/etc/nginx/` (for Nginx).

## Contributing

Contributions are welcome! Please submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.