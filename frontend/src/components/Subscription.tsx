import React from 'react';
import { useAppContext } from '../context/AppContext';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#00D97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5,8 6,11.5 13.5,4" />
  </svg>
);

const BENEFITS = [
  'Profil visible par tous les clients',
  'Réservations illimitées',
  'Paiements sécurisés NEXUS PAY',
  'Statistiques avancées',
  'Support prioritaire 7j/7',
  'Badge professionnel vérifié',
];

export default function Subscription() {
  const { navigateTo } = useAppContext();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050507',
      display: 'flex',
      flexDirection: 'column',
      padding: '48px 24px 40px',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#F4F4F8',
          fontFamily: 'Inter, sans-serif',
          marginBottom: '8px',
        }}>
          7 jours gratuits
        </div>
        <div style={{
          fontSize: '16px',
          color: '#9898B4',
          fontFamily: 'Inter, sans-serif',
          marginBottom: '32px',
        }}>
          puis 19.90 CHF/mois
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckIcon />
              <span style={{
                fontSize: '15px',
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}>
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigateTo('nexusOS')}
        style={{
          width: '100%',
          height: '56px',
          background: '#F2D06B',
          color: '#050507',
          border: 'none',
          borderRadius: '14px',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Commencer l'essai gratuit
      </button>

      <button
        onClick={() => navigateTo('roleSelection')}
        style={{
          marginTop: '12px',
          background: 'none',
          border: 'none',
          color: '#54546C',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Pas maintenant
      </button>
    </div>
  );
}
