import React from 'react';
import { useAppContext } from '../context/AppContext';

const BookingLocation: React.FC = () => {
  const {
    selectedProvider,
    selectedService,
    selectedLocation,
    setSelectedLocation,
    setCurrentScreen,
    goToSplash,
  } = useAppContext();

  if (!selectedProvider || !selectedService) {
    return null;
  }

  const handleContinue = () => {
    if (selectedLocation) {
      setCurrentScreen('bookingDate');
    }
  };

  const domicileAvailable = selectedService.priceDomicile !== null;
  const studioAvailable =
    selectedService.priceStudio !== null &&
    selectedProvider.studioAddress &&
    selectedProvider.studioLat &&
    selectedProvider.studioLng;

  const displayPrice =
    selectedLocation === 'domicile'
      ? selectedService.priceDomicile
      : selectedService.priceStudio;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
        <button
          onClick={() => setCurrentScreen('providerDetail')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            color: 'rgba(255, 255, 255, 0.55)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          ← RETOUR
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}
        >
          Choisir le lieu
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
          Où souhaitez-vous recevoir cette prestation ?
        </p>

        {/* Location Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          <div
            onClick={() => domicileAvailable && setSelectedLocation('domicile')}
            style={{
              background:
                selectedLocation === 'domicile' ? 'rgba(232,213,176,0.12)' : '#1a1a1a',
              border: `1px solid ${selectedLocation === 'domicile' ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: '16px',
              padding: '20px',
              cursor: domicileAvailable ? 'pointer' : 'not-allowed',
              opacity: domicileAvailable ? 1 : 0.4,
              transition: 'all 0.18s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                  🏠 À DOMICILE
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                  {domicileAvailable ? 'Le professionnel se déplace' : 'Non disponible'}
                </div>
              </div>
              {domicileAvailable && (
                <div
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#E8D5B0',
                  }}
                >
                  {selectedService.priceDomicile}.–
                </div>
              )}
            </div>
          </div>

          <div
            onClick={() => studioAvailable && setSelectedLocation('studio')}
            style={{
              background: selectedLocation === 'studio' ? 'rgba(232,213,176,0.12)' : '#1a1a1a',
              border: `1px solid ${selectedLocation === 'studio' ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: '16px',
              padding: '20px',
              cursor: studioAvailable ? 'pointer' : 'not-allowed',
              opacity: studioAvailable ? 1 : 0.4,
              transition: 'all 0.18s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                  ✂️ AU STUDIO
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                  {studioAvailable ? selectedProvider.studioAddress : 'Non disponible'}
                </div>
              </div>
              {studioAvailable && (
                <div
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#E8D5B0',
                  }}
                >
                  {selectedService.priceStudio}.–
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recap */}
        {selectedLocation && (
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div className="section-label" style={{ marginBottom: '12px' }}>
              RÉCAPITULATIF
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              {selectedService.name}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '12px' }}>
              {selectedLocation === 'domicile' ? '🏠 À domicile' : '✂️ Au studio'} · {selectedService.duration}
            </div>
            <div
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '28px',
                fontWeight: 800,
                color: '#E8D5B0',
              }}
            >
              {displayPrice}.–
            </div>
          </div>
        )}

        <button
          className="btn-white"
          onClick={handleContinue}
          disabled={!selectedLocation}
        >
          CHOISIR LA DATE →
        </button>
      </div>
    </div>
  );
};

export default BookingLocation;
