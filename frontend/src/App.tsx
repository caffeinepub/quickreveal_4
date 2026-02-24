import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
import ScreenRouter from './components/ScreenRouter';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppContextProvider>
          <ScreenRouter />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                border: '1px solid #333',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </AppContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
