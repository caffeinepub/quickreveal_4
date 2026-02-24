import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { ChevronLeft, Check, CreditCard, Loader2 } from 'lucide-react';

interface LocalService {
  id: string;
  name: string;
  priceStudio: number | null;
  priceDomicile: number | null;
  duration: string;
}

interface LocalProvider {
  id: string;
  name: string;
  category: string;
  coverPhotoUrl: string;
  studioAddress?: string;
  modes: string[];
}

interface DayInfo {
  date: Date;
  label: string;
  num: number;
  dateStr: string;
}

type BookingStep = 'service' | 'datetime' | 'address' | 'recap' | 'payment' | 'confirmation';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
];

function generateNextDays(count: number): DayInfo[] {
  const days: DayInfo[] = [];
  const today = new Date();
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      label: i === 0 ? 'Auj.' : i === 1 ? 'Dem.' : dayNames[d.getDay()],
      num: d.getDate(),
      dateStr: d.toISOString().split('T')[0],
    });
  }
  return days;
}

function ConfettiAnimation() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999 }}>
      {pieces.map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: Math.random() > 0.5 ? '#E8C89A' : '#c9a870',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function BookingFlow() {
  const { navigate, screenParams, addNotification, setBookings } = useAppContext();
  const { isAuthenticated } = useAuthContext();

  const provider = screenParams?.provider as LocalProvider | undefined;
  const initialService = screenParams?.service as LocalService | undefined;

  const [step, setStep] = useState<BookingStep>(initialService ? 'datetime' : 'service');
  const [selectedService, setSelectedService] = useState<LocalService | null>(initialService ?? null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const days = generateNextDays(8);

  if (!provider) {
    return (
      <div
        style={{
          background: '#0A0A0A',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>Aucun professionnel sélectionné</p>
          <button
            onClick={() => navigate('explorer')}
            style={{
              background: '#E8C89A',
              border: 'none',
              borderRadius: '50px',
              padding: '12px 24px',
              color: '#0a0a0a',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Retour à l'Explorer
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && step !== 'service') {
    return (
      <div
        style={{
          background: '#0A0A0A',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
            Connectez-vous pour continuer
          </h3>
          <p style={{ fontSize: '14px', marginBottom: '24px', color: '#666' }}>
            Vous devez être connecté pour effectuer une réservation
          </p>
          <button
            onClick={() => navigate('splash')}
            style={{
              width: '100%',
              background: '#E8C89A',
              border: 'none',
              borderRadius: '50px',
              padding: '14px',
              color: '#0a0a0a',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('explorer')}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '50px',
              padding: '12px',
              color: '#666',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  // Simulate booking locally — demo providers use string IDs, not on-chain Principals
  const handlePayAndConfirm = async () => {
    setSubmitting(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      // Add a local booking to context
      const newBooking = {
        id: `booking-${Date.now()}`,
        proId: provider.id,
        proName: provider.name,
        serviceName: selectedService?.name ?? 'Service',
        servicePrice: selectedService?.priceDomicile ?? selectedService?.priceStudio ?? 0,
        date: selectedDate ?? '',
        timeSlot: selectedTime ?? '',
        address: address || provider.studioAddress || '',
        status: 'pending' as const,
        createdAt: Date.now(),
      };

      setBookings((prev) => [newBooking, ...prev]);

      addNotification({
        type: 'confirmed',
        message: `✅ Demande envoyée à ${provider.name}`,
      });

      setStep('confirmation');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch {
      setStep('confirmation');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const totalPrice = selectedService
    ? (selectedService.priceDomicile ?? selectedService.priceStudio ?? 0)
    : 0;

  // ── CONFIRMATION ──────────────────────────────────────────────────────────
  if (step === 'confirmation') {
    return (
      <div
        style={{
          background: '#0A0A0A',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        {showConfetti && <ConfettiAnimation />}
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(232,200,154,0.15)',
              border: '2px solid #E8C89A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Check size={36} style={{ color: '#E8C89A' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px', color: '#fff' }}>
            Demande envoyée ! ✨
          </h2>
          <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '15px' }}>
            Votre demande a été envoyée à{' '}
            <span style={{ color: '#E8C89A', fontWeight: 700 }}>{provider.name}</span>
          </p>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>
            Vous recevrez une confirmation dès que le professionnel accepte votre demande.
          </p>

          <div
            style={{
              background: '#1A1A1A',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid #222',
              textAlign: 'left',
            }}
          >
            {[
              { label: 'Service', value: selectedService?.name ?? '-' },
              { label: 'Date', value: selectedDate ?? '-' },
              { label: 'Heure', value: selectedTime ?? '-' },
              { label: 'Montant', value: `${totalPrice} CHF`, gold: true },
            ].map(({ label, value, gold }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  fontSize: '13px',
                  borderBottom: '1px solid #222',
                }}
              >
                <span style={{ color: '#666' }}>{label}</span>
                <span style={{ fontWeight: 600, color: gold ? '#E8C89A' : '#fff' }}>{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('clientDashboard')}
            style={{
              width: '100%',
              background: '#E8C89A',
              border: 'none',
              borderRadius: '50px',
              padding: '14px',
              color: '#0a0a0a',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '12px',
              fontSize: '14px',
            }}
          >
            Suivre ma réservation
          </button>
          <button
            onClick={() => navigate('explorer')}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '50px',
              padding: '12px',
              color: '#666',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Retour à l'Explorer
          </button>
        </div>
      </div>
    );
  }

  // ── PAYMENT ───────────────────────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setStep('recap')}
            style={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#fff' }}>Paiement sécurisé</h1>
        </div>

        <div style={{ padding: '24px 20px', maxWidth: '400px', margin: '0 auto' }}>
          <div
            style={{
              background: '#1A1A1A',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #222',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{selectedService?.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {provider.name} · {selectedDate} à {selectedTime}
              </div>
            </div>
            <div style={{ fontWeight: 900, fontSize: '18px', color: '#E8C89A' }}>
              {totalPrice} CHF
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#888', display: 'block', marginBottom: '8px' }}>
              Numéro de carte
            </label>
            <div style={{ position: 'relative' }}>
              <input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 44px 12px 14px',
                  color: '#fff',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
              />
              <CreditCard
                size={18}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#888', display: 'block', marginBottom: '8px' }}>
                Expiration
              </label>
              <input
                placeholder="MM/AA"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#888', display: 'block', marginBottom: '8px' }}>
                CVC
              </label>
              <input
                placeholder="123"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '1px solid #2A2A2A',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            onClick={handlePayAndConfirm}
            disabled={submitting}
            className="btn-tap-gold"
            style={{
              width: '100%',
              background: '#E8C89A',
              border: 'none',
              borderRadius: '50px',
              padding: '16px',
              color: '#0a0a0a',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '15px',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <Loader2
                size={18}
                style={{ animation: 'spin 1s linear infinite' }}
              />
            ) : null}
            Confirmer et Payer
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#444', marginTop: '12px' }}>
            Simulation visuelle · Aucun débit réel
          </p>
        </div>
      </div>
    );
  }

  // ── RECAP ─────────────────────────────────────────────────────────────────
  if (step === 'recap') {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setStep('address')}
            style={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#fff' }}>Récapitulatif</h1>
        </div>

        <div style={{ padding: '24px 20px', maxWidth: '400px', margin: '0 auto' }}>
          <div
            style={{
              background: '#1A1A1A',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid #222',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#222',
                  flexShrink: 0,
                }}
              >
                <img
                  src={provider.coverPhotoUrl}
                  alt={provider.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{provider.name}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>{provider.category}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #222', paddingTop: '12px' }}>
              {[
                { label: 'Service', value: selectedService?.name ?? '-' },
                { label: 'Durée', value: selectedService?.duration ?? '-' },
                { label: 'Date', value: selectedDate ?? '-' },
                { label: 'Heure', value: selectedTime ?? '-' },
                ...(address ? [{ label: 'Adresse', value: address }] : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    fontSize: '13px',
                    borderBottom: '1px solid #1a1a1a',
                  }}
                >
                  <span style={{ color: '#666' }}>{label}</span>
                  <span style={{ fontWeight: 500, maxWidth: '60%', textAlign: 'right', color: '#fff' }}>{value}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #333',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: '22px', color: '#E8C89A' }}>{totalPrice} CHF</span>
            </div>
          </div>

          <button
            onClick={() => setStep('payment')}
            className="btn-tap-gold"
            style={{
              width: '100%',
              background: '#E8C89A',
              border: 'none',
              borderRadius: '50px',
              padding: '16px',
              color: '#0a0a0a',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            Procéder au paiement →
          </button>
        </div>
      </div>
    );
  }

  // ── ADDRESS ───────────────────────────────────────────────────────────────
  if (step === 'address') {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setStep('datetime')}
            style={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#fff' }}>Votre adresse</h1>
        </div>

        <div style={{ padding: '24px 20px', maxWidth: '400px', margin: '0 auto' }}>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
            Où souhaitez-vous recevoir le professionnel ?
          </p>
          <textarea
            placeholder="Entrez votre adresse complète..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '14px',
              color: '#fff',
              fontSize: '15px',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              resize: 'none',
              marginBottom: '20px',
            }}
          />
          <button
            onClick={() => setStep('recap')}
            disabled={!address.trim()}
            className="btn-tap-gold"
            style={{
              width: '100%',
              background: address.trim() ? '#E8C89A' : '#222',
              border: 'none',
              borderRadius: '50px',
              padding: '16px',
              color: address.trim() ? '#0a0a0a' : '#444',
              fontWeight: 700,
              cursor: address.trim() ? 'pointer' : 'not-allowed',
              fontSize: '15px',
            }}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  // ── DATETIME ──────────────────────────────────────────────────────────────
  if (step === 'datetime') {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setStep('service')}
            style={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#fff' }}>Date & Heure</h1>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <p
            style={{
              color: '#888',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '12px',
            }}
          >
            Choisissez une date
          </p>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '24px',
              scrollbarWidth: 'none',
            }}
          >
            {days.map((day) => (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                style={{
                  flexShrink: 0,
                  width: '60px',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedDate === day.dateStr ? '#E8C89A' : '#1A1A1A',
                  color: selectedDate === day.dateStr ? '#0A0A0A' : '#888',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>{day.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{day.num}</div>
              </button>
            ))}
          </div>

          <p
            style={{
              color: '#888',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '12px',
            }}
          >
            Choisissez une heure
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  background: selectedTime === slot ? '#E8C89A' : '#1A1A1A',
                  color: selectedTime === slot ? '#0A0A0A' : '#888',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('address')}
            disabled={!selectedDate || !selectedTime}
            className="btn-tap-gold"
            style={{
              width: '100%',
              background: selectedDate && selectedTime ? '#E8C89A' : '#222',
              border: 'none',
              borderRadius: '50px',
              padding: '16px',
              color: selectedDate && selectedTime ? '#0a0a0a' : '#444',
              fontWeight: 700,
              cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
              fontSize: '15px',
            }}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  // ── SERVICE SELECTION ─────────────────────────────────────────────────────
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #1A1A1A',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => navigate('providerDetail')}
          style={{ background: '#1A1A1A', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff' }}
        >
          <ChevronLeft size={18} />
        </button>
        <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#fff' }}>Choisir un service</h1>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#222',
              flexShrink: 0,
            }}
          >
            <img
              src={provider.coverPhotoUrl}
              alt={provider.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px' }}>{provider.name}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>{provider.category}</div>
          </div>
        </div>

        <p
          style={{
            color: '#888',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}
        >
          Services disponibles
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {/* Fallback services if none passed */}
          {[
            { id: 's1', name: 'Service standard', priceStudio: 50, priceDomicile: 60, duration: '45 min' },
            { id: 's2', name: 'Service premium', priceStudio: 80, priceDomicile: 90, duration: '60 min' },
          ].map((service) => {
            const isSelected = selectedService?.id === service.id;
            const price = service.priceDomicile ?? service.priceStudio ?? 0;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                style={{
                  background: isSelected ? 'rgba(232,200,154,0.08)' : '#1A1A1A',
                  border: `1px solid ${isSelected ? '#E8C89A' : '#2A2A2A'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {service.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{service.duration}</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#E8C89A', flexShrink: 0, marginLeft: '12px' }}>
                  {price} CHF
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => selectedService && setStep('datetime')}
          disabled={!selectedService}
          className="btn-tap-gold"
          style={{
            width: '100%',
            background: selectedService ? '#E8C89A' : '#222',
            border: 'none',
            borderRadius: '50px',
            padding: '16px',
            color: selectedService ? '#0a0a0a' : '#444',
            fontWeight: 700,
            cursor: selectedService ? 'pointer' : 'not-allowed',
            fontSize: '15px',
          }}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
