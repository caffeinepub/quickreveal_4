import React from 'react';
import { IconRadar, IconWallet, IconDashboard, IconBusiness } from './icons/Icons';

interface ProTabBarProps {
  active: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { id: 'radar', label: 'Radar', Icon: IconRadar },
  { id: 'wallet', label: 'Wallet', Icon: IconWallet },
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'business', label: 'Business', Icon: IconBusiness },
];

export default function ProTabBar({ active, onChange }: ProTabBarProps) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--d1)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: 4,
            }}
          >
            <Icon
              size={22}
              color={isActive ? '#F2D06B' : '#54546C'}
            />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#F2D06B' : '#54546C',
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
