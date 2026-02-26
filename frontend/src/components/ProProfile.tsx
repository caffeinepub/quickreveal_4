import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconStar, IconClock, IconFlash } from './icons/Icons';

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function ProProfile() {
  const { selectedPro, navigateTo } = useAppContext();
  const [animStart, setAnimStart] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimStart(true), 200);
    return () => clearTimeout(t);
  }, []);

  // All hooks must be called before any early return
  const noteVal = useCountUp(selectedPro ? Math.round(selectedPro.note * 10) : 0, 800, animStart);
  const avisVal = useCountUp(selectedPro?.nbAvis ?? 0, 800, animStart);

  if (!selectedPro) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--void)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => navigateTo('explorerV2')}
          style={{ color: '#F2D06B', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Retour
        </button>
      </div>
    );
  }

  const pro = selectedPro;
  const services = pro.services ?? [
    { id: 'fallback', nom: 'Service', prix: pro.prixDepuis, duree: 30, description: '', badge: null as string | null },
  ];

  // Derive initials from prenom + nom
  const initials = `${pro.prenom.charAt(0)}${pro.nom.charAt(0)}`.toUpperCase();

  // Fallback gradient (pro.gradient may not exist on all DemoPro objects)
  const coverBackground = (pro as { gradient?: string }).gradient
    ?? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--void)',
        paddingBottom: '100px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Cover */}
      <div style={{ height: '260px', background: coverBackground, position: 'relative', overflow: 'hidden' }}>
        {pro.coverUrl && (
          <img
            src={pro.coverUrl}
            alt={pro.prenom}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,7,0.85) 100%)',
          }}
        />
        <button
          onClick={() => navigateTo('explorerV2')}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <IconArrowLeft size={18} color="var(--t1)" />
        </button>
        {pro.flashActif && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#F2D06B',
              borderRadius: '999px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 2,
            }}
          >
            <IconFlash size={12} color="#050507" />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                color: '#050507',
              }}
            >
              FLASH
            </span>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '-28px',
            left: '20px',
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '3px solid var(--void)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '24px',
              color: 'var(--t1)',
            }}
          >
            {initials}
          </span>
        </div>
      </div>

      <div style={{ padding: '44px 20px 0' }}>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '24px',
            color: 'var(--t1)',
            letterSpacing: '-0.03em',
            marginBottom: '4px',
          }}
        >
          {pro.prenom} {pro.nom}
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--t3)',
            marginBottom: '20px',
          }}
        >
          {pro.categorie} · {pro.ville}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              background: 'var(--d2)',
              borderRadius: '14px',
              padding: '14px 10px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: 'var(--t1)',
              }}
            >
              {(noteVal / 10).toFixed(1)}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'var(--t4)',
                marginTop: '2px',
              }}
            >
              Note
            </div>
          </div>
          <div
            style={{
              background: 'var(--d2)',
              borderRadius: '14px',
              padding: '14px 10px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: 'var(--t1)',
              }}
            >
              {avisVal}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'var(--t4)',
                marginTop: '2px',
              }}
            >
              Avis
            </div>
          </div>
          <div
            style={{
              background: 'var(--d2)',
              borderRadius: '14px',
              padding: '14px 10px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: 'var(--t1)',
              }}
            >
              {pro.nbPrestations ?? 0}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'var(--t4)',
                marginTop: '2px',
              }}
            >
              Prestations
            </div>
          </div>
        </div>

        {/* Bio */}
        {pro.bio && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: 'var(--t3)',
              lineHeight: '1.6',
              marginBottom: '28px',
            }}
          >
            {pro.bio}
          </p>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--t3)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Services
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service, idx) => (
                <div
                  key={service.id ?? idx}
                  style={{
                    background: 'var(--d2)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--t1)',
                        marginBottom: '4px',
                      }}
                    >
                      {service.nom}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconClock size={11} color="var(--t4)" />
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          color: 'var(--t4)',
                        }}
                      >
                        {service.duree} min
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#F2D06B',
                    }}
                  >
                    {service.prix} CHF
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, var(--void) 40%)',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigateTo('bookingFlow')}
          style={{
            width: '100%',
            height: '56px',
            background: '#F2D06B',
            color: '#050507',
            border: 'none',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Reserver · des {pro.prixDepuis} CHF
        </button>
      </div>
    </div>
  );
}
