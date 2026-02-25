import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { ProProfileData } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';
import { DEMO_PROS } from '../utils/demoData';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="#F2D06B" stroke="#F2D06B" strokeWidth="0.5">
    <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="7" cy="7" r="4.5" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" />
  </svg>
);

const LightningIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#00D97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,1 3,5.5 5.5,5.5 4,9 7,4.5 4.5,4.5" />
  </svg>
);

const CATEGORIES = ['Tous', 'Coiffure', 'Esthétique', 'Massage', 'Barbier', 'Ongles'];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Convert DemoPro to ProProfileData shape
function toProProfileData(pro: typeof DEMO_PROS[0]): ProProfileData {
  return {
    ...pro,
    flashResponseTime: typeof pro.flashResponseTime === 'number' ? pro.flashResponseTime : undefined,
  };
}

export default function Explorer() {
  const { navigateToProProfile } = useAppContext();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filtered = DEMO_PROS.filter(pro => {
    const matchSearch = pro.name.toLowerCase().includes(search.toLowerCase()) ||
      pro.category.toLowerCase().includes(search.toLowerCase()) ||
      pro.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tous' || pro.category === activeCategory;
    return matchSearch && matchCat;
  });

  const flashPros = DEMO_PROS.filter(p => p.flashActive);

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingBottom: '80px' }}>
      <GlobalHeader />

      <div style={{ paddingTop: '72px' }}>
        {/* Search */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#0D0D13',
            border: '1px solid #1E1E26',
            borderRadius: '12px',
            padding: '0 14px',
            height: '44px',
          }}>
            <span style={{ color: '#54546C' }}><SearchIcon /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un expert..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#F4F4F8',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${activeCategory === cat ? '#F2D06B' : '#1E1E26'}`,
                background: activeCategory === cat ? 'rgba(242,208,107,0.08)' : '#0D0D13',
                color: activeCategory === cat ? '#F2D06B' : '#54546C',
                fontSize: '13px',
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flash Live section */}
        {flashPros.length > 0 && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}>
              <LightningIcon />
              <span style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#F4F4F8',
                fontFamily: 'Inter, sans-serif',
              }}>
                Flash Live
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {flashPros.map(pro => (
                <button
                  key={pro.id + '-flash'}
                  onClick={() => navigateToProProfile(toProProfileData(pro))}
                  style={{
                    flexShrink: 0,
                    width: '120px',
                    background: '#0D0D13',
                    border: '1px solid rgba(0,217,122,0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: pro.gradient || 'linear-gradient(135deg, #1C1C26, #2E2E3E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#F4F4F8',
                  }}>
                    {getInitials(pro.name)}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F4F4F8', marginBottom: '2px', fontFamily: 'Inter, sans-serif' }}>
                    {pro.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '11px', color: '#00D97A', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                    Répond en {pro.flashResponseTime || 5}min
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pro list */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#54546C',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, sans-serif',
          }}>
            {filtered.length} expert{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </div>

          {filtered.map(pro => (
            <button
              key={pro.id}
              onClick={() => navigateToProProfile(toProProfileData(pro))}
              style={{
                width: '100%',
                height: '80px',
                background: '#0D0D13',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '14px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                flexShrink: 0,
                background: pro.gradient || 'linear-gradient(135deg, #1C1C26, #2E2E3E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: '#F4F4F8',
                overflow: 'hidden',
              }}>
                {pro.photos && pro.photos.length > 0 ? (
                  <img
                    src={pro.photos[0]}
                    alt={pro.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  getInitials(pro.name)
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#F4F4F8',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {pro.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#54546C',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: '2px',
                }}>
                  {pro.category} · {pro.city}
                </div>
                {pro.flashActive && (
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#00D97A',
                    marginTop: '2px',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Répond en {pro.flashResponseTime || 5}min
                  </div>
                )}
              </div>

              {/* Rating + Price */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  justifyContent: 'flex-end',
                  marginBottom: '4px',
                }}>
                  <StarIcon />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#F4F4F8',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {pro.rating.toFixed(1)}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#F2D06B',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  dès {pro.startingPrice} CHF
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav activeTab="explorer" />
    </div>
  );
}
