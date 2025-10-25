import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Chrome, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export function ExtensionPage() {
  const features = [
    {
      title: 'Automatic Configuration',
      description: 'One-click setup with preconfigured IDX proxy settings',
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">IDX User UI</span>
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
              Automatically configure your browser to use the IDX proxy
            </p>
          </div>

          <Alert className="border-primary/50 bg-primary/5">
            <AlertCircle className="h-5 w-5 text-primary" />
            <AlertTitle>Easy Setup</AlertTitle>
            <AlertDescription>
              The IDX Proxy extension is preconfigured with the proxy address. Simply install and
              enable to start monitoring your web traffic.
            </AlertDescription>
          </Alert>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">IDX Proxy Extension</CardTitle>
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
                <h3 className="text-lg font-semibold">Installation Instructions</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      1
                    </span>
                    <span>Download the extension package from the link below</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      2
                    </span>
                    <span>
                      Open Chrome and navigate to <code className="rounded bg-muted px-1 py-0.5">chrome://extensions/</code>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      3
                    </span>
                    <span>Enable "Developer mode" in the top right corner</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      4
                    </span>
                    <span>Click "Load unpacked" and select the extension folder</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      5
                    </span>
                    <span>Click the extension icon and enable the proxy</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download Extension
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
                  <a
                    href="https://github.com/idx-proxy/chrome-extension"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Proxy Configuration</CardTitle>
              <CardDescription>
                The extension is preconfigured with these settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Proxy Address</span>
                  <code className="text-sm font-mono font-semibold">proxy.idx.network:8080</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Protocols</span>
                  <span className="text-sm font-semibold">HTTP, HTTPS, HTTP/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Setup Required</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    None
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-5 w-5" />
            <AlertTitle>Privacy & Security</AlertTitle>
            <AlertDescription>
              All traffic routing is session-based. Request data is only visible to you when logged
              in with Internet Identity and is cleared when your session ends.
            </AlertDescription>
          </Alert>
        </div>
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
    </div>
  );
}
