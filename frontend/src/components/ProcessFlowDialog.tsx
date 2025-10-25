import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Shield, Lock, RefreshCw, AlertTriangle, Key } from 'lucide-react';

interface ProcessFlowDialogProps {
  trigger?: React.ReactNode;
}

export function ProcessFlowDialog({ trigger }: ProcessFlowDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            How It Works
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Application Documentation</DialogTitle>
          <DialogDescription>
            Complete guide to understanding the Web Request TLS Monitor and Recryptor system, monitoring, and security features
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flow">Process Flow</TabsTrigger>
            <TabsTrigger value="proxy">Proxy Details</TabsTrigger>
            <TabsTrigger value="encryption">Re-Encryption</TabsTrigger>
            <TabsTrigger value="decryption">Decryption Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-4">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <img
                    src="/assets/generated/idx-process-flow-diagram.dim_1200x800.png"
                    alt="Web Request TLS Monitor and Recryptor Process Flow Diagram"
                    className="w-full rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Process Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      The Web Request TLS Monitor and Recryptor provides comprehensive monitoring of web traffic through a secure proxy system.
                      This diagram illustrates the complete workflow from initial setup to data export and decryption approval.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">1. Browser Detection & Extension Setup</h4>
                      <p className="text-sm text-muted-foreground">
                        The application automatically detects your browser (Chrome or Firefox) and prompts you to install
                        the appropriate extension. The extension configures your browser to route traffic through the Web Request TLS Monitor and Recryptor proxy.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">2. Extension Activation</h4>
                      <p className="text-sm text-muted-foreground">
                        Once installed, the extension automatically configures proxy settings for HTTP, HTTPS, and HTTP/3/QUIC traffic.
                        You can enable/disable the proxy through the extension's simple interface.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">3. Internet Identity Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Log in using Internet Identity to access your personal monitoring dashboard. Each user session is isolated
                        and secure, with no cross-user data visibility.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">4. Request Proxying & Monitoring</h4>
                      <p className="text-sm text-muted-foreground">
                        All web requests from your browser pass through the Web Request TLS Monitor and Recryptor proxy, which captures metadata including URLs,
                        methods, protocols, headers, and response status codes. This data is sent to the backend for analysis.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">5. TLS Termination Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        The backend analyzes each request for signs of TLS termination, including suspicious headers, injected
                        JavaScript, QUIC connection manipulation, and handshake anomalies. Alerts are triggered for any detected issues.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">6. Automatic Re-encryption</h4>
                      <p className="text-sm text-muted-foreground">
                        When external TLS termination is detected, the system automatically re-encrypts request bodies using
                        ChaCha20-256 encryption with session-specific keys and unique nonces. This protects your data even if intercepted by external proxies.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">7. External Server Decryption Requests</h4>
                      <p className="text-sm text-muted-foreground">
                        External endpoint servers can submit requests to access plaintext data from re-encrypted requests.
                        These requests appear in your dashboard for review and approval.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">8. User Approval Workflow</h4>
                      <p className="text-sm text-muted-foreground">
                        You receive real-time notifications when external servers request decryption. Review the requesting
                        server details and approve or deny access to the plaintext data.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">9. Real-time Dashboard Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        The dashboard displays all requests in real-time with detailed information, security alerts,
                        re-encryption status, and pending decryption requests. Visual indicators help you quickly identify potential security issues.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">10. Filtering & Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Use powerful filters to analyze requests by protocol, domain, status code, TLS termination status,
                        and re-encryption status. Multiple filters can be applied simultaneously for detailed analysis.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2">11. Session Export</h4>
                      <p className="text-sm text-muted-foreground">
                        Export your complete session data in CSV or JSON format for offline analysis, reporting, or archival.
                        All request details, metadata, and security information are included in the export.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Key Security Features
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>Session-based data storage with automatic cleanup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>Real-time TLS termination detection for all protocols</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>ChaCha20-256 encryption for automatic re-encryption of compromised requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>Unique nonce/IV generation with entropy from user activity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>User-controlled decryption approval workflow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>Audit log of all decryption requests and decisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">•</span>
                        <span>Internet Identity authentication for secure access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="proxy" className="mt-4">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-6">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Idempotent Proxy Operation</h3>
                      <p className="text-sm text-muted-foreground">
                        Understanding how the proxy preserves request integrity
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">What is Idempotency?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The Web Request TLS Monitor and Recryptor proxy is designed to be <strong>idempotent</strong>, meaning it operates purely for monitoring 
                        and logging purposes without altering the semantics of HTTP methods or session state. The proxy acts as 
                        a transparent observer that does not interfere with the normal operation of web requests.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Key Principles
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>No Method Alteration:</strong> HTTP methods (GET, POST, PUT, DELETE, etc.) maintain 
                            their original semantics and behavior
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Session State Preservation:</strong> The proxy does not modify session state, cookies, 
                            or authentication tokens
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Consistent Results:</strong> Repeated processing of the same request yields the same 
                            monitoring and logging results
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Original Integrity:</strong> Request and response data pass through unchanged, 
                            preserving the original communication between client and server
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">What the Proxy Does</h4>
                      <div className="space-y-2">
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Monitors:</strong> Captures 
                            metadata about requests including URLs, methods, protocols, headers, and status codes
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Logs:</strong> Records request 
                            details for real-time dashboard display and session export
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Analyzes:</strong> Detects 
                            security issues like TLS termination without modifying the request
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Protects:</strong> Re-encrypts 
                            compromised data using ChaCha20-256 when external TLS termination is detected (see Re-Encryption tab)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">What the Proxy Does NOT Do</h4>
                      <div className="space-y-2">
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-red-600 dark:text-red-400">✗ Modify Requests:</strong> Does not 
                            change request bodies, headers (except for monitoring), or parameters
                          </p>
                        </div>
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-red-600 dark:text-red-400">✗ Alter Responses:</strong> Does not 
                            modify response data, status codes, or headers from the destination server
                          </p>
                        </div>
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-red-600 dark:text-red-400">✗ Change Behavior:</strong> Does not 
                            affect the functional behavior of web applications or APIs
                          </p>
                        </div>
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-red-600 dark:text-red-400">✗ Store Permanently:</strong> Does not 
                            retain request data beyond the active session
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Important Note
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The only exception to the "no modification" rule is the <strong>Re-Encryptor feature</strong>, 
                        which activates only when external TLS termination is detected. In this case, the proxy re-encrypts 
                        sensitive request body data using ChaCha20-256 to protect it from interception. This is a security 
                        enhancement that does not alter the semantic meaning of the request. See the Re-Encryption tab for details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="text-lg font-semibold mb-3">Technical Implementation</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      The proxy is implemented in Motoko on the Internet Computer, ensuring transparent operation 
                      while providing comprehensive monitoring capabilities. All monitoring operations are performed 
                      asynchronously without blocking or delaying the original request-response cycle.
                    </p>
                    <p>
                      Request metadata is captured and stored temporarily in session-based storage, allowing real-time 
                      dashboard updates without impacting the performance or behavior of proxied applications.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="encryption" className="mt-4">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-6">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Re-Encryptor Feature</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatic protection using ChaCha20-256 encryption for requests with detected TLS termination
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">What is the Re-Encryptor?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The Re-Encryptor is a security feature that automatically protects sensitive data when the proxy 
                        detects that a request has experienced <strong>TLS termination outside the ICP network</strong>. 
                        When this occurs, the proxy re-encrypts the request body using <strong>ChaCha20-256 encryption</strong> with 
                        a session-specific symmetric key and a unique nonce/IV before forwarding it to the external server.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        How It Works
                      </h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">1.</span>
                          <span>
                            <strong>Detection:</strong> The proxy analyzes each request for signs of external TLS 
                            termination (suspicious headers, injected content, QUIC manipulation, etc.)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">2.</span>
                          <span>
                            <strong>Flagging:</strong> If external TLS termination is detected, the request is flagged 
                            for re-encryption to protect sensitive data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">3.</span>
                          <span>
                            <strong>Nonce Generation:</strong> A unique 12-byte nonce/IV is generated using secure random 
                            number generation, enhanced with entropy from user activity timing when available
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">4.</span>
                          <span>
                            <strong>Re-encryption:</strong> The request body is re-encrypted using ChaCha20-256 with the 
                            session-specific key and unique nonce
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">5.</span>
                          <span>
                            <strong>Storage:</strong> The encrypted data and nonce are stored together in the smart contract 
                            for potential decryption upon user approval
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">6.</span>
                          <span>
                            <strong>Forwarding:</strong> The re-encrypted request is forwarded to the external server, 
                            which receives only encrypted data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">7.</span>
                          <span>
                            <strong>Decryption Request:</strong> The external server can submit a decryption request 
                            to the smart contract if it needs access to the original plaintext data
                          </span>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Benefits</h4>
                      <div className="space-y-2">
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Automatic Protection:</strong> 
                            No user action required - re-encryption happens automatically when threats are detected
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Strong Encryption:</strong> 
                            ChaCha20-256 provides military-grade encryption with authenticated encryption via Poly1305
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Unique Nonces:</strong> 
                            Each encryption operation uses a unique nonce/IV, preventing replay attacks and ensuring security
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Enhanced Entropy:</strong> 
                            Nonce generation incorporates entropy from user activity timing for additional randomness
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ User Control:</strong> 
                            You decide whether to release plaintext data to external servers through the approval workflow
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Session-Specific Keys:</strong> 
                            Each user session has unique encryption keys, preventing cross-session attacks
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Important: Selective Re-encryption
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        The Re-Encryptor only activates for requests flagged with <strong>external TLS termination</strong>. 
                        All other requests remain completely unchanged and pass through the proxy without any modification 
                        to their bodies, headers, or parameters.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This selective approach ensures that the proxy maintains its idempotent operation for normal 
                        traffic while providing enhanced protection only when security threats are detected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="text-lg font-semibold mb-3">ChaCha20-256 Encryption Implementation</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Encryption Algorithm</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The system uses <strong>ChaCha20-Poly1305</strong>, a modern authenticated encryption algorithm 
                        that combines the ChaCha20 stream cipher with the Poly1305 message authentication code. This provides 
                        both confidentiality and authenticity for encrypted data.
                      </p>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                      <h4 className="font-semibold text-sm mb-2">Technical Details</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Algorithm:</strong> ChaCha20-Poly1305 (AEAD - Authenticated Encryption with Associated Data)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Key Size:</strong> 256 bits (32 bytes) for maximum security
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Nonce/IV Size:</strong> 96 bits (12 bytes) as required by ChaCha20-Poly1305
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Implementation:</strong> Web Crypto API in the browser extension or frontend
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Random Generation:</strong> crypto.getRandomValues() for cryptographically secure randomness
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Entropy Enhancement:</strong> User activity timing data XORed with random nonce for additional entropy
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Nonce/IV Generation Process</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        Each encryption operation generates a unique nonce/IV through the following process:
                      </p>
                      <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li>1. Generate 12 cryptographically secure random bytes using crypto.getRandomValues()</li>
                        <li>2. If user activity data is available, derive entropy from recent activity timestamps</li>
                        <li>3. XOR the random nonce with activity-derived entropy for enhanced randomness</li>
                        <li>4. Store the nonce alongside the encrypted data for decryption purposes</li>
                      </ol>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Security Advantages
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Production-Ready:</strong> ChaCha20-256 is suitable for production use with sensitive data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Authenticated Encryption:</strong> Poly1305 MAC ensures data integrity and authenticity
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Resistance to Attacks:</strong> Unique nonces prevent replay attacks and ensure semantic security
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Performance:</strong> ChaCha20 is optimized for software implementations and provides excellent performance
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            <strong>Standards Compliance:</strong> Widely adopted and standardized (RFC 8439)
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">User Activity Entropy</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The system leverages the user liveliness detection feature to enhance nonce randomness. User activity 
                        timing data (keyboard and mouse events) provides additional entropy that is combined with cryptographically 
                        secure random values. This creates an extra layer of unpredictability in the nonce generation process, 
                        making it even more difficult for attackers to predict or reproduce nonces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="decryption" className="mt-4">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-6">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Decryption Approval Workflow</h3>
                      <p className="text-sm text-muted-foreground">
                        User-controlled access to plaintext data from re-encrypted requests
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">What is the Decryption Approval System?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        When a request is re-encrypted due to external TLS termination, the plaintext data is stored 
                        securely in the smart contract but is <strong>not automatically accessible</strong> to external 
                        servers. External endpoint servers must submit a decryption request to access the original data, 
                        and you have full control over whether to approve or deny these requests.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border/50 bg-card p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Complete Workflow
                      </h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">1.</span>
                          <span>
                            <strong>Re-encryption:</strong> When external TLS termination is detected, the request 
                            body is re-encrypted using ChaCha20-256 with a unique nonce, and both the encrypted data 
                            and nonce are stored securely in the smart contract
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">2.</span>
                          <span>
                            <strong>Server Request:</strong> The external endpoint server receives the encrypted data 
                            and can submit a decryption request to the smart contract if it needs the plaintext
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">3.</span>
                          <span>
                            <strong>User Notification:</strong> You receive a real-time notification in the dashboard 
                            showing the pending decryption request with details about the requesting server
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">4.</span>
                          <span>
                            <strong>Review & Decision:</strong> You review the request details and decide whether to 
                            approve or deny access to the plaintext data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">5.</span>
                          <span>
                            <strong>Data Release:</strong> If approved, the plaintext data is released to the smart 
                            contract and marked as available for the endpoint server to retrieve
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">6.</span>
                          <span>
                            <strong>Server Retrieval:</strong> The endpoint server polls the smart contract and 
                            retrieves the approved plaintext data using the stored nonce for decryption
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-primary">7.</span>
                          <span>
                            <strong>Audit Log:</strong> All decryption requests and your decisions are logged for 
                            complete transparency and auditing
                          </span>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Features</h4>
                      <div className="space-y-2">
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ User Control:</strong> 
                            You have complete control over who can access your plaintext data
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Real-time Notifications:</strong> 
                            Instant alerts when external servers request decryption
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Request Details:</strong> 
                            View complete information about the requesting server and the specific data being requested
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Status Tracking:</strong> 
                            Monitor the status of all decryption requests (pending, approved, denied, retrieved)
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-emerald-600 dark:text-emerald-400">✓ Audit Trail:</strong> 
                            Complete history of all decryption requests and your approval decisions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Security Considerations
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            Only you (the data owner) can approve or deny decryption requests for your data
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            Plaintext data is never automatically released without your explicit approval
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            The nonce/IV is stored alongside encrypted data to enable proper decryption
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            All decryption requests are tracked with detailed status updates for transparency
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            The system maintains a full audit log of all requests and decisions
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">•</span>
                          <span>
                            Data is only released when you explicitly approve the request
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="text-lg font-semibold mb-3">Using the Decryption Requests Dialog</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Accessing Decryption Requests</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Click the "Decryption Requests" button in the dashboard header to view all pending and processed 
                        decryption requests. A notification badge shows the number of pending requests awaiting your approval.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Reviewing Requests</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        Each pending request displays:
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                        <li>• Request ID for tracking</li>
                        <li>• Requesting server information</li>
                        <li>• Timestamp of the request</li>
                        <li>• Security alert explaining the request</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Making Decisions</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        For each pending request, you can click "Approve" to release the plaintext data or "Deny" to 
                        refuse access. Once you make a decision, the request moves to the history section with its 
                        updated status.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Request History</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The history section shows all processed requests with their current status: Approved (data released), 
                        Denied (access refused), or Retrieved (data successfully obtained by the server). This provides a 
                        complete audit trail of all decryption activities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>
                        Review each decryption request carefully before approving
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>
                        Verify that the requesting server is legitimate and expected
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>
                        Deny requests from unknown or suspicious servers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>
                        Regularly review your decryption request history for unusual activity
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

