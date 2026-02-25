import React, { useEffect, useRef, useState } from 'react';
import Confetti from './Confetti';

interface SubscriptionSuccessProps {
  onComplete: () => void;
}

export default function SubscriptionSuccess({ onComplete }: SubscriptionSuccessProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Phase 1: progress bar over 2s (2000ms / 40ms = 50 steps of 2%)
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);

    // Phase 2: show success at 2s
    const t1 = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase('success');
    }, 2000);

    // Phase 3: call onComplete at 4.5s
    const t2 = setTimeout(() => {
      if (!mountedRef.current) return;
      onComplete();
    }, 4500);

    // CRITICAL CLEANUP
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []); // empty deps — runs once only

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Progress bar top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: '#1C1C26',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#F2D06B',
          transition: 'width 40ms linear',
        }} />
      </div>

      {phase === 'loading' && (
        <>
          <div style={{
            width: 48,
            height: 48,
            border: '2px solid #1C1C26',
            borderTopColor: '#F2D06B',
            borderRadius: '50%',
            animation: 'nexusSpin 1s linear infinite',
          }} />
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 16,
            color: '#9898B4',
            marginTop: 20,
          }}>
            Activation en cours...
          </p>
        </>
      )}

      {phase === 'success' && (
        <>
          <Confetti />

          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(0,217,122,0.1)',
            border: '2px solid #00D97A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'nexusScaleIn 400ms ease-out',
          }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              stroke="#00D97A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: 0,
                animation: 'nexusDrawCheck 600ms ease-out',
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p style={{
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize: 28,
            color: '#F4F4F8',
            marginTop: 24,
            textAlign: 'center',
          }}>
            Profil active
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 15,
            color: '#9898B4',
            marginTop: 8,
            textAlign: 'center',
            padding: '0 32px',
            lineHeight: 1.6,
          }}>
            Vous etes maintenant visible par les clients de votre zone.
          </p>
        </>
      )}

      <style>{`
        @keyframes nexusSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes nexusScaleIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes nexusDrawCheck {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
