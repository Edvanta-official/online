// Centralized API configuration & fallback handler for Sparkle @ KKV
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch helper that seamlessly routes requests and injects JWT authorization token.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Attach JWT Bearer token if available
  const token = localStorage.getItem('sparkle_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers
  };

  // 1. Try relative endpoint first (works in dev mode / Vite proxy)
  try {
    const res = await fetch(cleanEndpoint, fetchOptions);
    if (res.ok || res.status === 400 || res.status === 401 || res.status === 409) {
      return res;
    }
  } catch (err) {}

  // 2. Try direct http://localhost:5000 backend (for live custom domain -> local DB connection)
  try {
    const localhostUrl = `http://localhost:5000${cleanEndpoint}`;
    const res = await fetch(localhostUrl, fetchOptions);
    if (res.ok || res.status === 400 || res.status === 401 || res.status === 409) {
      return res;
    }
  } catch (err) {}

  // 3. Fallback to default fetch
  return fetch(cleanEndpoint, fetchOptions);
};
