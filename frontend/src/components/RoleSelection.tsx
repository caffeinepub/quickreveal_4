import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function RoleSelection() {
  const { navigateTo } = useAppContext();
  const [selected, setSelected] = useState<'client' | 'pro' | null>(null);

  const handleContinue = () => {
    if (selected === 'client') {
      navigateTo('otpVerification');
    } else if (selected === 'pro') {
      navigateTo('proOnboarding');
    }
  };

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--t1)', marginBottom: '8px', textAlign: 'center' }}>
        Bienvenue sur NEXUS
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: 'var(--t3)', marginBottom: '40px', textAlign: 'center' }}>
        Choisissez votre profil
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '340px' }}>
        {/* Client card */}
        <div
          onClick={() => setSelected('client')}
          style={{
            background: 'var(--d3)',
            border: `1px solid ${selected === 'client' ? 'var(--gold-edge)' : 'var(--edge1)'}`,
            borderRadius: '20px', padding: '24px',
            cursor: 'pointer', transition: 'border 200ms',
            height: '148px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
        >
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--t1)', marginBottom: '6px' }}>
            Client
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>
            Trouvez et reservez des professionnels pres de chez vous
          </div>
        </div>

        {/* Pro card */}
        <div
          onClick={() => setSelected('pro')}
          style={{
            background: 'var(--d3)',
            border: `1px solid ${selected === 'pro' ? 'rgba(91,127,255,0.5)' : 'var(--edge1)'}`,
            borderRadius: '20px', padding: '24px',
            cursor: 'pointer', transition: 'border 200ms',
            height: '148px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
        >
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--t1)', marginBottom: '6px' }}>
            Professionnel
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>
            Developpez votre activite et recevez des clients
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        style={{
          marginTop: '32px',
          width: '100%', maxWidth: '340px', height: '56px',
          background: selected ? '#F2D06B' : 'var(--d4)',
          color: selected ? '#050507' : 'var(--t4)',
          border: 'none', borderRadius: '16px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
          cursor: selected ? 'pointer' : 'not-allowed',
          transition: 'all 200ms',
        }}
      >
        Continuer
      </button>
    </div>
  );
}
