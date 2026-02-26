import React, { useState } from 'react';
import { useGetBookingsByProfessional } from '../../hooks/useQueries';
import { IconHome, IconRadar, IconWallet, IconEdit, IconFlash, IconCalendar, IconArrowRight } from '../../components/icons';
import SubscriptionModal from './SubscriptionModal';

const PRO_TABS = [
  { id: 'radar', label: 'Radar', Icon: IconRadar },
  { id: 'wallet', label: 'Wallet', Icon: IconWallet },
  { id: 'dashboard', label: 'Home', Icon: IconHome },
  { id: 'business', label: 'Business', Icon: IconEdit },
];

interface ProDashboardScreenProps {
  principal: string | null;
  proTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function ProDashboardScreen({ principal, proTab, onTabChange, onLogout }: ProDashboardScreenProps) {
  const [showSubscription, setShowSubscription] = useState(false);
  const { data: bookings } = useGetBookingsByProfessional(principal);

  const pending = (bookings ?? []).filter((b) => b.status === 'pending').length;
  const confirmed = (bookings ?? []).filter((b) => b.status === 'confirmed').length;
  const totalRevenue = (bookings ?? []).filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 20px 16px', background: 'rgba(5,5,7,0.97)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontWeight: 900, fontSize: 22, color: '#F4F4F8', letterSpacing: '-0.04em' }}>NEXUS</span>
              <span style={{ fontWeight: 900, fontSize: 26, color: '#5B7FFF', letterSpacing: '-0.04em' }}>.</span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#F2D06B', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Pro Dashboard</div>
          </div>
          <button
            onClick={() => setShowSubscription(true)}
            style={{ padding: '7px 14px', background: 'rgba(242,208,107,0.1)', border: '1px solid rgba(242,208,107,0.2)', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <IconFlash size={12} color="#F2D06B" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#F2D06B' }}>PRO</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px' }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'En attente', value: pending.toString(), color: '#F2D06B', bg: 'rgba(242,208,107,0.08)' },
            { label: 'Confirmes', value: confirmed.toString(), color: '#00D97A', bg: 'rgba(0,217,122,0.08)' },
            { label: 'Revenus', value: `${totalRevenue} CHF`, color: '#5B7FFF', bg: 'rgba(91,127,255,0.08)' },
            { label: 'Total', value: (bookings ?? []).length.toString(), color: '#9898B4', bg: 'rgba(255,255,255,0.04)' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '16px', background: stat.bg, border: `1px solid ${stat.color}22`, borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#9898B4', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#9898B4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Dernieres reservations</div>
          {!bookings || bookings.length === 0 ? (
            <div style={{ padding: '24px', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 14, textAlign: 'center' }}>
              <IconCalendar size={28} color="#2E2E3E" />
              <div style={{ fontSize: 13, color: '#54546C', marginTop: 10 }}>Aucune reservation pour le moment</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} style={{ padding: '12px 14px', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>#{b.id.slice(0, 14)}</div>
                    <div style={{ fontSize: 11, color: '#9898B4', marginTop: 2 }}>{b.date}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F2D06B', flexShrink: 0 }}>{Number(b.totalPrice)} CHF</div>
                  <IconArrowRight size={14} color="#54546C" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
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

      {showSubscription && principal && (
        <SubscriptionModal proId={principal} onClose={() => setShowSubscription(false)} />
      )}
    </div>
  );
}
