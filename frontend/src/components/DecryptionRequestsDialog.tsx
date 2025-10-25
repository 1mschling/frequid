import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetUserDecryptionRequests, useApproveDecryptionRequest, useDenyDecryptionRequest } from '../hooks/useQueries';
import { Key, Clock, Server, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import type { DecryptionRequest } from '../backend';
import { format } from 'date-fns';

interface DecryptionRequestsDialogProps {
  trigger?: React.ReactNode;
}

export function DecryptionRequestsDialog({ trigger }: DecryptionRequestsDialogProps) {
  const { data: decryptionRequests = [], isLoading } = useGetUserDecryptionRequests();
  const approveMutation = useApproveDecryptionRequest();
  const denyMutation = useDenyDecryptionRequest();

  const pendingRequests = decryptionRequests.filter(req => req.status === 'pending');
  const processedRequests = decryptionRequests.filter(req => req.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Denied</Badge>;
      case 'retrieved':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Retrieved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async (requestId: string) => {
    await approveMutation.mutateAsync(requestId);
  };

  const handleDeny = async (requestId: string) => {
    await denyMutation.mutateAsync(requestId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="relative">
            <Key className="h-4 w-4 mr-2" />
            Decryption Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Decryption Requests
          </DialogTitle>
          <DialogDescription>
            Review and manage decryption requests from external servers
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {pendingRequests.length > 0 && (
              <Alert variant="default" className="border-2 border-amber-500/50 bg-amber-500/5">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="font-semibold text-amber-600 dark:text-amber-400">
                  Pending Approval Required
                </AlertTitle>
                <AlertDescription>
                  You have {pendingRequests.length} pending decryption request{pendingRequests.length > 1 ? 's' : ''} waiting for your approval.
                  External servers are requesting access to plaintext data from re-encrypted requests.
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Loading decryption requests...</p>
                </div>
              </div>
            ) : decryptionRequests.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Key className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No decryption requests</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    External servers haven't requested access to any re-encrypted data yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingRequests.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Pending Requests ({pendingRequests.length})
                    </h3>
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <DecryptionRequestCard
                          key={request.requestId}
                          request={request}
                          onApprove={handleApprove}
                          onDeny={handleDeny}
                          isApproving={approveMutation.isPending}
                          isDenying={denyMutation.isPending}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {processedRequests.length > 0 && (
                  <>
                    {pendingRequests.length > 0 && <Separator />}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Request History ({processedRequests.length})
                      </h3>
                      <div className="space-y-3">
                        {processedRequests.map((request) => (
                          <div
                            key={request.requestId}
                            className="rounded-lg border border-border/50 bg-card p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getStatusBadge(request.status)}
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {request.requestId}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Server className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{request.endpointServer}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(Number(request.timestamp) / 1_000_000), 'PPpp')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface DecryptionRequestCardProps {
  request: DecryptionRequest;
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  isApproving: boolean;
  isDenying: boolean;
}

function DecryptionRequestCard({ request, onApprove, onDeny, isApproving, isDenying }: DecryptionRequestCardProps) {
  const timestamp = Number(request.timestamp) / 1_000_000;
  const formattedDate = format(new Date(timestamp), 'PPpp');

  return (
    <div className="rounded-lg border-2 border-amber-500/50 bg-amber-500/5 p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Pending Approval
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">
                {request.requestId}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Requesting Server</p>
                  <p className="text-sm font-medium">{request.endpointServer}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Request Time</p>
                  <p className="text-sm">{formattedDate}</p>
                </div>
              </div>
            </div>

            <Alert className="border-blue-500/20 bg-blue-500/5">
              <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-xs">
                This server is requesting access to the plaintext data from a re-encrypted request.
                Approving will release the decrypted data to the endpoint server for retrieval.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onApprove(request.requestId)}
            disabled={isApproving || isDenying}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeny(request.requestId)}
            disabled={isApproving || isDenying}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Deny
          </Button>
        </div>
      </div>
    </div>
  );
}
