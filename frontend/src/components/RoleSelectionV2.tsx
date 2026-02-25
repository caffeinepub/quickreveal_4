import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconUser, IconBusiness, IconArrowRight } from './icons/Icons';

export default function RoleSelectionV2() {
  const { setCurrentScreen, setAppRole } = useAppContext();
  const [pressed, setPressed] = useState<string | null>(null);

  const handleClient = () => {
    setAppRole('client');
    setCurrentScreen('clientOtp');
  };

  const handlePro = () => {
    setAppRole('pro');
    setCurrentScreen('proOnboarding');
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
        padding: '40px 24px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '8px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '28px', color: 'var(--t1)', letterSpacing: '-0.04em' }}>
          NEXUS<span style={{ color: 'var(--gold)' }}>.</span>
        </span>
      </div>

      <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '26px', color: 'var(--t1)', textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.03em' }}>
        Bienvenue
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', textAlign: 'center', marginBottom: '48px' }}>
        Choisissez votre profil
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Client card */}
        <button
          onMouseDown={() => setPressed('client')}
          onMouseUp={() => setPressed(null)}
          onTouchStart={() => setPressed('client')}
          onTouchEnd={() => setPressed(null)}
          onClick={handleClient}
          style={{
            width: '100%',
            background: 'var(--d2)',
            border: `1px solid ${pressed === 'client' ? 'var(--blue)' : 'var(--edge1)'}`,
            borderRadius: '20px',
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transform: pressed === 'client' ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 200ms, border-color 200ms',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(91,127,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconUser size={24} color="var(--blue)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--t1)', marginBottom: '4px' }}>Client</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>Reservez des prestations a domicile</div>
          </div>
          <IconArrowRight size={18} color="var(--t4)" />
        </button>

        {/* Pro card */}
        <button
          onMouseDown={() => setPressed('pro')}
          onMouseUp={() => setPressed(null)}
          onTouchStart={() => setPressed('pro')}
          onTouchEnd={() => setPressed(null)}
          onClick={handlePro}
          style={{
            width: '100%',
            background: 'var(--d2)',
            border: `1px solid ${pressed === 'pro' ? 'var(--gold)' : 'var(--edge1)'}`,
            borderRadius: '20px',
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transform: pressed === 'pro' ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 200ms, border-color 200ms',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(242,208,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconBusiness size={24} color="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--t1)', marginBottom: '4px' }}>Professionnel</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>Gerez votre activite et vos clients</div>
          </div>
          <IconArrowRight size={18} color="var(--t4)" />
        </button>
      </div>
    </div>
  );
}
