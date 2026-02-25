import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROS, DemoPro } from '../utils/demoData';
import { IconSearch, IconFlash, IconStar } from './icons/Icons';

const CATEGORIES = ['Tous', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];
const SUBTITLES = [
  'Beaute a domicile, en 3 taps',
  'Les meilleurs pros pres de vous',
  'Reservez en moins de 2 minutes',
  'Paiement securise, satisfaction garantie',
];

export default function ExplorerV2() {
  const { navigateTo, setSelectedPro } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const flashPros = DEMO_PROS.filter((p) => p.flashActif);

  const filteredPros = DEMO_PROS.filter((pro) => {
    const matchCat = activeCategory === 'Tous' || pro.categorie === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || `${pro.prenom} ${pro.nom} ${pro.ville}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleProClick = (pro: DemoPro) => {
    setSelectedPro(pro as any);
    navigateTo('proFiche');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--void)',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0' }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)' }}>NEXUS</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#F2D06B' }}>.</span>
        </div>
        <p style={{
          fontSize: 13,
          color: 'var(--t3)',
          margin: '0 0 20px',
          transition: 'opacity 0.3s ease',
        }}>
          {SUBTITLES[subtitleIndex]}
        </p>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--d1)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <IconSearch size={16} color="var(--t3)" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un pro, une ville..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--t1)',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>

        {/* Category pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: 24,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 20,
                border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: activeCategory === cat ? '#F2D06B' : 'var(--d1)',
                color: activeCategory === cat ? '#050507' : 'var(--t3)',
                fontSize: 12,
                fontWeight: activeCategory === cat ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Flash Live Section */}
      {flashPros.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: '0 20px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconFlash size={14} color="#F2D06B" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.04em' }}>
              FLASH LIVE
            </span>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00D97A',
              animation: 'pulse 2s infinite',
            }} />
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '0 20px',
            scrollbarWidth: 'none',
          }}>
            {flashPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => handleProClick(pro)}
                style={{
                  flexShrink: 0,
                  width: 168,
                  height: 228,
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <img
                  src={pro.coverUrl}
                  alt={pro.prenom}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.style.background = pro.gradient;
                    }
                  }}
                />
                {/* Dark overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,5,7,0.1) 0%, rgba(5,5,7,0.92) 100%)',
                }} />

                {/* Flash badge */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: '#F2D06B',
                  borderRadius: 8,
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <IconFlash size={10} color="#050507" />
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#050507', letterSpacing: '0.04em' }}>LIVE</span>
                </div>

                {/* Note */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'rgba(5,5,7,0.7)',
                  borderRadius: 8,
                  padding: '3px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}>
                  <IconStar size={9} color="#F2D06B" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--t1)' }}>{pro.note}</span>
                </div>

                {/* Info bottom */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 2 }}>
                    {pro.prenom}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                    {pro.ville} — des {pro.prixDepuis} CHF
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro List */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
          {filteredPros.length} professionnel{filteredPros.length > 1 ? 's' : ''}
        </div>

        {filteredPros.map((pro) => (
          <div
            key={pro.id}
            onClick={() => handleProClick(pro)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
            }}>
              <img
                src={pro.coverUrl}
                alt={pro.prenom}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.style.background = pro.gradient;
                    target.parentElement.innerHTML = `<span style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:white;font-family:Inter,sans-serif">${pro.initials}</span>`;
                  }
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
                  {pro.prenom} {pro.nom}
                </span>
                {pro.flashActif && (
                  <div style={{
                    background: 'rgba(242,208,107,0.15)',
                    borderRadius: 6,
                    padding: '1px 5px',
                  }}>
                    <IconFlash size={9} color="#F2D06B" />
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                {pro.categorie} — {pro.ville}
              </div>
            </div>

            {/* Right */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginBottom: 2 }}>
                <IconStar size={11} color="#F2D06B" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{pro.note}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>des {pro.prixDepuis} CHF</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
