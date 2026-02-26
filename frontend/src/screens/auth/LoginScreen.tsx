import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface LoginScreenProps {
  onSuccess: () => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [error, setError] = useState('');

  useEffect(() => {
    if (identity) onSuccess();
  }, [identity, onSuccess]);

  const handleLogin = async () => {
    setError('');
    try {
      await login();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      if (msg !== 'User is already authenticated') setError(msg);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {[
        { top: '-10%', left: '-10%', size: 300, color: 'rgba(242,208,107,0.06)', dur: 14 },
        { top: '60%', right: '-15%', size: 250, color: 'rgba(91,127,255,0.05)', dur: 18 },
        { top: '30%', left: '60%', size: 200, color: 'rgba(0,217,122,0.04)', dur: 22 },
        { bottom: '-5%', left: '20%', size: 280, color: 'rgba(242,208,107,0.04)', dur: 16 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
          background: orb.color, filter: 'blur(60px)',
          top: (orb as Record<string, unknown>).top as string | undefined,
          left: (orb as Record<string, unknown>).left as string | undefined,
          right: (orb as Record<string, unknown>).right as string | undefined,
          bottom: (orb as Record<string, unknown>).bottom as string | undefined,
          animation: `floatOrb ${orb.dur}s ease-in-out infinite`, pointerEvents: 'none',
        }} />
      ))}

      <div style={{ textAlign: 'center', marginBottom: 48, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontWeight: 900, fontSize: 54, color: '#F4F4F8', letterSpacing: '-0.04em', lineHeight: 1 }}>NEXUS</span>
          <span style={{ fontWeight: 900, fontSize: 60, color: '#5B7FFF', letterSpacing: '-0.04em', lineHeight: 1 }}>.</span>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: '#9898B4', fontWeight: 400, letterSpacing: '0.02em' }}>Plateforme beaute suisse</p>
        <div style={{ width: 64, height: 2, background: 'linear-gradient(90deg, transparent, #F2D06B, transparent)', margin: '16px auto 0' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 320, padding: '0 24px', zIndex: 1 }}>
        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.2)', borderRadius: 10, color: '#FF3D5A', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            width: '100%', height: 56,
            background: isLoggingIn ? 'rgba(242,208,107,0.4)' : 'linear-gradient(135deg, #F2D06B, #D4A050)',
            color: '#050507', fontWeight: 700, fontSize: 15, letterSpacing: '0.06em',
            textTransform: 'uppercase', borderRadius: 14, border: 'none',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(242,208,107,0.25)',
          }}
        >
          {isLoggingIn ? (
            <>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #050507', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              Connexion...
            </>
          ) : 'SE CONNECTER'}
        </button>
        <p style={{ marginTop: 20, fontSize: 11, color: '#54546C', textAlign: 'center', lineHeight: 1.6 }}>
          Connexion securisee via Internet Identity<br />Aucun mot de passe requis
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', zIndex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#2E2E3E' }}>
          Built with love using{' '}
          <a href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#F2D06B', textDecoration: 'none' }}>
            caffeine.ai
          </a>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
