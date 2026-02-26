import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';

export default function ProLogin() {
  const { navigateTo } = useAppContext();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [error, setError] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    setError('');
    try {
      await login();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(msg);
    }
  };

  useEffect(() => {
    if (identity && actor) {
      const principal = identity.getPrincipal();
      actor.getProProfile(principal).then(() => {
        navigateTo('nexusOS');
      }).catch(() => {
        navigateTo('builder');
      });
    }
  }, [identity, actor, navigateTo]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(242,208,107,0.06)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(0,217,122,0.04)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 430,
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            padding: '6px 16px',
            background: 'rgba(242,208,107,0.1)',
            border: '1px solid rgba(242,208,107,0.2)',
            borderRadius: 20,
            color: 'var(--gold)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            marginBottom: 32,
            textTransform: 'uppercase',
          }}
        >
          Espace Professionnel
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 48,
              color: 'var(--t1)',
              letterSpacing: '-2px',
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 54,
              color: '#4A9EFF',
            }}
          >
            .
          </span>
        </div>

        <p
          style={{
            fontSize: 14,
            color: 'rgba(244,244,248,0.5)',
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          Connectez-vous pour acceder a votre espace pro
        </p>

        {error && (
          <div
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,61,90,0.12)',
              border: '1px solid rgba(255,61,90,0.3)',
              borderRadius: 12,
              color: 'var(--alert)',
              fontSize: 13,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            width: '100%',
            height: 62,
            borderRadius: 16,
            border: 'none',
            background: isLoggingIn
              ? 'rgba(242,208,107,0.5)'
              : 'linear-gradient(135deg, #F2D06B 0%, #E8B84B 100%)',
            color: '#050507',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            boxShadow: isLoggingIn ? 'none' : '0 8px 32px rgba(242,208,107,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isLoggingIn ? (
            <>
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(5,5,7,0.3)',
                  borderTopColor: '#050507',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Connexion en cours...
            </>
          ) : (
            'Se connecter avec Internet Identity'
          )}
        </button>

        <button
          onClick={() => navigateTo('landing')}
          style={{
            marginTop: 16,
            background: 'none',
            border: 'none',
            color: 'rgba(244,244,248,0.4)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Retour
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
