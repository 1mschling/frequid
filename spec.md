# Web Request TLS Monitor and Recryptor with Chrome Extension

## Overview
A web application that provides users with a real-time dashboard to monitor proxied web requests during their active session, now enhanced with a Chrome browser extension for automatic proxy configuration. Users authenticate using Internet Identity and can view detailed information about all requests passing through the proxy system.

Real-time dashboard for monitoring proxied web requests, and enabling data encryption for important data.

## Process Flow Documentation
- Display a comprehensive process flow diagram within the application documentation or help section
- Visual diagram illustrating the complete application workflow from browser setup to session export
- Flow diagram should show:
  - Browser detection and extension installation process
  - Extension activation and proxy configuration
  - Internet Identity authentication flow
  - Request proxying and monitoring pipeline
  - TLS termination detection and re-encryption process
  - Real-time dashboard updates
  - Filtering and export functionality
  - External server decryption request workflow
  - User approval process for plaintext data release
- Interactive or static diagram accessible from the main dashboard
- Clear visual representation of data flow between browser, extension, proxy, and dashboard

## Browser Detection and Extension Promotion
- Automatically detect the user's browser (Chrome or Firefox)
- Display a prominent confirmation prompt or banner suggesting the appropriate browser extension for installation
- Provide direct install links for Chrome Web Store or Firefox Add-ons as applicable
- For unsupported browsers, display a message indicating that only Chrome and Firefox are supported for automatic proxy configuration
- Banner should be visually prominent and easily dismissible after user interaction

## Chrome Extension
- Automatically configures Chrome browser to use the Web Request TLS Monitor and Recryptor proxy for HTTP, HTTPS, and HTTP/3/QUIC traffic
- Preconfigured with the Web Request TLS Monitor and Recryptor proxy address - no manual setup required
- Simple onboarding UI within the extension to:
  - Confirm proxy activation
  - Display current proxy status (active/inactive)
  - Show connection status to Web Request TLS Monitor and Recryptor proxy
- Extension activates proxy configuration upon installation
- Users can enable/disable proxy through the extension interface

## Firefox Extension
- Automatically configures Firefox browser to use the Web Request TLS Monitor and Recryptor proxy for HTTP, HTTPS, and HTTP/3/QUIC traffic
- Preconfigured with the Web Request TLS Monitor and Recryptor proxy address - no manual setup required
- Simple onboarding UI within the extension to:
  - Confirm proxy activation
  - Display current proxy status (active/inactive)
  - Show connection status to Web Request TLS Monitor and Recryptor proxy
- Extension activates proxy configuration upon installation
- Users can enable/disable proxy through the extension interface

## Authentication
- Users log in using Internet Identity
- Authentication is required to access the dashboard

## User Liveliness Detection
- Continuously monitor user presence through keyboard and mouse/touchpad movement events in the background
- Track user activity timestamps for recent interactions
- Configurable inactivity timeout (default several minutes)
- Mark user as inactive when no activity is detected within the timeout period
- Display warning notifications when user approaches inactivity timeout
- Require re-authentication after extended inactivity periods
- Invisible background process that serves as bot prevention mechanism
- Replace traditional captcha requirements with liveliness detection

## Core Features

### Real-time Request Dashboard
- Display all proxied web requests for the current user session
- Show request details including:
  - URL
  - HTTP method
  - Protocol version (HTTP/1.1, HTTP/2, HTTP/3)
  - Timestamp
  - Response status
  - Request headers
  - Response headers
  - Re-encryption status indicator for requests that were re-encrypted due to external TLS termination
  - Authentication status (authenticated/unauthenticated)
  - Key agreement protocol used
  - Protected user data type (e.g., name, personal data)
  - Endpoint/CDN/firewall information (IP address, hostname)
  - CA certificate status (good/bad)
  - End-to-end encryption confirmation
  - Mutual authentication status
  - Number of intermediary hops
  - Encrypted payload type (e.g., ChaCha20-256)
  - Forward secrecy confirmation per request
