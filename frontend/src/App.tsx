import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
import ScreenRouter from './components/ScreenRouter';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AppContextProvider>
          {/* Full-screen root wrapper */}
          <div style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            background: '#050507',
            overflow: 'hidden',
          }}>
            {/* Inner content constrained to 430px */}
            <div style={{
              maxWidth: '430px',
              margin: '0 auto',
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <ScreenRouter />
            </div>
          </div>
          <Toaster position="top-center" richColors />
        </AppContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
