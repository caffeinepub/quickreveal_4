import React from 'react';
import { IconRadar, IconWallet, IconDashboard, IconBusiness } from './icons/Icons';

export interface ProTabBarProps {
  active: string;
  onChange: (tab: string) => void;
  proActif?: boolean;
}

const TABS = [
  { id: 'radar', label: 'Radar', Icon: IconRadar },
  { id: 'wallet', label: 'Wallet', Icon: IconWallet },
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'business', label: 'Business', Icon: IconBusiness },
];

export default function ProTabBar({ active, onChange, proActif }: ProTabBarProps) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--d2)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {TABS.map(({ id, label, Icon }) => {
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
              position: 'relative',
            }}
          >
            <Icon
              size={22}
              color={isActive ? 'var(--gold)' : 'var(--t4)'}
            />
            <span style={{
              fontFamily: 'Inter',
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--gold)' : 'var(--t4)',
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
            {id === 'dashboard' && proActif && (
              <div style={{
                position: 'absolute',
                top: 6,
                right: '50%',
                marginRight: -14,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--gold)',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
