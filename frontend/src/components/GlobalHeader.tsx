import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface GlobalHeaderProps {
  showNotifications?: boolean;
  notificationCount?: number;
  onBellClick?: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  showNotifications = true,
  notificationCount,
  onBellClick,
}) => {
  const { userName, unreadCount, appRole, setNotificationCenterOpen } = useAppContext();

  const badgeCount = notificationCount !== undefined ? notificationCount : unreadCount;

  const initials = userName
    ? userName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleBellClick = () => {
    if (onBellClick) {
      onBellClick();
    } else {
      setNotificationCenterOpen(true);
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: '60px',
        background: 'rgba(5,5,7,0.92)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: '22px',
          color: '#F4F4F8',
          letterSpacing: '-0.5px',
          userSelect: 'none',
        }}
      >
        NEXUS<span style={{ color: '#5B7FFF' }}>.</span>
      </span>

      {/* Right side */}
      {showNotifications && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleBellClick}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Bell size={16} color="#9898B4" />
            </button>
            {badgeCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#FF3D5A',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            )}
          </div>

          {/* Avatar */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F2D06B 0%, #b8860b 100%)',
              border: appRole === 'pro'
                ? '2px solid rgba(242,208,107,0.6)'
                : '2px solid rgba(242,208,107,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0a0a0a',
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
            }}
          >
            {initials !== 'U' ? initials : <User size={14} color="#0a0a0a" />}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;
