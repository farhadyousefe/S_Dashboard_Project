// ============================================
// OPTIONS PAGE SCRIPT - v2.1.0
// ============================================
// WHAT IS THIS FILE?
// This file controls the Settings page where users customize their dashboard.
// It loads saved settings, allows users to change them, and saves everything.
// ============================================

// ============================================
// SECTION 1: LOAD SAVED SETTINGS
// ============================================
// This runs when the options page first opens.
// It loads all the user's saved preferences from Chrome storage.

// 📝 DOMContentLoaded EVENT
// This event fires when the HTML page is fully loaded.
// "DOM" = Document Object Model (the structure of the webpage)
// We use "async" because we need to wait for Chrome storage to load.
document.addEventListener('DOMContentLoaded', async () => {
  // 🎯 TRY TO LOAD SETTINGS
  // Use try/catch to handle errors gracefully.
  // If something fails, the extension won't break.
  try {
    // 📋 GET SETTINGS FROM STORAGE
    // chrome.storage.sync.get reads settings that are synced across devices.
    // The array lists all the setting names we want to load.
    // This returns an object with the settings (or undefined if not set).
    const settings = await chrome.storage.sync.get([
      'cryptoCurrency', // Which crypto to track
      'temperatureUnit', // Celsius or Fahrenheit
      'backgroundCategory', // Nature, City, Ocean, etc.
      'showCrypto', // Show crypto widget (true/false)
      'showWeather', // Show weather widget (true/false)
    ]);

    // ============================================
    // FILL THE FORM WITH SAVED VALUES
    // ============================================
    // For each setting, we check if it exists in storage.
    // If it doesn't exist, we use a default value.

    // 💰 CRYPTOCURRENCY
    // Changed default from 'dogecoin' to 'bitcoin'
    // settings.cryptoCurrency || 'bitcoin' means:
    //   - If settings.cryptoCurrency exists, use that
    //   - Otherwise, use 'bitcoin' as the default
    document.getElementById('cryptoCurrency').value =
      settings.cryptoCurrency || 'bitcoin'; // ✅ Changed to Bitcoin!

    // 🌡️ TEMPERATURE UNIT
    // Default is 'metric' (Celsius)
    // Users can change to 'imperial' (Fahrenheit)
    document.getElementById('temperatureUnit').value =
      settings.temperatureUnit || 'metric';

    // 🖼️ BACKGROUND CATEGORY
    // Default is 'nature' (beautiful landscapes)
    // Other options: city, ocean, mountains, forest
    document.getElementById('backgroundCategory').value =
      settings.backgroundCategory || 'nature';

    // 👁️ SHOW CRYPTO
    // This is a checkbox - it can be true or false
    // !== false means: if it's not specifically set to false, check it
    // This ensures the checkbox is checked by default
    document.getElementById('showCrypto').checked =
      settings.showCrypto !== false;

    // 👁️ SHOW WEATHER
    // Same logic as above - checked by default
    document.getElementById('showWeather').checked =
      settings.showWeather !== false;
  } catch (err) {
    // ❌ ERROR HANDLING
    // If anything goes wrong (e.g., storage is unavailable),
    // log the error but don't crash the extension.
    console.error('Failed to load settings:', err);
  }
});

// ============================================
// SECTION 2: SAVE SETTINGS
// ============================================
// This runs when the user clicks the "Save Settings" button.
// It collects all the form values and saves them to Chrome storage.

