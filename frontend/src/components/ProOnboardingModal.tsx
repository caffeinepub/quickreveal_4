import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ProOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function ProOnboardingModal({ isOpen, onClose, onStart }: ProOnboardingModalProps) {
  if (!isOpen) return null;

  const benefits = [
    { icon: '🚀', title: 'Profil visible immédiatement', desc: 'Apparaissez dans l\'Explorer dès l\'activation' },
    { icon: '📅', title: 'Réservations automatiques', desc: 'Vos clients réservent 24h/24, 7j/7' },
    { icon: '💳', title: 'Paiements sécurisés', desc: 'Encaissez sans effort via Stripe' },
    { icon: '📊', title: 'Analytics en temps réel', desc: 'Suivez vos performances et revenus' },
    { icon: '🔔', title: 'Notifications instantanées', desc: 'Soyez alerté à chaque nouvelle réservation' },
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
            Bienvenue sur NEXUS Pro
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: '#9898B4',
            margin: '4px 0 0',
          }}>
            Démarrez votre essai gratuit de 7 jours
          </p>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          padding: '20px 24px',
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '12px 0',
              borderBottom: i < benefits.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{
                width: 40,
                height: 40,
                background: 'rgba(242,208,107,0.1)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {b.icon}
              </div>
              <div>
                <p style={{
                  margin: 0,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#F4F4F8',
                }}>
                  {b.title}
                </p>
                <p style={{
                  margin: '2px 0 0',
                  fontFamily: 'Inter',
                  fontSize: 12,
                  color: '#9898B4',
                }}>
                  {b.desc}
                </p>
              </div>
              <div style={{
                marginLeft: 'auto',
                color: '#F2D06B',
                fontSize: 16,
                flexShrink: 0,
              }}>
                ✓
              </div>
            </div>
          ))}

          <div style={{
            background: 'rgba(242,208,107,0.06)',
            border: '1px solid rgba(242,208,107,0.15)',
            borderRadius: 12,
            padding: '14px 16px',
            marginTop: 16,
          }}>
            <p style={{
              margin: 0,
              fontFamily: 'Inter',
              fontSize: 13,
              color: '#F2D06B',
              lineHeight: 1.5,
            }}>
              🎁 <strong>7 jours gratuits</strong>, puis 199 CHF/an. Annulable à tout moment.
            </p>
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
            Plus tard
          </button>
          <button
            onClick={onStart}
            style={{
              flex: 2,
              height: 50,
              background: '#F2D06B',
              border: 'none',
              borderRadius: 12,
              color: '#050507',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Démarrer l'essai gratuit
          </button>
        </div>
      </div>
    </div>
  );
}
