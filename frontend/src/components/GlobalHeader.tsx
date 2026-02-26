import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useMyNotifications } from '../hooks/useQueries';
import { IconBell } from './icons/Icons';

export default function GlobalHeader() {
  const {
    userName,
    notificationCenterOpen,
    setNotificationCenterOpen,
    inAppNotifications,
    setInAppNotifications,
    unreadCount,
  } = useAppContext();

  const { data: fetchedNotifs } = useMyNotifications();

  React.useEffect(() => {
    if (fetchedNotifs && fetchedNotifs.length > 0) {
      setInAppNotifications(fetchedNotifs);
    }
  }, [fetchedNotifs, setInAppNotifications]);

  const initial = userName ? userName.charAt(0).toUpperCase() : 'N';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          height: 64,
          background: 'rgba(5,5,7,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(244,244,248,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 100,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: 'var(--t1)',
              letterSpacing: '-1px',
            }}
          >
            NEXUS
          </span>
          <span style={{ fontWeight: 900, fontSize: 26, color: '#4A9EFF' }}>.</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Bell */}
          <button
            onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: 'var(--t1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Notifications"
          >
            <IconBell size={22} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: 'var(--alert)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  lineHeight: 1,
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F2D06B, #E8B84B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050507',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {initial}
          </div>
        </div>
      </header>

      {/* Notification Center Panel */}
      <NotificationPanel />
    </>
  );
}

function NotificationPanel() {
  const {
    notificationCenterOpen,
    setNotificationCenterOpen,
    inAppNotifications,
    markNotifRead,
    markAllNotifsRead,
  } = useAppContext();

  const typeLabels: Record<string, string> = {
    nouvelle_demande: 'Nouvelle demande',
    paiement_confirme: 'Paiement confirme',
    fonds_liberes: 'Fonds liberes',
    avis_recu: 'Avis recu',
    booking_confirme: 'Reservation confirmee',
  };

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('fr-CH', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(ts));
  };

  return (
    <>
      {/* Backdrop */}
      {notificationCenterOpen && (
        <div
          onClick={() => setNotificationCenterOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199,
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: 380,
          height: '100%',
          background: '#0A0A0F',
          borderLeft: '1px solid rgba(244,244,248,0.08)',
          zIndex: 200,
          transform: notificationCenterOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
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
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--t1)',
              }}
            >
              Notifications
            </h2>
            {inAppNotifications.length > 0 && (
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(244,244,248,0.4)' }}>
                {inAppNotifications.filter((n) => !n.read).length} non lues
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {inAppNotifications.some((n) => !n.read) && (
              <button
                onClick={markAllNotifsRead}
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
                lineHeight: 1,
              }}
            >
              x
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {inAppNotifications.length === 0 ? (
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
            inAppNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotifRead(notif.id)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(244,244,248,0.04)',
                  background: notif.read ? 'transparent' : 'rgba(242,208,107,0.04)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Dot */}
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: notif.read ? 400 : 600,
                      color: 'var(--t1)',
                      marginBottom: 2,
                    }}
                  >
                    {typeLabels[notif.type] ?? notif.type}
                  </div>
                  {notif.bookingId && (
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(244,244,248,0.4)',
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Booking #{notif.bookingId.slice(0, 12)}...
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.3)' }}>
                    {formatTime(notif.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
