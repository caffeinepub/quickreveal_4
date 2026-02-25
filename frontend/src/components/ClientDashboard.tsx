import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import type { Booking } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GlobalHeader from './GlobalHeader';
import BottomNav from './BottomNav';

export default function ClientDashboard() {
  const { navigateTo, bookings } = useAppContext();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const pendingBookings = bookings?.filter((b) => b.status === 'pending') ?? [];
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed') ?? [];
  const hasPendingBookings = pendingBookings.length > 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigateTo('splash');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F2D06B';
      case 'confirmed': return '#00D97A';
      case 'cancelled': return '#FF5050';
      default: return '#54546C';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <div
      key={booking.id}
      style={{
        background: '#0D0D13',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '10px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ color: '#F4F4F8', fontWeight: 700, fontSize: '15px', marginBottom: '3px', fontFamily: 'Inter, sans-serif' }}>
            {booking.proName ?? 'Pro'}
          </div>
          <div style={{ color: '#54546C', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
            {booking.serviceName ?? booking.service ?? 'Service'}
          </div>
        </div>
        <span style={{
          background: `${getStatusColor(booking.status)}15`,
          color: getStatusColor(booking.status),
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '20px',
          border: `1px solid ${getStatusColor(booking.status)}40`,
          fontFamily: 'Inter, sans-serif',
        }}>
          {getStatusLabel(booking.status)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
        <span style={{ color: '#54546C', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          {booking.date ?? '—'}
        </span>
        <span style={{ color: '#54546C', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          {booking.timeSlot ?? booking.time ?? '—'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#F2D06B', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
          {booking.price ?? 0} CHF
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingTop: '60px', paddingBottom: '80px' }}>
      <GlobalHeader />

      <div style={{ padding: '24px 16px 0' }}>
        <h1 style={{ color: '#F4F4F8', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
          Mes réservations
        </h1>
        <p style={{ color: '#54546C', fontSize: '13px', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
          Gérez vos rendez-vous
        </p>

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#F2D06B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              En attente
            </div>
            {pendingBookings.map(renderBookingCard)}
          </div>
        )}

        {/* Confirmed bookings */}
        {confirmedBookings.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#00D97A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              Confirmés
            </div>
            {confirmedBookings.map(renderBookingCard)}
          </div>
        )}

        {/* Empty state */}
        {pendingBookings.length === 0 && confirmedBookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#54546C' }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#2E2E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <rect x="8" y="10" width="32" height="32" rx="4" />
                <line x1="8" y1="20" x2="40" y2="20" />
                <line x1="16" y1="6" x2="16" y2="14" />
                <line x1="32" y1="6" x2="32" y2="14" />
              </svg>
            </div>
            <p style={{ fontSize: '16px', color: '#54546C', fontWeight: 600, marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
              Aucune réservation
            </p>
            <p style={{ fontSize: '13px', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
              Explorez les pros disponibles
            </p>
            <button
              onClick={() => navigateTo('explorer')}
              style={{
                background: '#F2D06B',
                color: '#050507',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
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
            style={{
              width: '100%',
              background: 'transparent',
              color: '#54546C',
              fontWeight: 500,
              fontSize: '14px',
              border: '1px solid #1E1E26',
              borderRadius: '12px',
              padding: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
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
