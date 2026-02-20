import React, { useState, useEffect } from 'react';
import { useAppContext, Provider } from '../context/AppContext';
import { MapPin } from 'lucide-react';
import { calculateDistance } from '../utils/haversine';

const Explorer: React.FC = () => {
  const {
    goToSplash,
    providers,
    selectedCategory,
    selectedMode,
    selectedCity,
    setSelectedCategory,
    setSelectedMode,
    setSelectedCity,
    setSelectedProvider,
    setCurrentScreen,
  } = useAppContext();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoFilterActive, setGeoFilterActive] = useState(false);
  const [geoError, setGeoError] = useState(false);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentScreen('providerDetail');
  };

  const handleGeoFilter = () => {
    if (geoFilterActive) {
      setGeoFilterActive(false);
      setUserLocation(null);
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGeoFilterActive(true);
          setGeoError(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeoError(true);
        }
      );
    } else {
      setGeoError(true);
    }
  };

  // Filter providers
  let filteredProviders = providers.filter((p) => {
    const categoryMatch = selectedCategory === 'Tous' || p.categoryLabel === selectedCategory;
    const modeMatch =
      selectedMode === 'Tous' ||
      (selectedMode === 'Domicile' && p.modes.includes('domicile')) ||
      (selectedMode === 'Salon' && p.modes.includes('salon'));
    const cityMatch = selectedCity === 'Tous' || p.city === selectedCity;
    return categoryMatch && modeMatch && cityMatch;
  });

  // Calculate distances and sort if geo filter is active
  if (geoFilterActive && userLocation) {
    filteredProviders = filteredProviders
      .map((p) => ({
        ...p,
        distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  const categories = ['Tous', 'Barber', 'Coiffure', 'Esthétique', 'Massage', 'Onglerie'];
  const modes = ['Tous', 'Domicile', 'Salon'];
  const cities = ['Tous', 'Lausanne', 'Genève', 'Payerne'];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'rgba(232,213,176,0.12)' : 'transparent',
                  border: `1px solid ${selectedCategory === cat ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                  borderRadius: '999px',
                  color: selectedCategory === cat ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modes & Cities */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                style={{
                  background: selectedMode === mode ? 'rgba(232,213,176,0.12)' : 'transparent',
                  border: `1px solid ${selectedMode === mode ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                  borderRadius: '999px',
                  color: selectedMode === mode ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {mode}
              </button>
            ))}
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  background: selectedCity === city ? 'rgba(232,213,176,0.12)' : 'transparent',
                  border: `1px solid ${selectedCity === city ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                  borderRadius: '999px',
                  color: selectedCity === city ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {city}
              </button>
            ))}
            <button
              onClick={handleGeoFilter}
              style={{
                background: geoFilterActive ? 'rgba(232,213,176,0.12)' : 'transparent',
                border: `1px solid ${geoFilterActive ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                borderRadius: '999px',
                color: geoFilterActive ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MapPin size={12} />
              AUTOUR DE MOI
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '16px',
          }}
        >
          {filteredProviders.length} RÉSULTAT{filteredProviders.length > 1 ? 'S' : ''}
          {geoFilterActive && ' · TRIÉS PAR DISTANCE'}
        </div>

        {geoError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Impossible d'accéder à votre position. Veuillez autoriser la géolocalisation.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredProviders.map((provider: any) => (
            <div
              key={provider.id}
              onClick={() => handleProviderClick(provider)}
              style={{
                background: '#1a1a1a',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E8D5B0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  height: '160px',
                  backgroundImage: `url(${provider.coverPhotoUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  dès {provider.priceFrom}.–
                </div>
                {geoFilterActive && provider.distance !== undefined && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(232,213,176,0.95)',
                      color: '#0a0a0a',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <MapPin size={12} />à {provider.distance} km
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    marginBottom: '6px',
                  }}
                >
                  {provider.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {provider.categoryLabel}
                  </span>
                  <span
                    style={{
                      padding: '3px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {provider.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
