import React from 'react';
import { useAppContext } from '../context/AppContext';
import { IconBell } from './icons/Icons';

interface GlobalHeaderProps {
  notificationCount?: number;
}

export default function GlobalHeader({ notificationCount }: GlobalHeaderProps) {
  const { userName, unreadCount, appRole, setNotificationCenterOpen, navigateTo } = useAppContext();

  const count = notificationCount ?? unreadCount;

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(5,5,7,0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--edge1)',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '20px', color: 'var(--t1)' }}>
        NEXUS<span style={{ color: 'var(--gold)' }}>.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => {
            setNotificationCenterOpen(true);
            navigateTo('notificationCenter');
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', position: 'relative' }}
        >
          <IconBell size={22} color="var(--t2)" />
          {count > 0 && (
            <div style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--alert)',
            }} />
          )}
        </button>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #D4A050)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#050507' }}>
            {userName ? userName[0].toUpperCase() : 'U'}
          </span>
        </div>
      </div>
    </div>
  );
}
