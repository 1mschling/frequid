export type BrowserType = 'chrome' | 'firefox' | 'unsupported';

export interface BrowserInfo {
  type: BrowserType;
  name: string;
  extensionUrl: string;
}

export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for Firefox
  if (userAgent.includes('firefox')) {
    return {
      type: 'firefox',
      name: 'Firefox',
      extensionUrl: 'https://addons.mozilla.org/firefox/addon/web-request-tls-monitor/', // Placeholder URL
    };
  }
  
  // Check for Chrome (and Chrome-based browsers like Edge, Brave, etc.)
  // Note: Edge and other Chromium browsers can use Chrome extensions
  if (userAgent.includes('chrome') || userAgent.includes('chromium') || userAgent.includes('edg')) {
    return {
      type: 'chrome',
      name: userAgent.includes('edg') ? 'Edge' : 'Chrome',
      extensionUrl: 'https://chrome.google.com/webstore/detail/web-request-tls-monitor/', // Placeholder URL
    };
  }
  
  return {
    type: 'unsupported',
    name: 'Unsupported Browser',
    extensionUrl: '',
  };
}
