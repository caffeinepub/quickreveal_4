import React from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { goToSplash, logoutClient, clientReservations, cancelClientReservation } =
    useAppContext();

  const pendingReservations = clientReservations.filter((r) => r.status === 'pending');
  const completedReservations = clientReservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'completed'
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
        <button
          onClick={logoutClient}
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          DÉCONNEXION
        </button>
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '32px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          marginBottom: '32px',
        }}
      >
        Mes Réservations
      </h1>

      {/* Pending Reservations */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '16px',
          }}
        >
          En cours
        </h2>
        {pendingReservations.length === 0 ? (
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            Aucune réservation en cours
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingReservations.map((reservation) => (
              <div
                key={reservation.id}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '16px',
                  padding: '18px',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => cancelClientReservation(reservation.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 59, 48, 0.15)',
                    border: '1px solid rgba(255, 59, 48, 0.3)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ff3b30',
                  }}
                >
                  <X size={16} />
                </button>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                  {reservation.providerName}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '4px',
                  }}
                >
                  {reservation.service}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.35)',
                    marginBottom: '12px',
                  }}
                >
                  {new Date(reservation.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  à {reservation.time} · {reservation.location}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.35)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.09)',
                    paddingTop: '12px',
                  }}
                >
                  <div>📞 {reservation.providerPhone}</div>
                  <div>📍 {reservation.providerAddress}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '16px',
          }}
        >
          Historique
        </h2>
        {completedReservations.length === 0 ? (
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            Aucune réservation passée
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completedReservations.map((reservation) => (
              <div
                key={reservation.id}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '16px',
                  padding: '18px',
                  opacity: 0.6,
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                  {reservation.providerName}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '4px',
                  }}
                >
                  {reservation.service}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.35)' }}>
                  {new Date(reservation.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  à {reservation.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
