import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, MapPin, ChevronDown, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { SWISS_CITIES } from '../utils/demoData';

const STEPS = ['Service', 'Créneau', 'Adresse', 'Récap', 'Paiement'];

const TIME_SLOTS = [
  { id: 'flash1', label: 'Dans 1h', sublabel: 'Disponible maintenant', value: 'dans-1h' },
  { id: 'flash2', label: 'Dans 2h', sublabel: 'Créneau rapide', value: 'dans-2h' },
  { id: 'tonight', label: 'Ce soir', sublabel: '18h00 - 21h00', value: 'ce-soir' },
  { id: 'tomorrow', label: 'Demain', sublabel: 'Matin ou après-midi', value: 'demain' },
];

function QRCode() {
  const size = 7;
  const pattern = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if ((r < 2 && c < 2) || (r < 2 && c >= size - 2) || (r >= size - 2 && c < 2)) return true;
      return Math.random() > 0.5;
    })
  );
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 8px)`,
          gap: 2,
          padding: 12,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          border: '1px solid rgba(242,208,107,0.3)',
        }}
      >
        {pattern.flat().map((filled, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: filled ? '#F2D06B' : 'transparent',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: '#0D0D13',
            padding: '3px 6px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 900,
            color: '#F2D06B',
            letterSpacing: '0.1em',
          }}
        >
          NEXUS.
        </div>
      </div>
    </div>
  );
}

function SuccessAnimation({ onComplete }: { onComplete: () => void }) {
  const [barWidth, setBarWidth] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<Array<{ x: number; delay: number; duration: number }>>([]);

  if (confettiRef.current.length === 0) {
    confettiRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
    }));
  }

  useEffect(() => {
    const t1 = setTimeout(() => setBarWidth(100), 50);
    const t2 = setTimeout(() => {
      setShowCircle(true);
      setShowConfetti(true);
    }, 2600);
    const t3 = setTimeout(() => onComplete(), 4600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050507',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Confetti — gold only */}
      {showConfetti &&
        confettiRef.current.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -20,
              left: `${c.x}%`,
              width: 8,
              height: 8,
              borderRadius: i % 3 === 0 ? '50%' : 2,
              background: '#F2D06B',
              animation: `goldRain ${c.duration}s ease-in ${c.delay}s both`,
            }}
          />
        ))}

      {/* Progress bar */}
      <div
        style={{
          width: '80%',
          height: 4,
          background: '#1C1C26',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 40,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            background: '#F2D06B',
            borderRadius: 2,
            transition: 'width 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Success circle */}
      {showCircle && (
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#00D97E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            boxShadow: '0 0 40px rgba(0,217,126,0.4)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M12 24L20 32L36 16"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 0,
                animation: 'drawCheck 0.5s ease 0.2s both',
              }}
            />
          </svg>
        </div>
      )}

      {showCircle && (
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            animation: 'riseIn 0.5s ease 0.4s both',
          }}
        >
          Paiement confirmé !
        </div>
      )}
      {showCircle && (
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            color: '#9898B4',
            fontFamily: 'Inter, sans-serif',
            animation: 'riseIn 0.5s ease 0.6s both',
          }}
        >
          Redirection vers le suivi...
        </div>
      )}
    </div>
  );
}

export default function BookingFlow() {
  const { selectedPro, navigateTo, navigateToLiveStatus, addBooking, addNotification } = useAppContext();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Genève');
  const [note, setNote] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amountBeat, setAmountBeat] = useState(false);

  const pro = selectedPro;

  const services = pro?.services || [
    { id: 's1', name: 'Coupe + Brushing', duration: '45min', price: 35, badge: 'Populaire' },
    { id: 's2', name: 'Coloration', duration: '90min', price: 85, badge: 'Nouveau' },
    { id: 's3', name: 'Soin Kératine', duration: '120min', price: 120, badge: 'Promo' },
    { id: 's4', name: 'Balayage', duration: '150min', price: 150 },
  ];

  const totalPrice = selectedService?.price || pro?.startingPrice || 35;

  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setAmountBeat(true);
        setTimeout(() => setAmountBeat(false), 300);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handlePayment = () => {
    const booking = {
      id: `booking-${Date.now()}`,
      proId: pro?.id || 'demo',
      proName: pro?.name || 'Pro',
      serviceId: selectedService?.id || 's1',
      serviceName: selectedService?.name || 'Service',
      service: selectedService?.name || 'Service',
      price: totalPrice,
      date: selectedSlot?.value || 'dans-1h',
      timeSlot: selectedSlot?.label || 'Dans 1h',
      time: selectedSlot?.label || 'Dans 1h',
      address: `${address}, ${city}`,
      status: 'confirmed' as const,
      createdAt: Date.now(),
    };
    addBooking(booking);
    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Réservation confirmée',
      message: `${booking.serviceName} avec ${booking.proName}`,
      read: false,
      createdAt: Date.now(),
    });
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    navigateToLiveStatus();
  };

  if (showSuccess) {
    return <SuccessAnimation onComplete={handleSuccessComplete} />;
  }

  const canNext =
    (step === 1 && selectedService) ||
    (step === 2 && selectedSlot) ||
    (step === 3 && address.trim().length > 0) ||
    step === 4;

  const cities = SWISS_CITIES || ['Genève', 'Lausanne', 'Berne', 'Zurich', 'Bâle', 'Fribourg'];

  return (
    <div
      style={{
        height: '100%',
        background: '#050507',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => (step > 1 ? setStep(s => s - 1) : navigateTo('proProfile'))}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#0D0D13',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} color="#F4F4F8" />
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>
              {step === 5 ? 'NEXUS PAY' : `Étape ${step}/4`}
            </div>
            <div style={{ fontSize: 12, color: '#54546C', fontFamily: 'Inter, sans-serif' }}>{STEPS[step - 1]}</div>
          </div>
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
            {[1, 2, 3, 4].map((s, i) => (
              <React.Fragment key={s}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: s < step ? '#00D97E' : s === step ? 'transparent' : '#1C1C26',
                    border: s === step ? '2px solid #F2D06B' : s < step ? '2px solid #00D97E' : '2px solid #2E2E3E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}
                >
                  {s < step ? (
                    <Check size={14} color="#fff" strokeWidth={3} />
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 800, color: s === step ? '#F2D06B' : '#2E2E3E', fontFamily: 'Inter, sans-serif' }}>
                      {s}
                    </span>
                  )}
                </div>
                {i < 3 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: s < step ? '#00D97E' : '#1C1C26',
                      transition: 'background 0.3s',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F4F4F8', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
              Choisissez un service
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.map((svc: any) => {
                const isSelected = selectedService?.id === svc.id;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    style={{
                      padding: '16px',
                      borderRadius: 16,
                      background: isSelected ? 'rgba(242,208,107,0.06)' : '#0D0D13',
                      border: isSelected ? '1px solid #F2D06B' : '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#F4F4F8', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
                        {svc.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#54546C', fontFamily: 'Inter, sans-serif' }}>{svc.duration}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#F2D06B', fontFamily: 'Inter, sans-serif' }}>
                        {svc.price} CHF
                      </div>
                      {svc.badge && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#F2D06B', background: 'rgba(242,208,107,0.1)', padding: '2px 6px', borderRadius: 6, marginTop: 4 }}>
                          {svc.badge}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Time slots */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F4F4F8', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
              Choisissez un créneau
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TIME_SLOTS.map(slot => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '20px 16px',
                      borderRadius: 18,
                      background: isSelected ? 'rgba(242,208,107,0.08)' : '#0D0D13',
                      border: isSelected ? '1px solid #F2D06B' : '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: isSelected ? '#F2D06B' : '#F4F4F8', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
                      {slot.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#54546C', fontFamily: 'Inter, sans-serif' }}>{slot.sublabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F4F4F8', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
              Votre adresse
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#54546C', fontWeight: 600, marginBottom: 6, display: 'block', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Adresse
                </label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Rue et numéro..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: '#0D0D13',
                    border: '1px solid #1E1E26',
                    color: '#F4F4F8',
                    fontSize: 15,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: 12, color: '#54546C', fontWeight: 600, marginBottom: 6, display: 'block', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Ville
                </label>
                <button
                  onClick={() => setShowCityDropdown(v => !v)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: '#0D0D13',
                    border: '1px solid #1E1E26',
                    color: '#F4F4F8',
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color="#F2D06B" />
                    {city}
                  </span>
                  <ChevronDown size={14} color="#54546C" />
                </button>
                {showCityDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#0D0D13',
                    border: '1px solid #1E1E26',
                    borderRadius: 14,
                    overflow: 'hidden',
                    zIndex: 10,
                    marginTop: 4,
                  }}>
                    {cities.map((c: string) => (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setShowCityDropdown(false); }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: c === city ? 'rgba(242,208,107,0.06)' : 'none',
                          border: 'none',
                          color: c === city ? '#F2D06B' : '#F4F4F8',
                          fontSize: 14,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#54546C', fontWeight: 600, marginBottom: 6, display: 'block', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Note (optionnel)
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Instructions particulières..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: '#0D0D13',
                    border: '1px solid #1E1E26',
                    color: '#F4F4F8',
                    fontSize: 15,
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Recap */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F4F4F8', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
              Récapitulatif
            </h2>
            <div style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
              {[
                { label: 'Pro', value: pro?.name || 'Pro' },
                { label: 'Service', value: selectedService?.name || 'Service' },
                { label: 'Créneau', value: selectedSlot?.label || '—' },
                { label: 'Adresse', value: `${address}, ${city}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 13, color: '#54546C', fontFamily: 'Inter, sans-serif' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#F2D06B', fontFamily: 'Inter, sans-serif' }}>{totalPrice} CHF</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Lock size={16} color="#F2D06B" />
              <span style={{ fontSize: 13, color: '#54546C', fontFamily: 'Inter, sans-serif' }}>Paiement sécurisé NEXUS PAY</span>
            </div>
            <QRCode />
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: '#F2D06B',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'transform 0.1s',
                  transform: amountBeat ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {totalPrice} CHF
              </div>
              <div style={{ fontSize: 13, color: '#54546C', marginTop: 8, fontFamily: 'Inter, sans-serif' }}>
                {selectedService?.name || 'Service'} · {pro?.name || 'Pro'}
              </div>
            </div>
            <button
              onClick={handlePayment}
              style={{
                marginTop: 32,
                width: '100%',
                padding: '18px',
                borderRadius: 18,
                background: '#F2D06B',
                border: 'none',
                color: '#050507',
                fontSize: 16,
                fontWeight: 900,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Payer maintenant
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {step < 5 && (
        <div style={{ padding: '16px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', flexShrink: 0 }}>
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 18,
              background: canNext ? '#F2D06B' : '#1C1C26',
              border: 'none',
              color: canNext ? '#050507' : '#2E2E3E',
              fontSize: 16,
              fontWeight: 900,
              cursor: canNext ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {step === 4 ? 'Procéder au paiement' : 'Continuer'}
          </button>
        </div>
      )}
    </div>
  );
}
