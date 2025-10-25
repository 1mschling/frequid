# Web Request TLS Monitor and Recryptor Chrome Extension

This Chrome extension automatically configures your browser to route HTTP, HTTPS, and HTTP/3/QUIC traffic through the Web Request TLS Monitor and Recryptor proxy for real-time monitoring and TLS termination detection.

## Features

- **Automatic Proxy Configuration**: One-click setup with preconfigured Web Request TLS Monitor and Recryptor proxy settings
- **Protocol Support**: Routes HTTP, HTTPS, and HTTP/3/QUIC traffic
- **Simple UI**: Clean popup interface showing proxy status and controls
- **Real-time Monitoring**: Works seamlessly with the Web Request TLS Monitor and Recryptor dashboard
- **TLS Detection**: Enables monitoring for TLS termination across all protocols

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `extension` folder
6. The Web Request TLS Monitor and Recryptor icon will appear in your extensions toolbar

### Setup Icons

Before loading the extension, ensure you have the icon files in the `extension/icons/` directory:

- `icon-16.png` (16x16)
- `icon-32.png` (32x32)
- `icon-48.png` (48x48)
- `icon-128.png` (128x128)
- `logo.png` (64x64 for popup)

You can use the provided assets from the main application:
- Copy `/assets/generated/idx-extension-icon-transparent.dim_128x128.png` as `icon-128.png`
- Resize it to create the other icon sizes
- Copy `/assets/generated/idx-popup-logo-transparent.dim_64x64.png` as `logo.png`

## Usage

1. Click the Web Request TLS Monitor and Recryptor icon in your Chrome toolbar
2. Click "Enable Proxy" to activate traffic routing
3. All HTTP/HTTPS/HTTP/3 traffic will now route through Web Request TLS Monitor and Recryptor proxy
4. Click "Open Dashboard" to view your monitored requests
5. Log in with Internet Identity to see your session data

## Proxy Configuration

The extension is preconfigured with:
- **Host**: proxy.idx.network
- **Port**: 8080
- **Protocols**: HTTP, HTTPS, HTTP/3/QUIC

## Permissions

The extension requires the following permissions:
- `proxy`: To configure browser proxy settings
- `storage`: To save proxy state
- `<all_urls>`: To route all traffic through the proxy

## Development

### File Structure

