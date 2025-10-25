import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Chrome, Download, X } from 'lucide-react';
import { detectBrowser, type BrowserInfo } from '@/lib/browserDetection';

interface ExtensionBannerProps {
  variant?: 'default' | 'compact';
  onDismiss?: () => void;
}

export function ExtensionBanner({ variant = 'default', onDismiss }: ExtensionBannerProps) {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);
    
    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem('extensionBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('extensionBannerDismissed', 'true');
    onDismiss?.();
  };

  if (!browserInfo || isDismissed) {
    return null;
  }

  if (browserInfo.type === 'unsupported') {
    return (
      <Alert className="relative border-amber-500/50 bg-amber-500/10">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        <AlertTitle className="flex items-center gap-2 pr-8">
          <Chrome className="h-5 w-5" />
          Browser Not Supported
        </AlertTitle>
        <AlertDescription className="mt-2">
          The Web Request TLS Monitor and Recryptor extension is currently only available for Chrome and Firefox browsers.
          Please use one of these browsers for automatic proxy configuration.
        </AlertDescription>
      </Alert>
    );
  }

  const extensionIcon = browserInfo.type === 'firefox' 
    ? '/assets/generated/idx-firefox-extension-icon-transparent.dim_128x128.png'
    : '/assets/generated/idx-extension-icon-transparent.dim_128x128.png';

  if (variant === 'compact') {
    return (
      <Alert className="relative border-primary/50 bg-primary/10">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 pr-8">
          <img src={extensionIcon} alt={`${browserInfo.name} Extension`} className="h-10 w-10" />
          <div className="flex-1">
            <AlertTitle className="text-sm">
              {browserInfo.name} Extension Available
            </AlertTitle>
            <AlertDescription className="text-xs">
              Install for automatic proxy configuration
            </AlertDescription>
          </div>
          <Button size="sm" asChild>
            <a href="/extension" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Install
            </a>
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Alert className="relative border-primary/50 bg-primary/10">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-6 w-6 p-0"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-start gap-4 pr-8">
        <img src={extensionIcon} alt={`${browserInfo.name} Extension`} className="h-12 w-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <AlertTitle className="text-base">
            {browserInfo.name} Extension Available
          </AlertTitle>
          <AlertDescription>
            We've detected you're using {browserInfo.name}. Install our browser extension for automatic
            proxy configuration and seamless request monitoring. No manual setup required!
          </AlertDescription>
          <div className="flex gap-2 pt-2">
            <Button size="sm" asChild>
              <a href="/extension" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Install Extension
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}