- Update the dashboard in real-time as new requests are processed
- Display each request with clear labels for all attributes
- Provide visual indicators and icons for different security states
- Include tooltips for each attribute explaining detection methods and limitations
- Organize request display to maintain readability while showing comprehensive metadata

### Advanced Request Filtering and Labeling
- Comprehensive filtering system with clear visual organization
- Basic filters section:
  - Filter requests by protocol (HTTP, HTTPS, HTTP/3/QUIC)
  - Filter requests by domain
  - Filter requests by status code
  - Filter requests by TLS termination status
  - Filter requests by re-encryption status
- Advanced filters section (collapsible/expandable):
  - Filter by protocol version (HTTP/1.1, HTTP/2, HTTP/3/QUIC)
  - Filter by authentication status (authenticated/unauthenticated)
  - Filter by key agreement protocol
  - Filter by HTTP method type
  - Filter by protected user data type (e.g., name, personal data)
  - Filter by endpoint/CDN/firewall info (IP address, hostname)
  - Filter by CA certificate status (good/bad)
  - Filter by end-to-end encryption confirmation
  - Filter by mutual authentication status
  - Filter by number of intermediary hops
  - Filter by encrypted payload type
  - Filter by forward secrecy status
- Multiple filters can be applied simultaneously
- Clear filter options to reset view
- Each filter includes tooltips explaining detection methods and limitations
- Visual indicators showing active filters
- Filter presets for common security scenarios

### Request Labeling System
- Clear, consistent labeling for all request attributes
- Color-coded visual indicators for security status:
  - Green indicators for secure/authenticated states
  - Yellow indicators for partial security or unknown states
  - Red indicators for insecure or compromised states
- Icon-based visual system for quick identification
- Expandable detail views for complex attributes
- Consistent terminology across all labels and tooltips
- User-friendly explanations for technical concepts

### Session Export
- Export all proxied requests from the current session
- Support CSV format export
- Support JSON format export
- Export includes all request details, metadata, re-encryption status, and extended metadata fields
- Download functionality integrated into dashboard

### TLS Termination Alert System
- Monitor all proxied requests for signs of TLS termination across all protocols
- Detect TLS termination through:
  - Suspicious headers indicating proxy interference
  - Injected JavaScript from the proxy
  - QUIC connection manipulation indicators
  - HTTP/3 stream tampering signs
  - Handshake anomalies
- Display prominent alerts immediately when TLS termination is detected
- Alert should be visually distinct and attention-grabbing
- Detect and alert on any data decryption, including for QUIC/HTTP/3 traffic
- Alert on TLS termination both inside and outside the ICP network

### Request Re-encryption System
- Automatically re-encrypt request bodies when TLS termination is detected outside the ICP network
- Generate session-specific ChaCha20-256 encryption keys for each user session
- Re-encrypt compromised request data before forwarding to external destinations
- Provide visual indicators in the dashboard showing which requests have been re-encrypted
- Display user notifications when requests are automatically re-encrypted due to external TLS termination

### External Server Decryption Request System
- Allow external endpoint servers to request access to plaintext data for specific re-encrypted requests
- Store web request data in the smart contract without plaintext data by default when re-encryption is enabled
- Implement mechanism for endpoint servers to submit decryption requests to the smart contract
- Display real-time notifications to users when external servers request plaintext data access
- Provide user approval interface with options to approve or deny decryption requests
- Show details of the requesting server and the specific data being requested
- Upon user approval, release plaintext data to the smart contract for endpoint server retrieval
- Allow endpoint servers to poll the smart contract to retrieve approved plaintext data
- Track and display status of decryption requests (pending, approved, denied, retrieved)
- Maintain audit log of all decryption requests and user decisions

