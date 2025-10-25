import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRequests, useGetTlsAlerts, useClearSession, useExportSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Shield,
  AlertTriangle,
  Activity,
  Download,
  Trash2,
  LogOut,
  Info,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Chrome,
  Settings,
} from 'lucide-react';
import { RequestDetailsDialog } from '@/components/RequestDetailsDialog';
import { RequestFilters } from '@/components/RequestFilters';
import { LivelinessIndicator } from '@/components/LivelinessIndicator';
import { ProcessFlowDialog } from '@/components/ProcessFlowDialog';
import { DecryptionRequestsDialog } from '@/components/DecryptionRequestsDialog';
import { ExtensionInstallGuideDialog } from '@/components/ExtensionInstallGuideDialog';
import { ProxyConfigDialog } from '@/components/ProxyConfigDialog';
import type { RequestData, FilterOptions } from '../backend';
import { useQueryClient } from '@tanstack/react-query';

export function DashboardPage() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading } = useGetAllRequests();
  const { data: tlsAlerts = [] } = useGetTlsAlerts();
  const clearSession = useClearSession();
  const exportSession = useExportSession();

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleClearSession = async () => {
    if (confirm('Are you sure you want to clear all session data? This action cannot be undone.')) {
      await clearSession.mutateAsync();
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    const data = await exportSession.mutateAsync(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-export-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredRequests = requests.filter((request) => {
    if (Object.keys(filters).length === 0) return true;

    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;

      if (key === 'domain') {
        return request.url.toLowerCase().includes((value as string).toLowerCase());
      }

      if (key === 'statusCode') {
        return request.responseStatus === BigInt(value as number);
      }

      if (key === 'intermediaryHops') {
        return request.intermediaryHops === BigInt(value as number);
      }

      const requestValue = request[key as keyof RequestData];
      return requestValue === value;
    });
  });

  const getStatusColor = (status: bigint) => {
    const statusNum = Number(status);
    if (statusNum >= 200 && statusNum < 300) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (statusNum >= 300 && statusNum < 400) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (statusNum >= 400 && statusNum < 500) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const getProtocolColor = (protocol: string) => {
    if (protocol.includes('HTTP/3') || protocol.includes('QUIC')) {
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    }
    if (protocol.includes('HTTPS') || protocol.includes('HTTP/2')) {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">Web Request TLS Monitor</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <LivelinessIndicator onInactive={handleLogout} />
            </div>
            <div className="flex items-center gap-2">
              <ProxyConfigDialog />
              <ExtensionInstallGuideDialog 
                trigger={
                  <Button variant="outline" size="sm">
                    <Chrome className="mr-2 h-4 w-4" />
                    Extension Guide
                  </Button>
                }
              />
              <ProcessFlowDialog />
              <DecryptionRequestsDialog />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto flex-1 space-y-6 p-4 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
                <p className="text-xs text-muted-foreground">Monitored in this session</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TLS Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tlsAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Potential security concerns</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Re-encrypted</CardTitle>
                <Lock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requests.filter((r) => r.reEncrypted).length}
                </div>
                <p className="text-xs text-muted-foreground">Protected with ChaCha20-256</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Request Monitor</CardTitle>
                  <CardDescription>Real-time view of proxied web requests via ICP canister</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSession}
                    disabled={clearSession.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Session
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RequestFilters filters={filters} onFiltersChange={setFilters} />

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading requests...</p>
                  </div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold">No Requests Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    {requests.length === 0
                      ? 'Start browsing with the extension enabled to see requests here'
                      : 'No requests match your current filters'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRequests.map((request, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={getProtocolColor(request.protocol)}>
                              {request.protocol}
                            </Badge>
                            <Badge variant="outline" className="font-mono">
                              {request.method}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.responseStatus)}>
                              {request.responseStatus.toString()}
                            </Badge>
                            {request.tlsTerminated && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    TLS Alert
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    TLS termination detected outside ICP network. This may indicate a proxy or intermediary handling encryption.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {request.reEncrypted && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    <Lock className="mr-1 h-3 w-3" />
                                    Re-encrypted
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Request body re-encrypted with ChaCha20-256 using session-specific key and user activity entropy.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {request.authenticationStatus && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                    <Shield className="mr-1 h-3 w-3" />
                                    {request.authenticationStatus}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Authentication status detected from headers (Authorization, Cookie, etc.)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {request.endToEndEncryption !== undefined && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className={request.endToEndEncryption ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}>
                                    {request.endToEndEncryption ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                    E2E
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    End-to-end encryption status inferred from protocol and headers
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {request.forwardSecrecy !== undefined && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className={request.forwardSecrecy ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                                    {request.forwardSecrecy ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <HelpCircle className="mr-1 h-3 w-3" />}
                                    PFS
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Perfect Forward Secrecy status based on key agreement protocol
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground break-all">{request.url}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Number(request.timestamp) / 1000000).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {selectedRequest && (
          <RequestDetailsDialog
            request={selectedRequest}
            open={!!selectedRequest}
            onOpenChange={(open) => !open && setSelectedRequest(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
