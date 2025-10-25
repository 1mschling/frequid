import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RequestData, FilterOptions, DecryptionRequest } from '../backend';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

const REQUESTS_QUERY_KEY = ['requests'];
const TLS_ALERTS_QUERY_KEY = ['tls-alerts'];
const REENCRYPTED_REQUESTS_QUERY_KEY = ['reencrypted-requests'];
const DECRYPTION_REQUESTS_QUERY_KEY = ['decryption-requests'];

export function useGetAllRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<RequestData[]>({
    queryKey: REQUESTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });
}

export function useGetFilteredRequests(filters: FilterOptions) {
  const { actor, isFetching } = useActor();

  return useQuery<RequestData[]>({
    queryKey: ['filtered-requests', filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFilteredRequests(filters);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useGetTlsAlerts() {
  const { actor, isFetching } = useActor();
  const previousCountRef = useRef<number>(0);

  const query = useQuery<RequestData[]>({
    queryKey: TLS_ALERTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTlsAlerts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Show toast notification when new TLS alerts are detected
  useEffect(() => {
    if (query.data && query.data.length > previousCountRef.current) {
      const newAlerts = query.data.length - previousCountRef.current;
      toast.error('TLS Termination Detected!', {
        description: `${newAlerts} new request${newAlerts > 1 ? 's have' : ' has'} experienced TLS termination. Your connection may be intercepted.`,
        duration: 10000,
      });
    }
    if (query.data) {
      previousCountRef.current = query.data.length;
    }
  }, [query.data]);

  return query;
}

export function useGetReEncryptedRequests() {
  const { actor, isFetching } = useActor();
  const previousCountRef = useRef<number>(0);

  const query = useQuery<RequestData[]>({
    queryKey: REENCRYPTED_REQUESTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const filters: FilterOptions = { reEncrypted: true };
      return actor.getFilteredRequests(filters);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });

  // Show toast notification when new re-encrypted requests are detected
  useEffect(() => {
    if (query.data && query.data.length > previousCountRef.current) {
      const newReEncrypted = query.data.length - previousCountRef.current;
      toast.info('Request Re-encrypted', {
        description: `${newReEncrypted} request${newReEncrypted > 1 ? 's have' : ' has'} been automatically re-encrypted due to external TLS termination.`,
        duration: 8000,
      });
    }
    if (query.data) {
      previousCountRef.current = query.data.length;
    }
  }, [query.data]);

  return query;
}

export function useGetUserDecryptionRequests() {
  const { actor, isFetching } = useActor();
  const previousCountRef = useRef<number>(0);

  const query = useQuery<DecryptionRequest[]>({
    queryKey: DECRYPTION_REQUESTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserDecryptionRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Show toast notification when new decryption requests are detected
  useEffect(() => {
    if (query.data && query.data.length > previousCountRef.current) {
      const newRequests = query.data.length - previousCountRef.current;
      const pendingRequests = query.data.filter(req => req.status === 'pending').length;
      
      if (pendingRequests > 0) {
        toast.warning('Decryption Request Received', {
          description: `${newRequests} new decryption request${newRequests > 1 ? 's have' : ' has'} been received from external servers. Review and approve or deny.`,
          duration: 10000,
        });
      }
    }
    if (query.data) {
      previousCountRef.current = query.data.length;
    }
  }, [query.data]);

  return query;
}

export function useApproveDecryptionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.approveDecryptionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DECRYPTION_REQUESTS_QUERY_KEY });
      toast.success('Decryption request approved', {
        description: 'The plaintext data has been released to the endpoint server.',
      });
    },
    onError: (error) => {
      toast.error('Failed to approve decryption request', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDenyDecryptionRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.denyDecryptionRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DECRYPTION_REQUESTS_QUERY_KEY });
      toast.success('Decryption request denied', {
        description: 'The endpoint server will not receive access to the plaintext data.',
      });
    },
    onError: (error) => {
      toast.error('Failed to deny decryption request', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useGetRequest(requestId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RequestData | null>({
    queryKey: ['request', requestId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRequest(requestId);
    },
    enabled: !!actor && !isFetching && !!requestId,
  });
}

export function useClearSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TLS_ALERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REENCRYPTED_REQUESTS_QUERY_KEY });
      toast.success('Session cleared successfully');
    },
    onError: (error) => {
      toast.error('Failed to clear session', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useEndSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.endSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TLS_ALERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REENCRYPTED_REQUESTS_QUERY_KEY });
      toast.success('Session ended successfully');
    },
    onError: (error) => {
      toast.error('Failed to end session', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useExportSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.exportSession(format);
    },
    onSuccess: (data, format) => {
      // Create a blob and download the file
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-export-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Session exported as ${format.toUpperCase()}`, {
        description: 'Download started successfully',
      });
    },
    onError: (error) => {
      toast.error('Failed to export session', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
