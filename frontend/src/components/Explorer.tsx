import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Star, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import BottomNav from './BottomNav';

const DEMO_PROS = [
  {
    id: 'julien-rossi',
    brandName: 'Julien Rossi',
    slogan: 'Barber premium à domicile',
    category: 'Barber',
    city: 'Lausanne',
    rating: 4.9,
    reviewCount: 47,
    responseTime: '3 min',
    minPrice: 35,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/barber-lausanne-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    bio: 'Spécialiste coupe homme et barbe depuis 10 ans.',
    services: [
      { id: 's1', name: 'Coupe homme', duration: 45, price: 45, badges: ['Populaire'] },
      { id: 's2', name: 'Barbe complète', duration: 30, price: 35, badges: [] },
      { id: 's3', name: 'Coupe + Barbe', duration: 75, price: 70, badges: ['Promo'] },
    ],
    acceptanceRate: 97,
    totalPrestations: 124,
  },
  {
    id: 'lucie-esthetics',
    brandName: 'Lucie Esthetics',
    slogan: 'Beauté & bien-être à domicile',
    category: 'Esthétique',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 63,
    responseTime: '5 min',
    minPrice: 55,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/esthetique-lausanne-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-lucie-esthetics.dim_800x600.png',
    bio: 'Esthéticienne diplômée, spécialiste soins visage et corps.',
    services: [
      { id: 's1', name: 'Soin visage', duration: 60, price: 75, badges: ['Populaire'] },
      { id: 's2', name: 'Épilation jambes', duration: 45, price: 55, badges: [] },
      { id: 's3', name: 'Manucure', duration: 30, price: 40, badges: ['Nouveau'] },
    ],
    acceptanceRate: 95,
    totalPrestations: 89,
  },
  {
    id: 'sophiane-hair',
    brandName: 'Sophiane Hair',
    slogan: 'Coiffure créative & tendance',
    category: 'Coiffure',
    city: 'Lausanne',
    rating: 4.7,
    reviewCount: 38,
    responseTime: '8 min',
    minPrice: 60,
    isFlash: false,
    hasRevolut: false,
    coverPhoto: '/assets/generated/coiffure-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-sophiane-hair.dim_800x600.png',
    bio: 'Coiffeuse passionnée, spécialiste colorations et coupes femme.',
    services: [
      { id: 's1', name: 'Coupe femme', duration: 60, price: 80, badges: ['Populaire'] },
      { id: 's2', name: 'Coloration', duration: 120, price: 120, badges: [] },
      { id: 's3', name: 'Brushing', duration: 45, price: 60, badges: [] },
    ],
    acceptanceRate: 92,
    totalPrestations: 67,
  },
  {
    id: 'zen-touch',
    brandName: 'Zen Touch',
    slogan: 'Massage & relaxation premium',
    category: 'Massage',
    city: 'Genève',
    rating: 5.0,
    reviewCount: 29,
    responseTime: '10 min',
    minPrice: 80,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/massage-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-zen-touch.dim_800x600.png',
    bio: 'Masseur certifié, techniques suédoises et thaïlandaises.',
    services: [
      { id: 's1', name: 'Massage relaxant 60min', duration: 60, price: 90, badges: ['Populaire'] },
      { id: 's2', name: 'Massage sportif', duration: 45, price: 80, badges: [] },
      { id: 's3', name: 'Massage duo', duration: 90, price: 160, badges: ['Nouveau'] },
    ],
    acceptanceRate: 100,
    totalPrestations: 45,
  },
  {
    id: 'noura-beauty',
    brandName: 'Noura Beauty',
    slogan: 'Maquillage & soins orientaux',
    category: 'Esthétique',
    city: 'Fribourg',
    rating: 4.6,
    reviewCount: 21,
    responseTime: '15 min',
    minPrice: 45,
    isFlash: false,
    hasRevolut: false,
    coverPhoto: '/assets/generated/coiffure-fribourg-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-noura-beauty.dim_800x600.png',
    bio: 'Maquilleuse professionnelle, spécialiste mariages et événements.',
    services: [
      { id: 's1', name: 'Maquillage événement', duration: 60, price: 85, badges: ['Populaire'] },
      { id: 's2', name: 'Soin hammam', duration: 90, price: 95, badges: ['Nouveau'] },
      { id: 's3', name: 'Henné', duration: 45, price: 45, badges: [] },
    ],
    acceptanceRate: 88,
    totalPrestations: 34,
  },
  {
    id: 'barber-geneva',
    brandName: 'Mageste Labs',
    slogan: 'Barber shop haut de gamme',
    category: 'Barber',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 55,
    responseTime: '5 min',
    minPrice: 40,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/barber-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-mageste-labs.dim_800x600.png',
    bio: 'Barbier expert, spécialiste dégradés et soins barbe.',
    services: [
      { id: 's1', name: 'Dégradé américain', duration: 45, price: 50, badges: ['Populaire'] },
      { id: 's2', name: 'Rasage traditionnel', duration: 30, price: 40, badges: [] },
      { id: 's3', name: 'Coupe + Rasage', duration: 75, price: 80, badges: ['Promo'] },
    ],
    acceptanceRate: 96,
    totalPrestations: 112,
  },
];

