import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Clock, Globe, ArrowRight, Network, Lock, ShieldCheck, Key, Shield, CheckCircle2, XCircle, ShieldAlert, Info } from 'lucide-react';
import type { RequestData } from '../backend';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RequestDetailsDialogProps {
  request: RequestData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsDialog({ request, open, onOpenChange }: RequestDetailsDialogProps) {
  if (!request) return null;

  const timestamp = Number(request.timestamp) / 1_000_000;
  const formattedDate = format(new Date(timestamp), 'PPpp');
  const status = Number(request.responseStatus);

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      DELETE: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      PATCH: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    };
    return colors[method] || 'bg-muted text-muted-foreground border-border';
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-600 dark:text-emerald-400';
    if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
    if (status >= 400 && status < 500) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProtocolColor = (protocol: string) => {
    if (protocol === 'HTTP/3') {
      return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
    }
    if (protocol === 'HTTP/2') {
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    }
    return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Request Details
            </DialogTitle>
            <DialogDescription>Complete information about this proxied request with comprehensive security metadata</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <div className="space-y-6">
              {request.tlsTerminated && (
                <Alert variant="destructive" className="border-2">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle className="font-semibold">TLS Termination Detected</AlertTitle>
                  <AlertDescription>
                    This request shows signs of TLS termination, indicating potential proxy
                    interference or data decryption. The connection may not be end-to-end encrypted.
                    This detection applies to all protocols including HTTP/3/QUIC traffic.
                    {request.protocol === 'HTTP/3' && request.quicData && !request.quicData.tlsHandshake && (
                      <span className="block mt-2">
                        <strong>QUIC Alert:</strong> TLS handshake failure detected in QUIC connection, indicating possible decryption or manipulation.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {request.reEncrypted && (
                <Alert className="border-2 border-primary/50 bg-primary/5">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold text-primary">Request Re-encrypted</AlertTitle>
                  <AlertDescription>
                    This request was automatically re-encrypted due to external TLS termination detection.
                    The request body has been protected with session-specific encryption before forwarding
                    to the destination server. Only authorized servers can decrypt this data.
                    {request.encryptedPayloadType && (
                      <span className="block mt-2">
                        <strong>Encryption:</strong> {request.encryptedPayloadType}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Request Information
                </h3>
                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getMethodColor(request.method)}>
                      {request.method}
                    </Badge>
                    <Badge variant="outline" className={getProtocolColor(request.protocol)}>
                      {request.protocol === 'HTTP/3' && (
                        <Network className="mr-1 h-3 w-3" />
                      )}
                      {request.protocol}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm font-mono font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    {request.reEncrypted && (
                      <Badge variant="default" className="gap-1 bg-primary/90">
                        <Lock className="h-3 w-3" />
                        Re-encrypted
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">URL</p>
                    <p className="break-all text-sm font-mono">{request.url}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formattedDate}
                  </div>
                </div>
              </div>

              {/* Security Metadata */}
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Metadata
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">Security attributes are detected using best-effort analysis of headers, certificates, and connection properties. Some values may have detection limitations.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg border border-border/50 bg-muted/30 p-4">
                  {request.authenticationStatus && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Authentication Status</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Detected from authentication headers and certificate validation. Best-effort detection.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant={request.authenticationStatus === 'authenticated' ? 'default' : 'secondary'}>
                        {request.authenticationStatus === 'authenticated' ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {request.authenticationStatus}
                      </Badge>
                    </div>
                  )}
                  {request.keyAgreementProtocol && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Key Agreement Protocol</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Key exchange protocol used for establishing secure connection (e.g., ECDHE, DHE). Detection is best-effort.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm font-mono">{request.keyAgreementProtocol}</p>
                    </div>
                  )}
                  {request.caCertificateStatus && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">CA Certificate Status</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Certificate Authority validation status. Indicates whether the certificate chain is trusted.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant={request.caCertificateStatus === 'good' ? 'default' : 'destructive'}>
                        {request.caCertificateStatus === 'good' ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {request.caCertificateStatus}
                      </Badge>
                    </div>
                  )}
                  {request.endToEndEncryption !== undefined && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">End-to-End Encryption</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Whether the connection maintains encryption without intermediary decryption. Critical for data privacy.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant={request.endToEndEncryption ? 'default' : 'secondary'}>
                        {request.endToEndEncryption ? (
                          <ShieldCheck className="mr-1 h-3 w-3" />
                        ) : (
                          <ShieldAlert className="mr-1 h-3 w-3" />
                        )}
                        {request.endToEndEncryption ? 'Confirmed' : 'Not Confirmed'}
                      </Badge>
                    </div>
                  )}
                  {request.mutualAuthentication !== undefined && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Mutual Authentication</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Whether both client and server authenticate each other (mTLS). Provides stronger security guarantees.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant={request.mutualAuthentication ? 'default' : 'secondary'}>
                        {request.mutualAuthentication ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  )}
                  {request.forwardSecrecy !== undefined && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Forward Secrecy (PFS)</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Perfect Forward Secrecy ensures past communications remain secure even if keys are compromised. Detection is best-effort.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant={request.forwardSecrecy ? 'default' : 'secondary'}>
                        {request.forwardSecrecy ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {request.forwardSecrecy ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  )}
                  {request.protectedDataType && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Protected Data Type</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Type of sensitive data detected in the request (e.g., personal info, credentials, financial data).</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant="outline">{request.protectedDataType}</Badge>
                    </div>
                  )}
                  {request.endpointInfo && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Endpoint Information</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">IP address or hostname of the endpoint, CDN, or firewall handling the request.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm font-mono break-all">{request.endpointInfo}</p>
                    </div>
                  )}
                  {request.intermediaryHops !== undefined && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Intermediary Hops</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Number of intermediary hops detected based on proxy headers. Best-effort calculation.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm font-mono">{Number(request.intermediaryHops)}</p>
                    </div>
                  )}
                  {request.encryptedPayloadType && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs text-muted-foreground">Encrypted Payload Type</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Encryption algorithm used for re-encrypted payloads (e.g., ChaCha20-256, AES-256-GCM).</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge variant="default" className="gap-1">
                        <Key className="h-3 w-3" />
                        {request.encryptedPayloadType}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {request.quicData && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      QUIC Connection Details
                    </h3>
                    <div className="space-y-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Connection ID</p>
                          <p className="text-sm font-mono break-all">{request.quicData.connectionId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Stream ID</p>
                          <p className="text-sm font-mono">{Number(request.quicData.streamId)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">QUIC Version</p>
                          <p className="text-sm font-mono">{request.quicData.quicVersion}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">TLS Handshake</p>
                          <Badge 
                            variant={request.quicData.tlsHandshake ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {request.quicData.tlsHandshake ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                      
                      {request.quicData.http3Headers.length > 0 && (
                        <>
                          <Separator className="my-3" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">HTTP/3 Headers</p>
                            <div className="space-y-2">
                              {request.quicData.http3Headers.map(([key, value], index) => (
                                <div key={index} className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">{key}</p>
                                  <p className="break-all text-sm font-mono">{value}</p>
                                  {index < request.quicData!.http3Headers.length - 1 && (
                                    <Separator className="mt-2" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Request Headers
                </h3>
                {request.requestHeaders.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No request headers</p>
                ) : (
                  <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4">
                    {request.requestHeaders.map(([key, value], index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{key}</p>
                        <p className="break-all text-sm font-mono">{value}</p>
                        {index < request.requestHeaders.length - 1 && (
                          <Separator className="mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Response Headers
                </h3>
                {request.responseHeaders.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No response headers</p>
                ) : (
                  <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4">
                    {request.responseHeaders.map(([key, value], index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{key}</p>
                        <p className="break-all text-sm font-mono">{value}</p>
                        {index < request.responseHeaders.length - 1 && (
                          <Separator className="mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
