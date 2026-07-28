// ============================================
// BACKGROUND SERVICE WORKER
// ============================================

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'refresh-dashboard') {
    // Find the active tab and reload it
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Personal Dashboard installed!');
});

// Optional: Update data in background
chrome.alarms.create('updateCrypto', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateCrypto') {
    console.log('Background: Updating crypto data...');
  }
});
