import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function LandingPage() {
  const { navigateTo } = useAppContext();

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-2px', marginBottom: 16 }}>
        <span style={{ color: '#FFFFFF' }}>NEXUS</span>
        <span style={{ color: '#4F6EF7' }}>.</span>
      </div>
      <p style={{ fontSize: 16, color: '#555555', fontStyle: 'italic', marginBottom: 32, textAlign: 'center' }}>
        Services premium à domicile
      </p>
      <button
        onClick={() => navigateTo('splash')}
        style={{
          background: 'linear-gradient(135deg, #E8C89A, #D4A96A)',
          border: 'none',
          borderRadius: 14,
          padding: '16px 32px',
          color: '#080808',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Commencer
      </button>
    </div>
  );
}
