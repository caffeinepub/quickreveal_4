import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import { IconArrowLeft, IconStar } from './icons/Icons';

export default function ProFiche() {
  const { selectedPro, navigateTo, navigateToBookingFlow } = useAppContext();
  const [activeTab, setActiveTab] = useState<'services' | 'galerie' | 'avis'>('services');

  if (!selectedPro) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#050507',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => navigateTo('explorerV2')}
          style={{
            color: '#F2D06B',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Retour à l'Explorer
        </button>
      </div>
    );
  }

  const pro = selectedPro as any;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#050507',
        overflow: 'hidden',
      }}
    >
      {/* SCROLLABLE CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          style={{
            minHeight: '100%',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
          }}
        >
          {/* Cover */}
          <div style={{ position: 'relative', height: 220 }}>
            {pro.coverUrl ? (
              <img
                src={pro.coverUrl}
                alt={pro.nom}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(5,5,7,0.3) 0%, rgba(5,5,7,0.7) 100%)',
              }}
            />
            <button
              onClick={() => navigateTo('explorerV2')}
              style={{
                position: 'absolute',
                top: 'calc(16px + env(safe-area-inset-top, 0px))',
                left: 16,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(5,5,7,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconArrowLeft size={18} color="#fff" />
            </button>
            {pro.flashActif && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(16px + env(safe-area-inset-top, 0px))',
                  right: 16,
                  background: '#F2D06B',
                  color: '#050507',
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'Inter, sans-serif',
                  padding: '4px 10px',
                  borderRadius: 8,
                }}
              >
                ⚡ FLASH
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '20px 20px 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 800,
                    fontFamily: 'Inter, sans-serif',
                    margin: '0 0 4px',
                  }}
                >
                  {pro.nom}
                </h1>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                    margin: 0,
                  }}
                >
                  {pro.categorie} · {pro.ville}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    color: '#F2D06B',
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    margin: '0 0 2px',
                  }}
                >
                  dès {pro.prixDepuis} CHF
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconStar size={12} color="#F2D06B" />
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 12,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {pro.note} ({pro.nbAvis} avis)
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Avis', value: pro.nbAvis },
                {
                  label: 'Prestations',
                  value: pro.nbPrestations || (pro.services?.length ?? 0),
                },
                { label: 'Réponse', value: `${pro.reponseMins || 15}min` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p
                    style={{
                      color: '#F2D06B',
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      margin: '0 0 2px',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 11,
                      fontFamily: 'Inter, sans-serif',
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 20,
              }}
            >
              {(['services', 'galerie', 'avis'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom:
                      activeTab === tab ? '2px solid #F2D06B' : '2px solid transparent',
                    color: activeTab === tab ? '#F2D06B' : 'rgba(255,255,255,0.4)',
                    fontSize: 13,
                    fontWeight: activeTab === tab ? 700 : 400,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'services' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(pro.services || []).map((service: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                          margin: '0 0 2px',
                        }}
                      >
                        {service.nom}
                      </p>
                      <p
                        style={{
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: 12,
                          fontFamily: 'Inter, sans-serif',
                          margin: 0,
                        }}
                      >
                        {service.duree} min
                      </p>
                    </div>
                    <p
                      style={{
                        color: '#F2D06B',
                        fontSize: 15,
                        fontWeight: 700,
                        fontFamily: 'Inter, sans-serif',
                        margin: 0,
                      }}
                    >
                      {service.prix} CHF
                    </p>
                  </div>
                ))}
                {(!pro.services || pro.services.length === 0) && (
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: 13,
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'center',
                      padding: '20px 0',
                    }}
                  >
                    Aucun service disponible
                  </p>
                )}
              </div>
            )}

            {activeTab === 'galerie' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 4,
                }}
              >
                {(pro.photos || []).slice(0, 9).map((photo: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <img
                      src={photo}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
                {(!pro.photos || pro.photos.length === 0) && (
                  <p
                    style={{
                      gridColumn: '1/-1',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: 13,
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'center',
                      padding: '20px 0',
                    }}
                  >
                    Aucune photo
                  </p>
                )}
              </div>
            )}

            {activeTab === 'avis' && (
              <div
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                  padding: '20px 0',
                }}
              >
                Aucun avis pour le moment
              </div>
            )}

            {/* Book CTA — inline, not fixed */}
            <button
              onClick={() => navigateToBookingFlow && navigateToBookingFlow()}
              style={{
                width: '100%',
                height: 54,
                background: '#F2D06B',
                color: '#050507',
                border: 'none',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                marginTop: 24,
                flexShrink: 0,
              }}
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV — NOT FIXED */}
      <BottomNav activeTab="explorerV2" />
    </div>
  );
}
