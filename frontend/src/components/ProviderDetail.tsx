import React from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconStar } from './icons/Icons';

export default function ProviderDetail() {
  const { selectedPro, navigateTo } = useAppContext();

  if (!selectedPro) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => navigateTo('explorer')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Retour
        </button>
      </div>
    );
  }

  const pro = selectedPro;
  // Use new field names from utils/demoData DemoPro type
  const services = pro.services ?? [
    { nom: 'Coupe homme', prix: pro.startingPrice, duree: 30, badge: undefined as string | undefined },
  ];

  const stats = [
    { label: 'Note', value: pro.note.toFixed(1) },
    { label: 'Avis', value: String(pro.avis) },
    { label: 'Des', value: `${pro.startingPrice} CHF` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingBottom: '100px' }}>
      {/* Cover */}
      <div style={{ height: '220px', background: pro.gradient, position: 'relative' }}>
        <button
          onClick={() => navigateTo('explorer')}
          style={{ position: 'absolute', top: '16px', left: '16px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <IconArrowLeft size={18} color="var(--t1)" />
        </button>
        <div style={{ position: 'absolute', bottom: '-28px', left: '20px', width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '3px solid var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--t1)' }}>{pro.initials}</span>
        </div>
      </div>

      <div style={{ padding: '44px 20px 0' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          {pro.prenom} {pro.nom}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t3)', marginBottom: '20px' }}>
          {pro.categorie} · {pro.ville}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0', background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          {stats.map((stat, i, arr) => (
            <div key={stat.label} style={{ flex: 1, padding: '14px 8px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--edge1)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                {stat.label === 'Note' && <IconStar size={12} color="var(--gold)" />}
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: stat.label === 'Note' ? 'var(--gold)' : 'var(--t1)' }}>{stat.value}</div>
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '9px', color: 'var(--t4)', letterSpacing: '0.08em' }}>{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        {pro.bio && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', lineHeight: 1.6, marginBottom: '28px' }}>
            {pro.bio}
          </p>
        )}

        {/* Services */}
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--t1)', marginBottom: '16px' }}>
          Services
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map((service, i) => (
            <div key={i} style={{ background: 'var(--d2)', border: '1px solid var(--edge1)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: 'var(--t1)' }}>{service.nom}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--gold)' }}>{service.prix} CHF</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', padding: '16px 20px', background: 'rgba(5,5,7,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--edge1)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => navigateTo('bookingFlow')}
          style={{ width: '100%', height: '56px', background: 'var(--gold)', color: '#050507', border: 'none', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '15px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,208,107,0.25)' }}
        >
          Reserver maintenant
        </button>
      </div>
    </div>
  );
}
