// ============================================
// BACKGROUND SERVICE WORKER - v2.0.0
// ============================================
// WHAT IS THIS FILE?
// This is the "brain" of your extension that runs in the background.
// It keeps working even when you close the new tab page.
// Think of it as a tiny server that runs inside Chrome.
// ============================================

// 📝 CONSOLE LOGGING
// This prints a message to the service worker's console.
// It helps us know when the service worker starts up.
// You can see this by clicking on "service worker" in chrome://extensions/
console.log('🚀 Background service worker starting...');

// ============================================
// SECTION 1: KEYBOARD SHORTCUTS
// ============================================
// This listens for keyboard shortcuts that the user presses.
// The shortcuts are defined in manifest.json under "commands".

// 📝 LISTENING FOR COMMANDS
// chrome.commands.onCommand is an "event listener" that waits for keyboard shortcuts.
// When the user presses the shortcut, this function runs.
chrome.commands.onCommand.addListener((command) => {
  // "command" tells us which shortcut was pressed.
  // We defined "refresh-dashboard" in manifest.json.

  // 🎯 CHECK IF IT'S OUR REFRESH SHORTCUT
  if (command === 'refresh-dashboard') {
    // Find all tabs in the current browser window.
    // chrome.tabs.query gets information about open tabs.
    // { active: true, currentWindow: true } means:
    //   - active: true = the tab the user is looking at
    //   - currentWindow: true = only search in the current window, not all windows
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Check if we actually found a tab.
      // tabs[0] is the first (and only) tab that matches our query.
      if (tabs[0]) {
        // Reload the tab (like pressing F5).
        // chrome.tabs.reload refreshes the page.
        // tabs[0].id is the unique ID Chrome gives to each tab.
        chrome.tabs.reload(tabs[0].id);

        // Log that we refreshed the dashboard.
        console.log('🔄 Dashboard refreshed via shortcut');
      }
    });
  }
});

// ============================================
// SECTION 2: INSTALLATION / UPDATE HANDLING
// ============================================
// This runs when the extension is first installed or updated.
// It's like a "welcome" function that sets things up.

// 📝 INSTALLATION EVENT
// chrome.runtime.onInstalled fires when:
//   - User installs the extension for the first time
//   - User updates the extension to a new version
// details contains information about what happened.
chrome.runtime.onInstalled.addListener((details) => {
  // Log the installation event with details.
  // details.reason tells us if it was "install" or "update".
  // details.previousVersion tells us what version they were using before.
  console.log('📦 Extension installed/updated:', details);

  // 🎯 SET UP THE ALARMS
  // Call our function that creates the timer for crypto updates.
  // We need to set this up whenever the extension is installed or updated.
  setupAlarms();
});

// ============================================
// SECTION 3: ALARMS (Scheduled Tasks)
// ============================================
// Alarms are like timers that wake up the service worker periodically.
// They let us do things in the background, like updating crypto prices.

// 📝 SET UP ALARMS
// This function creates a timer that goes off every 5 minutes.
function setupAlarms() {
  // Use try/catch to handle any errors gracefully.
  // This prevents the extension from breaking if something goes wrong.
  try {
    // 🗑️ CLEAR EXISTING ALARMS
    // First, remove any old alarms that might exist.
    // This prevents duplicate alarms from running.
    // chrome.alarms.clearAll removes all alarms.
    // The callback function runs after clearing is complete.
    chrome.alarms.clearAll(() => {
      // ✨ CREATE A NEW ALARM
      // chrome.alarms.create creates a new scheduled task.
      // Parameters:
      //   1. "updateCrypto" - The name of the alarm (used to identify it)
      //   2. { periodInMinutes: 5, delayInMinutes: 1 } - The schedule
      //      - periodInMinutes: 5 = run every 5 minutes
      //      - delayInMinutes: 1 = wait 1 minute before first run
      chrome.alarms.create('updateCrypto', {
        periodInMinutes: 5,
        delayInMinutes: 1,
      });

      // Log that the alarm was created successfully.
      console.log('✅ Crypto update alarm set (every 5 minutes)');
    });
  } catch (err) {
    // If something goes wrong, log a warning but don't crash.
    // This might happen if the alarms API isn't available.
    console.warn('⚠️ Alarms not available:', err);
  }
}

