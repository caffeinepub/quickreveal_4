import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function BookingLocation() {
  const { navigateTo } = useAppContext();
  const [locationType, setLocationType] = useState<'domicile' | 'studio'>('domicile');

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <button
        onClick={() => navigateTo('explorer')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--t2)',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 20 }}>
        Lieu de la prestation
      </h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {(['domicile', 'studio'] as const).map(type => (
          <button
            key={type}
            onClick={() => setLocationType(type)}
            style={{
              flex: 1,
              padding: '20px 16px',
              borderRadius: 16,
              border: locationType === type ? '1px solid var(--gold)' : '1px solid var(--d4)',
              background: locationType === type ? 'rgba(212,175,55,0.1)' : 'var(--d2)',
              color: locationType === type ? 'var(--gold)' : 'var(--t2)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>
              {type === 'domicile' ? '🏠' : '💈'}
            </div>
            {type === 'domicile' ? 'À domicile' : 'En studio'}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateTo('bookingFlow')}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
          border: 'none',
          color: '#000',
          fontSize: 16,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
        }}
      >
        Continuer →
      </button>
    </div>
  );
}
