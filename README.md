# PGP-SSL: SSL Certificates with PGP Key Generation

`pgp-ssl` is a Node.js CLI tool that generates PGP keys using ECC or RSA and creates SSL certificates for use with Apache or Nginx. It supports Debian, Ubuntu, and CentOS operating systems.

## Features

- **PGP Key Generation**: ECC or RSA.
- **Passphrase Protection**: Optional encryption of the PGP private key.
- **SSL Certificate Creation**: Automates configuration for Apache or Nginx.

## Installation

Install via npm:

```bash
npm install pgp-ssl
```

Run the tool using `npx`:

```bash
npx pgp-ssl start
```

## Usage

To display the help menu:

```bash
npx pgp-ssl help
```

To generate PGP keys and SSL certificates:

```bash
npx pgp-ssl start
```

You will be prompted for:
- **Name** (required)
- **Email** (required)
- **Passphrase** (optional)
- **Domain** (required)
- **Operating System**
- **Web Server** (Apache or Nginx)
- **Key Type** (RSA or ECC)

### Example:

```bash
npx pgp-ssl start
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
```

## Dependencies

- **Node.js**: Requires version 12.x or above.
- **OpenPGP.js**: For PGP key generation.
- **OpenSSL**: Used for SSL certificates.

Ensure **OpenSSL** is installed and accessible via the command line.

### Installing OpenSSL

For **Debian/Ubuntu**:
```bash
sudo apt-get install openssl
```

For **CentOS**:
```bash
sudo yum install openssl
```

## Security Considerations

- **Passphrase Protection**: Always use a strong passphrase to protect your PGP private key.
- **Certificate Location**: Certificates are stored in `/etc/ssl/`, and configuration files are stored in `/etc/apache2/` (for Apache) or `/etc/nginx/` (for Nginx).

## Contributing

Fork the repository on GitLab, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.