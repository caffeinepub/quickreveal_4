import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROS } from '../utils/demoData';
import { IconSearch, IconStar, IconFlash } from './icons/Icons';

const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'barber', label: 'Barbier' },
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'esthetique', label: 'Esthetique' },
  { id: 'massage', label: 'Massage' },
];

export default function Explorer() {
  const { navigateTo, setSelectedPro } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPros = DEMO_PROS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.categorie === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ville.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleProClick = (pro: typeof DEMO_PROS[0]) => {
    setSelectedPro(pro as any);
    navigateTo('proFiche');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingBottom: 80, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ padding: '52px 20px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>Explorer</h1>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 20 }}>Professionnels disponibles pres de vous</p>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--d2)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
          <IconSearch size={18} color="var(--t4)" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: 'Inter, sans-serif', fontSize: 15 }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 24 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 20,
                border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: activeCategory === cat.id ? '#F2D06B' : 'var(--d2)',
                color: activeCategory === cat.id ? '#050507' : 'var(--t3)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: activeCategory === cat.id ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pro list */}
      <div style={{ padding: '0 20px' }}>
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
            <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: pro.gradient }}>
              <img
                src={pro.coverUrl}
                alt={pro.prenom}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{pro.prenom} {pro.nom}</span>
                {pro.flashActif && <IconFlash size={12} color="#F2D06B" />}
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>{pro.categorie} · {pro.ville}</div>
            </div>

            {/* Right */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginBottom: 2 }}>
                <IconStar size={11} color="#F2D06B" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{pro.note}</span>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)' }}>
                des {pro.prixDepuis} CHF
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
