import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconCheck, IconClock, IconLocation, IconUser, IconPhone } from './icons/Icons';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export default function BookingFlow() {
  const { selectedPro, setCurrentScreen, setCurrentBooking, showSMSToast } = useAppContext();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [location, setLocation] = useState<'domicile' | 'studio' | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Use startingPrice (new field name) with fallback
  const fallbackPrice = selectedPro?.startingPrice ?? 35;
  const services = selectedPro?.services ?? [{ nom: 'Coupe homme', prix: fallbackPrice, duree: 30, badge: undefined }];
  const today = new Date();

  const getDayLabel = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], date: d.getDate() };
  };

  const handleConfirm = () => {
    const service = services[selectedService ?? 0];
    const dayInfo = getDayLabel(selectedDay ?? 0);
    setCurrentBooking({
      proId: selectedPro?.id,
      proName: `${selectedPro?.prenom} ${selectedPro?.nom}`,
      service: service.nom,
      servicePrice: service.prix,
      location: location ?? 'domicile',
      date: `${dayInfo.day} ${dayInfo.date}`,
      timeSlot: selectedTime ?? '',
      clientName,
      clientPhone,
      clientAddress,
    });
    showSMSToast('Reservation confirmee ! Details envoyes.', clientPhone || '+41 79 000 00 00');
    setCurrentScreen('liveStatus');
  };

  const canProceed = () => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return location !== null;
    if (step === 3) return selectedDay !== null && selectedTime !== null;
    if (step === 4) return clientName.trim() !== '' && clientPhone.trim() !== '';
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--edge1)' }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : setCurrentScreen('proFiche')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <IconArrowLeft size={22} color="var(--t2)" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--t1)' }}>
            {['Choisir un service', 'Lieu de prestation', 'Date et heure', 'Vos coordonnees', 'Confirmation'][step - 1]}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t4)' }}>Etape {step} sur 5</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--d3)', position: 'relative' }}>
        <div style={{ height: '100%', background: 'var(--gold)', width: `${(step / 5) * 100}%`, transition: 'width 300ms ease-out', borderRadius: '0 2px 2px 0' }} />
      </div>

      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)', marginBottom: '20px' }}>
              Quel service souhaitez-vous ?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedService(i)}
                  style={{
                    width: '100%',
                    background: selectedService === i ? 'rgba(242,208,107,0.08)' : 'var(--d2)',
                    border: `1px solid ${selectedService === i ? 'var(--gold)' : 'var(--edge1)'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 200ms',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t1)', marginBottom: '4px' }}>{service.nom}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconClock size={12} color="var(--t4)" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--t4)' }}>{service.duree} min</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--gold)' }}>{service.prix} CHF</span>
                    {selectedService === i && <IconCheck size={18} color="var(--gold)" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)', marginBottom: '20px' }}>
              Ou souhaitez-vous la prestation ?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'domicile', label: 'A domicile', desc: 'Le pro se deplace chez vous', icon: <IconLocation size={24} color={location === 'domicile' ? 'var(--gold)' : 'var(--t3)'} /> },
                { id: 'studio', label: 'En studio', desc: 'Vous vous deplacez chez le pro', icon: <IconUser size={24} color={location === 'studio' ? 'var(--gold)' : 'var(--t3)'} /> },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocation(opt.id as 'domicile' | 'studio')}
                  style={{
                    width: '100%',
                    background: location === opt.id ? 'rgba(242,208,107,0.08)' : 'var(--d2)',
                    border: `1px solid ${location === opt.id ? 'var(--gold)' : 'var(--edge1)'}`,
                    borderRadius: '18px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                    transition: 'all 200ms',
                  }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: location === opt.id ? 'rgba(242,208,107,0.12)' : 'var(--d3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {opt.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: location === opt.id ? 'var(--gold)' : 'var(--t1)', marginBottom: '4px' }}>{opt.label}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)', marginBottom: '20px' }}>
              Choisissez une date
            </h2>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '28px', scrollbarWidth: 'none' }}>
              {Array.from({ length: 7 }, (_, i) => {
                const info = getDayLabel(i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    style={{
                      flexShrink: 0,
                      width: '56px',
                      height: '72px',
                      borderRadius: '14px',
                      background: selectedDay === i ? 'var(--gold)' : 'var(--d2)',
                      border: `1px solid ${selectedDay === i ? 'var(--gold)' : 'var(--edge1)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 200ms',
                    }}
                  >
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '11px', color: selectedDay === i ? '#050507' : 'var(--t4)' }}>{info.day}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: selectedDay === i ? '#050507' : 'var(--t1)' }}>{info.date}</span>
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t2)', marginBottom: '14px' }}>Heure disponible</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  style={{
                    height: '44px',
                    borderRadius: '12px',
                    background: selectedTime === slot ? 'var(--gold)' : 'var(--d2)',
                    border: `1px solid ${selectedTime === slot ? 'var(--gold)' : 'var(--edge1)'}`,
                    color: selectedTime === slot ? '#050507' : 'var(--t2)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: selectedTime === slot ? 700 : 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)', marginBottom: '20px' }}>
              Vos coordonnees
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Nom complet', value: clientName, setter: setClientName, placeholder: 'Jean Dupont', icon: <IconUser size={16} color="var(--t4)" /> },
                { label: 'Telephone', value: clientPhone, setter: setClientPhone, placeholder: '+41 79 000 00 00', icon: <IconPhone size={16} color="var(--t4)" /> },
                { label: 'Adresse', value: clientAddress, setter: setClientAddress, placeholder: 'Rue du Bourg 12, Lausanne', icon: <IconLocation size={16} color="var(--t4)" /> },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: 'var(--t3)', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>{field.icon}</div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      style={{ width: '100%', height: '50px', background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '12px', paddingLeft: '40px', paddingRight: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--t1)', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--t1)', marginBottom: '24px' }}>
              Recapitulatif
            </h2>
            <div style={{ background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
              {[
                { label: 'Pro', value: `${selectedPro?.prenom} ${selectedPro?.nom}` },
                { label: 'Service', value: services[selectedService ?? 0]?.nom },
                { label: 'Lieu', value: location === 'domicile' ? 'A domicile' : 'En studio' },
                { label: 'Date', value: selectedDay !== null ? `${getDayLabel(selectedDay).day} ${getDayLabel(selectedDay).date}` : '-' },
                { label: 'Heure', value: selectedTime ?? '-' },
                { label: 'Adresse', value: clientAddress || '-' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--edge1)' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t4)' }}>{row.label}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--t1)' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--t1)' }}>Total</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '22px', color: 'var(--gold)' }}>{services[selectedService ?? 0]?.prix} CHF</span>
              </div>
            </div>

            <div style={{ background: 'rgba(0,217,122,0.06)', border: '1px solid rgba(0,217,122,0.15)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <IconCheck size={16} color="var(--flash)" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: 'var(--t2)' }}>Paiement securise · Annulation gratuite 24h avant</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--edge1)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => step < 5 ? setStep(s => s + 1) : handleConfirm()}
          disabled={!canProceed()}
          style={{
            width: '100%',
            height: '56px',
            background: canProceed() ? 'var(--gold)' : 'var(--d4)',
            color: canProceed() ? '#050507' : 'var(--t4)',
            border: 'none',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: canProceed() ? 'pointer' : 'not-allowed',
            transition: 'all 200ms',
            boxShadow: canProceed() ? '0 4px 20px rgba(242,208,107,0.2)' : 'none',
          }}
        >
          {step < 5 ? 'Continuer' : 'Confirmer la reservation'}
        </button>
      </div>
    </div>
  );
}
