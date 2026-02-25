import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Splash() {
  const { navigateTo } = useAppContext();
  const [pressing, setPressing] = useState(false);

  const handleConnect = () => {
    navigateTo('roleSelection');
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
      }}
    >
      {/* ── Ambient Orbs ── */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,127,255,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: -150,
          left: -100,
          pointerEvents: 'none',
          animation: 'orbeFloat 12s ease infinite',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,208,107,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: 100,
          right: -80,
          pointerEvents: 'none',
          animation: 'orbeFloat 16s ease infinite 3s',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,95,255,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: 300,
          left: '30%',
          pointerEvents: 'none',
          animation: 'orbeFloat 20s ease infinite 6s',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,224,122,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: 200,
          right: '20%',
          pointerEvents: 'none',
          animation: 'orbeFloat 14s ease infinite 9s',
          willChange: 'transform',
        }}
      />

      {/* ── Main Content ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          width: '100%',
          maxWidth: 430,
          zIndex: 1,
          animation: 'revealBlur 1s ease 0.2s both',
        }}
      >
        {/* Logo */}
        <div
          style={{
            lineHeight: 1,
            userSelect: 'none',
            textShadow: '0 0 80px rgba(91,127,255,0.15)',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 54,
              color: 'var(--t1)',
              letterSpacing: '-3px',
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 60,
              color: 'var(--blue)',
              letterSpacing: 0,
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: 16,
            color: 'var(--t3)',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            marginTop: 14,
            textAlign: 'center',
            animation: 'revealBlur 0.8s ease 0.5s both',
          }}
        >
          L'excellence à votre porte
        </p>

        {/* Decorative gold line */}
        <div
          style={{
            width: 64,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            margin: '32px auto',
            animation: 'revealBlur 0.6s ease 0.7s both',
          }}
        />

        {/* CTA Button */}
        <button
          onClick={handleConnect}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onTouchStart={() => setPressing(true)}
          onTouchEnd={() => {
            setPressing(false);
            handleConnect();
          }}
          style={{
            background: 'linear-gradient(135deg, #F2D06B 0%, #ECC97A 45%, #D4A050 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientDrift 5s ease infinite',
            color: 'var(--void)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 16,
            width: 'calc(100% - 48px)',
            height: 62,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-gold)',
            transform: pressing ? 'scale(0.97)' : 'scale(1)',
            transition: 'transform 80ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 48,
            position: 'relative',
            overflow: 'hidden',
            willChange: 'transform',
            animationName: 'gradientDrift, riseIn',
            animationDuration: '5s, 0.6s',
            animationTimingFunction: 'ease, cubic-bezier(0.22,1,0.36,1)',
            animationIterationCount: 'infinite, 1',
            animationDelay: '0s, 0.9s',
            animationFillMode: 'none, both',
          }}
        >
          SE CONNECTER
        </button>

        {/* Security line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 20,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              color: 'var(--t4)',
            }}
          >
            Face ID · Empreinte · WebAuthn
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 11,
          color: 'var(--t4)',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      >
        NEXUS · Suisse romande · CHF
      </div>
    </div>
  );
}
