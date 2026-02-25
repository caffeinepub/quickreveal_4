import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROS } from '../data/mockData';
import { IconSearch, IconStar } from './icons/Icons';

const CATEGORIES = ['Tous', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];

export default function Explorer() {
  const { navigateTo, setSelectedPro } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPros = DEMO_PROS.filter(pro => {
    const matchCat = activeCategory === 'Tous' || pro.categorie.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery ||
      pro.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.ville.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '28px', color: 'var(--t1)', letterSpacing: '-0.04em', marginBottom: '16px' }}>
          Explorer
        </h1>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
            <IconSearch size={16} color="var(--t4)" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '46px', background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '12px', paddingLeft: '40px', paddingRight: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--t1)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                height: '34px',
                padding: '0 16px',
                borderRadius: '999px',
                border: `1px solid ${activeCategory === cat ? 'var(--gold)' : 'var(--edge1)'}`,
                background: activeCategory === cat ? 'rgba(242,208,107,0.1)' : 'var(--d2)',
                color: activeCategory === cat ? 'var(--gold)' : 'var(--t3)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: activeCategory === cat ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pro list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {filteredPros.map(pro => (
          <button
            key={pro.id}
            onClick={() => {
              setSelectedPro(pro);
              navigateTo('providerDetail');
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--edge1)',
              padding: '16px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'left',
            }}
          >
            {/* Avatar */}
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: pro.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--t1)' }}>{pro.initials}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t1)', marginBottom: '2px' }}>
                {pro.prenom} {pro.nom}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t3)', marginBottom: '4px' }}>
                {pro.categorie} · {pro.ville}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconStar size={11} color="var(--gold)" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: 'var(--gold)' }}>{pro.note}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {/* Use startingPrice (new field name) */}
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--t1)' }}>des {pro.startingPrice}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11px', color: 'var(--t3)' }}>CHF</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
