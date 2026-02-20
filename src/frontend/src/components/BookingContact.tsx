import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const BG_COLORS: Record<string, [string, string]> = {
  barber: ['#1a0f08', '#3d2000'],
  coiffure: ['#1a0818', '#3d1040'],
  esthetique: ['#180818', '#380838'],
  massage: ['#081218', '#103040'],
  onglerie: ['#1a1808', '#3d3000'],
};

const BookingContact: React.FC = () => {
  const {
    selectedProvider,
    selectedService,
    selectedLocation,
    selectedDateTime,
    setCurrentScreen,
    setBookingFormData,
  } = useAppContext();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [showToast, setShowToast] = useState(false);

  if (!selectedProvider || !selectedService || !selectedLocation || !selectedDateTime) {
    return null;
  }

  const bg = BG_COLORS[selectedProvider.category] || ['#1a1a1a', '#2a2a2a'];
  const currentPrice =
    selectedLocation === 'domicile' ? selectedService.priceDomicile : selectedService.priceStudio;

  const formatDate = (date: Date) => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const monthNames = [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ];
    return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`;
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^(\+41|0)[0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format invalide (ex: 079 123 45 67)';
    }

    if (selectedLocation === 'domicile' && !address.trim()) {
      newErrors.address = "L'adresse est requise pour une prestation à domicile";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setBookingFormData({ name, phone, address });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setCurrentScreen('explorer');
      }, 3000);
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          height: '220px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(160deg, ${bg[0]}, ${bg[1]})`,
            backgroundImage: `url(${selectedProvider.coverPhotoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 80%)',
          }}
        />
        <div
          onClick={() => setCurrentScreen('bookingDate')}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 10,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#ffffff',
          }}
        >
          ‹
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px 20px' }}>
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '28px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              marginBottom: '3px',
            }}
          >
            {selectedProvider.name}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.25)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            VALIDATION
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px 40px' }}>
        {/* Recap */}
        <div
          className="card"
          style={{ padding: '18px', marginBottom: '24px' }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.25)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            Récapitulatif
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
            {selectedService.name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '2px' }}>
            {selectedProvider.name} · {selectedLocation === 'domicile' ? 'Domicile' : 'Studio'}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '8px' }}>
            {formatDate(selectedDateTime.date)} à {selectedDateTime.time}
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '24px',
              fontWeight: 800,
              color: '#E8D5B0',
            }}
          >
            {currentPrice}.–
          </div>
        </div>

        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.25)', marginBottom: '24px' }}>
          Le professionnel a besoin de ces informations pour valider votre rendez-vous.
        </div>

        {/* Form */}
        <div
          style={{
            background: '#1a1a1a',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
            }}
          >
            <label
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.25)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Prénom & Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: selectedLocation === 'domicile' ? '1px solid rgba(255, 255, 255, 0.09)' : 'none',
            }}
          >
            <label
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.25)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="079 XXX XX XX"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                color: '#ffffff',
              }}
            />
          </div>
          {selectedLocation === 'domicile' && (
            <div style={{ padding: '14px 18px' }}>
              <label
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255, 255, 255, 0.25)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Adresse Complète
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rue, Numéro, Ville"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#ffffff',
                }}
              />
            </div>
          )}
        </div>

        {/* Errors */}
        {(errors.name || errors.phone || errors.address) && (
          <div style={{ marginBottom: '16px' }}>
            {errors.name && (
              <div style={{ fontSize: '12px', color: '#e05252', marginBottom: '4px' }}>
                {errors.name}
              </div>
            )}
            {errors.phone && (
              <div style={{ fontSize: '12px', color: '#e05252', marginBottom: '4px' }}>
                {errors.phone}
              </div>
            )}
            {errors.address && (
              <div style={{ fontSize: '12px', color: '#e05252', marginBottom: '4px' }}>
                {errors.address}
              </div>
            )}
          </div>
        )}

        <button className="btn-sand" onClick={handleSubmit}>
          ENVOYER LA DEMANDE
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            left: '20px',
            right: '20px',
            maxWidth: '430px',
            margin: '0 auto',
            zIndex: 999,
            background: '#3ecf8e',
            color: '#0a0a0a',
            borderRadius: '999px',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'slide-in-from-top 300ms ease-in-out',
            textAlign: 'center',
          }}
        >
          Réservation confirmée !
        </div>
      )}
    </div>
  );
};

export default BookingContact;
