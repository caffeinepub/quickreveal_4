import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GlobalHeader from './GlobalHeader';
import BottomNav from './BottomNav';
import type { LocalBooking } from '../context/AppContext';

type TabId = 'radar' | 'wallet' | 'portfolio' | 'agenda';

export default function NexusOS() {
  const { navigate, bookings, proProfile } = useAppContext();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('radar');

  const pendingBookings = bookings?.filter((b) => b.status === 'pending') ?? [];
  const hasPendingBookings = pendingBookings.length > 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate('splash');
  };

  const tabs: { id: TabId; label: string; emoji: string }[] = [
    { id: 'radar', label: 'RADAR', emoji: '📡' },
    { id: 'wallet', label: 'WALLET', emoji: '💰' },
    { id: 'portfolio', label: 'PORTFOLIO', emoji: '🎨' },
    { id: 'agenda', label: 'AGENDA', emoji: '📅' },
  ];

  return (
    <div
      className="screen-transition"
      style={{ minHeight: '100dvh', backgroundColor: '#0A0A0A', paddingTop: '56px', paddingBottom: '80px' }}
    >
      <GlobalHeader hasNotifications={hasPendingBookings} />

      <div style={{ padding: '24px 16px 0' }}>
        {/* Pro header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '28px',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: '4px',
            }}
          >
            Espace Pro
          </h1>
          <p style={{ color: '#888888', fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
            {proProfile?.brandName ?? 'Professionnel'}
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Demandes', value: pendingBookings.length.toString(), color: '#E8C89A' },
            { label: 'Ce mois', value: '0 CHF', color: '#22C55E' },
            { label: 'Note', value: '—', color: '#4F6EF7' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#111111',
                borderRadius: '12px',
                padding: '14px 12px',
                textAlign: 'center',
                border: '1px solid #1F1F1F',
              }}
            >
              <div
                style={{
                  color: stat.color,
                  fontWeight: 700,
                  fontSize: '20px',
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: '#555555', fontSize: '11px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="scroll-no-bar"
          style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn-tap"
                style={{
                  flexShrink: 0,
                  backgroundColor: isActive ? '#E8C89A' : '#1A1A1A',
                  color: isActive ? '#0A0A0A' : '#888888',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  border: isActive ? 'none' : '1px solid #2A2A2A',
                  borderRadius: '50px',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {tab.emoji} {tab.label}
                {tab.id === 'radar' && hasPendingBookings && (
                  <span
                    className="red-badge-pulse"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#EF4444',
                      borderRadius: '50%',
                      border: '1.5px solid #0A0A0A',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'radar' && (
          <div>
            {pendingBookings.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: '#555555',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📡</div>
                <p style={{ fontSize: '16px', color: '#888888', fontWeight: 600, marginBottom: '8px' }}>
                  Aucune demande en attente
                </p>
                <p style={{ fontSize: '14px' }}>Les nouvelles réservations apparaîtront ici</p>
              </div>
            ) : (
              pendingBookings.map((booking: LocalBooking) => (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: '#111111',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid #1F1F1F',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                        {booking.clientName ?? 'Client'}
                      </div>
                      <div style={{ color: '#888888', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                        {booking.serviceName ?? 'Service'}
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: 'rgba(232,200,154,0.1)',
                        color: '#E8C89A',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        padding: '4px 10px',
                        borderRadius: '50px',
                        border: '1px solid rgba(232,200,154,0.2)',
                      }}
                    >
                      En attente
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                    <span style={{ color: '#666666', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                      📅 {booking.date ?? '—'}
                    </span>
                    <span style={{ color: '#666666', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                      🕐 {booking.timeSlot ?? '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-tap"
                      style={{
                        flex: 1,
                        backgroundColor: '#22C55E',
                        color: '#FFFFFF',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '13px',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Accepter
                    </button>
                    <button
                      className="btn-tap"
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        color: '#EF4444',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '13px',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '50px',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Refuser
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#555555', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
            <p style={{ fontSize: '16px', color: '#888888', fontWeight: 600, marginBottom: '8px' }}>Revenus</p>
            <p style={{ color: '#E8C89A', fontWeight: 700, fontSize: '32px', fontFamily: "'Inter', sans-serif" }}>0 CHF</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Ce mois-ci</p>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#555555', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎨</div>
            <p style={{ fontSize: '16px', color: '#888888', fontWeight: 600, marginBottom: '8px' }}>Portfolio</p>
            <p style={{ fontSize: '14px' }}>Ajoutez vos photos de travaux</p>
            <button
              onClick={() => navigate('builder')}
              className="btn-tap"
              style={{
                marginTop: '20px',
                backgroundColor: '#E8C89A',
                color: '#0A0A0A',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '50px',
                padding: '14px 28px',
                cursor: 'pointer',
              }}
            >
              Modifier le profil
            </button>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#555555', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📅</div>
            <p style={{ fontSize: '16px', color: '#888888', fontWeight: 600, marginBottom: '8px' }}>Agenda</p>
            <p style={{ fontSize: '14px' }}>Gérez vos disponibilités</p>
          </div>
        )}

        {/* Logout */}
        <div style={{ marginTop: '32px', paddingBottom: '16px' }}>
          <button
            onClick={handleLogout}
            className="btn-tap"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#555555',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              border: '1px solid #1F1F1F',
              borderRadius: '12px',
              padding: '14px',
              cursor: 'pointer',
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <BottomNav activeTab="reservations" hasPendingBookings={hasPendingBookings} />
    </div>
  );
}
