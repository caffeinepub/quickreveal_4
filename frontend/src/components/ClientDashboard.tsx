import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Booking } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';

export default function ClientDashboard() {
  const { bookings, navigateTo } = useAppContext();

  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');

  const handleCancel = (id: string) => {
    // Cancellation handled via context in a real implementation
    console.log('Cancel booking', id);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#050507',
        overflow: 'hidden',
      }}
    >
      {/* SCROLLABLE CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          style={{
            minHeight: '100%',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
          }}
        >
          <GlobalHeader />

          <div style={{ padding: '24px 20px 0' }}>
            <h1
              style={{
                color: '#fff',
                fontSize: 24,
                fontWeight: 800,
                fontFamily: 'Inter, sans-serif',
                margin: '0 0 4px',
              }}
            >
              Mes Réservations
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                margin: '0 0 24px',
              }}
            >
              Gérez vos rendez-vous
            </p>

            {/* Pending */}
            {pending.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  En attente
                </p>
                {pending.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            )}

            {/* Confirmed */}
            {confirmed.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  Confirmées
                </p>
                {confirmed.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {bookings.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 15,
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: 20,
                  }}
                >
                  Aucune réservation pour le moment
                </p>
                <button
                  onClick={() => navigateTo('explorerV2')}
                  style={{
                    background: '#F2D06B',
                    color: '#050507',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Explorer les pros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV — NOT FIXED */}
      <BottomNav activeTab="clientDashboard" hasPendingBookings={pending.length > 0} />
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '14px 16px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <p
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              margin: '0 0 4px',
            }}
          >
            {booking.service}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              margin: 0,
            }}
          >
            {booking.date} · {booking.time}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            padding: '4px 10px',
            borderRadius: 8,
            background:
              booking.status === 'confirmed'
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(242,208,107,0.15)',
            color: booking.status === 'confirmed' ? '#22c55e' : '#F2D06B',
          }}
        >
          {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
        </span>
      </div>
      {booking.status === 'pending' && (
        <button
          onClick={() => onCancel(booking.id)}
          style={{
            marginTop: 10,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '6px 14px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
          }}
        >
          Annuler
        </button>
      )}
    </div>
  );
}
