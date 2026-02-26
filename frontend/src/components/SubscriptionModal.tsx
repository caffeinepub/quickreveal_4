import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSubscribe();
  };

  const benefits = [
    { icon: '⚡', text: 'Profil visible dans l\'Explorer' },
    { icon: '📅', text: 'Réservations en ligne illimitées' },
    { icon: '💳', text: 'Paiements automatiques sécurisés' },
    { icon: '📊', text: 'Statistiques et analytics' },
    { icon: '🔔', text: 'Notifications clients en temps réel' },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,7,0.85)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: 'calc(100vh - 64px - env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,255,255,0.06)',
          borderBottom: 'none',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36,
          height: 4,
          background: '#2E2E3E',
          borderRadius: 2,
          margin: '12px auto',
          flexShrink: 0,
        }} />

        {/* Fixed title */}
        <div style={{
          padding: '0 24px 16px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize: 20,
            color: '#F4F4F8',
            margin: 0,
          }}>
            Passer à Pro
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: '#9898B4',
            margin: '4px 0 0',
          }}>
            Activez votre compte professionnel
          </p>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          padding: '20px 24px',
        }}>
          {/* Pricing */}
          <div style={{
            background: 'rgba(242,208,107,0.06)',
            border: '1px solid rgba(242,208,107,0.2)',
            borderRadius: 16,
            padding: '20px',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 36,
              color: '#F2D06B',
              margin: 0,
            }}>
              199 CHF
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontSize: 13,
              color: '#9898B4',
              margin: '4px 0 0',
            }}>
              par an · soit 16.60 CHF/mois
            </p>
            <div style={{
              display: 'inline-block',
              background: 'rgba(242,208,107,0.15)',
              border: '1px solid rgba(242,208,107,0.3)',
              borderRadius: 20,
              padding: '4px 12px',
              marginTop: 10,
            }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#F2D06B', fontWeight: 600 }}>
                🎁 7 jours d'essai gratuit
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div>
            {benefits.map((b, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < benefits.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#F4F4F8' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons — always visible */}
        <div style={{
          flexShrink: 0,
          padding: '12px 24px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          gap: 12,
          background: '#0D0D13',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 50,
              background: '#121219',
              border: '1px solid #1C1C26',
              borderRadius: 12,
              color: '#9898B4',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              flex: 2,
              height: 50,
              background: loading ? '#2E2E3E' : '#F2D06B',
              border: 'none',
              borderRadius: 12,
              color: loading ? '#9898B4' : '#050507',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Activation...' : 'Commencer l\'essai gratuit'}
          </button>
        </div>
      </div>
    </div>
  );
}
