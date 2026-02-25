import React, { useState, useEffect, useRef } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';

const TIMELINE_STEPS = [
  { id: 1, label: 'Réservation confirmée', sublabel: 'Paiement reçu' },
  { id: 2, label: 'Pro notifié', sublabel: 'En attente de confirmation' },
  { id: 3, label: 'En route', sublabel: 'Le pro se déplace vers vous' },
  { id: 4, label: 'Prestation en cours', sublabel: 'en cours...' },
  { id: 5, label: 'Terminé', sublabel: 'Merci pour votre confiance !' },
];

export default function LiveStatus() {
  const { navigateTo, currentBooking } = useAppContext();
  const [seconds, setSeconds] = useState(600); // 10 minutes
  const [activeStep, setActiveStep] = useState(3);
  const [beatKey, setBeatKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return s - 1;
      });
      setBeatKey(k => k + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Simulate step progression
  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(4), 8000);
    return () => clearTimeout(t1);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        paddingBottom: 90,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={() => navigateTo('explorer')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--d2)',
            border: '1px solid var(--d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="var(--t1)" />
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>Suivi en direct</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Votre pro arrive bientôt</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Countdown card */}
        <div
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid var(--edge-gold)',
            borderRadius: 24,
            padding: '28px 20px',
            textAlign: 'center',
            marginBottom: 24,
            animation: 'breatheGold 2.5s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 8 }}>
            ARRIVÉE ESTIMÉE
          </div>
          <div
            key={beatKey}
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: 'var(--gold)',
              lineHeight: 1,
              fontFamily: 'Inter, sans-serif',
              animation: 'countBeat 0.3s ease',
              letterSpacing: '-0.02em',
            }}
          >
            {timeStr}
          </div>
          <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 8 }}>
            {seconds > 0 ? 'minutes restantes' : 'Votre pro est arrivé !'}
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            background: 'var(--d2)',
            border: '1px solid var(--d4)',
            borderRadius: 20,
            padding: '20px 16px',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>
            Progression
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE_STEPS.map((step, i) => {
              const isCompleted = step.id < activeStep;
              const isActive = step.id === activeStep;
              const isFuture = step.id > activeStep;

              return (
                <div key={step.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                  {/* Connector line */}
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 15,
                        top: 32,
                        width: 2,
                        height: 'calc(100% - 8px)',
                        background: isCompleted
                          ? '#22c55e'
                          : isActive
                          ? 'var(--edge-gold)'
                          : 'var(--d4)',
                        transition: 'background 0.5s',
                      }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isCompleted
                        ? '#22c55e'
                        : isActive
                        ? 'transparent'
                        : 'var(--d3)',
                      border: isCompleted
                        ? '2px solid #22c55e'
                        : isActive
                        ? '2px solid var(--gold)'
                        : '2px solid var(--d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: isActive ? 'breatheGold 2s ease-in-out infinite' : 'none',
                      boxShadow: isActive ? '0 0 12px rgba(212,175,55,0.4)' : 'none',
                      transition: 'all 0.5s',
                      zIndex: 1,
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} color="#fff" strokeWidth={3} />
                    ) : (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: isActive ? 'var(--gold)' : 'var(--d4)',
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: i < TIMELINE_STEPS.length - 1 ? 20 : 0, paddingTop: 4 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 600,
                        color: isCompleted
                          ? '#22c55e'
                          : isActive
                          ? 'var(--gold)'
                          : 'var(--t3)',
                        transition: 'color 0.5s',
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: isActive ? 'var(--t2)' : 'var(--t3)',
                        marginTop: 2,
                        animation: isActive && step.sublabel === 'en cours...'
                          ? 'breatheFlash 1.5s ease-in-out infinite'
                          : 'none',
                      }}
                    >
                      {step.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info card */}
        <div
          style={{
            marginTop: 16,
            background: 'var(--d2)',
            border: '1px solid var(--d4)',
            borderRadius: 16,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 28 }}>📍</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
              Votre pro est en route
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
              Restez disponible à votre adresse
            </div>
          </div>
        </div>

        {/* Contact button */}
        <button
          style={{
            width: '100%',
            marginTop: 16,
            padding: '14px',
            borderRadius: 14,
            background: 'var(--d2)',
            border: '1px solid var(--edge-gold)',
            color: 'var(--gold)',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          📞 Contacter le pro
        </button>
      </div>

      <BottomNav activeTab="bookings" />
    </div>
  );
}
