import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const ArrowRightIcon = ({ color = '#2E2E3E' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9,4 13,8 9,12" />
  </svg>
);

export default function RoleSelection() {
  const { navigateTo, setAppRole } = useAppContext();
  const [selected, setSelected] = useState<'client' | 'pro' | null>(null);

  const handleSelect = (role: 'client' | 'pro') => {
    setSelected(role);
    setTimeout(() => {
      setAppRole(role);
      if (role === 'client') {
        navigateTo('otp');
      } else {
        navigateTo('subscription');
      }
    }, 180);
  };

  const clientActive = selected === 'client';
  const proActive = selected === 'pro';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050507',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{
          fontSize: '36px',
          fontWeight: 900,
          color: '#F4F4F8',
          letterSpacing: '-0.03em',
          fontFamily: 'Inter, sans-serif',
        }}>
          NEXUS
          <span style={{ color: '#F2D06B' }}>.</span>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#54546C',
          marginTop: '8px',
          fontWeight: 400,
        }}>
          Choisissez votre profil
        </p>
      </div>

      {/* Cards */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Client Card */}
        <button
          onClick={() => handleSelect('client')}
          style={{
            width: '100%',
            height: '96px',
            background: clientActive ? 'rgba(91,127,255,0.04)' : '#0D0D13',
            border: `1px solid ${clientActive ? '#5B7FFF' : '#1E1E26'}`,
            borderRadius: '16px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#F4F4F8',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2,
            }}>
              Client
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#54546C',
              marginTop: '4px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Réservez un expert à domicile
            </div>
          </div>
          <ArrowRightIcon color={clientActive ? '#5B7FFF' : '#2E2E3E'} />
        </button>

        {/* Pro Card */}
        <button
          onClick={() => handleSelect('pro')}
          style={{
            width: '100%',
            height: '96px',
            background: proActive ? 'rgba(242,208,107,0.04)' : '#0D0D13',
            border: `1px solid ${proActive ? '#F2D06B' : '#1E1E26'}`,
            borderRadius: '16px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#F4F4F8',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2,
            }}>
              Professionnel
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#54546C',
              marginTop: '4px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Gérez votre activité beauté
            </div>
          </div>
          <ArrowRightIcon color={proActive ? '#F2D06B' : '#2E2E3E'} />
        </button>
      </div>

      <p style={{
        marginTop: '32px',
        fontSize: '12px',
        color: '#2E2E3E',
        textAlign: 'center',
      }}>
        Vous pouvez changer de rôle à tout moment
      </p>
    </div>
  );
}
