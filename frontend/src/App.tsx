import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContextProvider } from './context/AppContext';
import { AuthContextProvider } from './context/AuthContext';
import ScreenRouter from './components/ScreenRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppContextProvider>
          <div
            id="app-container"
            style={{
              maxWidth: 430,
              margin: '0 auto',
              minHeight: '100vh',
              position: 'relative',
              background: 'var(--void)',
              overflow: 'hidden',
            }}
          >
            <ScreenRouter />
          </div>
        </AppContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
