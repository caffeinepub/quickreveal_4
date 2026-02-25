import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconCheck } from './icons/Icons';

const BENEFITS = [
  'Visibilite illimitee sur NEXUS',
  'Demandes Flash en temps reel',
  'Paiements TWINT instantanes',
  'Agenda et gestion des RDV',
  'Statistiques et revenus detailles',
  'Support prioritaire 7j sur 7',
];

export default function SubscriptionModal() {
  const { closeSubscriptionModal, navigateTo } = useAppContext();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    closeSubscriptionModal();
    navigateTo('proSuccess');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(5,5,7,0.95)',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 20px 40px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeSubscriptionModal(); }}
    >
      <div style={{
        background: 'var(--d2)',
        border: '1px solid var(--gold-edge)',
        borderRadius: '28px',
        padding: '32px',
        maxWidth: '420px',
        width: '100%',
        marginTop: '10vh',
      }}>
        {/* Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(0,217,122,0.08)',
            border: '1px solid rgba(0,217,122,0.2)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '11px',
            color: 'var(--flash)',
            letterSpacing: '0.1em',
          }}>
            7 JOURS GRATUITS
          </span>
        </div>

        {/* Heading */}
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '32px', color: 'var(--t1)', marginTop: '16px' }}>
          Essai gratuit
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px', color: 'var(--t2)', marginTop: '6px' }}>
          puis 19.90 CHF/mois
        </div>

        {/* Benefits */}
        <div style={{
          background: 'var(--d3)',
          border: '1px solid var(--edge1)',
          borderRadius: '16px',
          padding: '20px',
          marginTop: '20px',
        }}>
          {BENEFITS.map((benefit, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                borderBottom: i < BENEFITS.length - 1 ? '1px solid var(--edge1)' : 'none',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <IconCheck size={16} color="var(--flash)" />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--t2)' }}>
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Email */}
        <label style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '12px',
          color: 'var(--t3)',
          marginTop: '20px',
          marginBottom: '8px',
          letterSpacing: '0.06em',
        }}>
          Adresse email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          placeholder="votre@email.com"
          style={{
            width: '100%',
            height: '52px',
            background: 'var(--d3)',
            border: `1px solid ${emailFocused ? 'var(--gold)' : 'var(--d4)'}`,
            borderRadius: '12px',
            padding: '0 16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '15px',
            color: 'var(--t1)',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: emailFocused ? '0 0 0 3px rgba(242,208,107,0.15)' : 'none',
            transition: 'border 200ms, box-shadow 200ms',
          }}
        />

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            width: '100%',
            height: '58px',
            background: '#F2D06B',
            color: '#050507',
            border: 'none',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            boxShadow: '0 8px 32px rgba(242,208,107,0.25)',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'opacity 200ms',
          }}
        >
          {loading && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          Commencer l essai gratuit
        </button>

        {/* Disclaimer */}
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: 'var(--t3)',
          textAlign: 'center',
          marginTop: '12px',
        }}>
          Aucun prelevement pendant 7 jours.
        </div>
      </div>
    </div>
  );
}
