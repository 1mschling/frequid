import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Chrome, CheckCircle2, AlertCircle, ExternalLink, FileArchive } from 'lucide-react';

export function ExtensionPage() {
  const features = [
    {
      title: 'Automatic Configuration',
      description: 'One-click setup with configurable ICP canister proxy settings',
      icon: CheckCircle2,
    },
    {
      title: 'Protocol Support',
      description: 'Routes HTTP, HTTPS, and HTTP/3/QUIC traffic seamlessly',
      icon: Shield,
    },
    {
      title: 'Real-time Status',
      description: 'View proxy connection status and toggle on/off instantly',
      icon: AlertCircle,
    },
  ];

  const handleDownloadExtension = () => {
    alert('Please download the extension folder from the project repository and follow the manual installation instructions below.');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Web Request TLS Monitor</span>
          </div>
          <Button variant="outline" asChild>
            <a href="/">
              Back to Dashboard
            </a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex-1 space-y-8 p-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Chrome className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Chrome Extension</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Automatically configure your browser to use the ICP canister proxy
            </p>
          </div>

          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle>Manual Installation Required</AlertTitle>
            <AlertDescription>
              This extension is not published to the Chrome Web Store. Please follow the manual installation instructions below to load the unpacked extension.
            </AlertDescription>
          </Alert>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">ICP Proxy Extension</CardTitle>
                  <CardDescription className="mt-2">
                    Version 1.0.0 • For Chrome and Chromium-based browsers
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Chrome className="mr-1 h-3 w-3" />
                  Chrome
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-2"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2">
                  <FileArchive className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Manual Installation Instructions</h3>
                </div>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      1
                    </span>
                    <span>
                      Download the extension folder from your project directory (located at <code className="rounded bg-muted px-1 py-0.5">extension/</code>)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      2
                    </span>
                    <span>
                      If you have a ZIP file, extract it to a folder on your computer
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      3
                    </span>
                    <span>
                      Open Chrome and navigate to <code className="rounded bg-muted px-1 py-0.5">chrome://extensions/</code>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      4
                    </span>
                    <span>Enable <strong>"Developer mode"</strong> using the toggle in the top right corner</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      5
                    </span>
                    <span>Click <strong>"Load unpacked"</strong> button and select the extension folder</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      6
                    </span>
                    <span>The extension should now appear in your extensions list. Click the extension icon in the toolbar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      7
                    </span>
                    <span>Configure the ICP canister proxy address in the extension popup (default is provided)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      8
                    </span>
                    <span>Enable the proxy to start monitoring requests</span>
                  </li>
                </ol>
              </div>

              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle>Developer Mode Required</AlertTitle>
                <AlertDescription>
                  Since this extension is not published to the Chrome Web Store, you must enable Developer Mode in Chrome to load it as an unpacked extension. This is a standard procedure for testing and using local extensions.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={handleDownloadExtension}
                >
                  <Download className="h-4 w-4" />
                  Download Instructions
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
                  <a
                    href="https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Chrome Extension Guide
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Proxy Configuration</CardTitle>
              <CardDescription>
                Configure the extension to point to your deployed ICP canister
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Proxy Type</span>
                  <code className="text-sm font-mono font-semibold">ICP Canister</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Protocols</span>
                  <span className="text-sm font-semibold">HTTP, HTTPS, HTTP/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Configuration</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    Configurable in Extension
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Setup Required</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Manual Load Only
                  </Badge>
                </div>
              </div>
              <Alert className="mt-4 border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle>ICP Canister Address</AlertTitle>
                <AlertDescription>
                  After deploying the proxy canister to the Internet Computer, update the proxy address in the extension popup to point to your canister's HTTP gateway URL. The extension provides a default address that you can customize.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-5 w-5" />
            <AlertTitle>Privacy & Security</AlertTitle>
            <AlertDescription>
              All traffic routing is session-based through the ICP canister. Request data is only visible to you when logged
              in with Internet Identity and is cleared when your session ends. The proxy canister runs on the Internet Computer for enhanced security and decentralization.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Web Request TLS Monitor and Recryptor. Built with <span className="text-destructive">♥</span> using{' '}
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
    </div>
  );
}
