import React, { useState } from 'react';
import { useRadarDemandes, useUpdateBookingStatus } from '../hooks/useQueries';
import type { Booking } from '../backend';
import { BookingStatus } from '../backend';

type FilterTab = 'pending' | 'confirmed' | 'history';

export default function RadarPro() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending');

  const { data: bookings = [], isLoading } = useRadarDemandes();
  const updateStatus = useUpdateBookingStatus();

  const filtered = bookings.filter((b) => {
    if (activeFilter === 'pending') return b.status === 'pending';
    if (activeFilter === 'confirmed') return b.status === 'confirmed';
    return b.status === 'cancelled';
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const handleAccept = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.confirmed });
  };

  const handleDecline = (bookingId: string) => {
    updateStatus.mutate({ bookingId, status: BookingStatus.cancelled });
  };

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'pending', label: 'En attente', count: pendingCount },
    { key: 'confirmed', label: 'Confirmees', count: confirmedCount },
    { key: 'history', label: 'Historique' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Inter, sans-serif',
        background: 'var(--void)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 0',
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--t1)',
            letterSpacing: '-0.5px',
          }}
        >
          Radar
        </h1>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(244,244,248,0.4)' }}>
          Demandes de reservation en temps reel
        </p>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(244,244,248,0.04)',
            borderRadius: 12,
            padding: 4,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 9,
                border: 'none',
                background: activeFilter === tab.key ? 'rgba(242,208,107,0.15)' : 'transparent',
                color: activeFilter === tab.key ? 'var(--gold)' : 'rgba(244,244,248,0.4)',
                fontSize: 12,
                fontWeight: activeFilter === tab.key ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background: activeFilter === tab.key ? 'var(--gold)' : 'rgba(244,244,248,0.15)',
                    color: activeFilter === tab.key ? '#050507' : 'rgba(244,244,248,0.6)',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '48px 0',
              color: 'rgba(244,244,248,0.3)',
              fontSize: 14,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                border: '2px solid rgba(242,208,107,0.2)',
                borderTopColor: 'var(--gold)',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Chargement...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
              color: 'rgba(244,244,248,0.3)',
              fontSize: 14,
            }}
          >
            {activeFilter === 'pending'
              ? 'Aucune demande en attente'
              : activeFilter === 'confirmed'
              ? 'Aucune reservation confirmee'
              : 'Aucun historique'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onAccept={() => handleAccept(booking.id)}
                onDecline={() => handleDecline(booking.id)}
                isPending={updateStatus.isPending}
                showActions={activeFilter === 'pending'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onAccept,
  onDecline,
  isPending,
  showActions,
}: {
  booking: Booking;
  onAccept: () => void;
  onDecline: () => void;
  isPending: boolean;
  showActions: boolean;
}) {
  return (
    <div
      style={{
        background: 'rgba(244,244,248,0.03)',
        border: '1px solid rgba(244,244,248,0.08)',
        borderRadius: 14,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>
            Service #{booking.serviceId.slice(0, 8)}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginTop: 2 }}>
            {booking.date} {booking.timeSlot && `· ${booking.timeSlot}`}
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--gold)',
          }}
        >
          {Number(booking.totalPrice)} CHF
        </div>
      </div>

      {/* Address */}
      {booking.address && (
        <div
          style={{
            fontSize: 12,
            color: 'rgba(244,244,248,0.5)',
            padding: '8px 12px',
            background: 'rgba(244,244,248,0.03)',
            borderRadius: 8,
          }}
        >
          {booking.address}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onDecline}
            disabled={isPending}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: '1px solid rgba(255,61,90,0.3)',
              background: 'rgba(255,61,90,0.08)',
              color: 'var(--alert)',
              fontSize: 13,
              fontWeight: 600,
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Refuser
          </button>
          <button
            onClick={onAccept}
            disabled={isPending}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: 'none',
              background: isPending ? 'rgba(0,217,122,0.3)' : 'rgba(0,217,122,0.15)',
              color: 'var(--flash)',
              fontSize: 13,
              fontWeight: 600,
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {isPending ? (
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(0,217,122,0.3)',
                  borderTopColor: 'var(--flash)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : null}
            Accepter
          </button>
        </div>
      )}
    </div>
  );
}
