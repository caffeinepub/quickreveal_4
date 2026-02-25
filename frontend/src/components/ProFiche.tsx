import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconStar, IconFlash, IconClock } from './icons/Icons';

export default function ProFiche() {
  const { selectedPro, navigateTo } = useAppContext();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!selectedPro) {
    navigateTo('explorerV2');
    return null;
  }

  const pro = selectedPro;
  const services = pro.services ?? [];

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      paddingBottom: 100,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Cover image */}
      <div style={{
        position: 'relative',
        height: 270,
        overflow: 'hidden',
        background: pro.gradient || 'var(--d2)',
      }}>
        <img
          src={pro.coverUrl}
          alt={pro.prenom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Grain overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,7,0.98) 100%)',
        }} />

        {/* Back button */}
        <button
          onClick={() => navigateTo('explorerV2')}
          style={{
            position: 'absolute',
            top: 52,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(5,5,7,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <IconArrowLeft size={18} color="var(--t1)" />
        </button>

        {/* Flash badge */}
        {pro.flashActif && (
          <div style={{
            position: 'absolute',
            top: 52,
            right: 16,
            background: '#F2D06B',
            borderRadius: 10,
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 10,
          }}>
            <IconFlash size={12} color="#050507" />
            <span style={{
              fontFamily: 'Inter',
              fontWeight: 800,
              fontSize: 11,
              color: '#050507',
              letterSpacing: '0.5px',
            }}>
              FLASH
            </span>
          </div>
        )}

        {/* Pro info at bottom of cover */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 10,
        }}>
          <div style={{
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: 26,
            color: 'var(--t1)',
            letterSpacing: '-0.5px',
            marginBottom: 4,
          }}>
            {pro.prenom} {pro.nom}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconStar size={13} color="#F2D06B" />
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>
                {pro.note}
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                ({pro.nbAvis} avis)
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              {pro.categorie} · {pro.ville}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 24,
        }}>
          {[
            { label: 'Acceptation', value: pro.acceptation ? `${pro.acceptation}%` : '—' },
            { label: 'Prestations', value: pro.nbPrestations ? `${pro.nbPrestations}` : '—' },
            { label: 'Reponse', value: pro.reponseMins ? `${pro.reponseMins}min` : '—' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--d2)',
              borderRadius: 12,
              padding: '12px 8px',
              textAlign: 'center',
              border: '1px solid var(--d3)',
            }}>
              <div style={{
                fontFamily: 'Inter',
                fontWeight: 800,
                fontSize: 16,
                color: 'var(--t1)',
                marginBottom: 2,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: 'Inter',
                fontSize: 10,
                color: 'var(--t4)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Slogan */}
        {pro.slogan && (
          <div style={{
            fontFamily: 'Inter',
            fontStyle: 'italic',
            fontSize: 15,
            color: '#F2D06B',
            marginBottom: 16,
            lineHeight: 1.4,
          }}>
            "{pro.slogan}"
          </div>
        )}

        {/* Bio */}
        {pro.bio && (
          <div style={{
            fontFamily: 'Inter',
            fontSize: 14,
            color: 'var(--t3)',
            lineHeight: 1.6,
            marginBottom: 28,
          }}>
            {pro.bio}
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <>
            <div style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--t3)',
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              marginBottom: 14,
            }}>
              Services
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  style={{
                    background: selectedService === service.id ? 'rgba(242,208,107,0.06)' : 'var(--d2)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: selectedService === service.id
                      ? '1px solid rgba(242,208,107,0.3)'
                      : '1px solid var(--d3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Service image */}
                  {service.imageUrl && (
                    <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={service.imageUrl}
                        alt={service.nom}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) parent.style.display = 'none';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,7,0.7) 100%)',
                      }} />
                    </div>
                  )}

                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: 'var(--t1)', marginBottom: 2 }}>
                          {service.nom}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <IconClock size={11} color="var(--t4)" />
                          <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--t4)' }}>
                            {service.duree} min
                          </span>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 16, color: '#F2D06B' }}>
                        {service.prix} CHF
                      </div>
                    </div>

                    {selectedService === service.id && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 12 }}>
                          {service.description}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('bookingFlow');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: '#F2D06B',
                            border: 'none',
                            borderRadius: 12,
                            color: '#050507',
                            fontFamily: 'Inter',
                            fontWeight: 800,
                            fontSize: 14,
                            cursor: 'pointer',
                          }}
                        >
                          Reserver ce service
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '16px 20px 32px',
        background: 'linear-gradient(180deg, transparent 0%, var(--void) 40%)',
        zIndex: 50,
      }}>
        <button
          onClick={() => navigateTo('bookingFlow')}
          style={{
            width: '100%',
            padding: '18px',
            background: '#F2D06B',
            border: 'none',
            borderRadius: 16,
            color: '#050507',
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            letterSpacing: '0.3px',
          }}
        >
          Reserver · des {pro.prixDepuis} CHF
        </button>
      </div>
    </div>
  );
}
