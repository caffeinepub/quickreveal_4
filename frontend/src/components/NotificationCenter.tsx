import React from 'react';
import { useAppContext, Notification } from '../context/AppContext';
import { X, Bell } from 'lucide-react';

function getNotificationColor(_notification: Notification): string {
  return '#F2D06B';
}

export default function NotificationCenter({ onClose }: { onClose?: () => void }) {
  const { notifications, unreadCount, markAllRead, removeNotification } = useAppContext();

  const getBody = (notif: Notification) => notif.message || notif.body || '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxHeight: '80vh',
          background: '#0D0D13',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={18} color="#F2D06B" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#FF3D5A',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#F2D06B',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Tout lire
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={20} color="#54546C" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {notifications.length === 0 ? (
            <div
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                color: '#54546C',
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Aucune notification
            </div>
          ) : (
            notifications.map(notif => {
              const color = getNotificationColor(notif);
              return (
                <div
                  key={notif.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    background: notif.read ? 'transparent' : 'rgba(242,208,107,0.02)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={16} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: notif.read ? 500 : 700,
                        color: '#F4F4F8',
                        marginBottom: 3,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {notif.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#54546C',
                        lineHeight: 1.5,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {getBody(notif)}
                    </div>
                    <div style={{ fontSize: 10, color: '#2E2E3E', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>
                      {new Date(notif.createdAt).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} color="#2E2E3E" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
