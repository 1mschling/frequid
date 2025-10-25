import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings, Copy, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ProxyConfigDialogProps {
  trigger?: React.ReactNode;
}

// Default deployed proxy canister address (update this with your actual deployment)
const DEFAULT_PROXY_ADDRESS = 'https://[YOUR-PROXY-CANISTER-ID].ic0.app';

export function ProxyConfigDialog({ trigger }: ProxyConfigDialogProps) {
  const [proxyAddress, setProxyAddress] = useState(
    localStorage.getItem('proxyAddress') || DEFAULT_PROXY_ADDRESS
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = () => {
    localStorage.setItem('proxyAddress', proxyAddress);
    toast.success('Proxy address saved', {
      description: 'The extension will use this address for routing traffic.',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proxyAddress);
    toast.success('Copied to clipboard');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Test connection to the proxy canister
      const response = await fetch(`${proxyAddress}/health`, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        setIsConnected(true);
        toast.success('Connection successful', {
          description: 'The proxy canister is reachable and responding.',
        });
      } else {
        setIsConnected(false);
        toast.error('Connection failed', {
          description: 'The proxy canister did not respond as expected.',
        });
      }
    } catch (error) {
      setIsConnected(false);
      toast.error('Connection failed', {
        description: 'Unable to reach the proxy canister. Check the address and try again.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    setProxyAddress(DEFAULT_PROXY_ADDRESS);
    localStorage.setItem('proxyAddress', DEFAULT_PROXY_ADDRESS);
    toast.info('Reset to default address');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Proxy Config
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">ICP Proxy Canister Configuration</DialogTitle>
          <DialogDescription>
            Configure the Internet Computer proxy canister address for request monitoring
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle>Live Proxy Deployment</AlertTitle>
            <AlertDescription>
              The proxy canister is deployed on the Internet Computer mainnet. Update the address below to point to your deployed canister.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proxy-address">Proxy Canister HTTP Gateway URL</Label>
              <div className="flex gap-2">
                <Input
                  id="proxy-address"
                  value={proxyAddress}
                  onChange={(e) => setProxyAddress(e.target.value)}
                  placeholder="https://[canister-id].ic0.app"
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Format: https://[CANISTER-ID].ic0.app or https://[CANISTER-ID].raw.ic0.app
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleTestConnection} disabled={isTesting} size="sm">
                {isTesting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              {isConnected && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
            <h4 className="font-semibold text-sm">Deployment Instructions</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-primary">1.</span>
                <span>Deploy the proxy canister: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">dfx deploy proxy</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-primary">2.</span>
                <span>Note the canister ID from the deployment output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-primary">3.</span>
                <span>Construct the HTTP gateway URL: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">https://[CANISTER-ID].ic0.app</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-primary">4.</span>
                <span>Enter the URL above and click "Save Configuration"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-primary">5.</span>
                <span>Update your browser extension with the same address</span>
              </li>
            </ol>
          </div>

          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle>Extension Configuration</AlertTitle>
            <AlertDescription>
              After saving this address, make sure to update your browser extension's proxy configuration to use the same URL. Open the extension popup and update the proxy address field.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a
                  href="https://internetcomputer.org/docs/current/developer-docs/backend/motoko/deploying"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Deployment Docs
                </a>
              </Button>
              <Button onClick={handleSave}>
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
