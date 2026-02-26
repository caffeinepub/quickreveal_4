import React from 'react';
import { useGetBookingsByUser } from '../../hooks/useQueries';
import type { Booking } from '../../backend';
import { IconCalendar, IconArrowRight } from '../../components/icons';

const CLIENT_TABS = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'alertes', label: 'Alertes' },
  { id: 'profil', label: 'Profil' },
];

interface ReservationsScreenProps {
  principal: string | null;
  clientTab: string;
  onTabChange: (tab: string) => void;
  onSelectBooking: (booking: Booking) => void;
  onGoExplorer: () => void;
}

export default function ReservationsScreen({ principal, clientTab, onTabChange, onSelectBooking, onGoExplorer }: ReservationsScreenProps) {
  const { data: bookings, isLoading } = useGetBookingsByUser(principal);

  const statusLabel: Record<string, string> = { pending: 'En attente', confirmed: 'Confirme', cancelled: 'Annule' };
  const statusColor: Record<string, { color: string; bg: string }> = {
    pending: { color: '#F2D06B', bg: 'rgba(242,208,107,0.1)' },
    confirmed: { color: '#00D97A', bg: 'rgba(0,217,122,0.1)' },
    cancelled: { color: '#FF3D5A', bg: 'rgba(255,61,90,0.1)' },
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ flexShrink: 0, padding: '48px 20px 16px', background: 'rgba(5,5,7,0.97)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#F4F4F8', letterSpacing: '-0.03em' }}>Mes reservations</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(242,208,107,0.2)', borderTopColor: '#F2D06B', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 13, color: '#9898B4' }}>Chargement...</div>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <IconCalendar size={40} color="#2E2E3E" />
            <div style={{ fontSize: 16, fontWeight: 600, color: '#9898B4', marginTop: 16 }}>Aucune reservation</div>
            <div style={{ fontSize: 13, color: '#54546C', marginTop: 8, marginBottom: 24 }}>Explorez les professionnels pres de chez vous</div>
            <button onClick={onGoExplorer} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #F2D06B, #D4A050)', color: '#050507', fontWeight: 700, fontSize: 14, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Explorer les pros
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bookings.map((booking: Booking) => {
              const sc = statusColor[booking.status as string] ?? { color: '#9898B4', bg: 'rgba(255,255,255,0.05)' };
              return (
                <button
                  key={booking.id}
                  onClick={() => onSelectBooking(booking)}
                  style={{ width: '100%', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconCalendar size={20} color={sc.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Reservation #{booking.id.slice(0, 12)}
                    </div>
                    <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2 }}>{booking.date} {booking.timeSlot && `· ${booking.timeSlot}`}</div>
                    <div style={{ marginTop: 6, display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 600 }}>
                      {statusLabel[booking.status as string] ?? booking.status}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#F2D06B' }}>{Number(booking.totalPrice)} CHF</div>
                    <IconArrowRight size={14} color="#54546C" style={{ marginTop: 4 }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      <div style={{ flexShrink: 0, display: 'flex', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {CLIENT_TABS.map((tab) => {
          const isActive = clientTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', gap: 3 }}>
              {isActive && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: '#F2D06B', borderRadius: 2 }} />}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? '#F2D06B' : '#2E2E3E' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
