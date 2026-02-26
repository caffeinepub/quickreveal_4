import React, { useState } from 'react';
import { useAdminAllPros, useAdminAllBookings, useAdminMetrics, useAdminValidatePro } from '../../hooks/useQueries';
import type { ProProfile, Booking } from '../../backend';
import { IconLogout, IconUser, IconCalendar, IconWallet, IconCheck } from '../../components/icons';

type AdminTab = 'dashboard' | 'pros' | 'bookings' | 'revenus';

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

export default function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { data: pros, isLoading: prosLoading } = useAdminAllPros();
  const { data: bookings, isLoading: bookingsLoading } = useAdminAllBookings();
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const validatePro = useAdminValidatePro();

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'pros', label: 'Pros' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'revenus', label: 'Revenus' },
  ];

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirme',
    cancelled: 'Annule',
  };

  const statusColors: Record<string, { color: string; bg: string }> = {
    pending: { color: '#F2D06B', bg: 'rgba(242,208,107,0.1)' },
    confirmed: { color: '#00D97A', bg: 'rgba(0,217,122,0.1)' },
    cancelled: { color: '#FF3D5A', bg: 'rgba(255,61,90,0.1)' },
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
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '48px 20px 0',
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
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontWeight: 900, fontSize: 22, color: '#F4F4F8', letterSpacing: '-0.04em' }}>
                NEXUS
              </span>
              <span style={{ fontWeight: 900, fontSize: 26, color: '#5B7FFF', letterSpacing: '-0.04em' }}>.</span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#F2D06B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#0D0D13',
              border: '1px solid #1C1C26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconLogout size={16} color="#9898B4" />
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 12,
            padding: 4,
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
                color: activeTab === tab.key ? '#F2D06B' : 'rgba(244,244,248,0.4)',
                fontSize: 11,
                fontWeight: activeTab === tab.key ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
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
          WebkitOverflowScrolling: 'touch',
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
          padding: '16px 20px 32px',
        }}
      >
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {metricsLoading ? (
              <LoadingSpinner />
            ) : metrics ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <MetricCard
                  label="Reservations totales"
                  value={Number(metrics.totalBookings).toString()}
                  icon={<IconCalendar size={20} color="#F2D06B" />}
                  accent="#F2D06B"
                />
                <MetricCard
                  label="Professionnels actifs"
                  value={Number(metrics.totalActivePros).toString()}
                  icon={<IconUser size={20} color="#00D97A" />}
                  accent="#00D97A"
                />
                <MetricCard
                  label="Utilisateurs enregistres"
                  value={Number(metrics.totalRegisteredUsers).toString()}
                  icon={<IconUser size={20} color="#5B7FFF" />}
                  accent="#5B7FFF"
                />
                <div
                  style={{
                    padding: '20px',
                    background: 'rgba(242,208,107,0.06)',
                    border: '1px solid rgba(242,208,107,0.12)',
                    borderRadius: 14,
                  }}
                >
                  <div style={{ fontSize: 11, color: '#9898B4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Commission NEXUS estimee
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#F2D06B' }}>
                    {Number(metrics.totalBookings).toFixed(2)} CHF
                  </div>
                  <div style={{ fontSize: 11, color: '#54546C', marginTop: 4 }}>
                    Base: 1 CHF par reservation
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState label="Metriques non disponibles" />
            )}
          </div>
        )}

        {/* PROS */}
        {activeTab === 'pros' && (
          <div>
            {prosLoading ? (
              <LoadingSpinner />
            ) : !pros || pros.length === 0 ? (
              <EmptyState label="Aucun professionnel enregistre" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pros.map((pro: ProProfile) => (
                  <div
                    key={pro.id.toString()}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(242,208,107,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F2D06B',
                        fontWeight: 700,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {pro.brandName ? pro.brandName.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pro.brandName || 'Sans nom'}
                      </div>
                      <div style={{ fontSize: 11, color: '#9898B4', marginTop: 2 }}>
                        {pro.city || 'Ville inconnue'} · {pro.category || 'Categorie inconnue'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: pro.isVerified ? 'rgba(0,217,122,0.1)' : 'rgba(255,61,90,0.1)',
                            color: pro.isVerified ? '#00D97A' : '#FF3D5A',
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {pro.isVerified ? 'Verifie' : 'Non verifie'}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: pro.profileStatus === 'published' ? 'rgba(91,127,255,0.1)' : 'rgba(255,255,255,0.05)',
                            color: pro.profileStatus === 'published' ? '#5B7FFF' : '#9898B4',
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {pro.profileStatus === 'published' ? 'Publie' : 'Brouillon'}
                        </span>
                      </div>
                    </div>
                    {!pro.isVerified && (
                      <button
                        onClick={() => validatePro.mutate(pro.id.toString())}
                        disabled={validatePro.isPending}
                        style={{
                          flexShrink: 0,
                          padding: '7px 14px',
                          borderRadius: 8,
                          border: 'none',
                          background: 'rgba(0,217,122,0.15)',
                          color: '#00D97A',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: validatePro.isPending ? 'not-allowed' : 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {validatePro.isPending ? (
                          <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(0,217,122,0.3)', borderTopColor: '#00D97A', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                          <>
                            <IconCheck size={12} color="#00D97A" />
                            Valider
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <LoadingSpinner />
            ) : !bookings || bookings.length === 0 ? (
              <EmptyState label="Aucune reservation" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bookings.map((booking: Booking) => {
                  const sc = statusColors[booking.status as string] ?? { color: '#9898B4', bg: 'rgba(255,255,255,0.05)' };
                  return (
                    <div
                      key={booking.id}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          #{booking.id.slice(0, 16)}...
                        </div>
                        <div style={{ fontSize: 11, color: '#9898B4', marginTop: 2 }}>
                          {booking.date} {booking.timeSlot && `· ${booking.timeSlot}`}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#F2D06B' }}>
                          {Number(booking.totalPrice)} CHF
                        </div>
                        <div style={{ marginTop: 4, padding: '2px 8px', borderRadius: 6, background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 600 }}>
                          {statusLabels[booking.status as string] ?? booking.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REVENUS */}
        {activeTab === 'revenus' && (
          <div>
            {metricsLoading ? (
              <LoadingSpinner />
            ) : metrics ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  style={{
                    padding: '24px 20px',
                    background: 'rgba(242,208,107,0.06)',
                    border: '1px solid rgba(242,208,107,0.15)',
                    borderRadius: 16,
                  }}
                >
                  <div style={{ fontSize: 11, color: '#9898B4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Revenus totaux NEXUS
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#F2D06B', letterSpacing: '-0.03em' }}>
                    {Number(metrics.totalBookings).toFixed(2)} CHF
                  </div>
                  <div style={{ fontSize: 12, color: '#9898B4', marginTop: 6 }}>
                    Commission 1 CHF x {Number(metrics.totalBookings)} reservations
                  </div>
                </div>
                <MetricCard
                  label="Professionnels actifs"
                  value={Number(metrics.totalActivePros).toString()}
                  icon={<IconWallet size={20} color="#00D97A" />}
                  accent="#00D97A"
                />
                <MetricCard
                  label="Reservations totales"
                  value={Number(metrics.totalBookings).toString()}
                  icon={<IconCalendar size={20} color="#5B7FFF" />}
                  accent="#5B7FFF"
                />
              </div>
            ) : (
              <EmptyState label="Donnees non disponibles" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <div style={{ fontSize: 13, color: '#9898B4' }}>{label}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(242,208,107,0.2)', borderTopColor: '#F2D06B', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#9898B4' }}>Chargement...</span>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9898B4', fontSize: 14 }}>
      {label}
    </div>
  );
}
