import React, { useState } from 'react';
import { useWalletSolde, useMyNotifications } from '../hooks/useQueries';
import { useAppContext } from '../context/AppContext';
import { useRadarDemandes } from '../hooks/useQueries';

export default function WalletPro() {
  const { addNotification } = useAppContext();
  const { data: solde = 0, isLoading: soldeLoading } = useWalletSolde();
  const { data: bookings = [] } = useRadarDemandes();
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  React.useEffect(() => {
    if (!cooldownEnd) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldownRemaining(remaining);
      if (remaining === 0) {
        setCooldownEnd(null);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const handleVirement = () => {
    if (solde <= 0) return;
    const end = Date.now() + 30000;
    setCooldownEnd(end);
    setCooldownRemaining(30);
    addNotification({
      type: 'fonds_liberes',
      message: `Virement de ${solde.toFixed(2)} CHF initie`,
      timestamp: Date.now(),
      read: false,
    });
  };

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

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
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--t1)',
            letterSpacing: '-0.5px',
          }}
        >
          Wallet
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(244,244,248,0.4)' }}>
          Vos revenus NEXUS
        </p>

        {/* Balance card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(242,208,107,0.12) 0%, rgba(242,208,107,0.06) 100%)',
            border: '1px solid rgba(242,208,107,0.2)',
            borderRadius: 16,
            padding: '24px 20px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(244,244,248,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Solde disponible
          </div>
          {soldeLoading ? (
            <div
              style={{
                width: 80,
                height: 40,
                background: 'rgba(242,208,107,0.1)',
                borderRadius: 8,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ) : (
            <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--gold)', letterSpacing: '-1px' }}>
              {solde.toFixed(2)}
              <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 6 }}>CHF</span>
            </div>
          )}

          <button
            onClick={handleVirement}
            disabled={solde <= 0 || !!cooldownEnd}
            style={{
              marginTop: 16,
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background:
                solde <= 0 || !!cooldownEnd
                  ? 'rgba(242,208,107,0.2)'
                  : 'linear-gradient(135deg, #F2D06B, #E8B84B)',
              color: solde <= 0 || !!cooldownEnd ? 'rgba(5,5,7,0.4)' : '#050507',
              fontSize: 14,
              fontWeight: 700,
              cursor: solde <= 0 || !!cooldownEnd ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {cooldownEnd
              ? `Virement en cours... ${cooldownRemaining}s`
              : solde <= 0
              ? 'Aucun fonds disponible'
              : `Virer ${solde.toFixed(2)} CHF sur IBAN`}
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
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
          Reservations confirmees
        </div>

        {confirmedBookings.length === 0 ? (
          <div
            style={{
              padding: '32px 0',
              textAlign: 'center',
              color: 'rgba(244,244,248,0.3)',
              fontSize: 14,
            }}
          >
            Aucune transaction pour le moment
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {confirmedBookings.map((booking) => (
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>
                    Reservation #{booking.id.slice(0, 10)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.4)', marginTop: 2 }}>
                    {booking.date}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--flash)' }}>
                  +{Number(booking.totalPrice)} CHF
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