// 📝 SUBMIT EVENT LISTENER
// The 'submit' event fires when the user clicks the save button
// or presses Enter in a form field.
document
  .getElementById('settingsForm')
  .addEventListener('submit', async (e) => {
    // 🛑 PREVENT PAGE REFRESH
    // By default, submitting a form refreshes the page.
    // We don't want that - we want to stay on the settings page.
    // e.preventDefault() stops the default behavior.
    e.preventDefault();

    // 📋 COLLECT ALL SETTINGS FROM THE FORM
    // We create an object with all the current values from the form.
    const settings = {
      // Get the selected crypto from the dropdown
      cryptoCurrency: document.getElementById('cryptoCurrency').value,

      // Get the selected temperature unit
      temperatureUnit: document.getElementById('temperatureUnit').value,

      // Get the selected background category
      backgroundCategory: document.getElementById('backgroundCategory').value,

      // Get checkbox state (true if checked, false if not)
      showCrypto: document.getElementById('showCrypto').checked,

      // Get checkbox state for weather
      showWeather: document.getElementById('showWeather').checked,
    };

    // 🎯 TRY TO SAVE SETTINGS
    try {
      // 💾 SAVE TO CHROME STORAGE
      // chrome.storage.sync.set saves the settings.
      // These settings will sync across all devices where the user is logged in.
      await chrome.storage.sync.set(settings);

      // ✅ SHOW SUCCESS MESSAGE
      // Find the status element (where we show messages)
      const status = document.getElementById('status');

      // Set the success message
      status.textContent = '✅ Settings saved successfully!';

      // Add the 'success' class to make it green and visible
      status.className = 'status success';

      // ⏰ CLEAR THE MESSAGE AFTER 3 SECONDS
      // After 3000 milliseconds (3 seconds), remove the success class.
      // This makes the message disappear.
      setTimeout(() => {
        status.className = 'status'; // Removes 'success' class
      }, 3000);
    } catch (err) {
      // ❌ ERROR HANDLING
      // If saving fails (e.g., storage is full), show an alert.
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  });

// ============================================
// SECTION 3: MIGRATION FROM v1.0.0
// ============================================
// This handles upgrading from the old version to v2.0.0.
// It checks if the user has old settings and moves them to the new format.

// 📝 DOMContentLoaded EVENT (Second Listener)
// This is another listener for the same event.
// Multiple listeners can run on the same event.
document.addEventListener('DOMContentLoaded', async () => {
  // 🔍 CHECK FOR OLD SETTINGS
  // In v1.0.0, settings were stored in 'local' storage.
  // In v2.0.0, we use 'sync' storage (which syncs across devices).
  // We check if the user has a cryptoCurrency in local storage.
  const oldSettings = await chrome.storage.local.get(['cryptoCurrency']);

  // If oldSettings.cryptoCurrency exists, the user is upgrading from v1
  if (oldSettings.cryptoCurrency) {
    // 🔄 MIGRATE OLD SETTINGS TO NEW FORMAT
    // Copy the old crypto setting (or use default)
    // Use 'bitcoin' as fallback instead of 'dogecoin'
    await chrome.storage.sync.set({
      cryptoCurrency: oldSettings.cryptoCurrency || 'bitcoin', // ✅ Changed!
      temperatureUnit: 'metric', // Default to Celsius
      backgroundCategory: 'nature', // Default to Nature
      showCrypto: true, // Show crypto by default
      showWeather: true, // Show weather by default
    });

    // 🗑️ CLEAR OLD STORAGE
    // Once we've copied the settings to sync storage,
    // we can clear the old local storage to save space.
    await chrome.storage.local.clear();

    // 🎉 SHOW WELCOME MESSAGE
    // Let the user know they've been upgraded to v2.0.0
    showWelcomeMessage();
  }
});

// ============================================
// SECTION 4: WELCOME MESSAGE
// ============================================
// This shows a friendly message when users upgrade to v2.0.0.
// It explains what's new and exciting.

// 📝 SHOW WELCOME MESSAGE FUNCTION
// This function creates and displays the welcome message.
function showWelcomeMessage() {
  // Find the status element
  const status = document.getElementById('status');

  // Set the HTML content (includes emoji and line breaks)
  status.innerHTML = `
    🎉 Welcome to v2.0.0!<br>
    We've added new features and improved performance.<br>
    Check out the settings page to customize your dashboard!
  `;

  // Add the success class to make it visible and styled
  status.className = 'status success';
}

// ============================================
// END OF FILE
// ============================================
// WHAT HAVE WE BUILT?
//
// This options page does 4 main things:
// 1. 📋 Loads saved settings when the page opens
// 2. 💾 Saves settings when the user clicks "Save"
// 3. 🔄 Migrates old settings from v1.0.0
// 4. 🎉 Shows a welcome message for new users
//
// The settings are stored in chrome.storage.sync,
// which means they sync across all devices!
// ============================================