const SWISS_CITIES = [
  'Lausanne', 'Genève', 'Fribourg', 'Neuchâtel', 'Sion',
  'Montreux', 'Vevey', 'Yverdon-les-Bains', 'Nyon', 'Morges',
  'Renens', 'Biel/Bienne', 'La Chaux-de-Fonds', 'Delémont',
];

const CATEGORIES = [
  { id: 'all', label: 'Tous', emoji: '' },
  { id: 'flash', label: 'Flash', emoji: '⚡' },
  { id: 'Barber', label: 'Barber', emoji: '✂️' },
  { id: 'Coiffure', label: 'Coiffure', emoji: '💇' },
  { id: 'Esthétique', label: 'Esthétique', emoji: '💅' },
  { id: 'Massage', label: 'Massage', emoji: '🤲' },
];

type DemoPro = typeof DEMO_PROS[0];

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="skeleton-shimmer" style={{ width: '100%', height: '180px' }} />
      <div style={{ backgroundColor: '#111111', padding: '16px' }}>
        <div className="skeleton-shimmer" style={{ height: '20px', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
        <div className="skeleton-shimmer" style={{ height: '14px', borderRadius: '4px', marginBottom: '12px', width: '40%' }} />
        <div className="skeleton-shimmer" style={{ height: '14px', borderRadius: '4px', marginBottom: '16px', width: '80%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ height: '20px', borderRadius: '4px', width: '30%' }} />
          <div className="skeleton-shimmer" style={{ height: '40px', borderRadius: '50px', width: '35%' }} />
        </div>
      </div>
    </div>
  );
}

function FlashCard({ pro, onPress }: { pro: DemoPro; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="btn-tap"
      style={{
        flexShrink: 0,
        width: '160px',
        height: '200px',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <img
        src={pro.coverPhoto}
        alt={pro.brandName}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <div
        className="flash-badge"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#22C55E',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          padding: '4px 10px',
          borderRadius: '50px',
          letterSpacing: '0.05em',
        }}
      >
        FLASH
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '14px',
            fontFamily: "'Inter', sans-serif",
            marginBottom: '2px',
          }}
        >
          {pro.brandName}
        </div>
        <div style={{ color: '#CCCCCC', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
          {pro.city}
        </div>
      </div>
    </button>
  );
}

function ProCard({ pro, onPress, onBook }: { pro: DemoPro; onPress: () => void; onBook: () => void }) {
  return (
    <div
      className="card-hover"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backgroundColor: '#111111',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px' }}>
        <img
          src={pro.coverPhoto}
          alt={pro.brandName}
          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
        />
        {pro.isFlash && (
          <div
            className="flash-badge"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#22C55E',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              padding: '5px 12px',
              borderRadius: '50px',
              letterSpacing: '0.05em',
            }}
          >
            ⚡ FLASH
          </div>
        )}
        {pro.hasRevolut && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              padding: '5px 10px',
              borderRadius: '50px',
              backdropFilter: 'blur(4px)',
            }}
          >
            Revolut ✅
          </div>
        )}
      </div>

      <div
        style={{ backgroundColor: '#111111', padding: '16px', cursor: 'pointer' }}
        onClick={onPress}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', fontFamily: "'Inter', sans-serif" }}>
            {pro.brandName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#E8C89A" color="#E8C89A" />
            <span style={{ color: '#E8C89A', fontWeight: 700, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
              {pro.rating}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: '#888888', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            {pro.category}
          </span>
          <span style={{ color: '#666666', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            ({pro.reviewCount} avis)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          <span style={{ color: '#666666', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            📍 {pro.city}
          </span>
          <span style={{ color: '#666666', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            ⚡ Répond {pro.responseTime}
          </span>
        </div>

        <div style={{ height: '1px', backgroundColor: '#1F1F1F', marginBottom: '14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#E8C89A', fontWeight: 700, fontSize: '18px', fontFamily: "'Inter', sans-serif" }}>
            À partir de {pro.minPrice} CHF
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onBook(); }}
            className="btn-tap"
            style={{
              backgroundColor: '#E8C89A',
              color: '#0A0A0A',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            RÉSERVER <Zap size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Explorer() {
  const { navigate, bookings } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistanceSlider, setShowDistanceSlider] = useState(false);
  const [isLoading] = useState(false);
  const cityInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityInputRef.current && !cityInputRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasPendingBookings = useMemo(
    () => bookings?.some((b) => b.status === 'pending') ?? false,
    [bookings]
  );

  const filteredPros = useMemo(() => {
    return DEMO_PROS.filter((pro) => {
      if (selectedCategory === 'flash') return pro.isFlash;
      if (selectedCategory !== 'all' && pro.category !== selectedCategory) return false;
      if (selectedCity && pro.city !== selectedCity) return false;
      return true;
    });
  }, [selectedCategory, selectedCity]);

  const flashPros = useMemo(() => DEMO_PROS.filter((p) => p.isFlash), []);

  const handleProPress = (pro: DemoPro) => {
    navigate('providerDetail', { provider: pro });
  };

  const handleBook = (pro: DemoPro) => {
    navigate('providerDetail', { provider: pro });
  };

  return (
    <div
      className="screen-transition"
      style={{ minHeight: '100dvh', backgroundColor: '#0A0A0A', paddingTop: '56px', paddingBottom: '80px' }}
    >
      <GlobalHeader hasNotifications={hasPendingBookings} />

      <div style={{ padding: '20px 16px 0' }}>
        {/* Search bar */}
        <div ref={cityInputRef} style={{ position: 'relative', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '14px',
              padding: '0 14px',
              height: '50px',
              gap: '10px',
            }}
          >
            <MapPin size={18} color="#E8C89A" />
            <input
              type="text"
              placeholder="Votre ville..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onFocus={() => setShowCityDropdown(true)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#CCCCCC',
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
              }}
            />
            <button
              onClick={() => setShowDistanceSlider(!showDistanceSlider)}
              style={{
                backgroundColor: '#E8C89A',
                color: '#0A0A0A',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                border: 'none',
                borderRadius: '50px',
                padding: '5px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ≤ {maxDistance} km
              <ChevronDown size={12} />
            </button>
          </div>

          {/* City dropdown */}
          {showCityDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '54px',
                left: 0,
                right: 0,
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '14px',
                zIndex: 50,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              {SWISS_CITIES.filter((c) =>
                !selectedCity || c.toLowerCase().includes(selectedCity.toLowerCase())
              ).map((city) => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #2A2A2A',
                    color: '#CCCCCC',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <MapPin size={14} color="#E8C89A" />
                  {city}
                </button>
              ))}
            </div>
          )}

          {/* Distance slider */}
          {showDistanceSlider && (
            <div
              style={{
                marginTop: '8px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#888888', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                  Distance maximale
                </span>
                <span style={{ color: '#E8C89A', fontWeight: 700, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                  {maxDistance} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#E8C89A' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ color: '#555555', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>5 km</span>
                <span style={{ color: '#555555', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>50 km</span>
              </div>
            </div>
          )}
        </div>

        {/* Category filters */}
        <div
          className="scroll-no-bar"
          style={{ display: 'flex', gap: '8px', marginBottom: '24px', paddingBottom: '4px' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn-tap"
                style={{
                  flexShrink: 0,
                  backgroundColor: isActive ? '#E8C89A' : '#1A1A1A',
                  color: isActive ? '#0A0A0A' : '#888888',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '14px',
                  border: isActive ? 'none' : '1px solid #2A2A2A',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.emoji && <span style={{ marginRight: '4px' }}>{cat.emoji}</span>}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Flash section */}
        {(selectedCategory === 'all' || selectedCategory === 'flash') && flashPros.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="green-dot-pulse" />
              <span
                style={{
                  color: '#22C55E',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                DISPONIBLES MAINTENANT
              </span>
            </div>
            <div
              className="scroll-no-bar"
              style={{ display: 'flex', gap: '12px', paddingBottom: '4px' }}
            >
              {flashPros.map((pro) => (
                <FlashCard key={pro.id} pro={pro} onPress={() => handleProPress(pro)} />
              ))}
            </div>
          </div>
        )}

        {/* Main pro list */}
        <div style={{ marginBottom: '8px' }}>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              marginBottom: '16px',
            }}
          >
            {selectedCity ? `Pros à ${selectedCity}` : 'Tous les pros'}
          </h2>

          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredPros.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: '#555555',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '16px', color: '#888888' }}>Aucun pro trouvé</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Essayez une autre ville ou catégorie</p>
            </div>
          ) : (
            filteredPros.map((pro) => (
              <ProCard
                key={pro.id}
                pro={pro}
                onPress={() => handleProPress(pro)}
                onBook={() => handleBook(pro)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer style={{ padding: '24px 0 8px', textAlign: 'center' }}>
          <p style={{ color: '#333333', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#555555' }}
            >
              caffeine.ai
            </a>{' '}
            · © {new Date().getFullYear()} NEXUS
          </p>
        </footer>
      </div>

      <BottomNav activeTab="explorer" hasPendingBookings={hasPendingBookings} />
    </div>
  );
}
