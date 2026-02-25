import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DEMO_PROS, FILTER_CATEGORIES, DemoPro } from '../utils/demoData';
import { IconBell, IconSearch, IconFlash, IconStar } from './icons/Icons';

const CLIENT_TABS = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'bookings', label: 'Reservations' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profil' },
];

export default function ExplorerV2() {
  const { navigateTo, setSelectedPro, userName } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [activeClientTab, setActiveClientTab] = useState('explorer');
  const [searchQuery, setSearchQuery] = useState('');

  const flashPros = DEMO_PROS.filter((p) => p.isFlash);
  const filteredPros = DEMO_PROS.filter((p) => {
    const matchesFilter =
      activeFilter === 'Tous' ||
      p.categorie.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ville.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleProClick = (pro: DemoPro) => {
    setSelectedPro(pro);
    navigateTo('proFiche');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 16px',
        background: 'var(--void)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--t1)',
            letterSpacing: '-0.02em',
          }}>
            NEXUS<span style={{ color: 'var(--blue)' }}>.</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigateTo('notificationCenter')}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--d2)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconBell size={18} color="var(--t2)" />
            </button>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 700,
                color: '#050507',
              }}>
                {(userName || 'U')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--d2)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <IconSearch size={16} color="var(--t4)" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un pro, une ville..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter',
              fontSize: 14,
              color: 'var(--t1)',
            }}
          />
          <div style={{
            background: 'var(--d3)',
            borderRadius: 8,
            padding: '4px 10px',
          }}>
            <span style={{
              fontFamily: 'Inter',
              fontSize: 12,
              color: 'var(--t4)',
            }}>
              Lausanne
            </span>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  flexShrink: 0,
                  padding: '7px 16px',
                  borderRadius: 20,
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? 'var(--gold)' : 'var(--d2)',
                  color: isActive ? '#050507' : 'var(--t3)',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 20px 100px' }}>
        {/* Flash Live section */}
        {(activeFilter === 'Tous' || flashPros.some((p) => p.categorie.toLowerCase() === activeFilter.toLowerCase())) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                animation: 'breathe 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--t1)',
              }}>
                Flash Live
              </span>
              <span style={{
                fontFamily: 'Inter',
                fontSize: 12,
                color: 'var(--t4)',
              }}>
                Disponibles maintenant
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 8,
              scrollbarWidth: 'none',
            }}>
              {flashPros
                .filter((p) => activeFilter === 'Tous' || p.categorie.toLowerCase() === activeFilter.toLowerCase())
                .map((pro) => (
                  <FlashCard key={pro.id} pro={pro} onClick={() => handleProClick(pro)} />
                ))}
            </div>
          </div>
        )}

        {/* Pour vous section */}
        <div>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--t1)',
            display: 'block',
            marginBottom: 12,
          }}>
            Pour vous
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {filteredPros.map((pro) => (
              <ProListCard key={pro.id} pro={pro} onClick={() => handleProClick(pro)} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{
        display: 'flex',
        background: 'var(--d2)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        position: 'sticky',
        bottom: 0,
      }}>
        {CLIENT_TABS.map(({ id, label }) => {
          const isActive = activeClientTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveClientTab(id)}
              style={{
                flex: 1,
                padding: '12px 0 10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <div style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: isActive ? 'var(--gold)' : 'transparent',
                marginBottom: 2,
              }} />
              <span style={{
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--gold)' : 'var(--t4)',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Flash Card ───────────────────────────────────────────────────────────────

function FlashCard({ pro, onClick }: { pro: DemoPro; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: 168,
        height: 228,
        borderRadius: 20,
        overflow: 'hidden',
        flexShrink: 0,
        cursor: 'pointer',
        background: pro.gradient,
      }}
    >
      {!imgError && pro.coverUrl && (
        <img
          src={pro.coverUrl}
          alt={pro.prenom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'absolute',
            inset: 0,
          }}
          onError={() => setImgError(true)}
        />
      )}

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(5,5,7,0.1) 0%, rgba(5,5,7,0.92) 100%)',
        zIndex: 1,
      }} />

      {/* Flash badge top-left */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(5,5,7,0.7)',
        borderRadius: 20,
        padding: '4px 8px',
      }}>
        <IconFlash size={10} color="var(--gold)" />
        <span style={{
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.04em',
        }}>
          FLASH
        </span>
      </div>

      {/* Rating top-right */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        background: 'rgba(5,5,7,0.7)',
        borderRadius: 20,
        padding: '4px 8px',
      }}>
        <IconStar size={10} color="var(--gold)" />
        <span style={{
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--t1)',
        }}>
          {pro.note}
        </span>
      </div>

      {/* Info bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px',
        zIndex: 2,
      }}>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--t1)',
          display: 'block',
          marginBottom: 2,
        }}>
          {pro.prenom}
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 11,
          color: 'var(--t3)',
          display: 'block',
          marginBottom: 6,
        }}>
          {pro.ville}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 11,
            color: 'var(--gold)',
            fontWeight: 600,
          }}>
            {pro.flashResponseTime}
          </span>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--t1)',
          }}>
            {pro.startingPrice} CHF
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Pro List Card ────────────────────────────────────────────────────────────

function ProListCard({ pro, onClick }: { pro: DemoPro; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
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
        background: pro.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {!imgError && pro.coverUrl ? (
          <img
            src={pro.coverUrl}
            alt={pro.prenom}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
          }}>
            {pro.initials}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--t1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {pro.prenom}
          </span>
          {pro.isFlash && (
            <IconFlash size={12} color="var(--gold)" />
          )}
        </div>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          color: 'var(--t4)',
        }}>
          {pro.categorie} — {pro.ville}
        </span>
      </div>

      {/* Right side */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginBottom: 2 }}>
          <IconStar size={11} color="var(--gold)" />
          <span style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--t2)',
          }}>
            {pro.note}
          </span>
        </div>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          color: 'var(--t4)',
        }}>
          des {pro.startingPrice} CHF
        </span>
      </div>
    </div>
  );
}
