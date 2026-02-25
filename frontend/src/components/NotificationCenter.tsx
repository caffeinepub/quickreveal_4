import React from 'react';
import { useAppContext, Notification } from '../context/AppContext';

function getBody(notif: Notification): string {
  return notif.message || notif.body || '';
}

export default function NotificationCenter() {
  const { notifications, markAllRead, removeNotification, goBack } = useAppContext();

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--edge1)',
      }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)' }}>
          Notifications
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllRead}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '13px',
                color: 'var(--gold)',
                cursor: 'pointer',
              }}
            >
              Tout lire
            </button>
          )}
          <button
            onClick={goBack}
            style={{
              background: 'var(--d3)',
              border: '1px solid var(--edge1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              color: 'var(--t1)',
            }}
          >
            x
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--t3)',
          }}>
            Aucune notification
          </div>
        )}
        {notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              background: notif.read ? 'var(--d2)' : 'var(--d3)',
              border: `1px solid ${notif.read ? 'var(--edge1)' : 'var(--edge2)'}`,
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              position: 'relative',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: notif.read ? 500 : 700,
                fontSize: '14px',
                color: 'var(--t1)',
              }}>
                {notif.title}
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--t2)',
                marginTop: '4px',
                lineHeight: '1.5',
              }}>
                {getBody(notif)}
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: 'var(--t4)',
                marginTop: '6px',
              }}>
                {new Date(notif.createdAt).toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' })}
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--t4)',
                fontSize: '18px',
                padding: '0',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              x
            </button>
            {!notif.read && (
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '40px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--gold)',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
