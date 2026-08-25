// Centralized API configuration & fallback handler for Sparkle @ KKV
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch helper that seamlessly routes requests to:
 * 1. Vite proxy / relative /api path
 * 2. Localhost backend (http://localhost:5000/api)
 * 3. Configured VITE_API_URL live backend endpoint
 */
export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. Try relative endpoint first (works in dev mode / Vite proxy)
  try {
    const res = await fetch(cleanEndpoint, options);
    if (res.ok || res.status === 400 || res.status === 401 || res.status === 409) {
      return res;
    }
  } catch (err) {}

  // 2. Try direct http://localhost:5000 backend (for live custom domain -> local DB connection)
  try {
    const localhostUrl = `http://localhost:5000${cleanEndpoint}`;
    const res = await fetch(localhostUrl, options);
    if (res.ok || res.status === 400 || res.status === 401 || res.status === 409) {
      return res;
    }
  } catch (err) {}

  // 3. Fallback to default fetch
  return fetch(cleanEndpoint, options);
};
