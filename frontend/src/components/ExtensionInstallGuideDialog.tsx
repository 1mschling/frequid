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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Chrome, AlertCircle, ExternalLink, FileArchive, CheckCircle2, Settings } from 'lucide-react';
import { detectBrowser } from '@/lib/browserDetection';

interface ExtensionInstallGuideDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExtensionInstallGuideDialog({ 
  trigger, 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange 
}: ExtensionInstallGuideDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const browserInfo = detectBrowser();
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const defaultTrigger = (
    <Button size="sm">
      <FileArchive className="mr-2 h-4 w-4" />
      Installation Guide
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Chrome className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Extension Installation Guide</DialogTitle>
              <DialogDescription>
                Step-by-step instructions for loading the unpacked extension and configuring the ICP canister proxy
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6">
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertTitle>Manual Installation Required</AlertTitle>
              <AlertDescription>
                This extension is not published to the {browserInfo.name} Web Store. You must load it manually as an unpacked extension using Developer Mode.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Installation Steps</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {browserInfo.name}
                </Badge>
              </div>

              <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      1
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Locate the Extension Folder</p>
                      <p className="text-sm text-muted-foreground">
                        Find the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">extension/</code> folder in your project directory. This folder contains all the necessary files for the extension.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      2
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Open Extension Management Page</p>
                      <p className="text-sm text-muted-foreground">
                        {browserInfo.type === 'firefox' ? (
                          <>Navigate to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">about:debugging#/runtime/this-firefox</code> in Firefox</>
                        ) : (
                          <>Navigate to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">chrome://extensions/</code> in {browserInfo.name}</>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        You can copy and paste this URL directly into your browser's address bar.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      3
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Enable Developer Mode</p>
                      <p className="text-sm text-muted-foreground">
                        {browserInfo.type === 'firefox' ? (
                          <>Click the <strong>"Load Temporary Add-on..."</strong> button</>
                        ) : (
                          <>Toggle the <strong>"Developer mode"</strong> switch in the top right corner of the page</>
                        )}
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      4
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Load the Extension</p>
                      <p className="text-sm text-muted-foreground">
                        {browserInfo.type === 'firefox' ? (
                          <>Select any file from the extension folder (e.g., <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">manifest.json</code>)</>
                        ) : (
                          <>Click the <strong>"Load unpacked"</strong> button and select the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">extension/</code> folder</>
                        )}
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      5
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Verify Installation</p>
                      <p className="text-sm text-muted-foreground">
                        The extension should now appear in your extensions list. Look for the <strong>"Web Request TLS Monitor and Recryptor"</strong> extension with the IDX icon.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      6
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        Configure ICP Canister Proxy Address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click the extension icon in your browser toolbar. In the popup, you'll see a proxy address field. Update this to point to your deployed ICP canister's HTTP gateway URL.
                      </p>
                      <div className="mt-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-blue-600 dark:text-blue-400">Example:</strong> If your proxy canister ID is <code className="rounded bg-muted px-1 py-0.5 font-mono">abc123-xyz</code>, the URL would be <code className="rounded bg-muted px-1 py-0.5 font-mono">https://abc123-xyz.ic0.app</code>
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      7
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Enable the Proxy</p>
                      <p className="text-sm text-muted-foreground">
                        After configuring the proxy address, toggle the proxy to <strong>"ON"</strong> to start monitoring requests through the ICP canister.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <Alert className="border-blue-500/50 bg-blue-500/10">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <AlertTitle>Important Notes</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  • Developer Mode is required for loading unpacked extensions. This is a standard Chrome/Firefox feature for testing and using local extensions.
                </p>
                <p>
                  • {browserInfo.type === 'firefox' 
                    ? 'Temporary add-ons in Firefox are removed when you close the browser. You\'ll need to reload it each time.' 
                    : 'The extension will remain installed until you remove it manually.'}
                </p>
                <p>
                  • Make sure the extension folder contains all required files including <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">manifest.json</code>.
                </p>
                <p>
                  • The proxy address can be updated at any time through the extension popup to point to different ICP canister deployments.
                </p>
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Deploying the Proxy Canister
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                To deploy the proxy canister to the Internet Computer:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">dfx deploy proxy</code> to deploy the proxy canister</li>
                <li>2. Note the canister ID from the deployment output</li>
                <li>3. The HTTP gateway URL will be <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">https://[CANISTER-ID].ic0.app</code></li>
                <li>4. Use this URL in the extension's proxy address configuration</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Need More Help?</h3>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                  <a
                    href={browserInfo.type === 'firefox' 
                      ? 'https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/'
                      : 'https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Official {browserInfo.name} Guide
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
