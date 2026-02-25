import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { AppUserRole } from '../backend';

interface ProOnboardingModalProps {
  onClose: () => void;
}

const BENEFITS = [
  'Profil visible par des milliers de clients autour de vous',
  'Réservations instantanées 24h/24',
  'Paiements garantis NEXUS PAY',
  'Notifications temps réel',
  'Zéro commission les 7 premiers jours',
];

export default function ProOnboardingModal({ onClose }: ProOnboardingModalProps) {
  const { navigateTo, setAppRole } = useAppContext();
  const saveProfile = useSaveCallerUserProfile();

  const handleStart = async () => {
    try {
      await saveProfile.mutateAsync({ name: 'Professionnel', appRole: AppUserRole.professional });
    } catch {
      // continue even if backend save fails
    }
    setAppRole('pro');
    navigateTo('builder');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        background: '#111111',
        borderRadius: '24px 24px 0 0',
        padding: '32px 24px 40px',
        animation: 'slideUp 0.3s ease forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 4 }}>
              LANCER MON SERVICE
            </h2>
            <p style={{ fontSize: 14, color: '#E8C89A' }}>7 jours gratuits · Sans engagement</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888888',
              cursor: 'pointer',
              fontSize: 20,
              padding: 4,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {BENEFITS.map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(232,200,154,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 14,
                color: '#E8C89A',
                fontWeight: 700,
              }}>
                ✓
              </div>
              <p style={{ fontSize: 14, color: '#CCCCCC' }}>{benefit}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleStart}
            disabled={saveProfile.isPending}
            style={{
              width: '100%',
              height: 56,
              background: 'linear-gradient(135deg, #E8C89A, #D4A96A)',
              border: 'none',
              borderRadius: 14,
              color: '#080808',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: saveProfile.isPending ? 'not-allowed' : 'pointer',
              opacity: saveProfile.isPending ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {saveProfile.isPending ? (
              <>
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(8,8,8,0.3)',
                  borderTop: '2px solid #080808',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                Chargement...
              </>
            ) : (
              'Commencer 7 jours gratuits'
            )}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#555555',
              fontSize: 14,
              cursor: 'pointer',
              padding: '12px',
              width: '100%',
            }}
          >
            Pas maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
