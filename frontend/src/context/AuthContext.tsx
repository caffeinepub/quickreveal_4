import React, { createContext, useContext, ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  identity: ReturnType<typeof useInternetIdentity>['identity'];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? null;
  const isLoading = isInitializing || loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        throw error;
      }
    }
  };

  const handleLogout = async () => {
    await clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
        identity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** @deprecated Use useAuth instead */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthContextProvider');
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthContextProvider');
  return ctx;
}
