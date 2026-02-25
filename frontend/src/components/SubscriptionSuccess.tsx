import React, { useEffect, useState } from 'react';
import { useProContext } from '../context/ProContext';
import { IconCheck, IconStar } from './icons/Icons';

export interface SubscriptionSuccessProps {
  onSuccessComplete: () => void;
}

export default function SubscriptionSuccess({ onSuccessComplete }: SubscriptionSuccessProps) {
  const { setProActif } = useProContext();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3500;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setPhase('done');
      }
    }, 50);

    const timer = setTimeout(() => {
      setProActif(true);
      onSuccessComplete();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      zIndex: 2000,
    }}>
      {/* Animated circle */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: phase === 'done'
          ? 'rgba(242,208,107,0.2)'
          : 'rgba(242,208,107,0.08)',
        border: `2px solid ${phase === 'done' ? 'var(--gold)' : 'rgba(242,208,107,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        transition: 'all 0.5s ease',
      }}>
        {phase === 'done' ? (
          <IconCheck size={40} color="var(--gold)" />
        ) : (
          <IconStar size={36} color="var(--gold)" />
        )}
      </div>

      <span style={{
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--t1)',
        textAlign: 'center',
        marginBottom: 12,
      }}>
        {phase === 'done' ? 'Profil active !' : 'Activation en cours...'}
      </span>

      <span style={{
        fontFamily: 'Inter',
        fontSize: 14,
        color: 'var(--t4)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 1.5,
      }}>
        {phase === 'done'
          ? 'Votre profil est maintenant visible dans l\'Explorer.'
          : 'Configuration de votre espace professionnel...'}
      </span>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        maxWidth: 280,
        height: 4,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--gold)',
          borderRadius: 2,
          transition: 'width 0.1s linear',
        }} />
      </div>

      <span style={{
        fontFamily: 'Inter',
        fontSize: 12,
        color: 'var(--t4)',
        marginTop: 12,
      }}>
        {Math.round(progress)}%
      </span>
    </div>
  );
}
