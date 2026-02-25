import React, { useState, useRef } from 'react';
import { useProContext } from '../context/ProContext';
import { IconCamera, IconX, IconCheck } from './icons/Icons';
import SubscriptionSuccess from './SubscriptionSuccess';

interface BusinessScreenProps {
  onActivationSuccess: () => void;
}

const SUB_TABS = [
  { id: 'identite', label: 'Identite' },
  { id: 'paiement', label: 'Paiement' },
  { id: 'services', label: 'Services' },
  { id: 'galerie', label: 'Galerie' },
];

const SERVICE_PRESETS: Record<string, string[]> = {
  barber: ['Coupe homme', 'Degrade premium', 'Coupe + Barbe', 'Barbe design', 'Rasage traditionnel'],
  coiffure: ['Coupe femme', 'Couleur', 'Meches', 'Brushing'],
  esthetique: ['Soin visage', 'Manucure', 'Pedicure', 'Pose gel'],
  massage: ['Massage relaxant', 'Massage sportif', 'Massage duo'],
};

export default function BusinessScreen({ onActivationSuccess }: BusinessScreenProps) {
  const [activeSubTab, setActiveSubTab] = useState('identite');
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { proData, setProData, proActif } = useProContext();

  const fileInputRef0 = useRef<HTMLInputElement>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);
  const fileInputRefs = [fileInputRef0, fileInputRef1, fileInputRef2, fileInputRef3];

  const photos = proData.photos || [];

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

  const canActivate = photos.filter(Boolean).length >= 3;

  if (showSubscriptionSuccess) {
    return (
      <SubscriptionSuccess
        onSuccessComplete={() => {
          setShowSubscriptionSuccess(false);
          onActivationSuccess();
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100%', background: 'var(--void)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0' }}>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--t1)',
          display: 'block',
          marginBottom: 20,
        }}>
          Mon Business
        </span>

        {/* Sub-tab bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'var(--d2)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}>
          {SUB_TABS.map(({ id, label }) => {
            const isActive = activeSubTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSubTab(id)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--gold)' : 'transparent',
                  color: isActive ? '#050507' : 'var(--t4)',
                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab content */}
      <div style={{ padding: '0 20px' }}>
        {activeSubTab === 'identite' && (
          <IdentiteTab proData={proData} setProData={setProData} />
        )}
        {activeSubTab === 'paiement' && (
          <PaiementTab proData={proData} setProData={setProData} />
        )}
        {activeSubTab === 'services' && (
          <ServicesTab proData={proData} setProData={setProData} />
        )}
        {activeSubTab === 'galerie' && (
          <GalerieTab
            photos={photos}
            proData={proData}
            setProData={setProData}
            fileInputRefs={fileInputRefs}
            handleSlotClick={handleSlotClick}
            handleFileChange={handleFileChange}
            canActivate={canActivate}
            proActif={proActif}
            onActivate={() => setShowSubscriptionModal(true)}
          />
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onConfirm={() => {
            setShowSubscriptionModal(false);
            setShowSubscriptionSuccess(true);
          }}
        />
      )}
    </div>
  );
}

// ─── Identite Tab ────────────────────────────────────────────────────────────

function IdentiteTab({ proData, setProData }: { proData: any; setProData: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FieldGroup label="Prenom">
        <input
          value={proData.prenom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProData({ ...proData, prenom: e.target.value })}
          style={inputStyle}
          placeholder="Votre prenom"
        />
      </FieldGroup>
      <FieldGroup label="Ville">
        <input
          value={proData.ville}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProData({ ...proData, ville: e.target.value })}
          style={inputStyle}
          placeholder="Votre ville"
        />
      </FieldGroup>
      <FieldGroup label="Categorie">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'barber', label: 'Barber' },
            { id: 'coiffure', label: 'Coiffure' },
            { id: 'esthetique', label: 'Esthetique' },
            { id: 'massage', label: 'Massage' },
          ].map(({ id, label }) => {
            const isSelected = proData.categorie === id;
            return (
              <button
                key={id}
                onClick={() => setProData({ ...proData, categorie: id })}
                style={{
                  padding: '12px',
                  borderRadius: 12,
                  border: isSelected ? '1.5px solid var(--gold)' : '1.5px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(242,208,107,0.1)' : 'var(--d2)',
                  color: isSelected ? 'var(--gold)' : 'var(--t3)',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FieldGroup>
      <FieldGroup label="Slogan">
        <input
          value={proData.slogan}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProData({ ...proData, slogan: e.target.value })}
          style={inputStyle}
          placeholder="Votre slogan"
        />
      </FieldGroup>
      <FieldGroup label="Bio">
        <textarea
          value={proData.bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProData({ ...proData, bio: e.target.value })}
          style={{ ...inputStyle, height: 100, resize: 'none' } as React.CSSProperties}
          placeholder="Decrivez votre activite..."
        />
      </FieldGroup>
    </div>
  );
}

// ─── Paiement Tab ────────────────────────────────────────────────────────────

function PaiementTab({ proData, setProData }: { proData: any; setProData: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'var(--d2)',
        borderRadius: 16,
        padding: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 13,
          color: 'var(--t4)',
          lineHeight: 1.5,
          display: 'block',
        }}>
          Renseignez votre IBAN pour recevoir vos paiements directement sur votre compte bancaire.
        </span>
      </div>
      <FieldGroup label="IBAN">
        <input
          value={proData.iban}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProData({ ...proData, iban: e.target.value })}
          style={inputStyle}
          placeholder="CH00 0000 0000 0000 0000 0"
        />
      </FieldGroup>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        background: 'rgba(242,208,107,0.06)',
        borderRadius: 12,
        border: '1px solid rgba(242,208,107,0.15)',
      }}>
        <IconCheck size={14} color="var(--gold)" />
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          color: 'var(--t4)',
        }}>
          IBAN optionnel en mode demo. Requis pour les paiements en production.
        </span>
      </div>
    </div>
  );
}

