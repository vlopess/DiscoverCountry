import api, { tokenStorage } from './api';
import type {
  AuthResponse,
  AuthState,
  LoginPayload,
  RegisterPayload,
  ApiUser,
} from '../types';

const USER_KEY = 'dc_user';

// ─── Persist / restore auth state ─────────────────────────────────────────

function persistAuth(token: string, user: ApiUser): AuthState {
  tokenStorage.set(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

function clearAuth(): void {
  tokenStorage.remove();
  localStorage.removeItem(USER_KEY);
}

function getStoredAuth(): AuthState | null {
  const token = tokenStorage.get();
  const raw   = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try {
    const user = JSON.parse(raw) as ApiUser;
    return { token, user };
  } catch {
    return null;
  }
}

// ─── API calls ─────────────────────────────────────────────────────────────

async function login(payload: LoginPayload): Promise<AuthState> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return persistAuth(data.data.token, data.data.user);
}

async function register(payload: RegisterPayload): Promise<AuthState> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return persistAuth(data.data.token, data.data.user);
}

function logout(): void {
  clearAuth();
}

export const authService = { login, register, logout, getStoredAuth };
