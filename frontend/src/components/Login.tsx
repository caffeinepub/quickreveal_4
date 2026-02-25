import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { IconLock, IconSpinner } from './icons/Icons';

export default function Login() {
  const { setCurrentScreen } = useAppContext();
  const { login, loginStatus, identity } = useInternetIdentity();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (identity) {
        setCurrentScreen('roleSelection');
        return;
      }
      await login();
      setCurrentScreen('roleSelection');
    } catch (e) {
      // fallback: navigate anyway for demo
      setCurrentScreen('roleSelection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setCurrentScreen('roleSelection');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px',
      }}
    >
      {/* Ambient orbs */}
      {[
        { top: '-80px', left: '-60px', size: 280, color: 'rgba(242,208,107,0.06)', delay: '0s' },
        { top: '30%', right: '-80px', size: 220, color: 'rgba(0,217,122,0.04)', delay: '-4s' },
        { bottom: '20%', left: '-40px', size: 200, color: 'rgba(91,127,255,0.05)', delay: '-8s' },
        { bottom: '-60px', right: '-40px', size: 260, color: 'rgba(242,208,107,0.04)', delay: '-2s' },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(60px)',
            animation: `floatOrb 12s ease-in-out infinite`,
            animationDelay: orb.delay,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '360px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '54px', color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            NEXUS
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '60px', color: 'var(--gold)', lineHeight: 1 }}>.</span>
        </div>

        {/* Tagline */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 300, fontSize: '15px', color: 'var(--t3)', marginBottom: '48px', letterSpacing: '0.02em' }}>
          La beaute, a la demande
        </p>

        {/* Gold divider */}
        <div style={{ width: '64px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 48px' }} />

        {/* CTA Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading || loginStatus === 'logging-in'}
          style={{
            width: '100%',
            height: '62px',
            background: 'var(--gold)',
            color: '#050507',
            border: 'none',
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 24px rgba(242,208,107,0.25)',
            opacity: isLoading ? 0.8 : 1,
            transition: 'opacity 200ms',
            marginBottom: '16px',
          }}
        >
          {isLoading ? (
            <IconSpinner size={20} color="#050507" />
          ) : (
            <IconLock size={18} color="#050507" />
          )}
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/* Demo button */}
        <button
          onClick={handleDemo}
          style={{
            width: '100%',
            height: '52px',
            background: 'transparent',
            color: 'var(--t3)',
            border: '1px solid var(--edge1)',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'color 200ms, border-color 200ms',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.color = 'var(--t2)';
            (e.target as HTMLButtonElement).style.borderColor = 'var(--edge2)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.color = 'var(--t3)';
            (e.target as HTMLButtonElement).style.borderColor = 'var(--edge1)';
          }}
        >
          Continuer en mode demo
        </button>

        {/* Security line */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11px', color: 'var(--t4)', marginTop: '32px', lineHeight: 1.5 }}>
          Connexion securisee via Internet Identity
        </p>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--t4)' }}>
          Built with love using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'nexus-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)', textDecoration: 'none' }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
