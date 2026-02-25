import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ProSubscriptionModal() {
  const { navigateTo, setProActif, setFlashActive } = useAppContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setProActif(true);
    setFlashActive(true);
    setTimeout(() => {
      navigateTo('nexusOS');
    }, 2000);
  };

  if (success) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'var(--void)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(0,217,122,0.1)', border: '2px solid var(--flash)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
        }}>
          ✓
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--t1)', textAlign: 'center' }}>
          Vous etes en ligne !
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: 'var(--t2)', textAlign: 'center' }}>
          Votre profil est maintenant visible par les clients.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(5,5,7,0.95)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '0 20px 40px',
    }}>
      <div style={{
        background: 'var(--d2)', border: '1px solid var(--gold-edge)',
        borderRadius: '28px', padding: '32px',
        maxWidth: '420px', width: '100%', marginTop: '10vh',
      }}>
        <div style={{ display: 'inline-flex' }}>
          <span style={{
            background: 'rgba(0,217,122,0.08)', border: '1px solid rgba(0,217,122,0.2)',
            borderRadius: '999px', padding: '6px 16px',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px',
            color: 'var(--flash)', letterSpacing: '0.1em',
          }}>
            7 JOURS GRATUITS · 19,90 CHF/mois
          </span>
        </div>

        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--t1)', marginTop: '16px' }}>
          Devenez visible sur NEXUS
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            'Visibilite illimitee sur NEXUS',
            'Demandes Flash en temps reel',
            'Paiements TWINT instantanes',
            'Agenda et gestion des RDV',
            'Statistiques et revenus detailles',
            'Support prioritaire 7j sur 7',
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'rgba(0,217,122,0.1)', border: '1px solid rgba(0,217,122,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '11px', color: 'var(--flash)' }}>✓</span>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--t2)' }}>{benefit}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{
            display: 'block', fontFamily: 'Inter, sans-serif',
            fontWeight: 600, fontSize: '12px', color: 'var(--t3)',
            marginBottom: '8px', letterSpacing: '0.06em',
          }}>
            ADRESSE EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={{
              width: '100%', height: '52px',
              background: 'var(--d3)', border: '1px solid var(--d4)',
              borderRadius: '12px', padding: '0 16px',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px',
              color: 'var(--t1)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading || !email}
          style={{
            width: '100%', height: '58px',
            background: '#F2D06B', color: '#050507',
            border: 'none', borderRadius: '14px',
            fontFamily: 'Inter, sans-serif', fontWeight: 700,
            fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: loading || !email ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            boxShadow: '0 8px 32px rgba(242,208,107,0.25)',
            opacity: loading || !email ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}
        >
          {loading && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          Commencer l essai gratuit
        </button>

        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t3)', textAlign: 'center', marginTop: '12px' }}>
          Aucun prelevement pendant 7 jours.
        </div>
      </div>
    </div>
  );
}
