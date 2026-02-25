import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const STEPS = [
  { label: 'Demande envoyee', sublabel: 'Confirmation en attente' },
  { label: 'Pro confirme', sublabel: 'Rendez-vous accepte' },
  { label: 'En route', sublabel: 'Le pro se deplace' },
  { label: 'Prestation', sublabel: 'En cours' },
  { label: 'Termine', sublabel: 'Paiement effectue' },
];

export default function LiveStatus() {
  const { navigateTo, currentBooking } = useAppContext();
  const [activeStep, setActiveStep] = useState(1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '24px 20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--t1)' }}>
          Statut en direct
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', marginTop: '4px' }}>
          Votre reservation est en cours
        </div>
      </div>

      {/* Countdown card */}
      <div style={{
        background: 'var(--d2)',
        border: '1px solid var(--gold-edge)',
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '24px',
        animation: 'breatheGold 3s ease-in-out infinite',
      }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)', marginBottom: '8px' }}>
          Temps ecoule
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: '52px',
          color: 'var(--gold)',
          letterSpacing: '-0.02em',
          animation: 'countBeat 1s ease-in-out infinite',
        }}>
          {timeStr}
        </div>
        {currentBooking && (
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--t2)', marginTop: '8px' }}>
            {currentBooking.service}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {STEPS.map((step, i) => {
          const isComplete = i < activeStep;
          const isActive = i === activeStep;
          const isFuture = i > activeStep;
          return (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* Node + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isComplete ? 'var(--flash)' : isActive ? 'var(--gold)' : 'var(--d3)',
                  border: isFuture ? '1px solid var(--d5)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: isActive ? 'breatheGold 2s ease-in-out infinite' : 'none',
                  transition: 'background 300ms',
                }}>
                  {isComplete
                    ? <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                    : <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: isActive ? '#050507' : 'var(--t4)' }}>{i + 1}</span>
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: '2px', height: '32px',
                    background: isComplete ? 'var(--flash)' : 'var(--d4)',
                    transition: 'background 300ms',
                  }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingTop: '6px', paddingBottom: '24px' }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  color: isActive ? 'var(--t1)' : isFuture ? 'var(--t4)' : 'var(--t2)',
                }}>
                  {step.label}
                </div>
                {isActive && (
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: 'var(--flash)',
                    marginTop: '2px',
                    animation: 'breatheDot 2s ease-in-out infinite',
                  }}>
                    {step.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance step button (demo) */}
      <button
        onClick={() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1))}
        style={{
          width: '100%',
          height: '52px',
          background: 'var(--d3)',
          border: '1px solid var(--edge1)',
          borderRadius: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          color: 'var(--t2)',
          cursor: 'pointer',
          marginTop: '16px',
        }}
      >
        Simuler etape suivante
      </button>
    </div>
  );
}
