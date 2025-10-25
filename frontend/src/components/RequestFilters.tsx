import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, Info } from 'lucide-react';
import type { FilterOptions } from '../backend';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RequestFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function RequestFilters({ filters, onFiltersChange }: RequestFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleProtocolChange = (value: string) => {
    if (value === 'all') {
      const { protocol, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, protocol: value });
    }
  };

  const handleDomainChange = (value: string) => {
    if (value.trim() === '') {
      const { domain, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, domain: value });
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      const { statusCode, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, statusCode: BigInt(value) });
    }
  };

  const handleTlsChange = (value: string) => {
    if (value === 'all') {
      const { tlsTerminated, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, tlsTerminated: value === 'true' });
    }
  };

  const handleReEncryptedChange = (value: string) => {
    if (value === 'all') {
      const { reEncrypted, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, reEncrypted: value === 'true' });
    }
  };

  const handleMethodChange = (value: string) => {
    if (value === 'all') {
      const { method, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, method: value });
    }
  };

  const handleAuthStatusChange = (value: string) => {
    if (value === 'all') {
      const { authenticationStatus, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, authenticationStatus: value });
    }
  };

  const handleKeyAgreementChange = (value: string) => {
    if (value === 'all') {
      const { keyAgreementProtocol, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, keyAgreementProtocol: value });
    }
  };

  const handleProtectedDataChange = (value: string) => {
    if (value === 'all') {
      const { protectedDataType, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, protectedDataType: value });
    }
  };

  const handleEndpointChange = (value: string) => {
    if (value.trim() === '') {
      const { endpointInfo, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, endpointInfo: value });
    }
  };

  const handleCaStatusChange = (value: string) => {
    if (value === 'all') {
      const { caCertificateStatus, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, caCertificateStatus: value });
    }
  };

  const handleE2EChange = (value: string) => {
    if (value === 'all') {
      const { endToEndEncryption, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, endToEndEncryption: value === 'true' });
    }
  };

  const handleMutualAuthChange = (value: string) => {
    if (value === 'all') {
      const { mutualAuthentication, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, mutualAuthentication: value === 'true' });
    }
  };

  const handleHopsChange = (value: string) => {
    if (value.trim() === '') {
      const { intermediaryHops, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, intermediaryHops: BigInt(value) });
    }
  };

  const handlePayloadTypeChange = (value: string) => {
    if (value === 'all') {
      const { encryptedPayloadType, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, encryptedPayloadType: value });
    }
  };

  const handleForwardSecrecyChange = (value: string) => {
    if (value === 'all') {
      const { forwardSecrecy, ...rest } = localFilters;
      setLocalFilters(rest);
    } else {
      setLocalFilters({ ...localFilters, forwardSecrecy: value === 'true' });
    }
  };

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent className="mt-4 space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
          {/* Basic Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Basic Filters</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="protocol-filter" className="text-xs font-medium">
                  Protocol
                </Label>
                <Select
                  value={localFilters.protocol || 'all'}
                  onValueChange={handleProtocolChange}
                >
                  <SelectTrigger id="protocol-filter">
                    <SelectValue placeholder="All protocols" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All protocols</SelectItem>
                    <SelectItem value="HTTP/1.1">HTTP/1.1</SelectItem>
                    <SelectItem value="HTTP/2">HTTP/2</SelectItem>
                    <SelectItem value="HTTP/3">HTTP/3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain-filter" className="text-xs font-medium">
                  Domain
                </Label>
                <Input
                  id="domain-filter"
                  placeholder="example.com"
                  value={localFilters.domain || ''}
                  onChange={(e) => handleDomainChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-xs font-medium">
                  Status Code
                </Label>
                <Select
                  value={localFilters.statusCode?.toString() || 'all'}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="200">200 OK</SelectItem>
                    <SelectItem value="201">201 Created</SelectItem>
                    <SelectItem value="204">204 No Content</SelectItem>
                    <SelectItem value="301">301 Moved Permanently</SelectItem>
                    <SelectItem value="302">302 Found</SelectItem>
                    <SelectItem value="304">304 Not Modified</SelectItem>
                    <SelectItem value="400">400 Bad Request</SelectItem>
                    <SelectItem value="401">401 Unauthorized</SelectItem>
                    <SelectItem value="403">403 Forbidden</SelectItem>
                    <SelectItem value="404">404 Not Found</SelectItem>
                    <SelectItem value="500">500 Internal Server Error</SelectItem>
                    <SelectItem value="502">502 Bad Gateway</SelectItem>
                    <SelectItem value="503">503 Service Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tls-filter" className="text-xs font-medium">
                  TLS Status
                </Label>
                <Select
                  value={
                    localFilters.tlsTerminated === undefined
                      ? 'all'
                      : localFilters.tlsTerminated.toString()
                  }
                  onValueChange={handleTlsChange}
                >
                  <SelectTrigger id="tls-filter">
                    <SelectValue placeholder="All requests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All requests</SelectItem>
                    <SelectItem value="true">TLS Terminated</SelectItem>
                    <SelectItem value="false">TLS Secure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reencrypted-filter" className="text-xs font-medium">
                  Re-encryption
                </Label>
                <Select
                  value={
                    localFilters.reEncrypted === undefined
                      ? 'all'
                      : localFilters.reEncrypted.toString()
                  }
                  onValueChange={handleReEncryptedChange}
                >
                  <SelectTrigger id="reencrypted-filter">
                    <SelectValue placeholder="All requests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All requests</SelectItem>
                    <SelectItem value="true">Re-encrypted</SelectItem>
                    <SelectItem value="false">Not re-encrypted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="text-sm font-semibold">Advanced Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="method-filter" className="text-xs font-medium">
                      HTTP Method
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Filter by HTTP request method (GET, POST, etc.)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.method || 'all'}
                    onValueChange={handleMethodChange}
                  >
                    <SelectTrigger id="method-filter">
                      <SelectValue placeholder="All methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All methods</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="HEAD">HEAD</SelectItem>
                      <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="auth-filter" className="text-xs font-medium">
                      Authentication Status
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Best-effort detection of authentication status based on headers and certificates</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.authenticationStatus || 'all'}
                    onValueChange={handleAuthStatusChange}
                  >
                    <SelectTrigger id="auth-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="authenticated">Authenticated</SelectItem>
                      <SelectItem value="unauthenticated">Unauthenticated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="key-agreement-filter" className="text-xs font-medium">
                      Key Agreement Protocol
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Detected key exchange protocol (e.g., ECDHE, DHE). Detection is best-effort.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.keyAgreementProtocol || 'all'}
                    onValueChange={handleKeyAgreementChange}
                  >
                    <SelectTrigger id="key-agreement-filter">
                      <SelectValue placeholder="All protocols" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All protocols</SelectItem>
                      <SelectItem value="ECDHE">ECDHE</SelectItem>
                      <SelectItem value="DHE">DHE</SelectItem>
                      <SelectItem value="RSA">RSA</SelectItem>
                      <SelectItem value="PSK">PSK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="protected-data-filter" className="text-xs font-medium">
                      Protected Data Type
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Type of sensitive data detected in the request (e.g., personal info, credentials)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.protectedDataType || 'all'}
                    onValueChange={handleProtectedDataChange}
                  >
                    <SelectTrigger id="protected-data-filter">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="personal">Personal Data</SelectItem>
                      <SelectItem value="credentials">Credentials</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="endpoint-filter" className="text-xs font-medium">
                      Endpoint/CDN/Firewall
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Filter by IP address or hostname of endpoint, CDN, or firewall</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="endpoint-filter"
                    placeholder="IP or hostname"
                    value={localFilters.endpointInfo || ''}
                    onChange={(e) => handleEndpointChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="ca-status-filter" className="text-xs font-medium">
                      CA Certificate Status
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Certificate authority validation status. Detection is best-effort.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.caCertificateStatus || 'all'}
                    onValueChange={handleCaStatusChange}
                  >
                    <SelectTrigger id="ca-status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="bad">Bad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="e2e-filter" className="text-xs font-medium">
                      End-to-End Encryption
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Whether the connection maintains end-to-end encryption without intermediary decryption</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={
                      localFilters.endToEndEncryption === undefined
                        ? 'all'
                        : localFilters.endToEndEncryption.toString()
                    }
                    onValueChange={handleE2EChange}
                  >
                    <SelectTrigger id="e2e-filter">
                      <SelectValue placeholder="All requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All requests</SelectItem>
                      <SelectItem value="true">Confirmed</SelectItem>
                      <SelectItem value="false">Not Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="mutual-auth-filter" className="text-xs font-medium">
                      Mutual Authentication
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Whether both client and server authenticate each other. Detection is best-effort.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={
                      localFilters.mutualAuthentication === undefined
                        ? 'all'
                        : localFilters.mutualAuthentication.toString()
                    }
                    onValueChange={handleMutualAuthChange}
                  >
                    <SelectTrigger id="mutual-auth-filter">
                      <SelectValue placeholder="All requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All requests</SelectItem>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="hops-filter" className="text-xs font-medium">
                      Intermediary Hops
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Number of intermediary hops detected. Best-effort calculation based on headers.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="hops-filter"
                    type="number"
                    min="0"
                    placeholder="Number of hops"
                    value={localFilters.intermediaryHops?.toString() || ''}
                    onChange={(e) => handleHopsChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="payload-type-filter" className="text-xs font-medium">
                      Encrypted Payload Type
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Encryption algorithm used for re-encrypted payloads (e.g., ChaCha20-256)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={localFilters.encryptedPayloadType || 'all'}
                    onValueChange={handlePayloadTypeChange}
                  >
                    <SelectTrigger id="payload-type-filter">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="ChaCha20-256">ChaCha20-256</SelectItem>
                      <SelectItem value="AES-256-GCM">AES-256-GCM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="forward-secrecy-filter" className="text-xs font-medium">
                      Forward Secrecy
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Whether the connection provides forward secrecy (PFS). Detection is best-effort.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={
                      localFilters.forwardSecrecy === undefined
                        ? 'all'
                        : localFilters.forwardSecrecy.toString()
                    }
                    onValueChange={handleForwardSecrecyChange}
                  >
                    <SelectTrigger id="forward-secrecy-filter">
                      <SelectValue placeholder="All requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All requests</SelectItem>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end">
            <Button onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
