import React from 'react';
import { useMyBookings, useWalletSolde, useGetProProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useProContext } from '../context/ProContext';

interface DashboardScreenProps {
  proActif?: boolean;
  onActivate?: () => void;
}

export default function DashboardScreen({ proActif, onActivate }: DashboardScreenProps) {
  const { identity } = useInternetIdentity();
  const proCtx = useProContext();

  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { data: solde = 0, isLoading: soldeLoading } = useWalletSolde();
  const { data: proProfile } = useGetProProfile(identity?.getPrincipal().toString());

  const isActive = proActif ?? proCtx.proActif ?? false;

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
  const acceptanceRate =
    bookings.length > 0
      ? Math.round((confirmedBookings.length / bookings.length) * 100)
      : 0;

  const stats = [
    {
      label: 'Reservations',
      value: bookingsLoading ? '...' : confirmedBookings.length.toString(),
      sub: `${pendingBookings.length} en attente`,
      color: 'var(--gold)',
    },
    {
      label: 'Revenus',
      value: soldeLoading ? '...' : `${totalRevenue} CHF`,
      sub: 'Total confirme',
      color: 'var(--flash)',
    },
    {
      label: 'Taux acceptation',
      value: bookingsLoading ? '...' : `${acceptanceRate}%`,
      sub: `${bookings.length} demandes`,
      color: '#4A9EFF',
    },
    {
      label: 'Profil',
      value: proProfile
        ? proProfile.profileStatus === 'published'
          ? 'Publie'
          : 'Brouillon'
        : '...',
      sub: proProfile?.isVerified ? 'Verifie' : 'Non verifie',
      color: proProfile?.isVerified ? 'var(--flash)' : 'var(--alert)',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'Inter, sans-serif',
        background: 'var(--void)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--t1)',
              letterSpacing: '-0.5px',
            }}
          >
            Dashboard
          </h1>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(244,244,248,0.4)' }}>
          Vue d ensemble de votre activite
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
        {/* Inactive banner */}
        {!isActive && (
          <div
            style={{
              padding: '16px',
              background: 'rgba(255,61,90,0.08)',
              border: '1px solid rgba(255,61,90,0.2)',
              borderRadius: 12,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--alert)', fontWeight: 600 }}>
              Profil inactif
            </div>
            <div style={{ fontSize: 12, color: 'rgba(244,244,248,0.5)' }}>
              Activez votre profil pour recevoir des demandes de reservation.
            </div>
            {onActivate && (
              <button
                onClick={onActivate}
                style={{
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #F2D06B, #E8B84B)',
                  color: '#050507',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Activer mon profil
              </button>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 24,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(244,244,248,0.03)',
                border: '1px solid rgba(244,244,248,0.07)',
                borderRadius: 12,
                padding: '16px 14px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(244,244,248,0.4)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: stat.color,
                  letterSpacing: '-0.5px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.3)', marginTop: 4 }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(244,244,248,0.5)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Reservations recentes
        </div>

        {bookingsLoading ? (
          <div
            style={{
              color: 'rgba(244,244,248,0.3)',
              fontSize: 13,
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            Chargement...
          </div>
        ) : bookings.length === 0 ? (
          <div
            style={{
              color: 'rgba(244,244,248,0.3)',
              fontSize: 13,
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            Aucune reservation pour le moment
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bookings.slice(0, 5).map((booking) => {
              const statusColors: Record<string, string> = {
                pending: 'var(--gold)',
                confirmed: 'var(--flash)',
                cancelled: 'var(--alert)',
              };
              const statusLabels: Record<string, string> = {
                pending: 'En attente',
                confirmed: 'Confirme',
                cancelled: 'Annule',
              };
              return (
                <div
                  key={booking.id}
                  style={{
                    background: 'rgba(244,244,248,0.03)',
                    border: '1px solid rgba(244,244,248,0.07)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>
                      #{booking.id.slice(0, 10)}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginTop: 2 }}>
                      {booking.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
                      {Number(booking.totalPrice)} CHF
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color:
                          statusColors[booking.status as string] ??
                          'rgba(244,244,248,0.4)',
                        marginTop: 2,
                      }}
                    >
                      {statusLabels[booking.status as string] ?? String(booking.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
