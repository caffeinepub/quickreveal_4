import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DemoPro } from '../data/mockData';

interface LocalService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const CATEGORIES = ['Barber', 'Coiffure', 'Esthetique', 'Massage', 'Nail Art', 'Maquillage'];
const SWISS_CITIES = [
  'Lausanne', 'Geneve', 'Fribourg', 'Neuchatel', 'Sion', 'Bienne',
  'Yverdon', 'Montreux', 'Vevey', 'Morges', 'Nyon', 'La Chaux-de-Fonds',
];

export default function Builder() {
  const { navigateTo, setProProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<LocalService[]>([
    { id: '1', name: '', price: 0, duration: 30 },
  ]);

  const handleFinish = () => {
    // Map LocalService to DemoService format — use undefined instead of null for badge
    const mappedServices = services.map(s => ({
      nom: s.name,
      prix: s.price,
      duree: s.duration,
      badge: undefined as string | undefined,
    }));

    const proData: DemoPro = {
      id: `builder-${Date.now()}`,
      prenom: brandName,
      nom: '',
      initials: brandName.slice(0, 2).toUpperCase(),
      gradient: 'linear-gradient(135deg, #0A0614, #180B2E)',
      coverGradient: 'linear-gradient(135deg, #0A0614, #180B2E)',
      coverUrl: '',
      categorie: category.toLowerCase() || 'barber',
      ville: city,
      note: 5.0,
      avis: 0,
      slogan: '',
      bio,
      flashActif: false,
      isFlash: false,
      hasRevolut: false,
      revolutHandle: '',
      responseTime: '—',
      acceptanceRate: 100,
      serviceCount: mappedServices.length,
      startingPrice: services[0]?.price ?? 0,
      flashResponseTime: '—',
      services: mappedServices,
      reviews: [],
      galleryGradients: [],
    };

    setProProfile(proData);
    navigateTo('nexusOS');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '52px',
    background: 'var(--d3)', border: '1px solid var(--d4)',
    borderRadius: '12px', padding: '0 16px',
    fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px',
    color: 'var(--t1)', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'Inter, sans-serif',
    fontWeight: 600, fontSize: '12px', color: 'var(--t3)',
    letterSpacing: '0.1em', marginBottom: '8px',
  };

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '24px 20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px', color: 'var(--t1)' }}>
          Creer mon profil
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'var(--t3)', marginTop: '4px' }}>
          Etape {step} sur 3
        </div>
        {/* Progress */}
        <div style={{ height: '3px', background: 'var(--d4)', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--gold)', width: `${(step / 3) * 100}%`, transition: 'width 300ms ease', borderRadius: '999px' }} />
        </div>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>NOM DE MARQUE</label>
            <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Ex: Studio Julien" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>CATEGORIE</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    height: '48px',
                    background: category === cat ? 'var(--gold-bg)' : 'var(--d3)',
                    border: `1px solid ${category === cat ? 'var(--gold-edge)' : 'var(--d4)'}`,
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif', fontWeight: category === cat ? 600 : 400,
                    fontSize: '13px', color: category === cat ? 'var(--gold)' : 'var(--t3)',
                    cursor: 'pointer', transition: 'all 200ms',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>VILLE</label>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option value="">Choisir une ville</option>
              {SWISS_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!brandName || !category || !city}
            style={{
              height: '56px', background: brandName && category && city ? '#F2D06B' : 'var(--d4)',
              color: brandName && category && city ? '#050507' : 'var(--t4)',
              border: 'none', borderRadius: '14px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
              cursor: brandName && category && city ? 'pointer' : 'not-allowed',
              marginTop: '8px',
            }}
          >
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>BIO</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Decrivez votre activite..."
              style={{ ...inputStyle, height: '120px', padding: '12px 16px', resize: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, height: '52px', background: 'var(--d3)', border: '1px solid var(--edge1)', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--t2)', cursor: 'pointer' }}>
              Retour
            </button>
            <button onClick={() => setStep(3)} style={{ flex: 2, height: '52px', background: '#F2D06B', color: '#050507', border: 'none', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Continuer
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--t2)', marginBottom: '4px' }}>
            Vos services
          </div>
          {services.map((service, i) => (
            <div key={service.id} style={{ background: 'var(--d3)', border: '1px solid var(--edge1)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                value={service.name}
                onChange={e => setServices(prev => prev.map((s, idx) => idx === i ? { ...s, name: e.target.value } : s))}
                placeholder="Nom du service"
                style={{ ...inputStyle, height: '44px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  value={service.price || ''}
                  onChange={e => setServices(prev => prev.map((s, idx) => idx === i ? { ...s, price: Number(e.target.value) } : s))}
                  placeholder="Prix CHF"
                  style={{ ...inputStyle, height: '44px', flex: 1 }}
                />
                <input
                  type="number"
                  value={service.duration || ''}
                  onChange={e => setServices(prev => prev.map((s, idx) => idx === i ? { ...s, duration: Number(e.target.value) } : s))}
                  placeholder="Duree min"
                  style={{ ...inputStyle, height: '44px', flex: 1 }}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setServices(prev => [...prev, { id: String(Date.now()), name: '', price: 0, duration: 30 }])}
            style={{ height: '44px', background: 'var(--d3)', border: '1px dashed var(--edge2)', borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: 'var(--t3)', cursor: 'pointer' }}
          >
            + Ajouter un service
          </button>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, height: '52px', background: 'var(--d3)', border: '1px solid var(--edge1)', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--t2)', cursor: 'pointer' }}>
              Retour
            </button>
            <button onClick={handleFinish} style={{ flex: 2, height: '52px', background: '#F2D06B', color: '#050507', border: 'none', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Terminer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