### User Notifications for Critical TLS Events
- Show prominent in-app notifications (banner or toast) for TLS termination events
- Show notifications when requests are automatically re-encrypted due to external TLS termination
- Display real-time notifications when external servers request plaintext data access
- Show notifications when decryption requests are approved or denied
- Notifications appear whenever a request is detected as having TLS terminated
- Notifications persist until user acknowledges them
- Clear visual indication of critical security events and protective re-encryption actions

### Session Management
- All request data is session-based only
- No long-term storage of request history
- Data is cleared when the session ends
- Each user only sees their own session data

## Proxy Implementation Details

### Idempotent Operation
- The proxy operates idempotently for monitoring and logging purposes
- Does not alter the semantics of HTTP methods or session state
- Repeated processing of the same request yields the same monitoring/logging result
- Preserves original request integrity while providing security monitoring

### Re-Encryptor Feature
- When a request is flagged for TLS termination outside the ICP network, the proxy re-encrypts sensitive data in the request body using a session-specific symmetric key
- Re-encrypted requests are forwarded to external servers with only encrypted data
- External servers must request decryption from the ICP web app if needed to access original data
- All other requests remain unchanged and pass through without modification
- Uses ChaCha20-256 encryption algorithm for strong symmetric encryption
- Web Crypto API is used in the browser extension or frontend for encryption operations
- For each re-encryption operation, a unique nonce/IV is generated using a secure random number generator
- Entropy from user liveliness detection (activity timing and movement patterns) is incorporated when feasible to enhance nonce randomness
- The nonce/IV is stored or transmitted alongside each encrypted payload for decryption purposes

## Backend Requirements
- Store active session request data temporarily for both HTTP(S) and QUIC traffic
- Process and analyze incoming request data for TLS termination indicators across TCP-based TLS and QUIC-based TLS connections
- Handle QUIC/HTTP/3 specific request metadata and connection details
- Detect TLS termination events for both traditional HTTPS and HTTP/3 over QUIC protocols
- Enhanced TLS termination detection logic that identifies data decryption regardless of location (inside or outside ICP network)
- Generate and securely store session-specific ChaCha20-256 encryption keys for each user session
- Automatically re-encrypt request bodies using ChaCha20-256 symmetric encryption when external TLS termination is detected
- Generate unique nonces/IVs for each encryption operation using secure random number generation
- Incorporate entropy from user liveliness data (activity timing, movement patterns) when available to enhance nonce randomness
- Store nonces/IVs alongside encrypted payloads for decryption purposes
- Store web request data without plaintext content by default when re-encryption is enabled
- Provide API endpoints for external servers to submit decryption requests for specific re-encrypted requests
- Store and manage decryption requests with status tracking (pending, approved, denied, retrieved)
- Implement user approval workflow for decryption requests
- Release approved plaintext data to smart contract storage for endpoint server retrieval
- Provide polling mechanism for external servers to retrieve approved plaintext data
- Maintain audit log of all decryption requests and user approval decisions
- Collect and store comprehensive metadata fields using best-effort detection:
  - Authentication status (authenticated/unauthenticated)
  - Key agreement protocol identification
  - Protected user data type detection (e.g., name, personal data)
  - Endpoint/CDN/firewall information (IP address, hostname)
  - CA certificate status validation (good/bad)
  - End-to-end encryption confirmation
  - Mutual authentication status detection
  - Number of intermediary hops calculation
  - Encrypted payload type identification
  - Forward secrecy confirmation per request
- Enhanced filtering API endpoints supporting all metadata fields including advanced filtering combinations
- Provide structured metadata with consistent labeling for frontend display
- Generate CSV and JSON export data for session requests including all metadata fields with proper labeling
- Provide real-time data updates to the frontend including re-encryption events and decryption requests
- Handle user authentication with Internet Identity
- Clear session data and encryption keys when sessions end
- Store and validate user liveliness status and activity timestamps
- Provide configurable inactivity timeout settings
- Handle session invalidation based on user inactivity periods
- Include comprehensive code comments explaining proxy idempotency and ChaCha20-256 re-encryption implementation
- Document encryption algorithm implementation and nonce/IV generation process in backend code
- Provide metadata detection status and confidence levels for each attribute
- Support filter preset configurations for common security analysis scenarios

