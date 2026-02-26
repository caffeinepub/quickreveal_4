import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';

export default function Login() {
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

  React.useEffect(() => {
    if (identity && actor) {
      actor.getCallerUserProfile().then((profile) => {
        if (profile) {
          navigateTo('nexusOS');
        } else {
          navigateTo('roleSelection');
        }
      }).catch(() => {
        navigateTo('roleSelection');
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
      {[
        { top: '-20%', left: '-10%', size: 400, color: 'rgba(242,208,107,0.06)' },
        { top: '60%', right: '-15%', size: 350, color: 'rgba(0,217,122,0.04)' },
        { top: '30%', left: '60%', size: 250, color: 'rgba(242,208,107,0.04)' },
        { bottom: '-10%', left: '20%', size: 300, color: 'rgba(255,61,90,0.03)' },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(80px)',
            top: orb.top,
            left: orb.left,
            right: (orb as { right?: string }).right,
            bottom: (orb as { bottom?: string }).bottom,
            pointerEvents: 'none',
          }}
        />
      ))}

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
          gap: 0,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 54,
              color: 'var(--t1)',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 60,
              color: '#4A9EFF',
              lineHeight: 1,
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'rgba(244,244,248,0.5)',
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          La beaute, a la demande.
        </p>

        {/* Gold line */}
        <div
          style={{
            width: 64,
            height: 2,
            background: 'var(--gold)',
            marginBottom: 48,
            borderRadius: 1,
          }}
        />

        {/* Error */}
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

        {/* CTA Button */}
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
            transition: 'all 0.2s ease',
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

        {/* Security line */}
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: 'rgba(244,244,248,0.3)',
            textAlign: 'center',
          }}
        >
          Authentification securisee par Internet Computer
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
