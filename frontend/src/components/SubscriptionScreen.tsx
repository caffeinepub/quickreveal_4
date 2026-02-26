import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function SubscriptionScreen() {
  const { navigateTo, setSubscriptionActive, addNotification } = useAppContext();

  const handleActivate = () => {
    setSubscriptionActive(true);
    addNotification({
      type: 'booking_confirme',
      message: 'Votre essai gratuit de 7 jours a commence.',
      read: false,
      timestamp: Date.now(),
    });
    navigateTo('nexusOS');
  };

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          fontSize: '28px',
          color: 'var(--t1)',
          marginBottom: '8px',
        }}
      >
        Essai gratuit
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: 'var(--t2)',
          marginBottom: '32px',
        }}
      >
        7 jours gratuits, puis 19.90 CHF/mois
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {[
          'Visibilite illimitee sur NEXUS',
          'Demandes Flash en temps reel',
          'Paiements TWINT instantanes',
          'Agenda et gestion des RDV',
          'Statistiques et revenus detailles',
          'Support prioritaire 7j sur 7',
        ].map((benefit, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'rgba(0,217,122,0.1)',
                border: '1px solid rgba(0,217,122,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--flash)' }}>✓</span>
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                color: 'var(--t2)',
              }}
            >
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleActivate}
        style={{
          width: '100%',
          height: '58px',
          background: '#F2D06B',
          color: '#050507',
          border: 'none',
          borderRadius: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(242,208,107,0.25)',
        }}
      >
        Commencer l essai gratuit
      </button>

      <button
        onClick={() => navigateTo('nexusOS')}
        style={{
          width: '100%',
          marginTop: '12px',
          background: 'none',
          border: 'none',
          color: 'var(--t3)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '12px',
        }}
      >
        Plus tard
      </button>
    </div>
  );
}
