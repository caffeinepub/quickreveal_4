import React from 'react';
import { useAppContext } from '../context/AppContext';
import { IconSearch, IconCalendar, IconUser, IconBell } from './icons/Icons';

interface BottomNavProps {
  activeTab?: string;
  hasPendingBookings?: boolean;
}

const tabs = [
  { id: 'explorerV2', label: 'Explorer', Icon: IconSearch },
  { id: 'clientDashboard', label: 'Réservations', Icon: IconCalendar },
  { id: 'notifications', label: 'Alertes', Icon: IconBell },
  { id: 'proFiche', label: 'Profil', Icon: IconUser },
];

export default function BottomNav({ activeTab, hasPendingBookings }: BottomNavProps) {
  const { navigateTo, currentScreen, bookings } = useAppContext();

  const pendingCount = hasPendingBookings
    ? bookings.filter((b) => b.status === 'pending').length
    : 0;

  const active = activeTab || currentScreen;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
        flexShrink: 0,
        background: 'rgba(5,5,7,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const showBadge = tab.id === 'clientDashboard' && pendingCount > 0;
        return (
          <button
            key={tab.id}
            onClick={() => navigateTo(tab.id as any)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 12,
              paddingBottom: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              gap: 4,
              color: isActive ? '#F2D06B' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            <tab.Icon size={22} color={isActive ? '#F2D06B' : 'rgba(255,255,255,0.4)'} />
            {showBadge && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: '50%',
                  transform: 'translateX(10px)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F2D06B',
                }}
              />
            )}
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
