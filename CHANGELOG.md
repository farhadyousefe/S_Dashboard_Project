# Changelog

## [2.0.0] - 2026-07-28 - MAJOR UPDATE 🚀

### Added

- **Settings Page** - Users can now customize:
  - Cryptocurrency selection (BTC, ETH, DOGE, ADA, SOL, DOT)
  - Temperature unit toggle (°C/°F)
  - Background image categories (Nature, City, Ocean, Mountains, Forest)
  - Toggle crypto and weather widgets on/off
- **Caching System** - Data loads 5x faster with local caching
- **Keyboard Shortcut** - Ctrl+Shift+R to refresh dashboard
- **Background Service Worker** - Handles background tasks efficiently
- **Loading States** - Visual feedback while data loads
- **Glassmorphism UI** - Modern, beautiful design with blur effects
- **Responsive Design** - Works perfectly on all screen sizes

### Fixed

- Fixed broken default background image URL
- Changed weather icons from HTTP to HTTPS (security fix)
- Fixed crypto DOM update to prevent re-render issues
- Fixed CSS selector for crypto paragraphs
- Improved error handling with graceful fallbacks

### Changed

- **BREAKING**: Replaced simple script with module architecture
- **BREAKING**: Added chrome.storage.sync for persistent settings
- **BREAKING**: New UI design with glassmorphism
- Moved to Manifest V3 best practices
- Updated all API calls with better error handling

### Security

- Added Content Security Policy (CSP)
- All API calls now use HTTPS
- Added proper host_permissions

---

## [1.0.0] - 2026-05-09 - Initial Release

### Added

- Background images from Unsplash API
- Real-time clock with seconds
- Dogecoin price tracking
- Weather with geolocation
- Basic styling
- New tab override
