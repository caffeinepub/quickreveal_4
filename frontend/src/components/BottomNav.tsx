import React from 'react';
import { useAppContext } from '../context/AppContext';

interface BottomNavProps {
  activeTab?: string;
  hasPendingBookings?: boolean;
}

// SVG Icons — stroke 1.5px, currentColor
const RadarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="2" />
    <circle cx="10" cy="10" r="5.5" />
    <circle cx="10" cy="10" r="9" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="16" height="12" rx="2" />
    <path d="M2 9h16" />
    <text x="10" y="15.5" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">$</text>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="17" y2="6" />
    <line x1="3" y1="10" x2="17" y2="10" />
    <line x1="3" y1="14" x2="17" y2="14" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3.5l2 2-9 9-2.5.5.5-2.5 9-9z" />
    <path d="M12.5 5.5l2 2" />
  </svg>
);

const ExplorerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="5.5" />
    <line x1="13.5" y1="13.5" x2="17" y2="17" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2" />
    <line x1="3" y1="9" x2="17" y2="9" />
    <line x1="7" y1="2" x2="7" y2="6" />
    <line x1="13" y1="2" x2="13" y2="6" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6z" />
    <path d="M8 16a2 2 0 0 0 4 0" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7" r="3.5" />
    <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" />
  </svg>
);

export default function BottomNav({ activeTab, hasPendingBookings }: BottomNavProps) {
  const { navigateTo, appRole, currentScreen, bookings } = useAppContext();

  const pendingCount = hasPendingBookings
    ? 1
    : bookings.filter(b => b.status === 'pending').length;

  const isActive = (tab: string) => {
    if (activeTab) return activeTab === tab;
    const screenMap: Record<string, string> = {
      nexusOS: 'dashboard',
      walletPro: 'wallet',
      radarPro: 'radar',
      monBusiness: 'business',
      explorer: 'explorer',
      clientDashboard: 'reservations',
      notificationCenter: 'alertes',
    };
    return screenMap[currentScreen] === tab;
  };

  const tabStyle = (tab: string) => ({
    color: isActive(tab) ? '#F2D06B' : '#2E2E3E',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
  });

  const labelStyle = (tab: string): React.CSSProperties => ({
    fontSize: '10px',
    fontWeight: isActive(tab) ? 600 : 400,
    color: isActive(tab) ? '#F2D06B' : '#2E2E3E',
    letterSpacing: '0.02em',
  });

  const indicator = (tab: string) =>
    isActive(tab) ? (
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '2px',
          background: '#F2D06B',
          borderRadius: '0 0 2px 2px',
        }}
      />
    ) : null;

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    background: 'rgba(5,5,7,0.96)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    zIndex: 100,
  };

  if (appRole === 'pro') {
    return (
      <nav style={navStyle}>
        <button style={tabStyle('radar')} onClick={() => navigateTo('radarPro')}>
          {indicator('radar')}
          <span style={{ position: 'relative' }}>
            <RadarIcon />
            {pendingCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 8, height: 8, borderRadius: '50%',
                background: '#F2D06B',
              }} />
            )}
          </span>
          <span style={labelStyle('radar')}>Radar</span>
        </button>

        <button style={tabStyle('wallet')} onClick={() => navigateTo('walletPro')}>
          {indicator('wallet')}
          <WalletIcon />
          <span style={labelStyle('wallet')}>Wallet</span>
        </button>

        <button style={tabStyle('dashboard')} onClick={() => navigateTo('nexusOS')}>
          {indicator('dashboard')}
          <DashboardIcon />
          <span style={labelStyle('dashboard')}>Dashboard</span>
        </button>

        <button style={tabStyle('business')} onClick={() => navigateTo('monBusiness')}>
          {indicator('business')}
          <BusinessIcon />
          <span style={labelStyle('business')}>Mon Business</span>
        </button>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <button style={tabStyle('explorer')} onClick={() => navigateTo('explorer')}>
        {indicator('explorer')}
        <ExplorerIcon />
        <span style={labelStyle('explorer')}>Explorer</span>
      </button>

      <button style={tabStyle('reservations')} onClick={() => navigateTo('clientDashboard')}>
        {indicator('reservations')}
        <span style={{ position: 'relative' }}>
          <CalendarIcon />
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 8, height: 8, borderRadius: '50%',
              background: '#F2D06B',
            }} />
          )}
        </span>
        <span style={labelStyle('reservations')}>Réservations</span>
      </button>

      <button style={tabStyle('alertes')} onClick={() => navigateTo('notificationCenter')}>
        {indicator('alertes')}
        <BellIcon />
        <span style={labelStyle('alertes')}>Alertes</span>
      </button>

      <button style={tabStyle('profil')} onClick={() => {}}>
        {indicator('profil')}
        <ProfileIcon />
        <span style={labelStyle('profil')}>Profil</span>
      </button>
    </nav>
  );
}
