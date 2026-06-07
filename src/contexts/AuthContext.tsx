import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ApiUser, LoginPayload, RegisterPayload, AuthState } from '../types';
import { authService } from '../services/authService';

// ─── Shape ─────────────────────────────────────────────────────────────────
interface AuthContextData {
  user:            ApiUser | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  authError:       string | null;
  login:           (payload: LoginPayload)    => Promise<void>;
  register:        (payload: RegisterPayload) => Promise<void>;
  logout:          () => void;
  clearError:      () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(
    () => authService.getStoredAuth()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError]  = useState<string | null>(null);

  const handleSuccess = useCallback((state: AuthState) => {
    setAuth(state);
    setAuthError(null);
  }, []);

  const extractMessage = (error: unknown): string => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    ) {
      const e = error as { response?: { data?: { message?: string }; status?: number } };
      if (e.response?.data?.message) return e.response.data.message;
      if (e.response?.status === 401) return 'E-mail ou senha incorretos.';
      if (e.response?.status === 409) return 'Este e-mail já está cadastrado.';
    }
    return 'Ocorreu um erro. Tente novamente.';
  };

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const state = await authService.login(payload);
      handleSuccess(state);

    } catch (err) {
      setAuthError(extractMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccess]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const state = await authService.register(payload);
      handleSuccess(state);
    } catch (err) {
      setAuthError(extractMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccess]);

  const logout = useCallback(() => {
    authService.logout();
    setAuth(null);
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user:            auth?.user ?? null,
        isAuthenticated: !!auth?.token,
        isLoading,
        authError,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
