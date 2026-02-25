import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    if (loading) return;
    setLoading(true);
    // Simulate 800ms then trigger success flow — no API calls
    setTimeout(() => {
      onClose();
      onSubscribe();
    }, 800);
  };

  const benefits = [
    'Profil visible par des milliers de clients autour de vous',
    'Reservations instantanees 24h/24',
    'Paiements garantis NEXUS PAY',
    'Notifications temps reel',
    'Zero commission les 7 premiers jours',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,5,7,0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          background: '#0D0D13',
          borderRadius: '28px 28px 0 0',
          border: '1px solid rgba(242,208,107,0.12)',
          borderBottom: 'none',
          padding: '32px 24px 48px',
          animation: 'nexusSlideUp 300ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}>
          <div>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 24,
              color: '#F4F4F8',
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              LANCER MON SERVICE
            </p>
            <p style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 14,
              color: '#F2D06B',
              marginTop: 4,
              marginBottom: 0,
            }}>
              7 jours gratuits · Sans engagement
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#54546C',
              cursor: 'pointer',
              fontSize: 20,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Benefits */}
        <div style={{ marginTop: 24, marginBottom: 28 }}>
          {benefits.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              marginBottom: 18,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(242,208,107,0.1)',
                border: '1px solid rgba(242,208,107,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" stroke="#F2D06B" strokeWidth="2.5" fill="none">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 15,
                color: '#9898B4',
                lineHeight: 1.5,
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Main CTA button */}
        <button
          onClick={handleStart}
          disabled={loading}
          style={{
            width: '100%',
            height: 58,
            borderRadius: 16,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#1C1C26' : '#F2D06B',
            color: loading ? '#54546C' : '#050507',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.02em',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 18,
                height: 18,
                border: '2px solid #54546C',
                borderTopColor: '#9898B4',
                borderRadius: '50%',
                animation: 'nexusModalSpin 1s linear infinite',
              }} />
              Activation...
            </>
          ) : (
            'Commencer 7 jours gratuits'
          )}
        </button>

        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: '#54546C',
            textAlign: 'center',
            marginTop: 14,
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Pas maintenant
        </p>
      </div>

      <style>{`
        @keyframes nexusSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes nexusModalSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