// ─── Services Tab ────────────────────────────────────────────────────────────

function ServicesTab({ proData, setProData }: { proData: any; setProData: any }) {
  const presets = SERVICE_PRESETS[proData.categorie] || SERVICE_PRESETS['barber'];
  const services: string[] = proData.services || [];

  const toggleService = (name: string) => {
    const current = [...services];
    const idx = current.indexOf(name);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(name);
    }
    setProData({ ...proData, services: current });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{
        fontFamily: 'Inter',
        fontSize: 13,
        color: 'var(--t4)',
        marginBottom: 4,
      }}>
        Selectionnez vos services ({proData.categorie})
      </span>
      {presets.map((name) => {
        const isActive = services.includes(name);
        return (
          <button
            key={name}
            onClick={() => toggleService(name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 12,
              border: isActive ? '1.5px solid var(--gold)' : '1.5px solid rgba(255,255,255,0.08)',
              background: isActive ? 'rgba(242,208,107,0.08)' : 'var(--d2)',
              cursor: 'pointer',
            }}
          >
            <span style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: isActive ? 'var(--gold)' : 'var(--t2)',
              fontWeight: isActive ? 600 : 400,
            }}>
              {name}
            </span>
            {isActive && <IconCheck size={16} color="var(--gold)" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Galerie Tab ─────────────────────────────────────────────────────────────

interface GalerieTabProps {
  photos: (string | null)[];
  proData: any;
  setProData: any;
  fileInputRefs: React.RefObject<HTMLInputElement | null>[];
  handleSlotClick: (i: number) => void;
  handleFileChange: (i: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  canActivate: boolean;
  proActif: boolean;
  onActivate: () => void;
}

function GalerieTab({
  photos,
  proData,
  setProData,
  fileInputRefs,
  handleSlotClick,
  handleFileChange,
  canActivate,
  proActif,
  onActivate,
}: GalerieTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{
        fontFamily: 'Inter',
        fontSize: 13,
        color: 'var(--t4)',
      }}>
        Ajoutez au moins 3 photos pour activer votre profil.
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            onClick={() => handleSlotClick(i)}
            style={{
              width: '100%',
              height: 160,
              borderRadius: 16,
              overflow: 'hidden',
              border: photos[i]
                ? 'none'
                : '2px dashed rgba(242,208,107,0.3)',
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
                  <IconX size={12} color="var(--t1)" />
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
                <IconCamera color="var(--t4)" size={24} />
                <span style={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: 13,
                  color: 'var(--t4)',
                }}>
                  Ajouter
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: 'var(--d2)',
        borderRadius: 10,
      }}>
        <div style={{
          flex: 1,
          height: 4,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min((photos.filter(Boolean).length / 3) * 100, 100)}%`,
            background: 'var(--gold)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          color: 'var(--t4)',
          whiteSpace: 'nowrap',
        }}>
          {photos.filter(Boolean).length}/3 min
        </span>
      </div>

      {/* Activate button */}
      {canActivate && !proActif && (
        <button
          onClick={onActivate}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            border: 'none',
            background: '#F2D06B',
            color: '#050507',
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Activer mon profil
        </button>
      )}

      {proActif && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 16px',
          background: 'rgba(242,208,107,0.1)',
          borderRadius: 14,
          border: '1px solid rgba(242,208,107,0.3)',
        }}>
          <IconCheck size={16} color="var(--gold)" />
          <span style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--gold)',
          }}>
            Profil actif
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Subscription Modal ───────────────────────────────────────────────────────

function SubscriptionModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const benefits = [
    'Profil visible dans l\'Explorer',
    'Reservations en temps reel',
    'Paiements securises',
    'Support prioritaire',
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5,5,7,0.85)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 1000,
    }}>
      <div style={{
        width: '100%',
        background: 'var(--d2)',
        borderRadius: '24px 24px 0 0',
        padding: '32px 24px 40px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: 40,
          height: 4,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
          margin: '0 auto 28px',
        }} />

        <span style={{
          fontFamily: 'Inter',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--t1)',
          display: 'block',
          marginBottom: 8,
        }}>
          Essai gratuit 7 jours
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          color: 'var(--t4)',
          display: 'block',
          marginBottom: 28,
          lineHeight: 1.5,
        }}>
          Activez votre profil et recevez vos premieres reservations. Sans engagement, annulable a tout moment.
        </span>

        {benefits.map((benefit) => (
          <div key={benefit} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14,
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(242,208,107,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconCheck size={11} color="var(--gold)" />
            </div>
            <span style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: 'var(--t2)',
            }}>
              {benefit}
            </span>
          </div>
        ))}

        <button
          onClick={onConfirm}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            border: 'none',
            background: '#F2D06B',
            color: '#050507',
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 20,
          }}
        >
          Commencer l'essai gratuit
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: 'none',
            background: 'transparent',
            color: 'var(--t4)',
            fontFamily: 'Inter',
            fontSize: 14,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={{
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--t4)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 8,
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1.5px solid rgba(255,255,255,0.08)',
  background: 'var(--d2)',
  color: 'var(--t1)',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};
