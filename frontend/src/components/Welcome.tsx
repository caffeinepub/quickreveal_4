import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Welcome() {
  const { navigateTo, setUserName, setAppRole } = useAppContext();
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) setUserName(name.trim());
    setAppRole('client');
    navigateTo('explorer');
  };

  const handleSkip = () => {
    setAppRole('client');
    navigateTo('explorer');
  };

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            fontSize: 13,
            color: 'var(--gold)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            marginBottom: 12,
          }}
        >
          BIENVENUE
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>
          Comment vous appelez-vous ?
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t2)' }}>
          Personnalisez votre expérience NEXUS
        </p>
      </div>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Votre prénom..."
        style={{
          width: '100%',
          padding: '16px 20px',
          borderRadius: 16,
          background: 'var(--d2)',
          border: '1px solid var(--d4)',
          color: 'var(--t1)',
          fontSize: 16,
          outline: 'none',
          marginBottom: 16,
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
        onKeyDown={e => e.key === 'Enter' && handleStart()}
      />

      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: 18,
          background: 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
          border: 'none',
          color: '#000',
          fontSize: 16,
          fontWeight: 900,
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(212,175,55,0.4)',
          marginBottom: 12,
        }}
      >
        COMMENCER
      </button>

      <button
        onClick={handleSkip}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--t3)',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        PASSER
      </button>
    </div>
  );
}
