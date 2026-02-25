import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function SubscriptionScreen() {
  const { navigateTo, setSubscriptionActive, addNotification } = useAppContext();

  const handleActivate = () => {
    setSubscriptionActive(true);
    addNotification({
      title: 'Abonnement active',
      body: 'Votre essai gratuit de 7 jours a commence.',
      read: false,
    });
    navigateTo('nexusOS');
  };

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--t1)', marginBottom: '8px' }}>
        Essai gratuit
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px', color: 'var(--t2)', marginBottom: '32px' }}>
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
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'rgba(0,217,122,0.1)', border: '1px solid rgba(0,217,122,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--flash)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--t2)' }}>{benefit}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleActivate}
        style={{
          width: '100%', height: '60px',
          background: '#F2D06B', color: '#050507',
          border: 'none', borderRadius: '16px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700,
          fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(242,208,107,0.25)',
        }}
      >
        Commencer l essai gratuit
      </button>

      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t3)', textAlign: 'center', marginTop: '12px' }}>
        Aucun prelevement pendant 7 jours.
      </div>
    </div>
  );
}
