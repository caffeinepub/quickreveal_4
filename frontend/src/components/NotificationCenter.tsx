import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function NotificationCenter() {
  const {
    notifications,
    markAllRead,
    setNotificationCenterOpen,
  } = useAppContext();

  const getBody = (notif: { message?: string; body?: string }) =>
    notif.message ?? notif.body ?? '';

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--void)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(244,244,248,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
            Notifications
          </h2>
          {unread > 0 && (
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(244,244,248,0.4)' }}>
              {unread} non lues
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              style={{
                background: 'none',
                border: '1px solid rgba(242,208,107,0.3)',
                borderRadius: 8,
                color: 'var(--gold)',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Tout lire
            </button>
          )}
          <button
            onClick={() => setNotificationCenterOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(244,244,248,0.5)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            x
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {notifications.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'rgba(244,244,248,0.3)',
              fontSize: 14,
            }}
          >
            Aucune notification
          </div>
        ) : (
          notifications.map((notif, i) => (
            <div
              key={i}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(244,244,248,0.04)',
                background: notif.read ? 'transparent' : 'rgba(242,208,107,0.04)',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: notif.read ? 'rgba(244,244,248,0.15)' : 'var(--gold)',
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: notif.read ? 400 : 600,
                    color: 'var(--t1)',
                    marginBottom: 2,
                  }}
                >
                  {notif.type}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(244,244,248,0.5)' }}>
                  {getBody(notif)}
                </div>
                {notif.timestamp && (
                  <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.3)', marginTop: 2 }}>
                    {new Intl.DateTimeFormat('fr-CH', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                    }).format(new Date(notif.timestamp))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
