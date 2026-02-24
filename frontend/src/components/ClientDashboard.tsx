import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GlobalHeader from './GlobalHeader';
import BottomNav from './BottomNav';
import type { LocalBooking } from '../context/AppContext';

export default function ClientDashboard() {
  const { navigate, bookings } = useAppContext();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const pendingBookings = bookings?.filter((b) => b.status === 'pending') ?? [];
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed') ?? [];
  const completedBookings = bookings?.filter((b) => b.status === 'completed') ?? [];
  const hasPendingBookings = pendingBookings.length > 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate('splash');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#E8C89A';
      case 'confirmed': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#888888';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const renderBookingCard = (booking: LocalBooking) => (
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
            {booking.proName ?? 'Pro'}
          </div>
          <div style={{ color: '#888888', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            {booking.serviceName ?? 'Service'}
          </div>
        </div>
        <span
          style={{
            backgroundColor: `${getStatusColor(booking.status)}20`,
            color: getStatusColor(booking.status),
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            padding: '4px 10px',
            borderRadius: '50px',
            border: `1px solid ${getStatusColor(booking.status)}40`,
          }}
        >
          {getStatusLabel(booking.status)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <span style={{ color: '#666666', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
          📅 {booking.date ?? '—'}
        </span>
        <span style={{ color: '#666666', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
          🕐 {booking.timeSlot ?? '—'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#E8C89A', fontWeight: 700, fontSize: '16px', fontFamily: "'Inter', sans-serif" }}>
          {booking.servicePrice ?? 0} CHF
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="screen-transition"
      style={{ minHeight: '100dvh', backgroundColor: '#0A0A0A', paddingTop: '56px', paddingBottom: '80px' }}
    >
      <GlobalHeader hasNotifications={hasPendingBookings} />

      <div style={{ padding: '24px 16px 0' }}>
        <h1
          style={{
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.01em',
            marginBottom: '8px',
          }}
        >
          Mes réservations
        </h1>
        <p style={{ color: '#888888', fontSize: '15px', fontFamily: "'Inter', sans-serif", marginBottom: '28px' }}>
          Gérez vos rendez-vous
        </p>

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="green-dot-pulse" style={{ backgroundColor: '#E8C89A' }} />
              <span
                style={{
                  color: '#E8C89A',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                EN ATTENTE
              </span>
            </div>
            {pendingBookings.map(renderBookingCard)}
          </div>
        )}

        {/* Confirmed bookings */}
        {confirmedBookings.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: '14px' }}>
              Confirmés
            </h2>
            {confirmedBookings.map(renderBookingCard)}
          </div>
        )}

        {/* Completed bookings */}
        {completedBookings.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: '14px' }}>
              Terminés
            </h2>
            {completedBookings.map(renderBookingCard)}
          </div>
        )}

        {/* Empty state */}
        {pendingBookings.length === 0 && confirmedBookings.length === 0 && completedBookings.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              color: '#555555',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <p style={{ fontSize: '18px', color: '#888888', fontWeight: 600, marginBottom: '8px' }}>
              Aucune réservation
            </p>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>
              Explorez les pros disponibles et réservez votre premier service
            </p>
            <button
              onClick={() => navigate('explorer')}
              className="btn-tap"
              style={{
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
              Explorer les pros
            </button>
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
