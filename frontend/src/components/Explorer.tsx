import React, { useState, useMemo } from 'react';
import { Search, Zap, Star, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { SWISS_ROMANDE_CITIES, getDistanceBetweenCities } from '../utils/cityData';
import { DEMO_PROFILES, DemoProProfile } from '../utils/demoData';
import NotificationCenter from './NotificationCenter';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_FILTERS = ['Tous', 'Barber', 'Coiffure', 'Esthétique', 'Massage'];

function ProCardSkeleton() {
  return (
    <div className="bg-nexus-card border border-nexus-border rounded-nexus overflow-hidden">
      <Skeleton className="w-full h-32" style={{ background: '#2A2A2A' }} />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" style={{ background: '#2A2A2A' }} />
        <Skeleton className="h-3 w-1/2" style={{ background: '#2A2A2A' }} />
        <Skeleton className="h-3 w-2/3" style={{ background: '#2A2A2A' }} />
        <Skeleton className="h-10 w-full mt-2" style={{ background: '#2A2A2A' }} />
      </div>
    </div>
  );
}

function FlashBadge() {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-nexus-success flash-pulse inline-block" />
      FLASH
    </span>
  );
}

function ProCard({ pro, clientCity, onSelect }: { pro: DemoProProfile; clientCity: string; onSelect: (pro: DemoProProfile) => void }) {
  const distanceKm = getDistanceBetweenCities(clientCity, pro.city);
  const distanceLabel = distanceKm === 0 ? 'Même ville' : `${distanceKm} km`;

  return (
    <div
      className="bg-nexus-card border border-nexus-border rounded-nexus overflow-hidden cursor-pointer hover:border-nexus-gold transition-all active:scale-98"
      onClick={() => onSelect(pro)}
    >
      {/* Cover */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={pro.coverImage}
          alt={pro.brandName}
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).src = '/assets/generated/studio-cover-template.dim_1200x400.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {pro.isFlashActive && <FlashBadge />}
        </div>

        {/* Revolut badge */}
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,0,0,0.6)', color: '#E8C89A', border: '1px solid rgba(232,200,154,0.3)' }}>
            💳 Revolut ✅
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-base leading-tight">{pro.brandName}</h3>
            <p className="text-nexus-secondary text-xs mt-0.5">{pro.category}</p>
          </div>
          <div className="flex-shrink-0 ml-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-nexus-gold fill-nexus-gold" />
              <span className="text-white text-sm font-bold">{pro.rating}</span>
              <span className="text-nexus-secondary text-xs">({pro.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-nexus-secondary">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {distanceLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Répond en {pro.responseTime}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-nexus-secondary text-xs">
            À partir de <span className="text-white font-bold">{pro.startingPrice} CHF</span>
          </span>
          <button
            className="px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#E8C89A', color: '#0A0A0A' }}
            onClick={e => { e.stopPropagation(); onSelect(pro); }}
          >
            ⚡ RÉSERVER
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Explorer() {
  const { navigate, appRole } = useAppContext();
  const { isAuthenticated } = useAuthContext();
  const [selectedCity, setSelectedCity] = useState('Lausanne');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [distanceFilter, setDistanceFilter] = useState(50);
  const [showFlashOnly, setShowFlashOnly] = useState(false);
  const [isLoading] = useState(false);

  const flashPros = useMemo(() => DEMO_PROFILES.filter(p => p.isFlashActive), []);

  const filteredPros = useMemo(() => {
    return DEMO_PROFILES.filter(pro => {
      if (selectedCategory !== 'Tous' && pro.category !== selectedCategory) return false;
      if (showFlashOnly && !pro.isFlashActive) return false;
      const dist = getDistanceBetweenCities(selectedCity, pro.city);
      if (dist > distanceFilter) return false;
      return true;
    });
  }, [selectedCity, selectedCategory, distanceFilter, showFlashOnly]);

  const handleProSelect = (pro: DemoProProfile) => {
    navigate('providerDetail', { provider: pro });
  };

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px', background: '#0A0A0A', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#E8C89A' }}>
            NEXUS<span style={{ display: 'inline-block', width: '5px', height: '5px', background: '#3B82F6', borderRadius: '50%', marginLeft: '2px', marginBottom: '6px', verticalAlign: 'bottom' }} />
          </h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <NotificationCenter />
            {isAuthenticated ? (
              <>
                {appRole === 'professional' && (
                  <button onClick={() => navigate('nexusOS')} style={{ background: '#1A1A1A', border: '1px solid rgba(232,200,154,0.3)', borderRadius: '20px', color: '#E8C89A', fontSize: '11px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>
                    Espace Pro
                  </button>
                )}
                <button onClick={() => navigate('clientDashboard')} style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '20px', color: '#888', fontSize: '11px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>
                  Mes résa
                </button>
              </>
            ) : (
              <button onClick={() => navigate('splash')} style={{ background: '#E8C89A', border: 'none', borderRadius: '20px', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, padding: '6px 14px', cursor: 'pointer' }}>
                Se connecter
              </button>
            )}
          </div>
        </div>

        {/* Search header */}
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '10px' }}>Quel service cherchez-vous ?</p>

        {/* City selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#E8C89A' }} />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ width: '100%', background: '#1A1A1A', border: '1px solid #333', borderRadius: '10px', padding: '8px 10px 8px 28px', color: '#fff', fontSize: '13px', appearance: 'none', cursor: 'pointer' }}
            >
              {SWISS_ROMANDE_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1A1A1A', border: '1px solid #333', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>
            <span>≤ {distanceFilter} km</span>
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: selectedCategory === cat ? '#E8C89A' : '#1A1A1A',
                color: selectedCategory === cat ? '#0A0A0A' : '#666',
                transition: 'all 200ms',
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFlashOnly(!showFlashOnly)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: showFlashOnly ? '1px solid #22C55E' : 'none',
              background: showFlashOnly ? 'rgba(34,197,94,0.15)' : '#1A1A1A',
              color: showFlashOnly ? '#22C55E' : '#666',
              transition: 'all 200ms',
            }}
          >
            ⚡ Flash
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Flash section */}
        {flashPros.length > 0 && !showFlashOnly && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div className="w-2 h-2 rounded-full bg-nexus-success flash-pulse" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#22C55E' }}>
                Disponibles MAINTENANT
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {flashPros.map(pro => (
                <div
                  key={pro.id}
                  onClick={() => handleProSelect(pro)}
                  style={{ flexShrink: 0, width: '160px', background: '#1A1A1A', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  <div style={{ position: 'relative', height: '80px' }}>
                    <img src={pro.coverImage} alt={pro.brandName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '/assets/generated/studio-cover-template.dim_1200x400.png'; }} />
                    <div style={{ position: 'absolute', top: '4px', left: '4px' }}>
                      <FlashBadge />
                    </div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: '#fff', marginBottom: '2px' }}>{pro.brandName}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{pro.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '12px' }}>
            {filteredPros.length} professionnel{filteredPros.length !== 1 ? 's' : ''} trouvé{filteredPros.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {[1, 2, 3].map(i => <ProCardSkeleton key={i} />)}
          </div>
        ) : filteredPros.length === 0 ? (
          <div style={{ background: '#1A1A1A', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #222' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Aucun professionnel trouvé</p>
            <p style={{ color: '#444', fontSize: '12px' }}>Essayez d'élargir votre rayon ou de changer de ville</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {filteredPros.map(pro => (
              <ProCard key={pro.id} pro={pro} clientCity={selectedCity} onSelect={handleProSelect} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: '16px 20px', borderTop: '1px solid #1A1A1A', textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#333', fontSize: '11px' }}>
          Built with ❤️ using{' '}
          <a href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()} NEXUS
        </p>
      </footer>
    </div>
  );
}
