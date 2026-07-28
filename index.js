// ============================================
// CONFIGURATION (with settings)
// ============================================

let CONFIG = {
  TIMEZONE: 'en-US',
  TIME_STYLE: 'short',
  DEFAULT_BACKGROUND:
    'https://images.unsplash.com/photo-1501785888041-af3ef2c85b70?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzgzMjA3ODN8&ixlib=rb-4.1.0&q=85',
  cryptoCurrency: 'bitcoin',
  weatherUnits: 'metric',
  backgroundCategory: 'nature',
  showCrypto: true,
  showWeather: true,
};

// ============================================
// LOAD SETTINGS
// ============================================

async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'cryptoCurrency',
      'temperatureUnit',
      'backgroundCategory',
      'showCrypto',
      'showWeather',
    ]);

    if (settings.cryptoCurrency)
      CONFIG.cryptoCurrency = settings.cryptoCurrency;
    if (settings.temperatureUnit)
      CONFIG.weatherUnits = settings.temperatureUnit;
    if (settings.backgroundCategory)
      CONFIG.backgroundCategory = settings.backgroundCategory;
    if (settings.showCrypto !== undefined)
      CONFIG.showCrypto = settings.showCrypto;
    if (settings.showWeather !== undefined)
      CONFIG.showWeather = settings.showWeather;
  } catch (err) {
    console.warn('Using default settings:', err);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Show loading state
function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = '<span class="loading">Loading...</span>';
  }
}

// Hide loading state
function hideLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.remove('loading');
  }
}

// ============================================
// 1. BACKGROUND IMAGE
// ============================================

async function fetchBackground() {
  try {
    const res = await fetch(
      `https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${CONFIG.backgroundCategory}`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! status: ${res.status}`);
    }

    const data = await res.json();
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
    document.getElementById('author').textContent = `📸 By: ${data.user.name}`;
  } catch (err) {
    console.error('Failed to fetch background image:', err);
    document.body.style.backgroundImage = `url(${CONFIG.DEFAULT_BACKGROUND})`;
    document.getElementById('author').textContent = '📸 Photo by Unsplash';
  }
}

// ============================================
// 2. CLOCK
// ============================================

function updateClock() {
  const date = new Date();
  const time = date.toLocaleTimeString(CONFIG.TIMEZONE, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  document.getElementById('time').textContent = time;
}

// ============================================
// 3. CRYPTO PRICE
// ============================================

async function fetchCrypto() {
  // ✅ FIXED: Check if crypto should be shown
  if (!CONFIG.showCrypto) {
    document.getElementById('crypto').style.display = 'none';
    return;
  }

  document.getElementById('crypto').style.display = 'block';

  try {
    showLoading('crypto');

    // ✅ FIXED: Use correct property name (cryptoCurrency, not CRYPTO_CURRENCY)
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${CONFIG.cryptoCurrency}`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! status: ${res.status}`);
    }

    const data = await res.json();

    // Update the crypto display
    const cryptoContainer = document.getElementById('crypto');
    cryptoContainer.innerHTML = `
      <div class="crypto-top">
        <img src="${data.image.small}" alt="${data.name}" />
        <span>${data.name}</span>
        <span class="crypto-symbol">${data.symbol.toUpperCase()}</span>
      </div>
      <div class="crypto-details">
        <p>💰 Price: $${data.market_data.current_price.usd.toFixed(4)}</p>
        <p>📈 High (24h): $${data.market_data.high_24h.usd.toFixed(4)}</p>
        <p>📉 Low (24h): $${data.market_data.low_24h.usd.toFixed(4)}</p>
      </div>
    `;
  } catch (err) {
    console.error('Failed to fetch crypto:', err);
    document.getElementById('crypto').innerHTML = `
      <p>⚠️ Crypto data unavailable</p>
    `;
  }
}

// ============================================
// 4. WEATHER
// ============================================

async function fetchWeather(lat, lon) {
  // ✅ FIXED: Check if weather should be shown
  if (!CONFIG.showWeather) {
    document.getElementById('weather').style.display = 'none';
    return;
  }

  document.getElementById('weather').style.display = 'block';

  try {
    showLoading('weather');

    const res = await fetch(
      `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=${CONFIG.weatherUnits}`
    );

    if (!res.ok) {
      throw new Error('Weather data is not available');
    }

    const data = await res.json();

    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const temp = Math.round(data.main.temp);
    const tempUnit = CONFIG.weatherUnits === 'metric' ? '°C' : '°F';

    document.getElementById('weather').innerHTML = `
      <div class="temp">
        <img src="${iconURL}" alt="${data.weather[0].description}" />
        <span>${temp}${tempUnit}</span>
      </div>
      <p class="weather-city">📍 ${data.name}</p>
      <p class="weather-desc">${data.weather[0].description}</p>
    `;
  } catch (err) {
    console.error('Failed to fetch weather:', err);
    document.getElementById('weather').innerHTML = `
      <p>⚠️ Weather data unavailable</p>
    `;
  }
}

// ============================================
// 5. GET USER LOCATION
// ============================================

function getUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(lat, lon);
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        // Use a default city (London) if location is denied
        fetchWeather(51.5074, -0.1278);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    console.warn('Geolocation not supported');
    fetchWeather(51.5074, -0.1278); // Default to London
  }
}

// ============================================
// 6. SHOW VERSION
// ============================================

function showVersion() {
  try {
    const manifest = chrome.runtime.getManifest();
    document.getElementById('version').textContent = `v${manifest.version}`;
  } catch (err) {
    console.warn('Could not get version:', err);
    document.getElementById('version').textContent = 'v2.0.0';
  }
}

// ============================================
// 7. INITIALIZE EVERYTHING
// ============================================

async function init() {
  // Load settings first
  await loadSettings();

  console.log('🚀 Dashboard loading with settings:', CONFIG);

  // Show loading states
  showLoading('crypto');
  showLoading('weather');

  // Fetch all data
  await fetchBackground();
  await fetchCrypto();
  getUserLocation();

  // Start the clock
  updateClock();
  setInterval(updateClock, 1000);

  // Refresh crypto every 5 minutes
  setInterval(fetchCrypto, 300000);

  // Show version
  showVersion();
}

// Start the app
init();

console.log('🚀 Personal Dashboard loaded!');
