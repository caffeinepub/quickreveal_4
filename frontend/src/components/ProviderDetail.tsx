import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface LocalService {
  id: string;
  name: string;
  priceStudio: number | null;
  priceDomicile: number | null;
  duration: string;
  photos?: string[];
}

interface LocalProvider {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  city: string | string[];
  modes: string[];
  bio: string;
  priceFrom: number;
  coverPhotoUrl: string;
  services: LocalService[];
  studioAddress?: string;
  rating?: number;
  reviewCount?: number;
}

const BG_COLORS: Record<string, [string, string]> = {
  barber: ['#1a0f08', '#3d2000'],
  coiffure: ['#1a0818', '#3d1040'],
  esthetique: ['#180818', '#380838'],
  massage: ['#081218', '#103040'],
  onglerie: ['#1a1808', '#3d3000'],
};

const ProviderDetail: React.FC = () => {
  const { navigate, screenParams } = useAppContext();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const selectedProvider = screenParams?.provider as LocalProvider | undefined;

  if (!selectedProvider) {
    return (
      <div
        style={{
          background: '#0a0a0a',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>Professionnel non trouvé</p>
          <button
            onClick={() => navigate('explorer')}
            style={{
              background: '#E8C89A',
              border: 'none',
              borderRadius: '10px',
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

  const bg = BG_COLORS[selectedProvider.category] || ['#1a1a1a', '#2a2a2a'];

  const handleServiceClick = (service: LocalService) => {
    setSelectedServiceId(service.id);
  };

  const handleContinue = () => {
    if (selectedServiceId) {
      const service = selectedProvider.services.find((s) => s.id === selectedServiceId);
      navigate('bookingFlow', { provider: selectedProvider, service });
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
          onClick={() => navigate('explorer')}
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
              {Array.isArray(selectedProvider.city)
                ? selectedProvider.city[0]
                : selectedProvider.city}
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
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '17px',
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.55)',
            lineHeight: 1.6,
            marginBottom: '28px',
            borderLeft: '2px solid #E8C89A',
            paddingLeft: '14px',
          }}
        >
          {selectedProvider.bio}
        </p>

        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '12px',
          }}
        >
          PRESTATIONS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {selectedProvider.services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            const price = service.priceStudio ?? service.priceDomicile ?? 0;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                style={{
                  background: isSelected ? 'rgba(232,200,154,0.06)' : '#1a1a1a',
                  borderRadius: '16px',
                  border: `1px solid ${isSelected ? '#E8C89A' : 'rgba(255, 255, 255, 0.09)'}`,
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      marginBottom: '3px',
                    }}
                  >
                    {service.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.25)' }}>
                    {service.duration}
                    {service.priceStudio && service.priceDomicile
                      ? ` · 🏠${service.priceDomicile}.– / ✂️${service.priceStudio}.–`
                      : ''}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#E8C89A',
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
          onClick={handleContinue}
          disabled={!selectedServiceId}
          style={{
            width: '100%',
            background: selectedServiceId ? '#E8C89A' : '#222',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            color: selectedServiceId ? '#0a0a0a' : '#444',
            fontSize: '14px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: selectedServiceId ? 'pointer' : 'not-allowed',
            marginBottom: '40px',
            transition: 'all 0.2s',
          }}
        >
          RÉSERVER →
        </button>
      </div>
    </div>
  );
};

export default ProviderDetail;
