import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, AlertTriangle } from 'lucide-react';
import { ExtensionBanner } from '@/components/ExtensionBanner';
import { ProcessFlowDialog } from '@/components/ProcessFlowDialog';

export function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Web Request TLS Monitor and Recryptor</span>
          </div>
          <ProcessFlowDialog />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <ExtensionBanner variant="default" />

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Web Request TLS Monitor and Recryptor</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time dashboard for monitoring proxied web requests, and enabling data encryption for important data
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>
                Log in to view your session's request activity and security alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={login} disabled={isLoggingIn} className="w-full" size="lg">
                {isLoggingIn ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Log In
                  </>
                )}
              </Button>

              <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Features
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Real-time request monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>TLS termination detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Session-based data storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">•</span>
                    <span>Chrome & Firefox extension support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <footer className="text-center text-sm text-muted-foreground">
            © 2025. Built with <span className="text-destructive">♥</span> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
