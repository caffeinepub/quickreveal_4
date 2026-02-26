import React, { useState } from 'react';
import { createSubscriptionUrl } from '../../lib/payrexx';
import { IconX, IconCheck, IconTwint } from '../../components/icons';

interface SubscriptionModalProps {
  proId: string;
  onClose: () => void;
}

const BENEFITS = [
  'Profil visible dans l\'Explorer',
  'Gestion des réservations',
  'Paiements TWINT intégrés',
  'Radar de demandes en temps réel',
  'Wallet et virements automatiques',
  'Statistiques et analytics',
  'Notifications SMS clients',
];

export default function SubscriptionModal({ proId, onClose }: SubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setError('');
    if (!email.trim()) {
      setError('Email requis pour le paiement.');
      return;
    }
    if (!phone.trim()) {
      setError('Numéro de téléphone requis.');
      return;
    }
    setLoading(true);
    try {
      const url = await createSubscriptionUrl(proId, email.trim(), phone.trim());
      if (!url) {
        setError('Impossible de créer la session de paiement. Vérifiez la configuration Payrexx.');
        return;
      }
      window.location.href = url;
    } catch {
      setError('Erreur lors de la création du paiement. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,7,0.85)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,255,255,0.06)',
          borderBottom: 'none',
          maxHeight: 'calc(100% - 64px)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 250ms ease-out',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Header */}
        <div
          style={{
            padding: '16px 20px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#F4F4F8', letterSpacing: '-0.03em' }}>
              NEXUS Pro
            </div>
            <div style={{ fontSize: 13, color: '#9898B4', marginTop: 2 }}>
              7 jours d'essai gratuit
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#1C1C26',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconX size={14} color="#9898B4" />
          </button>
        </div>

        {/* Price */}
        <div
          style={{
            margin: '0 20px 16px',
            padding: '16px',
            background: 'rgba(242,208,107,0.06)',
            border: '1px solid rgba(242,208,107,0.15)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#F2D06B', letterSpacing: '-0.03em' }}>
              19.90 CHF
            </div>
            <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2 }}>par mois · TWINT</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconTwint size={20} color="#F2D06B" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F2D06B' }}>TWINT</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '0 20px',
          }}
        >
          {/* Benefits */}
          <div style={{ marginBottom: 20 }}>
            {BENEFITS.map((benefit) => (
              <div
                key={benefit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(0,217,122,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconCheck size={12} color="#00D97A" />
                </div>
                <span style={{ fontSize: 13, color: '#F4F4F8' }}>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: '#9898B4',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Email (pour la facture)
            </label>
            <input
              type="email"
              placeholder="votre@email.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: 48,
                background: '#121219',
                border: '1px solid #1C1C26',
                borderRadius: 10,
                padding: '0 14px',
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: '#9898B4',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Téléphone TWINT
            </label>
            <input
              type="tel"
              placeholder="+41 79 000 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                height: 48,
                background: '#121219',
                border: '1px solid #1C1C26',
                borderRadius: 10,
                padding: '0 14px',
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(255,61,90,0.1)',
                border: '1px solid rgba(255,61,90,0.2)',
                borderRadius: 10,
                color: '#FF3D5A',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ height: 8 }} />
        </div>

        {/* CTA */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 20px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 8px))',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 52,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#9898B4',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Plus tard
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              flex: 2,
              height: 52,
              background: loading ? 'rgba(242,208,107,0.4)' : 'linear-gradient(135deg, #F2D06B, #D4A050)',
              border: 'none',
              borderRadius: 12,
              color: '#050507',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #050507', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              'Demarrer l\'essai gratuit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
