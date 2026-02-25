import React from 'react';
import { useAppContext, Booking } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import BottomNav from './BottomNav';

export default function ClientDashboard() {
  const { bookings, setBookings, navigateTo } = useAppContext();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const cancelBooking = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
  };

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', paddingBottom: '90px' }}>
      <GlobalHeader />

      <div style={{ padding: '20px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--t1)', marginBottom: '20px' }}>
          Mes reservations
        </div>

        {bookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', marginBottom: '20px' }}>
              Aucune reservation pour le moment
            </div>
            <button
              onClick={() => navigateTo('explorerV2')}
              style={{
                height: '52px', padding: '0 24px',
                background: '#F2D06B', color: '#050507',
                border: 'none', borderRadius: '14px',
                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Trouver un pro
            </button>
          </div>
        )}

        {pendingBookings.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--t3)', letterSpacing: '0.08em', marginBottom: '12px' }}>
              EN ATTENTE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onCancel={cancelBooking} />
              ))}
            </div>
          </div>
        )}

        {confirmedBookings.length > 0 && (
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--t3)', letterSpacing: '0.08em', marginBottom: '12px' }}>
              CONFIRMES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {confirmedBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onCancel={cancelBooking} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab="reservations" />
    </div>
  );
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  return (
    <div style={{
      background: 'var(--d3)', border: '1px solid var(--edge1)',
      borderRadius: '16px', padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t1)' }}>
            {booking.proName}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)', marginTop: '2px' }}>
            {booking.service}
          </div>
        </div>
        <span style={{
          background: booking.status === 'confirmed' ? 'rgba(0,217,122,0.1)' : 'rgba(242,208,107,0.1)',
          border: `1px solid ${booking.status === 'confirmed' ? 'rgba(0,217,122,0.3)' : 'rgba(242,208,107,0.3)'}`,
          borderRadius: '999px', padding: '4px 10px',
          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px',
          color: booking.status === 'confirmed' ? 'var(--flash)' : 'var(--gold)',
        }}>
          {booking.status === 'confirmed' ? 'Confirme' : 'En attente'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>
          {booking.date} · {booking.time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--gold)' }}>
            {booking.price} CHF
          </span>
          {booking.status === 'pending' && (
            <button
              onClick={() => onCancel(booking.id)}
              style={{
                background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)',
                borderRadius: '8px', padding: '4px 10px',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px',
                color: 'var(--alert)', cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
