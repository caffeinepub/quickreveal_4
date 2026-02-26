import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  useAdminAllPros,
  useAdminAllBookings,
  useAdminMetrics,
  useAdminValidatePro,
} from '../hooks/useQueries';
import type { ProProfile, Booking } from '../backend';

type AdminTab = 'pros' | 'bookings' | 'metrics';

export default function AdminPanel() {
  const { navigateTo } = useAppContext();
  const [activeTab, setActiveTab] = useState<AdminTab>('pros');

  const { data: pros, isLoading: prosLoading, error: prosError } = useAdminAllPros();
  const { data: bookings, isLoading: bookingsLoading } = useAdminAllBookings();
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const validatePro = useAdminValidatePro();

  const handleValidate = (proId: string) => {
    validatePro.mutate(proId);
  };

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'pros', label: 'Professionnels' },
    { key: 'bookings', label: 'Reservations' },
    { key: 'metrics', label: 'Metriques' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '20px 20px 0',
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  color: 'var(--t1)',
                  letterSpacing: '-1px',
                }}
              >
                NEXUS
              </span>
              <span style={{ fontWeight: 900, fontSize: 28, color: '#4A9EFF' }}>.</span>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Admin Panel
            </div>
          </div>
          <button
            onClick={() => navigateTo('landing')}
            style={{
              background: 'rgba(244,244,248,0.06)',
              border: '1px solid rgba(244,244,248,0.1)',
              borderRadius: 10,
              color: 'rgba(244,244,248,0.6)',
              fontSize: 12,
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Retour
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(244,244,248,0.04)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 9,
                border: 'none',
                background: activeTab === tab.key ? 'rgba(242,208,107,0.15)' : 'transparent',
                color: activeTab === tab.key ? 'var(--gold)' : 'rgba(244,244,248,0.4)',
                fontSize: 12,
                fontWeight: activeTab === tab.key ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
          padding: '16px 20px 32px',
        }}
      >
        {/* PROS TAB */}
        {activeTab === 'pros' && (
          <div>
            {prosError && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,61,90,0.1)',
                  border: '1px solid rgba(255,61,90,0.2)',
                  borderRadius: 10,
                  color: 'var(--alert)',
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                Acces refuse. Vous devez etre administrateur.
              </div>
            )}
            {prosLoading ? (
              <LoadingState label="Chargement des professionnels..." />
            ) : !pros || pros.length === 0 ? (
              <EmptyState label="Aucun professionnel enregistre" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pros.map((pro) => (
                  <ProRow
                    key={pro.id.toString()}
                    pro={pro}
                    onValidate={() => handleValidate(pro.id.toString())}
                    isValidating={validatePro.isPending && validatePro.variables === pro.id.toString()}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <LoadingState label="Chargement des reservations..." />
            ) : !bookings || bookings.length === 0 ? (
              <EmptyState label="Aucune reservation" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div>
            {metricsLoading ? (
              <LoadingState label="Chargement des metriques..." />
            ) : !metrics ? (
              <EmptyState label="Metriques non disponibles" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <MetricCard
                  label="Reservations totales"
                  value={Number(metrics.totalBookings).toString()}
                  accent="var(--gold)"
                />
                <MetricCard
                  label="Professionnels actifs"
                  value={Number(metrics.totalActivePros).toString()}
                  accent="var(--flash)"
                />
                <MetricCard
                  label="Utilisateurs enregistres"
                  value={Number(metrics.totalRegisteredUsers).toString()}
                  accent="#4A9EFF"
                />
                <div
                  style={{
                    marginTop: 8,
                    padding: '16px',
                    background: 'rgba(242,208,107,0.06)',
                    border: '1px solid rgba(242,208,107,0.12)',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Commission NEXUS estimee
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)' }}>
                    {(Number(metrics.totalBookings) * 1).toFixed(2)} CHF
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.3)', marginTop: 4 }}>
                    Base: 1 CHF par reservation
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProRow({
  pro,
  onValidate,
  isValidating,
}: {
  pro: ProProfile;
  onValidate: () => void;
  isValidating: boolean;
}) {
  return (
    <div
      style={{
        background: 'rgba(244,244,248,0.03)',
        border: '1px solid rgba(244,244,248,0.07)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(242,208,107,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold)',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {pro.brandName ? pro.brandName.charAt(0).toUpperCase() : 'P'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--t1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pro.brandName || 'Sans nom'}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginTop: 2 }}>
          {pro.city || 'Ville inconnue'} · {pro.category || 'Categorie inconnue'}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <StatusBadge
            label={pro.isVerified ? 'Verifie' : 'Non verifie'}
            color={pro.isVerified ? 'var(--flash)' : 'var(--alert)'}
            bg={pro.isVerified ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)'}
          />
          <StatusBadge
            label={pro.profileStatus === 'published' ? 'Publie' : 'Brouillon'}
            color={pro.profileStatus === 'published' ? '#4A9EFF' : 'rgba(244,244,248,0.4)'}
            bg={pro.profileStatus === 'published' ? 'rgba(74,158,255,0.1)' : 'rgba(244,244,248,0.05)'}
          />
        </div>
      </div>

      {/* Validate button */}
      {!pro.isVerified && (
        <button
          onClick={onValidate}
          disabled={isValidating}
          style={{
            flexShrink: 0,
            padding: '7px 14px',
            borderRadius: 8,
            border: 'none',
            background: isValidating ? 'rgba(0,217,122,0.3)' : 'rgba(0,217,122,0.15)',
            color: 'var(--flash)',
            fontSize: 12,
            fontWeight: 600,
            cursor: isValidating ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isValidating ? (
            <span
              style={{
                width: 12,
                height: 12,
                border: '2px solid rgba(0,217,122,0.3)',
                borderTopColor: 'var(--flash)',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            'Valider'
          )}
        </button>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const statusColors: Record<string, { color: string; bg: string }> = {
    pending: { color: 'var(--gold)', bg: 'rgba(242,208,107,0.1)' },
    confirmed: { color: 'var(--flash)', bg: 'rgba(0,217,122,0.1)' },
    cancelled: { color: 'var(--alert)', bg: 'rgba(255,61,90,0.1)' },
  };
  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirme',
    cancelled: 'Annule',
  };

  const sc = statusColors[booking.status as string] ?? { color: 'rgba(244,244,248,0.4)', bg: 'rgba(244,244,248,0.05)' };

  return (
    <div
      style={{
        background: 'rgba(244,244,248,0.03)',
        border: '1px solid rgba(244,244,248,0.07)',
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--t1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          #{booking.id.slice(0, 16)}...
        </div>
        <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginTop: 2 }}>
          {booking.date} {booking.timeSlot && `· ${booking.timeSlot}`}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
          {Number(booking.totalPrice)} CHF
        </div>
        <div
          style={{
            marginTop: 4,
            padding: '2px 8px',
            borderRadius: 6,
            background: sc.bg,
            color: sc.color,
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {statusLabels[booking.status as string] ?? booking.status}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(244,244,248,0.03)',
        border: '1px solid rgba(244,244,248,0.07)',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontSize: 13, color: 'rgba(244,244,248,0.6)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

function StatusBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 6,
        background: bg,
        color,
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'rgba(244,244,248,0.3)',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(242,208,107,0.2)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'rgba(244,244,248,0.3)',
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
}
