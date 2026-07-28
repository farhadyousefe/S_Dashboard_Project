// ============================================
// LOAD SAVED SETTINGS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const settings = await chrome.storage.sync.get([
      'cryptoCurrency',
      'temperatureUnit',
      'backgroundCategory',
      'showCrypto',
      'showWeather',
    ]);

    // Populate form with saved values
    document.getElementById('cryptoCurrency').value =
      settings.cryptoCurrency || 'dogecoin';
    document.getElementById('temperatureUnit').value =
      settings.temperatureUnit || 'metric';
    document.getElementById('backgroundCategory').value =
      settings.backgroundCategory || 'nature';
    document.getElementById('showCrypto').checked =
      settings.showCrypto !== false;
    document.getElementById('showWeather').checked =
      settings.showWeather !== false;
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
});

// ============================================
// SAVE SETTINGS
// ============================================

document
  .getElementById('settingsForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const settings = {
      cryptoCurrency: document.getElementById('cryptoCurrency').value,
      temperatureUnit: document.getElementById('temperatureUnit').value,
      backgroundCategory: document.getElementById('backgroundCategory').value,
      showCrypto: document.getElementById('showCrypto').checked,
      showWeather: document.getElementById('showWeather').checked,
    };

    try {
      await chrome.storage.sync.set(settings);

      // Show success message
      const status = document.getElementById('status');
      status.textContent = '✅ Settings saved successfully!';
      status.className = 'status success';

      setTimeout(() => {
        status.className = 'status';
      }, 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  });

// Check if this is a first-time installation of v2
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user has old settings
  const oldSettings = await chrome.storage.local.get(['cryptoCurrency']);

  if (oldSettings.cryptoCurrency) {
    // Migrate old settings to new format
    await chrome.storage.sync.set({
      cryptoCurrency: oldSettings.cryptoCurrency || 'dogecoin',
      temperatureUnit: 'metric',
      backgroundCategory: 'nature',
      showCrypto: true,
      showWeather: true,
    });

    // Clear old storage
    await chrome.storage.local.clear();

    // Show welcome message
    showWelcomeMessage();
  }
});

function showWelcomeMessage() {
  const status = document.getElementById('status');
  status.innerHTML = `
    🎉 Welcome to v2.0.0!<br>
    We've added new features and improved performance.<br>
    Check out the settings page to customize your dashboard!
  `;
  status.className = 'status success';
}
