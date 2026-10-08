const PREFIX = 'devtoolkit:';

export function getStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStoredValue(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
  }
}

export function removeStoredValue(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore restricted storage contexts.
  }
}
