import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';

const LightningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8,1 4,7.5 7.5,7.5 6,13 10,6.5 6.5,6.5" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,10 5,6 8,9 13,3" />
    <polyline points="9,3 13,3 13,7" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" />
    <circle cx="7" cy="7" r="1.5" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7,1.5 8.8,5.2 13,5.7 10,8.6 10.8,12.8 7,10.8 3.2,12.8 4,8.6 1,5.7 5.2,5.2" />
  </svg>
);

export default function NexusOS() {
  const { navigateTo, userName, bookings, proActif, flashActive, setFlashActive } = useAppContext();
  const [localFlash, setLocalFlash] = useState(proActif ? true : flashActive);

  const handleFlashToggle = () => {
    const next = !localFlash;
    setLocalFlash(next);
    setFlashActive(next);
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingBottom: '80px' }}>
      <GlobalHeader />

      <div style={{ paddingTop: '80px', padding: '80px 16px 0' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '4px',
          }}>
            Bonjour{userName ? `, ${userName}` : ''} 
          </div>
          <div style={{ fontSize: '13px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
            Votre tableau de bord professionnel
          </div>

          {/* Trial badge */}
          {proActif && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0,217,122,0.1)',
              border: '1px solid #00D97A',
              borderRadius: '20px',
              padding: '4px 12px',
              marginTop: '10px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#00D97A',
                fontFamily: 'Inter, sans-serif',
              }}>
                ESSAI GRATUIT · J1/7
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '16px',
        }}>
          {[
            { label: 'Réservations', value: confirmedBookings.length.toString(), icon: <TrendUpIcon />, color: '#F2D06B' },
            { label: 'En attente', value: pendingBookings.length.toString(), icon: <LightningIcon />, color: '#00D97A' },
            { label: 'Vues profil', value: '142', icon: <EyeIcon />, color: '#5B7FFF' },
            { label: 'Note moyenne', value: '4.9', icon: <StarIcon />, color: '#F2D06B' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#0D0D13',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '14px',
              padding: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: stat.color,
                marginBottom: '8px',
              }}>
                {stat.icon}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {stat.label}
                </span>
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Flash toggle */}
        <div style={{
          background: '#0D0D13',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}>
              <span style={{ color: localFlash ? '#F2D06B' : '#54546C' }}>
                <LightningIcon />
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}>
                Flash Live
              </span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#54546C',
              fontFamily: 'Inter, sans-serif',
            }}>
              {localFlash ? 'Visible pour les demandes urgentes' : 'Activez pour les demandes urgentes'}
            </div>
          </div>
          <button
            onClick={handleFlashToggle}
            style={{
              width: '48px',
              height: '26px',
              borderRadius: '13px',
              background: localFlash ? '#F2D06B' : '#1C1C26',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: localFlash ? '25px' : '3px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: localFlash ? '#050507' : '#54546C',
              transition: 'left 0.2s',
            }} />
          </button>
        </div>

        {/* View public profile */}
        {proActif && (
          <button
            onClick={() => navigateTo('explorer')}
            style={{
              width: '100%',
              height: '48px',
              background: 'rgba(242,208,107,0.06)',
              border: '1px solid rgba(242,208,107,0.2)',
              borderRadius: '12px',
              color: '#F2D06B',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '16px',
            }}
          >
            Voir mon profil public
          </button>
        )}

        {/* Recent bookings */}
        {bookings.length > 0 && (
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#54546C',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Réservations récentes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bookings.slice(0, 3).map(booking => (
                <div key={booking.id} style={{
                  background: '#0D0D13',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>
                      {booking.proName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
                      {booking.date} · {booking.time}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: booking.status === 'confirmed' ? '#00D97A' : booking.status === 'pending' ? '#F2D06B' : '#FF5050',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'pending' ? 'En attente' : 'Annulé'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab="dashboard" />
    </div>
  );
}
