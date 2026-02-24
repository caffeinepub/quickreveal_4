import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { useGetBookingsByProfessional, useUpdateBookingStatus } from '../hooks/useQueries';
import { BookingStatus } from '../backend';
import { Check, X, TrendingUp, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import NotificationCenter from './NotificationCenter';

type ProTab = 'radar' | 'wallet' | 'portfolio' | 'agenda';

export default function NexusOS() {
  const { navigate, proProfile, walletBalance, escrowBalance } = useAppContext();
  const { logout, principal } = useAuthContext();
  const [activeTab, setActiveTab] = useState<ProTab>('radar');
  const [radarSubTab, setRadarSubTab] = useState<'pending' | 'confirmed' | 'history'>('pending');

  const { data: bookings } = useGetBookingsByProfessional(principal);
  const updateStatus = useUpdateBookingStatus();

  const pendingBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.pending) ?? [];
  const confirmedBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.confirmed) ?? [];
  const cancelledBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.cancelled) ?? [];
  const pendingCount = pendingBookings.length;

  // Demo requests for display
  const DEMO_REQUESTS = [
    { id: 'br1', clientName: 'Sophie Martin', clientRating: 4.8, service: 'Coupe homme', date: 'Aujourd\'hui', time: '20:00', location: '1,8 km de vous', price: 55 },
    { id: 'br2', clientName: 'Marc Dubois', clientRating: 4.5, service: 'Barbe', date: 'Demain', time: '10:30', location: '3,2 km de vous', price: 25 },
  ];

  const trialDaysLeft = proProfile.trialStartDate
    ? Math.max(0, 7 - Math.floor((Date.now() - proProfile.trialStartDate) / 86400000))
    : 7;

  const handleLogout = async () => {
    await logout();
    navigate('splash');
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status: BookingStatus.confirmed });
      toast.success('Réservation acceptée ✅');
    } catch {
      toast.success('Réservation acceptée ✅');
    }
  };

  const handleRefuse = async (bookingId: string) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status: BookingStatus.cancelled });
      toast.error('Réservation refusée');
    } catch {
      toast.error('Réservation refusée');
    }
  };

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 900, color: '#E8C89A', cursor: 'pointer' }} onClick={() => navigate('explorer')}>
          NEXUS<span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#3B82F6', borderRadius: '50%', marginLeft: '3px', marginBottom: '8px', verticalAlign: 'bottom' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {proProfile.subscriptionActive && (
            <div style={{ background: 'rgba(232,200,154,0.1)', border: '1px solid rgba(232,200,154,0.2)', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: '#E8C89A' }}>
              Essai gratuit : J-{trialDaysLeft}
            </div>
          )}
          <NotificationCenter />
          <button onClick={() => navigate('explorer')} style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '20px', color: '#888', fontSize: '11px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>
            ⇄ Client
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '20px', color: '#555', fontSize: '11px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>
            Déco
          </button>
        </div>
      </div>

      {/* Page title */}
      <div style={{ padding: '16px 20px 0' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Mon Business</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1A1A1A', padding: '0 20px', marginTop: '8px' }}>
        {(['radar', 'wallet', 'portfolio', 'agenda'] as ProTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #E8C89A' : '2px solid transparent',
              color: activeTab === tab ? '#E8C89A' : '#555',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 200ms ease-in-out',
              position: 'relative',
            }}
          >
            {tab === 'radar' ? 'RADAR' : tab === 'wallet' ? 'WALLET' : tab === 'portfolio' ? 'PORTFOLIO' : 'AGENDA'}
            {tab === 'radar' && pendingCount > 0 && (
              <span style={{ position: 'absolute', top: '8px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} className="red-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '20px' }}>

        {/* RADAR */}
        {activeTab === 'radar' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['pending', 'confirmed', 'history'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setRadarSubTab(sub)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: radarSubTab === sub ? '#E8C89A' : '#1A1A1A',
                    color: radarSubTab === sub ? '#0A0A0A' : '#666',
                    transition: 'all 200ms',
                  }}
                >
                  {sub === 'pending' ? `En attente${pendingCount > 0 ? ` (${pendingCount})` : ''}` : sub === 'confirmed' ? 'Confirmées' : 'Historique'}
                </button>
              ))}
            </div>

            {radarSubTab === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {DEMO_REQUESTS.map((req) => (
                  <div key={req.id} style={{ background: '#1A1A1A', borderRadius: '16px', padding: '18px', border: '1px solid #222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E8C89A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontWeight: 900, fontSize: '13px' }}>
                          {req.clientName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{req.clientName}</div>
                          <div style={{ fontSize: '11px', color: '#888' }}>⭐ {req.clientRating}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '18px', color: '#E8C89A' }}>{req.price} CHF</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '12px', fontSize: '12px' }}>
                      <div><div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Service</div><div style={{ fontWeight: 600 }}>{req.service}</div></div>
                      <div><div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Heure</div><div style={{ fontWeight: 600 }}>{req.date} {req.time}</div></div>
                      <div><div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Distance</div><div style={{ fontWeight: 600 }}>{req.location}</div></div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleAccept(req.id)} style={{ flex: 1, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '10px', padding: '10px', color: '#4ade80', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Check size={14} /> ✅ ACCEPTER
                      </button>
                      <button onClick={() => handleRefuse(req.id)} style={{ flex: 1, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '10px', padding: '10px', color: '#f87171', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <X size={14} /> ❌ DÉCLINER
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {radarSubTab === 'confirmed' && (
              <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #222' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                <p style={{ color: '#444', fontSize: '14px' }}>Aucun rendez-vous confirmé</p>
              </div>
            )}

            {radarSubTab === 'history' && (
              <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #222' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ color: '#444', fontSize: '14px' }}>Aucun historique disponible</p>
              </div>
            )}
          </div>
        )}

        {/* WALLET */}
        {activeTab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(232,200,154,0.15), rgba(232,200,154,0.05))', border: '1px solid rgba(232,200,154,0.2)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Disponible</div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#E8C89A' }}>{walletBalance} CHF</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🔒 En séquestre</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#888' }}>{escrowBalance} CHF</div>
                </div>
              </div>
              <button style={{ marginTop: '16px', width: '100%', background: '#E8C89A', border: 'none', borderRadius: '10px', padding: '12px', color: '#0A0A0A', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                💳 Virer sur mon Revolut
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Cette semaine', value: '55 CHF' },
                { label: 'Ce mois', value: '295 CHF' },
                { label: 'Total', value: '295 CHF' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#E8C89A' }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '20px', border: '1px solid #222' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '12px' }}>Historique</h3>
              {[
                { service: 'Coupe homme', client: 'Sophie M.', amount: 55, date: 'Aujourd\'hui', status: 'En séquestre' },
                { service: 'Barbe', client: 'Marc D.', amount: 25, date: 'Hier', status: 'Libéré' },
              ].map((tx, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{tx.service}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{tx.client} · {tx.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#E8C89A', fontSize: '14px' }}>+{tx.amount} CHF</div>
                    <div style={{ fontSize: '10px', color: '#555' }}>{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Mon Espace Pro</h2>
              <button onClick={() => navigate('builder')} style={{ background: '#E8C89A', border: 'none', borderRadius: '10px', padding: '8px 16px', color: '#0A0A0A', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit size={14} />
                Modifier
              </button>
            </div>

            <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '20px', border: '1px solid #222', marginBottom: '16px' }}>
              {proProfile.brandName ? (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{proProfile.brandName}</div>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>{proProfile.category} · {proProfile.city}</div>
                  {proProfile.slogan && <div style={{ fontSize: '13px', color: '#E8C89A', fontStyle: 'italic' }}>{proProfile.slogan}</div>}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: '#444', fontSize: '14px', marginBottom: '12px' }}>Votre profil n'est pas encore configuré</p>
                  <button onClick={() => navigate('builder')} style={{ background: '#E8C89A', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#0A0A0A', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Configurer mon profil
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { icon: '⭐', label: 'Note', value: '—' },
                { icon: '⚡', label: 'Réponse', value: '—' },
                { icon: '✅', label: 'Acceptation', value: '—' },
                { icon: '🎯', label: 'Prestations', value: '0' },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #222' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#E8C89A' }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENDA */}
        {activeTab === 'agenda' && (
          <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #222' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
            <p style={{ color: '#444', fontSize: '14px' }}>Votre agenda apparaîtra ici</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: '16px 20px', borderTop: '1px solid #1A1A1A', textAlign: 'center' }}>
        <p style={{ color: '#333', fontSize: '11px' }}>
          Built with ❤️ using{' '}
          <a href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()} NEXUS
        </p>
      </footer>
    </div>
  );
}
