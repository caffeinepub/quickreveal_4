import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconStar, IconClock, IconFlash, IconCheck } from './icons/Icons';

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

export default function ProFiche() {
  const { selectedPro, setCurrentScreen } = useAppContext();
  const [animStart, setAnimStart] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimStart(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Use new field names from utils/demoData DemoPro type
  const note = useCountUp(selectedPro ? Math.round(selectedPro.note * 10) : 0, 800, animStart);
  const avis = useCountUp(selectedPro?.avis ?? 0, 800, animStart);
  // responseTime is a string like "2 min", extract numeric part for count-up
  const responseTimeNum = parseInt(selectedPro?.responseTime ?? '0', 10) || 0;
  const reponse = useCountUp(responseTimeNum, 800, animStart);
  const acceptation = useCountUp(selectedPro?.acceptanceRate ?? 0, 800, animStart);
  const prestations = useCountUp(selectedPro?.serviceCount ?? 0, 800, animStart);

  if (!selectedPro) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setCurrentScreen('explorerV2')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Retour a l'explorer
        </button>
      </div>
    );
  }

  const services = selectedPro.services ?? [
    { nom: 'Coupe homme', prix: selectedPro.startingPrice, duree: 30, badge: undefined },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingBottom: '100px' }}>
      {/* Cover */}
      <div style={{ height: '240px', background: selectedPro.gradient, position: 'relative', overflow: 'hidden' }}>
        <button
          onClick={() => setCurrentScreen('explorerV2')}
          style={{ position: 'absolute', top: '16px', left: '16px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <IconArrowLeft size={18} color="var(--t1)" />
        </button>
        {selectedPro.isFlash && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--alert)', borderRadius: '999px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconFlash size={12} color="#fff" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', color: '#fff', letterSpacing: '0.05em' }}>FLASH</span>
          </div>
        )}
        {/* Avatar */}
        <div style={{ position: 'absolute', bottom: '-28px', left: '20px', width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '3px solid var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--t1)' }}>{selectedPro.initials}</span>
        </div>
      </div>

      <div style={{ padding: '44px 20px 0' }}>
        {/* Name & info */}
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          {selectedPro.prenom} {selectedPro.nom}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)', marginBottom: '20px' }}>
          {selectedPro.categorie} · {selectedPro.ville}
        </p>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: '0', background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          {[
            { label: 'NOTE', value: (note / 10).toFixed(1), color: 'var(--gold)' },
            { label: 'AVIS', value: avis.toString(), color: 'var(--t1)' },
            { label: 'REPONSE', value: `${reponse}min`, color: 'var(--flash)' },
            { label: 'ACCEPT.', value: `${acceptation}%`, color: 'var(--t1)' },
            { label: 'PRESTA.', value: prestations.toString(), color: 'var(--t1)' },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{ flex: 1, padding: '14px 8px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--edge1)' : 'none' }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: stat.color, marginBottom: '2px' }}>{stat.value}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '9px', color: 'var(--t4)', letterSpacing: '0.08em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Slogan & bio */}
        {selectedPro.slogan && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 500, fontSize: '15px', color: 'var(--t2)', marginBottom: '12px' }}>
            "{selectedPro.slogan}"
          </p>
        )}
        {selectedPro.bio && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', lineHeight: 1.6, marginBottom: '28px' }}>
            {selectedPro.bio}
          </p>
        )}

        {/* Services */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--t1)', marginBottom: '16px' }}>
          Services
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map((service, i) => (
            <div
              key={i}
              style={{ background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t1)' }}>{service.nom}</span>
                  {service.badge && (
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: service.badge.toLowerCase() === 'populaire' ? 'rgba(242,208,107,0.12)' : 'rgba(0,217,122,0.12)',
                      color: service.badge.toLowerCase() === 'populaire' ? 'var(--gold)' : 'var(--flash)',
                      border: `1px solid ${service.badge.toLowerCase() === 'populaire' ? 'rgba(242,208,107,0.2)' : 'rgba(0,217,122,0.2)'}`,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {service.badge}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconClock size={12} color="var(--t4)" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: 'var(--t4)' }}>{service.duree} min</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '18px', color: 'var(--gold)' }}>{service.prix}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)' }}> CHF</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', padding: '16px 20px', background: 'rgba(5,5,7,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--edge1)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => setCurrentScreen('bookingFlow')}
          style={{ width: '100%', height: '56px', background: 'var(--gold)', color: '#050507', border: 'none', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '15px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,208,107,0.25)' }}
        >
          Reserver maintenant
        </button>
      </div>
    </div>
  );
}