// 📝 HANDLE ALARM EVENTS
// This runs whenever ANY alarm goes off.
// chrome.alarms.onAlarm is the event listener for all alarms.
chrome.alarms.onAlarm.addListener((alarm) => {
  // Check which alarm went off by its name.
  // We only care about the "updateCrypto" alarm.
  if (alarm.name === 'updateCrypto') {
    // Log that the alarm fired.
    console.log('⏰ Updating crypto cache...');

    // Call the function that fetches fresh crypto data.
    updateCryptoCache();
  }
});

// ============================================
// SECTION 4: CACHE UPDATES (Background Tasks)
// ============================================
// These functions fetch data in the background and save it for later.
// This way, when the user opens a new tab, the data is ready.

// 📝 UPDATE CRYPTO CACHE
// This async function fetches fresh crypto data and saves it.
// "async" means this function can pause and wait for things like network requests.
async function updateCryptoCache() {
  // Use try/catch to handle any errors.
  try {
    // 📋 GET USER SETTINGS
    // First, we need to know which crypto the user wants to track.
    // chrome.storage.sync.get reads settings that are synced across devices.
    // ['cryptoCurrency'] asks for just that one setting.
    const settings = await chrome.storage.sync.get(['cryptoCurrency']);

    // Get the crypto currency from settings, or use "dogecoin" as default.
    // The || operator means "if the left side is undefined, use the right side".
    const cryptoCurrency = settings.cryptoCurrency || 'dogecoin';

    // 🌐 FETCH DATA FROM API
    // Use the fetch() function to get data from the internet.
    // We're calling the CoinGecko API to get crypto prices.
    // The backticks (`) let us insert variables into the string with ${}.
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoCurrency}`
    );

    // Check if the API request was successful.
    // response.ok is true if the status code is 200-299.
    if (!response.ok) {
      // If not successful, throw an error with the status code.
      throw new Error(`HTTP ${response.status}`);
    }

    // Parse the JSON response into a JavaScript object.
    // "await" means "wait for the JSON to download before continuing".
    const data = await response.json();

    // 💾 SAVE TO CACHE
    // Store the data in Chrome's local storage.
    // chrome.storage.local is NOT synced across devices (faster and more storage).
    // We're saving it with a key called "cachedCrypto".
    // The value is an object containing:
    //   - data: The actual crypto data from the API
    //   - timestamp: When we saved it (so we know if it's stale)
    await chrome.storage.local.set({
      cachedCrypto: {
        data: data,
        timestamp: Date.now(),
      },
    });

    // Log success with the crypto name.
    console.log('✅ Crypto cache updated:', cryptoCurrency);
  } catch (err) {
    // If anything fails, log the error.
    // This won't crash the extension, it will just log the issue.
    console.error('❌ Failed to update crypto cache:', err);
  }
}

// ============================================
// SECTION 5: REACT TO SETTINGS CHANGES
// ============================================
// This listens for when the user changes their settings.
// When they change the crypto currency, we update the cache immediately.

// 📝 LISTEN FOR STORAGE CHANGES
// chrome.storage.onChanged fires whenever ANY storage changes.
// This includes both sync and local storage.
chrome.storage.onChanged.addListener((changes, namespace) => {
  // Check if:
  //   1. The change happened in "sync" storage (not local)
  //   2. The "cryptoCurrency" setting was changed
  if (namespace === 'sync' && changes.cryptoCurrency) {
    // Log that the setting changed.
    console.log('🔄 Crypto setting changed, updating cache...');

    // Immediately update the cache with the new crypto.
    updateCryptoCache();
  }
});

// ============================================
// FINAL: READY MESSAGE
// ============================================
// This confirms the service worker is fully loaded and ready.
console.log('✨ Background service worker ready!');

// ============================================
// END OF FILE
// ============================================
// WHAT HAVE WE BUILT?
//
// This background service worker does 4 main things:
// 1. 🎯 Handles keyboard shortcuts (Ctrl+Shift+R to refresh)
// 2. ⏰ Runs scheduled tasks (updates crypto every 5 minutes)
// 3. 💾 Keeps data cached (so dashboard loads fast)
// 4. 🔄 Responds to setting changes (updates cache immediately)
//
// All this happens in the background without the user even knowing!
// ============================================
