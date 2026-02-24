import React from 'react';
import { Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useGetCallerUserProfile } from '../hooks/useQueries';

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface GlobalHeaderProps {
  hasNotifications?: boolean;
  notificationCount?: number;
}

export default function GlobalHeader({
  hasNotifications = false,
  notificationCount = 0,
}: GlobalHeaderProps) {
  const { navigate } = useAppContext();
  const { data: userProfile } = useGetCallerUserProfile();

  const initials = userProfile?.name ? getInitials(userProfile.name) : '?';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1F1F1F',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}
    >
      {/* NEXUS Logo */}
      <button
        onClick={() => navigate('explorer')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'baseline',
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: '24px',
            color: '#FFFFFF',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          NEXUS
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: '24px',
            color: '#4F6EF7',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          .
        </span>
      </button>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification Bell */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={22} color="#CCCCCC" />
          {(hasNotifications || notificationCount > 0) && (
            <span
              className="red-badge-pulse"
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '1.5px solid #0A0A0A',
              }}
            />
          )}
        </button>

        {/* Avatar with initials */}
        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#1A1A1A',
            border: '1.5px solid #2A2A2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#E8C89A',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.05em',
          }}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
