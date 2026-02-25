import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Check, X } from 'lucide-react';

const BENEFITS = [
  'Profil vérifié NEXUS',
  'Réservations illimitées',
  'Paiements Revolut intégrés',
  'Badge Flash disponible',
];

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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          background: 'var(--d2)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 24px 40px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>
            Passer Pro
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} color="var(--t3)" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {BENEFITS.map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid var(--edge-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={12} color="var(--gold)" strokeWidth={3} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--t1)' }}>{benefit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
            border: 'none',
            color: '#000',
            fontSize: 16,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            marginBottom: 10,
          }}
        >
          CONTINUER
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            background: 'none',
            border: 'none',
            color: 'var(--t3)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ANNULER
        </button>
      </div>
    </div>
  );
}
