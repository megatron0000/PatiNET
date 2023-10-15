# PatiNET - UDP and TCP Client/Server Application

PatiNET is an easy-to-use Electron application for handling both UDP and TCP client/server communication. This README will guide you through using PatiNET as an end user or developer.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Downloading the Application](#downloading-the-application)
  - [UDP Communication](#udp-communication)
  - [TCP Communication](#tcp-communication)
- [Developers](#developers)
- [Filing issues](#filing-issues)
- [Contributing](#contributing)
- [License](#license)

## Features

- Available for Windows, macOS, and Linux.
- Supports both UDP and TCP protocols.
- Allows using domain names or IP addresses for remote addresses.
- You can either choose a local port to bind to, or leave it up to the operating system.
- Messages can be read and written in either plain text or binary mode. In plain text mode, lines can be broken by pressing Enter (useful for crafting HTTP requests, for example)

## Usage

### Downloading the Application

To use PatiNET, follow these steps to download the appropriate file from the Releases section:

1. Visit the [Releases](https://github.com/megatron0000/PatiNET/releases) page on the PatiNET GitHub repository.
2. Scroll down to the latest release.
3. Depending on your operating system, download the appropriate binary for PatiNET. `patinet-xxx.Setup.exe` installs on Windows, `patinet_xxx_amd64.deb` installs on Linux, and `patinet-xxx-x64.dmg` installs on macOS. Here, `xxx` represents the version number (prefer the latest version). The other zip files are for running the program without installation.
4. Once the download is complete, install and run PatiNET on your machine (unless you've downloaded the zip file, which doesn't require installation)

### UDP Communication

1. Open PatiNET.
2. Click on the "UDP" tab.
3. Click on "Bind" to bind to a port. If you leave the input blank, a random port will be assigned.
4. Click on "Add" to add a remote address. Enter the IP address (or domain name) and port of the server you want to communicate with.
5. Type your message in the input field and click the "Send" button.

**Examples**:

<details>
<summary>Simple UDP example. The buttons "10" and "16" are the binary views of the data(base 10 and base 16)</summary>

![UDP example](docs/udp-example.gif)

</details>

<details>
<summary>Talking to Google DNS (8.8.8.8:53). We manually craft a DNS request (base 16) asking the IP of facebook.com, then send it to Google's DNS server. We read the response in base 10, where the last four bytes are the IPv4 address we asked for</summary>

![UDP DNS](docs/udp-dns.gif)

</details>

### TCP Communication

#### Client Mode

1. Open PatiNET.
2. Click on the "TCP Client" tab.
3. Click on "Add" to add a remote address. Enter the IP address (or domain name) and port of the server you want to communicate with. The local port may be left blank (this will assign a random port)
4. Click on "Connect" to initiate the TCP connection with the remote host.
5. Type your message in the input field and click the "Send" button.
6. At any time, you can click "Disconnect" to terminate the connection.

**Examples**:

<details>
<summary>Talking to example.com at port 80 (HTTP)</summary>

![TCP example.com port 80](docs/tcp-example-dot-com.gif)

</details>

#### Server Mode

1. Open PatiNET.
2. Click on the "TCP Server" tab.
3. Wait for a client to connect. When it does, you will see a panel similar to that of the TCP Client.

## Developers

1. **Fork the Repository**: Fork the project repository and clone your fork to your local machine.

   ```bash
      git clone https://github.com/megatron0000/PatiNET.git
   ```

2. **Navigate to your clone**: Open a terminal and navigate to the cloned directory.

   ```bash
   cd PatiNET
   ```

3. **Install Dependencies**: Use npm to install all the required packages.

   ```bash
   npm install
   ```

4. **Run the App**: Start the application using npm. This will use webpack and automatically reload whenever you make a change to the source code.

   ```bash
   npm start
   ```

## Filing Issues

If you encounter an issue, please [file a bug report](https://github.com/megatron0000/PatiNET/issues). When filing an issue, make sure to answer these five questions:

1. What version of the project are you using? example: 1.0.1
2. What operating system and processor architecture are you using? example: Ubuntu operating system with AMD Ryzen CPU
3. What did you do? example: opened the app on UDP mode, added a remote and sent a message
4. What did you expect to see? example: the message should be sent
5. What did you see instead? example: an error appeared and it said [error message here]

## Contributing

We welcome contributions to improve PatiNET. Feel free to open issues or pull requests with your ideas, bug reports, or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
