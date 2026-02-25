import React from 'react';
import { useAppContext } from '../context/AppContext';

interface UpgradeModalProps {
  onClose: () => void;
}

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
  const { upgradeToProAccount } = useAppContext();

  const handleUpgrade = () => {
    upgradeToProAccount();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(5,5,7,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--d2)', border: '1px solid var(--edge1)',
        borderRadius: '24px', padding: '28px',
        maxWidth: '380px', width: '100%',
      }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--t1)', marginBottom: '8px' }}>
          Passer Pro
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t2)', marginBottom: '24px', lineHeight: '1.6' }}>
          Devenez professionnel sur NEXUS et commencez a recevoir des clients.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {['Profil professionnel complet', 'Reservations en temps reel', 'Paiements TWINT', 'Support prioritaire'].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--flash)', fontSize: '14px' }}>✓</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--t2)' }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: '52px',
              background: 'var(--d3)', border: '1px solid var(--edge1)',
              borderRadius: '12px', fontFamily: 'Inter, sans-serif',
              fontWeight: 600, fontSize: '14px', color: 'var(--t2)',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleUpgrade}
            style={{
              flex: 2, height: '52px',
              background: '#F2D06B', color: '#050507',
              border: 'none', borderRadius: '12px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
