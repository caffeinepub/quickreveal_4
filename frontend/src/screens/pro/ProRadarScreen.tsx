import React, { useState } from 'react';
import { useGetBookingsByProfessional, useUpdateBookingStatus } from '../../hooks/useQueries';
import type { Booking } from '../../backend';
import { BookingStatus } from '../../backend';
import { IconRadar, IconHome, IconWallet, IconEdit, IconCheck, IconX, IconClock } from '../../components/icons';

const PRO_TABS = [
  { id: 'radar', label: 'Radar', Icon: IconRadar },
  { id: 'wallet', label: 'Wallet', Icon: IconWallet },
  { id: 'dashboard', label: 'Home', Icon: IconHome },
  { id: 'business', label: 'Business', Icon: IconEdit },
];

interface ProRadarScreenProps {
  principal: string | null;
  proTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProRadarScreen({ principal, proTab, onTabChange }: ProRadarScreenProps) {
  const [filter, setFilter] = useState<'pending' | 'confirmed' | 'all'>('pending');
  const { data: bookings, isLoading, refetch } = useGetBookingsByProfessional(principal);
  const updateStatus = useUpdateBookingStatus();

  const filtered = (bookings ?? []).filter((b) => {
    if (filter === 'pending') return b.status === 'pending';
    if (filter === 'confirmed') return b.status === 'confirmed';
    return true;
  });

  const pendingCount = (bookings ?? []).filter((b) => b.status === 'pending').length;

  const handleAccept = async (booking: Booking) => {
    await updateStatus.mutateAsync({ bookingId: booking.id, status: BookingStatus.confirmed });
    refetch();
  };

  const handleDecline = async (booking: Booking) => {
    await updateStatus.mutateAsync({ bookingId: booking.id, status: BookingStatus.cancelled });
    refetch();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ flexShrink: 0, padding: '48px 20px 0', background: 'rgba(5,5,7,0.97)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#F4F4F8', letterSpacing: '-0.03em' }}>Radar</h1>
          {pendingCount > 0 && (
            <div style={{ padding: '4px 12px', background: 'rgba(255,61,90,0.15)', border: '1px solid rgba(255,61,90,0.3)', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#FF3D5A' }}>
              {pendingCount} en attente
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          {[{ key: 'pending', label: 'En attente' }, { key: 'confirmed', label: 'Confirmes' }, { key: 'all', label: 'Tous' }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', background: filter === f.key ? 'rgba(242,208,107,0.15)' : 'rgba(255,255,255,0.04)', color: filter === f.key ? '#F2D06B' : '#9898B4', fontSize: 12, fontWeight: filter === f.key ? 700 : 400, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(242,208,107,0.2)', borderTopColor: '#F2D06B', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 13, color: '#9898B4' }}>Chargement...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <IconRadar size={40} color="#2E2E3E" />
            <div style={{ fontSize: 14, color: '#9898B4', marginTop: 16 }}>Aucune demande</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((booking) => (
              <div key={booking.id} style={{ background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 16, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F8' }}>#{booking.id.slice(0, 14)}</div>
                    <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconClock size={12} color="#54546C" />
                      {booking.date} {booking.timeSlot && `· ${booking.timeSlot}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F2D06B' }}>{Number(booking.totalPrice)} CHF</div>
                </div>
                {booking.address && <div style={{ fontSize: 12, color: '#9898B4', marginBottom: 12 }}>{booking.address}</div>}
                {booking.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleDecline(booking)}
                      disabled={updateStatus.isPending}
                      style={{ flex: 1, height: 44, background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.2)', borderRadius: 10, color: '#FF3D5A', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, cursor: updateStatus.isPending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <IconX size={14} color="#FF3D5A" />
                      Decliner
                    </button>
                    <button
                      onClick={() => handleAccept(booking)}
                      disabled={updateStatus.isPending}
                      style={{ flex: 2, height: 44, background: 'linear-gradient(135deg, #F2D06B, #D4A050)', border: 'none', borderRadius: 10, color: '#050507', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, cursor: updateStatus.isPending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {updateStatus.isPending ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #050507', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} /> : <><IconCheck size={14} color="#050507" />Accepter</>}
                    </button>
                  </div>
                )}
                {booking.status !== 'pending' && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: booking.status === 'confirmed' ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)', color: booking.status === 'confirmed' ? '#00D97A' : '#FF3D5A', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                    {booking.status === 'confirmed' ? 'Confirme' : 'Annule'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      <div style={{ flexShrink: 0, display: 'flex', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {PRO_TABS.map((tab) => {
          const isActive = proTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', gap: 3 }}>
              {isActive && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: '#F2D06B', borderRadius: 2 }} />}
              <tab.Icon size={22} color={isActive ? '#F2D06B' : '#2E2E3E'} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? '#F2D06B' : '#2E2E3E' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
