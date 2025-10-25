// Proxy configuration
const PROXY_CONFIG = {
  host: 'proxy.idx.network',
  port: 8080
};

// DOM elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusDescription = document.getElementById('statusDescription');
const toggleButton = document.getElementById('toggleButton');
const buttonText = document.getElementById('buttonText');
const proxyAddress = document.getElementById('proxyAddress');

// Initialize popup
async function init() {
  // Display proxy address
  proxyAddress.textContent = `${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`;
  
  // Check current proxy status
  const status = await getProxyStatus();
  updateUI(status);
  
  // Set up toggle button
  toggleButton.addEventListener('click', handleToggle);
}

// Get current proxy status from storage
async function getProxyStatus() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['proxyEnabled'], (result) => {
      resolve(result.proxyEnabled || false);
    });
  });
}

// Update UI based on proxy status
function updateUI(isEnabled) {
  if (isEnabled) {
    statusDot.className = 'status-dot active';
    statusText.textContent = 'Proxy Active';
    statusDescription.textContent = 'All traffic is being routed through the IDX proxy. Visit the dashboard to monitor your requests.';
    buttonText.textContent = 'Disable Proxy';
    toggleButton.className = 'button button-secondary';
  } else {
    statusDot.className = 'status-dot inactive';
    statusText.textContent = 'Proxy Inactive';
    statusDescription.textContent = 'Enable the proxy to start monitoring your web traffic through IDX.';
    buttonText.textContent = 'Enable Proxy';
    toggleButton.className = 'button button-primary';
  }
}

// Handle toggle button click
async function handleToggle() {
  toggleButton.disabled = true;
  buttonText.innerHTML = '<span class="spinner"></span> Processing...';
  
  try {
    const currentStatus = await getProxyStatus();
    const newStatus = !currentStatus;
    
    // Send message to background script to update proxy
    await chrome.runtime.sendMessage({
      action: 'toggleProxy',
      enabled: newStatus
    });
    
    // Update storage
    await chrome.storage.local.set({ proxyEnabled: newStatus });
    
    // Update UI
    updateUI(newStatus);
    
    // Show success notification
    showNotification(
      newStatus ? 'Proxy Enabled' : 'Proxy Disabled',
      newStatus 
        ? 'Your traffic is now being routed through IDX proxy.' 
        : 'Proxy has been disabled. Traffic is no longer monitored.'
    );
  } catch (error) {
    console.error('Error toggling proxy:', error);
    showNotification('Error', 'Failed to toggle proxy. Please try again.');
  } finally {
    toggleButton.disabled = false;
  }
}

// Show browser notification
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: title,
    message: message
  });
}

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', init);
