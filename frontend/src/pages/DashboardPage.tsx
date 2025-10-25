import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRequests, useGetFilteredRequests, useGetTlsAlerts, useGetReEncryptedRequests, useGetUserDecryptionRequests, useClearSession, useExportSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RequestDetailsDialog } from '../components/RequestDetailsDialog';
import { ExtensionBanner } from '@/components/ExtensionBanner';
import { RequestFilters } from '../components/RequestFilters';
import { LivelinessIndicator } from '../components/LivelinessIndicator';
import { ProcessFlowDialog } from '../components/ProcessFlowDialog';
import { DecryptionRequestsDialog } from '../components/DecryptionRequestsDialog';
import { Shield, LogOut, Activity, AlertTriangle, RefreshCw, Download, Lock, Key, CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Network } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { RequestData, FilterOptions } from '../backend';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DashboardPage() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterOptions>({});
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);
  
  const { data: allRequests = [] } = useGetAllRequests();
  const { data: filteredRequests = [], isLoading, refetch, isFetching } = useGetFilteredRequests(filters);
  const { data: tlsAlerts = [] } = useGetTlsAlerts();
  const { data: reEncryptedRequests = [] } = useGetReEncryptedRequests();
  const { data: decryptionRequests = [] } = useGetUserDecryptionRequests();
  const clearSessionMutation = useClearSession();
  const exportSessionMutation = useExportSession();
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);

  const requests = hasActiveFilters ? filteredRequests : allRequests;
  const pendingDecryptionRequests = decryptionRequests.filter(req => req.status === 'pending');

  const principal = identity?.getPrincipal().toString() || '';
  const shortPrincipal = principal ? `${principal.slice(0, 8)}...${principal.slice(-6)}` : '';

  // Handle user inactivity - clear session and log out
  const handleInactive = useCallback(async () => {
    queryClient.clear();
    await clear();
  }, [clear, queryClient]);

  const handleClearSession = () => {
    clearSessionMutation.mutate();
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportSessionMutation.mutate(format);
  };

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
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Web Request TLS Monitor and Recryptor</h1>
                <p className="text-xs text-muted-foreground">{shortPrincipal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LivelinessIndicator onInactive={handleInactive} />
              <DecryptionRequestsDialog />
              <ProcessFlowDialog />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={exportSessionMutation.isPending || allRequests.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={clear}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto flex-1 space-y-6 p-4 pb-8">
          <ExtensionBanner variant="compact" />

          {pendingDecryptionRequests.length > 0 && (
            <Alert className="border-2 border-amber-500/50 bg-amber-500/5 shadow-lg animate-in fade-in slide-in-from-top-2">
              <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                Decryption Request Pending
              </AlertTitle>
              <AlertDescription>
                {pendingDecryptionRequests.length} external server{pendingDecryptionRequests.length > 1 ? 's are' : ' is'} requesting 
                access to plaintext data from re-encrypted requests. Review and approve or deny these requests.
                <DecryptionRequestsDialog 
                  trigger={
                    <Button variant="outline" size="sm" className="mt-3">
                      <Key className="h-4 w-4 mr-2" />
                      Review Requests
                    </Button>
                  }
                />
              </AlertDescription>
            </Alert>
          )}

          {tlsAlerts.length > 0 && (
            <Alert variant="destructive" className="border-2 shadow-lg animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">TLS Termination Detected!</AlertTitle>
              <AlertDescription className="mt-2">
                {tlsAlerts.length} request{tlsAlerts.length > 1 ? 's have' : ' has'} experienced TLS
                termination. Your connection may be intercepted by a proxy. This includes any data decryption
                detected in HTTP/3/QUIC traffic or suspicious headers indicating proxy interference.
                {reEncryptedRequests.length > 0 && (
                  <span className="block mt-2 font-medium">
                    {reEncryptedRequests.length} request{reEncryptedRequests.length > 1 ? 's have' : ' has'} been automatically re-encrypted for protection.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{allRequests.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Current session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  TLS Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{tlsAlerts.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Security warnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Re-encrypted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{reEncryptedRequests.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Protected requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Decryption Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {pendingDecryptionRequests.length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Pending approval</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Request Activity
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Real-time monitoring of proxied web requests with comprehensive security metadata
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequestFilters filters={filters} onFiltersChange={setFilters} />
              
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading requests...</p>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {hasActiveFilters ? 'No requests match your filters' : 'No requests yet'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {hasActiveFilters 
                        ? 'Try adjusting your filter criteria' 
                        : 'Requests will appear here as they are proxied'}
                    </p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {requests.map((request, index) => {
                      const timestamp = Number(request.timestamp) / 1_000_000;
                      const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
                      const status = Number(request.responseStatus);

                      return (
                        <div key={index}>
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="w-full rounded-lg border border-border/50 bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                {/* Primary badges row */}
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
                                  <span className={`text-sm font-mono font-medium ${getStatusColor(status)}`}>
                                    {status}
                                  </span>
                                  {request.tlsTerminated && (
                                    <Badge variant="destructive" className="gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      TLS Alert
                                    </Badge>
                                  )}
                                  {request.reEncrypted && (
                                    <Badge variant="default" className="gap-1 bg-primary/90">
                                      <Lock className="h-3 w-3" />
                                      Re-encrypted
                                    </Badge>
                                  )}
                                </div>

                                {/* URL */}
                                <p className="break-all text-sm font-medium">{request.url}</p>

                                {/* Security metadata badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {request.authenticationStatus && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline" 
                                          className={
                                            request.authenticationStatus === 'authenticated'
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                          }
                                        >
                                          {request.authenticationStatus === 'authenticated' ? (
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                          ) : (
                                            <XCircle className="mr-1 h-3 w-3" />
                                          )}
                                          Auth: {request.authenticationStatus}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Authentication status detected from headers and certificates</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.endToEndEncryption !== undefined && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline"
                                          className={
                                            request.endToEndEncryption
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                          }
                                        >
                                          {request.endToEndEncryption ? (
                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                          ) : (
                                            <ShieldAlert className="mr-1 h-3 w-3" />
                                          )}
                                          E2E: {request.endToEndEncryption ? 'Yes' : 'No'}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">End-to-end encryption status</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.forwardSecrecy !== undefined && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline"
                                          className={
                                            request.forwardSecrecy
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                          }
                                        >
                                          <Key className="mr-1 h-3 w-3" />
                                          PFS: {request.forwardSecrecy ? 'Yes' : 'No'}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Perfect Forward Secrecy status</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.keyAgreementProtocol && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                                          Key: {request.keyAgreementProtocol}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Key agreement protocol used</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.caCertificateStatus && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline"
                                          className={
                                            request.caCertificateStatus === 'good'
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                          }
                                        >
                                          CA: {request.caCertificateStatus}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Certificate Authority validation status</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.mutualAuthentication !== undefined && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline"
                                          className={
                                            request.mutualAuthentication
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                          }
                                        >
                                          mTLS: {request.mutualAuthentication ? 'Yes' : 'No'}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Mutual authentication status</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.intermediaryHops !== undefined && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                                          Hops: {Number(request.intermediaryHops)}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Number of intermediary hops detected</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.protectedDataType && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                          Data: {request.protectedDataType}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Type of protected data detected</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                  {request.encryptedPayloadType && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                          <Lock className="mr-1 h-3 w-3" />
                                          {request.encryptedPayloadType}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Encryption algorithm used for payload</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>

                                {/* Timestamp */}
                                <p className="text-xs text-muted-foreground">{timeAgo}</p>
                              </div>
                            </div>
                          </button>
                          {index < requests.length - 1 && <Separator className="my-3" />}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </main>

        <footer className="border-t border-border/40 bg-muted/30 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2025. Built with <span className="text-destructive">♥</span> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>

        <RequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      </div>
    </TooltipProvider>
  );
}