## Encryption Implementation Notes
- Uses ChaCha20-256 encryption algorithm for strong symmetric encryption
- Web Crypto API is utilized in the browser extension or frontend for encryption operations
- Each encryption operation generates a unique nonce/IV using a cryptographically secure random number generator
- User liveliness data (activity timing, movement patterns) is incorporated as additional entropy when feasible
- Nonces/IVs are stored alongside encrypted payloads to enable proper decryption
- All encryption implementations maintain high security standards for production use
- Document encryption method implementation details and nonce/IV generation process in code comments

## User Interface
- Clean, professional dashboard layout with organized information hierarchy
- Real-time updating request list/table with comprehensive metadata display
- Advanced request filtering controls with intuitive organization:
  - Basic filters section always visible
  - Advanced filters in collapsible/expandable section
  - Clear visual separation between filter categories
  - Active filter indicators and easy reset options
- Comprehensive labeling system for all request attributes:
  - Clear, consistent labels for technical concepts
  - Color-coded visual indicators for security states
  - Icon-based quick identification system
  - Expandable detail views for complex attributes
- Enhanced tooltips and help system:
  - Detailed explanations for each filter and metadata field
  - Detection method explanations and limitations
  - Security considerations for each attribute
  - User-friendly language for technical concepts
- Session export button with format selection (CSV/JSON)
- Prominent alert banner for TLS termination warnings
- Visual indicators showing re-encrypted requests in the request list
- In-app notification system for critical TLS events and re-encryption actions (banner or toast notifications)
- Real-time notifications for external server decryption requests
- User approval interface for decryption requests with approve/deny options
- Display of decryption request details including requesting server information
- Status indicators for decryption requests (pending, approved, denied, retrieved)
- Audit log view for decryption request history
- Enhanced request detail view for examining individual requests including all metadata fields with proper labeling
- Session status indicator
- Browser detection banner with extension installation prompts
- Chrome extension with simple onboarding interface
- Firefox extension with simple onboarding interface
- Extension popup showing proxy status and controls
- Background user activity monitoring with invisible event listeners
- Inactivity warning notifications and re-authentication prompts
- User liveliness status indicators
- Process flow diagram accessible from dashboard or help section
- Comprehensive help dialogs and documentation explaining each filter and metadata field
- Filter preset buttons for common security analysis scenarios
- Application content in English

## Documentation Requirements
- Include detailed project README explaining proxy idempotency and re-encryption features
- Document ChaCha20-256 encryption implementation using Web Crypto API
- Explain nonce/IV generation process including entropy from user liveliness detection
- Provide clear explanations of re-encryptor functionality and external server decryption process
- Document external server decryption request workflow and user approval process
- Explain API endpoints for external servers to submit and retrieve decryption requests
- Include code comments in both backend and frontend explaining ChaCha20-256 implementation details
- Document security considerations and production deployment recommendations
- Provide examples of external server integration for decryption requests
- Document nonce/IV storage and transmission mechanisms
- Comprehensive documentation for all metadata fields including:
  - Detection methods and algorithms used
  - Accuracy limitations and confidence levels
  - Security implications of each attribute
  - Best practices for interpretation
- Document advanced filtering system and preset configurations
- Provide user guide for interpreting security labels and visual indicators
- Document UI organization principles for maintaining usability with comprehensive metadata
- Explain tooltip system and help documentation structure
- Include examples of common security analysis workflows using the filtering system
- Document labeling consistency standards and visual indicator meanings
- Provide troubleshooting guide for metadata detection issues
- Application content and documentation in English
