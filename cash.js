// ============================================
// CACHE UTILITY
// ============================================

const CACHE_DURATION = 300000; // 5 minutes

export async function getCachedData(key) {
  try {
    const result = await chrome.storage.local.get(key);
    const cached = result[key];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    return null;
  } catch (err) {
    console.error('Cache read error:', err);
    return null;
  }
}

export async function setCachedData(key, data) {
  try {
    await chrome.storage.local.set({
      [key]: {
        data: data,
        timestamp: Date.now(),
      },
    });
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

export async function clearCache() {
  try {
    await chrome.storage.local.clear();
    console.log('Cache cleared');
  } catch (err) {
    console.error('Cache clear error:', err);
  }
}
