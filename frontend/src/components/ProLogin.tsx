import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProLogin() {
  const { navigateTo } = useAppContext();
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
      navigateTo('nexusOS');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            fontSize: 13,
            color: 'var(--gold)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            marginBottom: 12,
          }}
        >
          NEXUS PRO
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
          Espace Professionnel
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t2)' }}>
          Connectez-vous pour accéder à votre tableau de bord
        </p>
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: 18,
          background: isLoggingIn
            ? 'var(--d3)'
            : 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
          border: 'none',
          color: isLoggingIn ? 'var(--t3)' : '#000',
          fontSize: 16,
          fontWeight: 900,
          cursor: isLoggingIn ? 'not-allowed' : 'pointer',
          boxShadow: isLoggingIn ? 'none' : '0 4px 24px rgba(212,175,55,0.4)',
          marginBottom: 16,
        }}
      >
        {isLoggingIn ? 'Connexion...' : 'SE CONNECTER'}
      </button>

      <button
        onClick={() => navigateTo('splash')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--t3)',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        ← Retour
      </button>
    </div>
  );
}
