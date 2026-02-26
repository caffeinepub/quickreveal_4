import React, { useState, useEffect } from 'react';
import { getNotifications, markAllRead, markRead, type InAppNotification } from '../../lib/notifications';
import { IconBell } from '../../components/icons';

const CLIENT_TABS = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'alertes', label: 'Alertes' },
  { id: 'profil', label: 'Profil' },
];

interface AlertesScreenProps {
  clientTab: string;
  onTabChange: (tab: string) => void;
}

export default function AlertesScreen({ clientTab, onTabChange }: AlertesScreenProps) {
  const [notifs, setNotifs] = useState<InAppNotification[]>([]);

  useEffect(() => {
    setNotifs(getNotifications());
  }, []);

  const handleMarkAll = () => {
    markAllRead();
    setNotifs(getNotifications());
  };

  const handleMarkOne = (id: string) => {
    markRead(id);
    setNotifs(getNotifications());
  };

  const typeColor: Record<string, string> = {
    nouvelle_demande: '#FF3D5A',
    paiement_confirme: '#00D97A',
    default: '#F2D06B',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050507',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: '48px 20px 16px',
          background: 'rgba(5,5,7,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#F4F4F8', letterSpacing: '-0.03em' }}>
          Alertes
        </h1>
        {notifs.some((n) => !n.lu) && (
          <button
            onClick={handleMarkAll}
            style={{
              background: 'none',
              border: 'none',
              color: '#F2D06B',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Tout marquer lu
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <IconBell size={40} color="#2E2E3E" />
            <div style={{ fontSize: 16, fontWeight: 600, color: '#9898B4', marginTop: 16 }}>
              Aucune alerte
            </div>
            <div style={{ fontSize: 13, color: '#54546C', marginTop: 8 }}>
              Vos notifications apparaitront ici
            </div>
          </div>
        ) : (
          notifs.map((n) => {
            const color = typeColor[n.type] ?? typeColor.default;
            return (
              <button
                key={n.id}
                onClick={() => handleMarkOne(n.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  background: n.lu ? 'none' : 'rgba(242,208,107,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconBell size={16} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F8' }}>{n.titre}</div>
                  <div style={{ fontSize: 13, color: '#9898B4', marginTop: 3, lineHeight: 1.5 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: 11, color: '#54546C', marginTop: 4 }}>
                    {new Date(n.timestamp).toLocaleTimeString('fr-CH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {!n.lu && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#F2D06B',
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          background: 'rgba(5,5,7,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {CLIENT_TABS.map((tab) => {
          const isActive = clientTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
                position: 'relative',
                gap: 3,
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 2,
                    background: '#F2D06B',
                    borderRadius: 2,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#F2D06B' : '#2E2E3E',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
