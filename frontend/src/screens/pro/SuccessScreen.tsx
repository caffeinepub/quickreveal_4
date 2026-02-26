import React, { useEffect, useState } from 'react';
import { IconCheck } from '../../components/icons';

interface SuccessScreenProps {
  onContinue: () => void;
}

export default function SuccessScreen({ onContinue }: SuccessScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('success');
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      {phase === 'loading' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(242,208,107,0.1)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #F2D06B, #D4A050)',
              transition: 'width 40ms linear',
            }}
          />
        </div>
      )}

      {phase === 'loading' ? (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid rgba(242,208,107,0.2)',
              borderTopColor: '#F2D06B',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }}
          />
          <p style={{ fontSize: 16, color: '#9898B4', margin: 0 }}>
            Activation en cours...
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'scaleIn 400ms ease-out' }}>
          {/* Confetti particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: i % 3 === 0 ? '50%' : 2,
                background: i % 2 === 0 ? '#F2D06B' : i % 3 === 0 ? '#00D97A' : '#5B7FFF',
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
                pointerEvents: 'none',
              }}
            />
          ))}

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(0,217,122,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '2px solid rgba(0,217,122,0.3)',
            }}
          >
            <IconCheck size={36} color="#00D97A" />
          </div>

          <h1
            style={{
              margin: '0 0 8px',
              fontWeight: 900,
              fontSize: 28,
              color: '#F4F4F8',
              letterSpacing: '-0.03em',
            }}
          >
            Abonnement actif
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: 15, color: '#9898B4' }}>
            Bienvenue dans NEXUS Pro
          </p>

          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(242,208,107,0.06)',
              border: '1px solid rgba(242,208,107,0.15)',
              borderRadius: 14,
              marginBottom: 32,
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 13, color: '#9898B4', marginBottom: 4 }}>Abonnement</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F2D06B' }}>19.90 CHF / mois</div>
            <div style={{ fontSize: 12, color: '#9898B4', marginTop: 4 }}>TWINT · Renouvellement automatique</div>
          </div>

          <button
            onClick={onContinue}
            style={{
              width: 280,
              height: 56,
              background: 'linear-gradient(135deg, #F2D06B, #D4A050)',
              color: '#050507',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(242,208,107,0.25)',
            }}
          >
            ACCEDER A NEXUS PRO
          </button>
        </div>
      )}
    </div>
  );
}
