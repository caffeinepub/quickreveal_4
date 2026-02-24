import React from 'react';
import { Search, Calendar, MessageCircle, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { ScreenType } from '../context/AppContext';

type TabId = 'explorer' | 'reservations' | 'messages' | 'profile';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  screen: ScreenType;
}

interface BottomNavProps {
  activeTab?: TabId;
  hasPendingBookings?: boolean;
}

export default function BottomNav({
  activeTab = 'explorer',
  hasPendingBookings = false,
}: BottomNavProps) {
  const { navigate, appRole } = useAppContext();

  const reservationsScreen: ScreenType = appRole === 'professional' ? 'nexusOS' : 'clientDashboard';

  const tabs: Tab[] = [
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Search size={22} />,
      screen: 'explorer',
    },
    {
      id: 'reservations',
      label: 'Réservations',
      icon: <Calendar size={22} />,
      screen: reservationsScreen,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageCircle size={22} />,
      screen: 'explorer',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: <User size={22} />,
      screen: reservationsScreen,
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#0F0F0F',
        borderTop: '1px solid #1F1F1F',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? '#E8C89A' : '#555555';

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.screen)}
            className="btn-tap"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color,
              position: 'relative',
              height: '100%',
            }}
          >
            <span style={{ color, position: 'relative' }}>
              {tab.icon}
              {tab.id === 'reservations' && hasPendingBookings && (
                <span
                  className="red-badge-pulse"
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    border: '1.5px solid #0F0F0F',
                  }}
                />
              )}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Inter', sans-serif",
                color,
                letterSpacing: '0.02em',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
