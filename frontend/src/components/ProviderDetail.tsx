import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconStar, IconClock } from './icons/Icons';

export default function ProviderDetail() {
  const { selectedPro, navigateTo } = useAppContext();
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number | null>(null);

  if (!selectedPro) {
    navigateTo('explorerV2');
    return null;
  }

  const pro = selectedPro;
  const services = pro.services ?? [
    { id: 'fallback', nom: 'Coupe homme', prix: pro.prixDepuis, duree: 30, description: '', badge: null as string | null },
  ];

  const stats = [
    { label: 'Note', value: String(pro.note) },
    { label: 'Avis', value: String(pro.nbAvis) },
    { label: 'Des', value: `${pro.prixDepuis} CHF` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingBottom: 100, fontFamily: 'Inter, sans-serif' }}>
      {/* Cover */}
      <div style={{ height: 240, background: pro.gradient, position: 'relative', overflow: 'hidden' }}>
        {pro.coverUrl && (
          <img
            src={pro.coverUrl}
            alt={pro.prenom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,7,0.9) 100%)' }} />
        <button
          onClick={() => navigateTo('explorerV2')}
          style={{ position: 'absolute', top: 52, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(5,5,7,0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
        >
          <IconArrowLeft size={18} color="var(--t1)" />
        </button>
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, zIndex: 10 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
            {pro.prenom} {pro.nom}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconStar size={12} color="#F2D06B" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{pro.note}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>({pro.nbAvis} avis)</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{pro.categorie} · {pro.ville}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ background: 'var(--d2)', borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'var(--t4)', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        {pro.bio && (
          <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>{pro.bio}</p>
        )}

        {/* Services */}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 14 }}>
          Services
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.map((service, i) => (
            <div
              key={service.id}
              onClick={() => setSelectedServiceIdx(selectedServiceIdx === i ? null : i)}
              style={{
                background: selectedServiceIdx === i ? 'rgba(242,208,107,0.06)' : 'var(--d2)',
                borderRadius: 14,
                padding: '14px 16px',
                border: selectedServiceIdx === i ? '1px solid rgba(242,208,107,0.3)' : '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{service.nom}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconClock size={11} color="var(--t4)" />
                    <span style={{ fontSize: 12, color: 'var(--t4)' }}>{service.duree} min</span>
                  </div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#F2D06B' }}>{service.prix} CHF</span>
              </div>
              {selectedServiceIdx === i && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 12 }}>{service.description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateTo('bookingFlow'); }}
                    style={{ width: '100%', padding: '12px', background: '#F2D06B', border: 'none', borderRadius: 12, color: '#050507', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Reserver ce service
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '16px 20px 32px', background: 'linear-gradient(180deg, transparent 0%, var(--void) 40%)', zIndex: 50 }}>
        <button
          onClick={() => navigateTo('bookingFlow')}
          style={{ width: '100%', padding: '18px', background: '#F2D06B', border: 'none', borderRadius: 16, color: '#050507', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          Reserver · des {pro.prixDepuis} CHF
        </button>
      </div>
    </div>
  );
}
