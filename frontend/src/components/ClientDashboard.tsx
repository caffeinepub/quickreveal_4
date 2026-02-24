import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { useGetBookingsByUser } from '../hooks/useQueries';
import { BookingStatus } from '../backend';
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: '#888', icon: <Clock size={14} /> },
  confirmed: { label: 'Confirmée', color: '#4ade80', icon: <CheckCircle size={14} /> },
  cancelled: { label: 'Annulée', color: '#f87171', icon: <XCircle size={14} /> },
};

export default function ClientDashboard() {
  const { navigate } = useAppContext();
  const { logout, principal } = useAuthContext();
  const prevBookingsRef = useRef<Record<string, string>>({});

  const { data: bookings, isLoading } = useGetBookingsByUser(principal);

  useEffect(() => {
    if (!bookings) return;
    bookings.forEach((booking) => {
      const prevStatus = prevBookingsRef.current[booking.id];
      const currentStatus = booking.status as unknown as string;
      if (prevStatus && prevStatus !== currentStatus) {
        if (currentStatus === BookingStatus.confirmed) {
          toast.success('Réservation confirmée ✅', {
            description: `Votre réservation a été acceptée par le professionnel`,
          });
        } else if (currentStatus === BookingStatus.cancelled) {
          toast.error('Réservation annulée', {
            description: 'Votre paiement sera remboursé sous 5-7 jours ouvrables',
          });
        }
      }
      prevBookingsRef.current[booking.id] = currentStatus;
    });
  }, [bookings]);

  const handleLogout = async () => {
    await logout();
    navigate('splash');
  };

  const pendingBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.pending) ?? [];
  const confirmedBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.confirmed) ?? [];
  const cancelledBookings = bookings?.filter((b) => (b.status as unknown as string) === BookingStatus.cancelled) ?? [];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #1A1A1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('explorer')}
            style={{
              background: '#1A1A1A',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 900, color: '#E8C89A' }}>
            NEXUS
          </h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#1A1A1A',
            border: '1px solid #333',
            borderRadius: '20px',
            color: '#888',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '24px' }}>
          Mes Réservations
        </h2>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#E8C89A' }} />
          </div>
        ) : (
          <>
            <Section title="En attente" count={pendingBookings.length}>
              {pendingBookings.length === 0 ? (
                <EmptyState message="Aucune réservation en attente" />
              ) : (
                pendingBookings.map((b) => <BookingCard key={b.id} booking={b} status="pending" />)
              )}
            </Section>

            <Section title="Confirmées" count={confirmedBookings.length}>
              {confirmedBookings.length === 0 ? (
                <EmptyState message="Aucune réservation confirmée" />
              ) : (
                confirmedBookings.map((b) => <BookingCard key={b.id} booking={b} status="confirmed" />)
              )}
            </Section>

            {cancelledBookings.length > 0 && (
              <Section title="Annulées" count={cancelledBookings.length}>
                {cancelledBookings.map((b) => <BookingCard key={b.id} booking={b} status="cancelled" />)}
              </Section>
            )}

            {!bookings?.length && (
              <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid #222' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                  Aucune réservation pour le moment
                </p>
                <button
                  onClick={() => navigate('explorer')}
                  style={{ background: '#E8C89A', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                >
                  Explorer les professionnels
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '12px' }}>
        {title} ({count})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#444', fontSize: '13px', border: '1px solid #222' }}>
      {message}
    </div>
  );
}

function BookingCard({ booking, status }: { booking: { id: string; serviceId: string; date: string; timeSlot: string; totalPrice: bigint }; status: string }) {
  const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS.pending;

  return (
    <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '16px', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{booking.serviceId}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>{booking.date} à {booking.timeSlot}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: '#E8C89A', fontSize: '16px' }}>{Number(booking.totalPrice)} CHF</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: statusInfo.color, fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
            {statusInfo.icon}
            {statusInfo.label}
          </div>
        </div>
      </div>
      {status === 'cancelled' && (
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#f87171', marginTop: '8px' }}>
          💳 Remboursement de {Number(booking.totalPrice)} CHF en cours (5-7 jours ouvrables)
        </div>
      )}
    </div>
  );
}
