import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROS } from '../utils/demoData';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';
import { IconSearch, IconFlash } from './icons/Icons';

export default function ExplorerV2() {
  const { navigateTo, setSelectedPro } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = ['Barber', 'Coiffure', 'Esthetique', 'Massage'];

  const filtered = DEMO_PROS.filter((pro) => {
    const matchesSearch =
      !searchQuery ||
      pro.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.ville.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || pro.categorie === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const flashPros = filtered.filter((p) => p.flashActif);
  const regularPros = filtered.filter((p) => !p.flashActif);

  // Normalize a demoData pro to satisfy AppContext DemoPro (all required fields must be non-optional)
  const normalizePro = (pro: typeof DEMO_PROS[0]) => ({
    ...pro,
    slogan: pro.slogan ?? '',
    bio: pro.bio ?? '',
    nbPrestations: pro.nbPrestations ?? 0,
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#050507',
        overflow: 'hidden',
      }}
    >
      {/* SCROLLABLE CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          overscrollBehavior: 'contain',
        }}
      >
        <div
          style={{
            minHeight: '100%',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
          }}
        >
          <GlobalHeader />

          {/* Search */}
          <div style={{ padding: '16px 20px 8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <IconSearch size={18} color="rgba(255,255,255,0.4)" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un pro, une ville..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Category filters */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '8px 20px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: !activeCategory ? '#F2D06B' : 'rgba(255,255,255,0.15)',
                background: !activeCategory ? 'rgba(242,208,107,0.12)' : 'transparent',
                color: !activeCategory ? '#F2D06B' : 'rgba(255,255,255,0.6)',
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: activeCategory === cat ? '#F2D06B' : 'rgba(255,255,255,0.15)',
                  background:
                    activeCategory === cat ? 'rgba(242,208,107,0.12)' : 'transparent',
                  color: activeCategory === cat ? '#F2D06B' : 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Flash section */}
          {flashPros.length > 0 && (
            <div style={{ padding: '16px 20px 8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <IconFlash size={16} color="#F2D06B" />
                <span
                  style={{
                    color: '#F2D06B',
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Flash Live
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {flashPros.map((pro) => (
                  <ProCard
                    key={pro.id}
                    pro={pro}
                    isFlash
                    onPress={() => {
                      setSelectedPro(normalizePro(pro));
                      navigateTo('proFiche');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular pros */}
          <div style={{ padding: '16px 20px 0' }}>
            {flashPros.length > 0 && (
              <p
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Tous les pros
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {regularPros.map((pro) => (
                <ProCard
                  key={pro.id}
                  pro={pro}
                  onPress={() => {
                    setSelectedPro(normalizePro(pro));
                    navigateTo('proFiche');
                  }}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                }}
              >
                Aucun professionnel trouve
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <BottomNav activeTab="explorerV2" />
    </div>
  );
}

interface ProCardProps {
  pro: any;
  isFlash?: boolean;
  onPress: () => void;
}

function ProCard({ pro, isFlash, onPress }: ProCardProps) {
  return (
    <div
      onClick={onPress}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: isFlash
          ? '1px solid rgba(242,208,107,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative', height: 120 }}>
        {pro.coverUrl ? (
          <img
            src={pro.coverUrl}
            alt={pro.nom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(5,5,7,0.8) 100%)',
          }}
        />
        {isFlash && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: '#F2D06B',
              color: '#050507',
              fontSize: 10,
              fontWeight: 800,
              fontFamily: 'Inter, sans-serif',
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.06em',
            }}
          >
            FLASH
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <p
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}
            >
              {pro.nom}
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                margin: '2px 0 0',
              }}
            >
              {pro.categorie} · {pro.ville}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                color: '#F2D06B',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}
            >
              des {pro.prixDepuis} CHF
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 11,
                fontFamily: 'Inter, sans-serif',
                margin: '2px 0 0',
              }}
            >
              {pro.note} ({pro.nbAvis} avis)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
