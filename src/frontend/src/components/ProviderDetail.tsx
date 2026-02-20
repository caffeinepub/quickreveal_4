import React, { useState } from 'react';
import { useAppContext, Service } from '../context/AppContext';

const BG_COLORS: Record<string, [string, string]> = {
  barber: ['#1a0f08', '#3d2000'],
  coiffure: ['#1a0818', '#3d1040'],
  esthetique: ['#180818', '#380838'],
  massage: ['#081218', '#103040'],
  onglerie: ['#1a1808', '#3d3000'],
};

const ProviderDetail: React.FC = () => {
  const { selectedProvider, setCurrentScreen, setSelectedService } = useAppContext();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  if (!selectedProvider) {
    return null;
  }

  const bg = BG_COLORS[selectedProvider.category] || ['#1a1a1a', '#2a2a2a'];

  const handleServiceClick = (service: Service) => {
    setSelectedServiceId(service.id);
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedServiceId) {
      setCurrentScreen('bookingLocation');
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: '280px',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
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
            background:
              'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        />
        {/* Back button */}
        <div
          onClick={() => setCurrentScreen('explorer')}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
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
            fontSize: '18px',
            color: '#ffffff',
            transition: 'all 0.18s',
          }}
        >
          ‹
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '20px 20px 22px', width: '100%' }}>
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '36px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              lineHeight: 1,
              marginBottom: '6px',
            }}
          >
            {selectedProvider.name}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {selectedProvider.categoryLabel}
            </span>
            <span
              style={{
                padding: '4px 10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {selectedProvider.city}
            </span>
            {selectedProvider.modes.includes('domicile') && (
              <span
                style={{
                  padding: '4px 10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Se déplace
              </span>
            )}
            {selectedProvider.modes.includes('salon') && (
              <span
                style={{
                  padding: '4px 10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Au studio
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        <p
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '17px',
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.55)',
            lineHeight: 1.6,
            marginBottom: '28px',
            borderLeft: '2px solid #E8D5B0',
            paddingLeft: '14px',
          }}
        >
          {selectedProvider.bio}
        </p>

        <div className="section-label">PRESTATIONS</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {selectedProvider.services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            const price = service.priceStudio || service.priceDomicile || 0;
            const hasGold = service.priceDomicile && !service.priceStudio;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '16px',
                  border: `1px solid ${isSelected ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  backgroundColor: isSelected ? 'rgba(232,213,176,0.06)' : '#1a1a1a',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      marginBottom: '3px',
                      color: hasGold ? '#E8D5B0' : '#ffffff',
                    }}
                  >
                    {service.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.25)' }}>
                    {service.duration}
                    {service.priceStudio && service.priceDomicile &&
                      ` · 🏠${service.priceDomicile}.– / ✂️${service.priceStudio}.–`}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: hasGold ? '#E8D5B0' : '#ffffff',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: '14px',
                  }}
                >
                  {price}.–
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="btn-white"
          onClick={handleContinue}
          disabled={!selectedServiceId}
          style={{ marginBottom: '40px' }}
        >
          CHOISIR LE LIEU →
        </button>
      </div>
    </div>
  );
};

export default ProviderDetail;
