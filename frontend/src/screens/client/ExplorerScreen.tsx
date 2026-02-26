import React, { useState } from 'react';
import { useFilterProsByLocation } from '../../hooks/useQueries';
import type { ProProfile } from '../../backend';
import { IconSearch, IconFlash, IconMapPin, IconStar } from '../../components/icons';

const CATEGORIES = ['Tous', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];

const COVER_IMAGES: Record<string, string> = {
  Barber: '/assets/generated/barber-geneva-cover.dim_1200x400.png',
  Coiffure: '/assets/generated/coiffure-geneva-cover.dim_1200x400.png',
  Esthetique: '/assets/generated/esthetique-lausanne-cover.dim_1200x400.png',
  Massage: '/assets/generated/massage-geneva-cover.dim_1200x400.png',
};

interface ExplorerScreenProps {
  onSelectPro: (pro: ProProfile) => void;
  clientTab: string;
  onTabChange: (tab: string) => void;
}

export default function ExplorerScreen({ onSelectPro, clientTab, onTabChange }: ExplorerScreenProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');

  const { data: pros, isLoading } = useFilterProsByLocation(46.2044, 6.1432, 50, category === 'Tous' ? null : category);

  const filtered = (pros ?? []).filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.brandName?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const CLIENT_TABS = [
    { id: 'explorer', label: 'Explorer' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'alertes', label: 'Alertes' },
    { id: 'profil', label: 'Profil' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 20px 0', background: 'rgba(5,5,7,0.97)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontWeight: 900, fontSize: 22, color: '#F4F4F8', letterSpacing: '-0.04em' }}>NEXUS</span>
            <span style={{ fontWeight: 900, fontSize: 26, color: '#5B7FFF', letterSpacing: '-0.04em' }}>.</span>
          </div>
          <div style={{ fontSize: 12, color: '#9898B4' }}>Geneve · Lausanne · Zurich</div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <IconSearch size={16} color="#54546C" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un pro, une ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', height: 44, background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 12, paddingLeft: 40, paddingRight: 16, color: '#F4F4F8', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 999, border: 'none',
                background: category === cat ? 'rgba(242,208,107,0.15)' : 'rgba(255,255,255,0.04)',
                color: category === cat ? '#F2D06B' : '#9898B4',
                fontSize: 12, fontWeight: category === cat ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pro list */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(242,208,107,0.2)', borderTopColor: '#F2D06B', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 13, color: '#9898B4' }}>Chargement des pros...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#9898B4' }}>Aucun professionnel trouve</div>
            <div style={{ fontSize: 12, color: '#54546C', marginTop: 8 }}>Essayez une autre categorie ou ville</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((pro) => (
              <ProCard key={pro.id.toString()} pro={pro} onSelect={() => onSelectPro(pro)} />
            ))}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      {/* Tab bar */}
      <div style={{ flexShrink: 0, display: 'flex', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {CLIENT_TABS.map((tab) => {
          const isActive = clientTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', gap: 3 }}
            >
              {isActive && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: '#F2D06B', borderRadius: 2 }} />}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? '#F2D06B' : '#2E2E3E' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProCard({ pro, onSelect }: { pro: ProProfile; onSelect: () => void }) {
  const coverSrc = COVER_IMAGES[pro.category] ?? '/assets/generated/studio-cover-template.dim_1200x400.png';
  return (
    <button
      onClick={onSelect}
      style={{ width: '100%', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', textAlign: 'left' }}
    >
      <div style={{ position: 'relative', height: 140 }}>
        <img
          src={pro.mainPhoto ? pro.mainPhoto.getDirectURL() : coverSrc}
          alt={pro.brandName}
          onError={(e) => { (e.target as HTMLImageElement).src = coverSrc; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        {pro.subscriptionStatus && (
          <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', background: 'rgba(242,208,107,0.9)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconFlash size={10} color="#050507" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#050507' }}>FLASH</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pro.brandName || 'Professionnel'}</div>
            <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2 }}>{pro.category}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <IconStar size={12} color="#F2D06B" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F2D06B' }}>4.8</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <IconMapPin size={12} color="#54546C" />
          <span style={{ fontSize: 12, color: '#54546C' }}>{pro.city || 'Suisse'}</span>
          {pro.atHomeService && (
            <span style={{ marginLeft: 8, padding: '2px 8px', background: 'rgba(91,127,255,0.1)', borderRadius: 6, fontSize: 10, color: '#5B7FFF', fontWeight: 600 }}>A domicile</span>
          )}
        </div>
      </div>
    </button>
  );
}
