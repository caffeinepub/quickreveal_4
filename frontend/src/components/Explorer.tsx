import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useActivePros, useFlashPros } from '../hooks/useQueries';
import type { ProProfile } from '../backend';
import BottomNav from './BottomNav';

const CATEGORIES = ['Tous', 'Barber', 'Coiffure', 'Esthetique', 'Massage'];

function proToDemoPro(pro: ProProfile) {
  return {
    id: pro.id.toString(),
    prenom: pro.brandName.split(' ')[0] ?? pro.brandName,
    nom: pro.brandName.split(' ').slice(1).join(' ') ?? '',
    initials: pro.brandName.slice(0, 2).toUpperCase(),
    categorie: pro.category,
    ville: pro.city,
    slogan: pro.slogan,
    bio: pro.bio,
    note: 4.8,
    nbAvis: 0,
    prixDepuis: 0,
    flashActif: pro.subscriptionStatus,
    nbPrestations: 0,
    coverUrl: pro.mainPhoto ? pro.mainPhoto.getDirectURL() : undefined,
    photos: pro.galleryPhotos.map((p) => p.getDirectURL()),
  };
}

export default function Explorer() {
  const { navigateToProProfile } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allPros = [], isLoading } = useActivePros();
  const { data: flashPros = [] } = useFlashPros();

  const filtered = allPros.filter((pro) => {
    const matchCat =
      selectedCategory === 'Tous' ||
      pro.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      !searchQuery ||
      pro.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0' }}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 24,
              fontWeight: 900,
              color: 'var(--t1)',
              letterSpacing: '-0.5px',
            }}
          >
            Explorer
          </h1>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(244,244,248,0.4)' }}>
            Trouvez votre professionnel ideal
          </p>

          {/* Search */}
          <div
            style={{
              position: 'relative',
              marginBottom: 16,
            }}
          >
            <input
              type="text"
              placeholder="Rechercher un pro, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(244,244,248,0.05)',
                border: '1px solid rgba(244,244,248,0.1)',
                borderRadius: 12,
                color: 'var(--t1)',
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 20,
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: selectedCategory === cat ? 'none' : '1px solid rgba(244,244,248,0.12)',
                  background:
                    selectedCategory === cat
                      ? 'linear-gradient(135deg, #F2D06B, #E8B84B)'
                      : 'transparent',
                  color: selectedCategory === cat ? '#050507' : 'rgba(244,244,248,0.6)',
                  fontSize: 12,
                  fontWeight: selectedCategory === cat ? 700 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flash section */}
        {flashPros.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                padding: '0 20px',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--flash)',
                  animation: 'pulseDot 1.5s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--flash)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Flash Live
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                padding: '0 20px',
                scrollbarWidth: 'none',
              }}
            >
              {flashPros.map((pro) => (
                <FlashCard
                  key={pro.id.toString()}
                  pro={pro}
                  onClick={() => navigateToProProfile(proToDemoPro(pro))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pro list */}
        <div style={{ padding: '0 20px' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(244,244,248,0.5)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {isLoading ? 'Chargement...' : `${filtered.length} professionnel${filtered.length !== 1 ? 's' : ''}`}
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 80,
                    background: 'rgba(244,244,248,0.04)',
                    borderRadius: 14,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: '48px 0',
                textAlign: 'center',
                color: 'rgba(244,244,248,0.3)',
                fontSize: 14,
              }}
            >
              Aucun professionnel trouve
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((pro) => (
                <ProCard
                  key={pro.id.toString()}
                  pro={pro}
                  onClick={() => navigateToProProfile(proToDemoPro(pro))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="explorer" />

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

function FlashCard({ pro, onClick }: { pro: ProProfile; onClick: () => void }) {
  const coverUrl = pro.mainPhoto ? pro.mainPhoto.getDirectURL() : null;

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 140,
        height: 180,
        borderRadius: 14,
        border: '1px solid rgba(0,217,122,0.2)',
        background: coverUrl
          ? `linear-gradient(to bottom, rgba(5,5,7,0.2), rgba(5,5,7,0.8)), url(${coverUrl}) center/cover`
          : 'linear-gradient(135deg, rgba(0,217,122,0.1), rgba(0,217,122,0.05))',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '12px',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--flash)',
          animation: 'pulseDot 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
        {pro.brandName}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(244,244,248,0.6)', marginTop: 2 }}>
        {pro.city}
      </div>
    </button>
  );
}

function ProCard({ pro, onClick }: { pro: ProProfile; onClick: () => void }) {
  const coverUrl = pro.mainPhoto ? pro.mainPhoto.getDirectURL() : null;

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'rgba(244,244,248,0.03)',
        border: '1px solid rgba(244,244,248,0.08)',
        borderRadius: 14,
        padding: '14px',
        cursor: 'pointer',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        textAlign: 'left',
      }}
    >
      {/* Avatar / cover */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: coverUrl
            ? `url(${coverUrl}) center/cover`
            : 'linear-gradient(135deg, rgba(242,208,107,0.2), rgba(242,208,107,0.05))',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold)',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {!coverUrl && pro.brandName.slice(0, 2).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--t1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pro.brandName}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(244,244,248,0.5)', marginTop: 2 }}>
          {pro.city} · {pro.category}
        </div>
        {pro.slogan && (
          <div
            style={{
              fontSize: 11,
              color: 'rgba(244,244,248,0.35)',
              marginTop: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {pro.slogan}
          </div>
        )}
      </div>

      {/* Flash badge */}
      {pro.subscriptionStatus && (
        <div
          style={{
            flexShrink: 0,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(0,217,122,0.1)',
            color: 'var(--flash)',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          FLASH
        </div>
      )}
    </button>
  );
}
