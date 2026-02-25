import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';
import ProSubscriptionModal from './ProSubscriptionModal';

const CATEGORIES = ['Coiffure', 'Esthétique', 'Massage', 'Barbier', 'Ongles', 'Maquillage', 'Nail Art', 'Autre'];

interface SubTabDef {
  id: string;
  label: string;
}

const SUBTABS: SubTabDef[] = [
  { id: 'identite', label: 'Identité' },
  { id: 'paiement', label: 'Paiement' },
  { id: 'services', label: 'Services' },
  { id: 'galerie', label: 'Galerie' },
];

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Coupe femme', price: 65, duration: 60, active: true },
  { id: '2', name: 'Coupe homme', price: 35, duration: 30, active: true },
  { id: '3', name: 'Coloration', price: 120, duration: 120, active: false },
  { id: '4', name: 'Brushing', price: 45, duration: 45, active: true },
];

export default function MonBusiness() {
  const { proActif, navigateTo } = useAppContext();
  const [activeTab, setActiveTab] = useState('identite');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const photoCount = photos.filter(Boolean).length;

  const handlePhotoClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target?.result as string;
      setPhotos(prev => {
        const next = [...prev];
        next[index] = dataURL;
        return next;
      });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const getTabStyle = (tabId: string): React.CSSProperties => ({
    flex: 1,
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tabId ? '#F2D06B' : 'transparent'}`,
    color: activeTab === tabId ? '#F2D06B' : '#54546C',
    fontSize: '13px',
    fontWeight: activeTab === tabId ? 700 : 400,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'color 0.15s, border-color 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingBottom: '80px' }}>
      <GlobalHeader />

      <div style={{ paddingTop: '72px' }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 0' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '4px',
          }}>
            Mon Business
          </h1>
          {proActif && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0,217,122,0.1)',
              border: '1px solid #00D97A',
              borderRadius: '20px',
              padding: '4px 12px',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#00D97A',
                fontFamily: 'Inter, sans-serif',
              }}>
                ESSAI GRATUIT · J1/7
              </span>
            </div>
          )}
        </div>

        {/* Sub tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #1E1E26',
          padding: '0 16px',
          marginBottom: '20px',
        }}>
          {SUBTABS.map(tab => (
            <button
              key={tab.id}
              style={getTabStyle(tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {/* Identité tab */}
          {activeTab === 'identite' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nom de marque</label>
                <input
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  placeholder="Ex: Studio Lumière"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Ex: Genève"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '10px',
                        background: category === cat ? 'rgba(242,208,107,0.08)' : '#0D0D13',
                        border: `1px solid ${category === cat ? '#F2D06B' : '#1E1E26'}`,
                        borderRadius: '10px',
                        color: category === cat ? '#F2D06B' : '#54546C',
                        fontSize: '13px',
                        fontWeight: category === cat ? 600 : 400,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Décrivez votre activité..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    height: 'auto',
                    padding: '12px 16px',
                    resize: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
                  onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
                />
              </div>
            </div>
          )}

          {/* Paiement tab */}
          {activeTab === 'paiement' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#0D0D13',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '20px',
              }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#F4F4F8',
                  marginBottom: '8px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Revolut Business
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#54546C',
                  marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Connectez votre compte Revolut pour recevoir vos paiements
                </div>
                <button style={{
                  width: '100%',
                  height: '44px',
                  background: '#F2D06B',
                  color: '#050507',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Connecter Revolut
                </button>
              </div>
            </div>
          )}

          {/* Services tab */}
          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map(service => (
                <div key={service.id} style={{
                  background: '#0D0D13',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#F4F4F8',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {service.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#54546C',
                      marginTop: '2px',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {service.duration}min · {service.price} CHF
                    </div>
                  </div>
                  <button
                    onClick={() => toggleService(service.id)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      background: service.active ? '#F2D06B' : '#1C1C26',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '3px',
                      left: service.active ? '23px' : '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: service.active ? '#050507' : '#54546C',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Galerie tab */}
          {activeTab === 'galerie' && (
            <div>
              {/* Counter + progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#54546C',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {photoCount}/4 photos
                  </span>
                  {photoCount >= 3 && (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#00D97A',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      Minimum atteint
                    </span>
                  )}
                </div>
                <div style={{
                  height: '3px',
                  background: '#1C1C26',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(photoCount / 4) * 100}%`,
                    background: '#F2D06B',
                    borderRadius: '2px',
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* 2x2 grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '24px',
              }}>
                {photos.map((photo, index) => (
                  <div key={index}>
                    <input
                      ref={el => { fileInputRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleFileChange(index, e)}
                    />
                    <div
                      onClick={() => !photo && handlePhotoClick(index)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: '#0D0D13',
                        border: `1px solid ${photo ? 'rgba(242,208,107,0.2)' : '#1E1E26'}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: photo ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {photo ? (
                        <>
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <button
                            onClick={e => handleRemovePhoto(index, e)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'rgba(5,5,7,0.8)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#F4F4F8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                            }}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                              <line x1="2" y1="2" x2="8" y2="8" />
                              <line x1="8" y1="2" x2="2" y2="8" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#2E2E3E',
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span style={{
                            fontSize: '11px',
                            color: '#2E2E3E',
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            Ajouter
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {!proActif && (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  style={{
                    width: '100%',
                    height: '56px',
                    background: '#F2D06B',
                    color: '#050507',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Activer mon profil
                </button>
              )}
            </div>
          )}
        </div>

        {/* Floating CTA if not on galerie tab */}
        {activeTab !== 'galerie' && !proActif && (
          <div style={{ padding: '24px 16px 0' }}>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              style={{
                width: '100%',
                height: '56px',
                background: '#F2D06B',
                color: '#050507',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Activer mon profil
            </button>
          </div>
        )}
      </div>

      <ProSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      <BottomNav activeTab="business" />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#54546C',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: 'Inter, sans-serif',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  background: '#0D0D13',
  border: '1px solid #1E1E26',
  borderRadius: '12px',
  padding: '0 16px',
  color: '#F4F4F8',
  fontSize: '15px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};
