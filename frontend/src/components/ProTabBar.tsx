import React from 'react';
import { IconRadar, IconWallet, IconDashboard, IconBusiness } from './icons/Icons';

type ProTab = 'radar' | 'wallet' | 'dashboard' | 'business';

interface ProTabBarProps {
  active: ProTab;
  onChange: (tab: ProTab) => void;
}

const tabs: { id: ProTab; label: string; Icon: React.FC<{ size?: number; color?: string; className?: string }> }[] = [
  { id: 'radar', label: 'Radar', Icon: IconRadar },
  { id: 'wallet', label: 'Wallet', Icon: IconWallet },
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'business', label: 'Business', Icon: IconBusiness },
];

export default function ProTabBar({ active, onChange }: ProTabBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
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
            }}
          >
            <tab.Icon size={22} color={isActive ? '#F2D06B' : 'rgba(255,255,255,0.4)'} />
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
