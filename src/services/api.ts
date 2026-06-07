import axios from 'axios';

// ─── Base URL ──────────────────────────────────────────────────────────────
// In development, set VITE_API_URL in .env.local
// e.g. VITE_API_URL=http://localhost:3000
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://countries-api-ti4f.onrender.com';

const TOKEN_KEY = 'dc_token';

// ─── Token helpers (used by interceptors and authService) ──────────────────
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token); },
  remove: (): void => { localStorage.removeItem(TOKEN_KEY); },
};

// ─── Axios instance ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT if present
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      tokenStorage.remove();
      localStorage.removeItem('dc_user');
      // Avoid circular import: use plain navigation
      if (!window.location.pathname.startsWith('/')) {
        window.location.href = '/';
      } else if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
