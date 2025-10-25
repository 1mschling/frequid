// Proxy configuration
const PROXY_CONFIG = {
  host: 'proxy.idx.network',
  port: 8080
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('IDX Proxy extension installed');
  
  // Set default state
  await chrome.storage.local.set({ proxyEnabled: false });
  
  // Show welcome notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: 'IDX Proxy Installed',
    message: 'Click the extension icon to configure your proxy settings.'
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleProxy') {
    toggleProxy(request.enabled)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

// Toggle proxy configuration
async function toggleProxy(enabled) {
  if (enabled) {
    // Configure proxy settings
    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'http',
          host: PROXY_CONFIG.host,
          port: PROXY_CONFIG.port
        },
        bypassList: ['localhost', '127.0.0.1', '<local>']
      }
    };
    
    await chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });
    
    console.log('Proxy enabled:', PROXY_CONFIG);
  } else {
    // Clear proxy settings
    await chrome.proxy.settings.clear({
      scope: 'regular'
    });
    
    console.log('Proxy disabled');
  }
}

// Monitor proxy errors
chrome.proxy.onProxyError.addListener((details) => {
  console.error('Proxy error:', details);
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: 'Proxy Connection Error',
    message: 'Unable to connect to IDX proxy. Please check your connection.'
  });
});

// Listen for storage changes to sync proxy state
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.proxyEnabled) {
    const enabled = changes.proxyEnabled.newValue;
    toggleProxy(enabled).catch(console.error);
  }
});
