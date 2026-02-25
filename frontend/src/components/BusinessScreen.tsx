import React, { useState, useRef } from 'react';
import { useProContext } from '../context/ProContext';
import { IconCamera, IconX } from './icons/Icons';

type SubTab = 'identite' | 'paiement' | 'services' | 'galerie';

interface BusinessScreenProps {
  onActivate?: () => void;
  // Legacy prop kept for backward compat — no longer used internally
  onActivationSuccess?: () => void;
}

export default function BusinessScreen({ onActivate }: BusinessScreenProps) {
  const { proData, setProData } = useProContext();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('identite');

  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const handleSlotClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image trop lourde (max 10MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newPhotos = [...proData.photos];
      newPhotos[index] = ev.target?.result as string;
      setProData({ ...proData, photos: newPhotos });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const photos = proData.photos;
  const canActivate = photos.filter(Boolean).length >= 3;

  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'identite', label: 'Identite' },
    { id: 'paiement', label: 'Paiement' },
    { id: 'services', label: 'Services' },
    { id: 'galerie', label: 'Galerie' },
  ];

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', margin: '0 0 20px' }}>
          Mon Business
        </h1>

        {/* Sub-tab bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'var(--d1)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}>
          {subTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 9,
                border: 'none',
                background: activeSubTab === id ? 'var(--d3)' : 'transparent',
                color: activeSubTab === id ? 'var(--t1)' : 'var(--t3)',
                fontSize: 12,
                fontWeight: activeSubTab === id ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 100px' }}>
        {activeSubTab === 'identite' && (
          <IdentiteTab proData={proData} setProData={setProData} />
        )}
        {activeSubTab === 'paiement' && (
          <PaiementTab proData={proData} setProData={setProData} onActivate={onActivate} />
        )}
        {activeSubTab === 'services' && (
          <ServicesTab proData={proData} setProData={setProData} />
        )}
        {activeSubTab === 'galerie' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>
              Ajoutez au moins 3 photos pour activer votre profil.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  style={{
                    width: '100%',
                    height: 160,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: photos[i] ? 'none' : '2px dashed rgba(242,208,107,0.3)',
                    background: photos[i] ? 'none' : 'var(--d3)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <input
                    ref={fileInputRefs[i]}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(i, e)}
                  />
                  {photos[i] ? (
                    <>
                      <img
                        src={photos[i] as string}
                        alt={`Photo ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const p = [...photos];
                          p[i] = null;
                          setProData({ ...proData, photos: p });
                        }}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(5,5,7,0.85)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--t1)',
                        }}
                      >
                        <IconX size={12} />
                      </button>
                    </>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: 8,
                    }}>
                      <IconCamera color="var(--t3)" size={24} />
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: 13,
                        color: 'var(--t3)',
                      }}>
                        Ajouter
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              fontSize: 12,
              color: 'var(--t3)',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              {photos.filter(Boolean).length}/3 photos minimum
            </div>

            {canActivate && (
              <button
                onClick={onActivate}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: 16,
                  border: 'none',
                  background: '#F2D06B',
                  color: '#050507',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                Activer mon profil
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Sub-tab components ----

interface TabProps {
  proData: ReturnType<typeof useProContext>['proData'];
  setProData: ReturnType<typeof useProContext>['setProData'];
  onActivate?: () => void;
}

function IdentiteTab({ proData, setProData }: TabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Prenom / Nom de marque
        </label>
        <input
          value={proData.prenom}
          onChange={(e) => setProData({ ...proData, prenom: e.target.value })}
          style={inputStyle}
          placeholder="Alexandre"
        />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Ville
        </label>
        <input
          value={proData.ville}
          onChange={(e) => setProData({ ...proData, ville: e.target.value })}
          style={inputStyle}
          placeholder="Lausanne"
        />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Categorie
        </label>
        <select
          value={proData.categorie}
          onChange={(e) => setProData({ ...proData, categorie: e.target.value })}
          style={{ ...inputStyle, appearance: 'none' as const }}
        >
          <option value="barber">Barber</option>
          <option value="coiffure">Coiffure</option>
          <option value="esthetique">Esthetique</option>
          <option value="massage">Massage</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Slogan
        </label>
        <input
          value={proData.slogan}
          onChange={(e) => setProData({ ...proData, slogan: e.target.value })}
          style={inputStyle}
          placeholder="L art de la coupe parfaite"
        />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Bio
        </label>
        <textarea
          value={proData.bio}
          onChange={(e) => setProData({ ...proData, bio: e.target.value })}
          style={{ ...inputStyle, height: 100, resize: 'none' as const }}
          placeholder="Decrivez votre expertise..."
        />
      </div>
    </div>
  );
}

function PaiementTab({ proData, setProData, onActivate }: TabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'rgba(242,208,107,0.06)',
        border: '1px solid rgba(242,208,107,0.15)',
        borderRadius: 14,
        padding: '14px 16px',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#F2D06B', margin: '0 0 4px' }}>
          NEXUS PAY
        </p>
        <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0, lineHeight: 1.5 }}>
          Les paiements sont traites automatiquement. Renseignez votre IBAN pour recevoir vos virements.
        </p>
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          IBAN
        </label>
        <input
          value={proData.iban}
          onChange={(e) => setProData({ ...proData, iban: e.target.value })}
          style={inputStyle}
          placeholder="CH56 0483 5012 3456 7800 9"
        />
      </div>
      <div style={{
        background: 'var(--d1)',
        borderRadius: 14,
        padding: '14px 16px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', margin: '0 0 8px' }}>
          Abonnement Pro
        </p>
        <p style={{ fontSize: 12, color: 'var(--t3)', margin: '0 0 14px', lineHeight: 1.5 }}>
          7 jours gratuits, puis 29 CHF/mois. Annulez a tout moment.
        </p>
        {onActivate && (
          <button
            onClick={onActivate}
            style={{
              background: '#F2D06B',
              color: '#050507',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Lancer mon service
          </button>
        )}
      </div>
    </div>
  );
}

function ServicesTab({ proData, setProData }: TabProps) {
  const addService = () => {
    setProData({
      ...proData,
      services: [
        ...proData.services,
        { nom: '', prix: 0, duree: 30, badge: null },
      ],
    });
  };

  return (
    <div>
      {proData.services.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: 'var(--t3)',
          fontSize: 13,
        }}>
          <p style={{ marginBottom: 16 }}>Aucun service pour l instant.</p>
          <button
            onClick={addService}
            style={{
              background: 'var(--d3)',
              border: '1px dashed rgba(242,208,107,0.3)',
              borderRadius: 12,
              padding: '12px 24px',
              color: '#F2D06B',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            + Ajouter un service
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {proData.services.map((service, i) => (
            <div key={i} style={{
              background: 'var(--d1)',
              borderRadius: 14,
              padding: '14px 16px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <input
                value={service.nom}
                onChange={(e) => {
                  const s = [...proData.services];
                  s[i] = { ...s[i], nom: e.target.value };
                  setProData({ ...proData, services: s });
                }}
                style={{ ...inputStyle, marginBottom: 8 }}
                placeholder="Nom du service"
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  value={service.prix}
                  onChange={(e) => {
                    const s = [...proData.services];
                    s[i] = { ...s[i], prix: Number(e.target.value) };
                    setProData({ ...proData, services: s });
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Prix CHF"
                />
                <input
                  type="number"
                  value={service.duree}
                  onChange={(e) => {
                    const s = [...proData.services];
                    s[i] = { ...s[i], duree: Number(e.target.value) };
                    setProData({ ...proData, services: s });
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Duree min"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addService}
            style={{
              background: 'transparent',
              border: '1px dashed rgba(242,208,107,0.3)',
              borderRadius: 12,
              padding: '12px',
              color: '#F2D06B',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            + Ajouter un service
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'var(--d2)',
  color: 'var(--t1)',
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};
