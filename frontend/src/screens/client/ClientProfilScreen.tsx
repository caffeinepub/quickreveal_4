import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { IconUser, IconLogout, IconSettings } from '../../components/icons';

const CLIENT_TABS = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'alertes', label: 'Alertes' },
  { id: 'profil', label: 'Profil' },
];

interface ClientProfilScreenProps {
  userName: string;
  userPhone: string;
  principal: string | null;
  clientTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function ClientProfilScreen({ userName, userPhone, principal, clientTab, onTabChange, onLogout }: ClientProfilScreenProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onLogout();
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ flexShrink: 0, padding: '48px 20px 16px', background: 'rgba(5,5,7,0.97)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#F4F4F8', letterSpacing: '-0.03em' }}>Mon profil</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 16, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #F2D06B, #D4A050)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, color: '#050507', flexShrink: 0 }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName || 'Utilisateur'}</div>
            <div style={{ fontSize: 13, color: '#9898B4', marginTop: 2 }}>{userPhone || 'Telephone non renseigne'}</div>
            {principal && <div style={{ fontSize: 10, color: '#54546C', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{principal.slice(0, 20)}...</div>}
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: <IconUser size={18} color="#9898B4" />, label: 'Informations personnelles' },
            { icon: <IconSettings size={18} color="#9898B4" />, label: 'Preferences notifications' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px 20px', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              {item.icon}
              <span style={{ fontSize: 14, color: '#F4F4F8' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,61,90,0.06)', border: '1px solid rgba(255,61,90,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          <IconLogout size={18} color="#FF3D5A" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#FF3D5A' }}>Se deconnecter</span>
        </button>
      </div>

      <div style={{ flexShrink: 0, display: 'flex', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {CLIENT_TABS.map((tab) => {
          const isActive = clientTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', gap: 3 }}>
              {isActive && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: '#F2D06B', borderRadius: 2 }} />}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? '#F2D06B' : '#2E2E3E' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
