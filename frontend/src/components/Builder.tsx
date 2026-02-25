import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface LocalService {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const CATEGORIES = ['Coiffure', 'Esthétique', 'Massage', 'Barbier', 'Ongles', 'Maquillage'];
const CITIES = ['Genève', 'Lausanne', 'Berne', 'Zurich', 'Bâle', 'Fribourg', 'Neuchâtel', 'Sion'];

export default function Builder() {
  const { navigateTo, setProProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState<LocalService[]>([
    { id: '1', name: 'Service principal', duration: 60, price: 80 },
  ]);

  const handleComplete = () => {
    setProProfile({
      id: `pro-${Date.now()}`,
      name: brandName,
      category,
      city,
      rating: 5.0,
      reviewCount: 0,
      startingPrice: services[0]?.price || 50,
      isFlash: false,
      flashActive: false,
      bio,
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        price: s.price,
      })),
    });
    navigateTo('nexusOS');
  };

  const addService = () => {
    setServices(prev => [...prev, {
      id: Date.now().toString(),
      name: 'Nouveau service',
      duration: 30,
      price: 50,
    }]);
  };

  const updateService = (id: string, field: keyof LocalService, value: string | number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
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
  };

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

  return (
    <div style={{ minHeight: '100vh', background: '#050507', padding: '48px 24px 40px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#F4F4F8', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
          Créez votre profil
        </div>
        <div style={{ fontSize: '13px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
          Étape {step}/3
        </div>
        <div style={{ height: '3px', background: '#1C1C26', borderRadius: '2px', marginTop: '12px' }}>
          <div style={{ height: '100%', width: `${(step / 3) * 100}%`, background: '#F2D06B', borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nom de marque</label>
              <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Ex: Studio Lumière" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#F2D06B'; }} onBlur={e => { e.target.style.borderColor = '#1E1E26'; }} />
            </div>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '10px', background: category === cat ? 'rgba(242,208,107,0.08)' : '#0D0D13', border: `1px solid ${category === cat ? '#F2D06B' : '#1E1E26'}`, borderRadius: '10px', color: category === cat ? '#F2D06B' : '#54546C', fontSize: '13px', fontWeight: category === cat ? 600 : 400, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Ville</label>
              <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Choisir une ville</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Décrivez votre activité..." rows={5} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'none' }} onFocus={e => { e.target.style.borderColor = '#F2D06B'; }} onBlur={e => { e.target.style.borderColor = '#1E1E26'; }} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#54546C', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
              Vos services
            </div>
            {services.map(svc => (
              <div key={svc.id} style={{ background: '#0D0D13', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                <input value={svc.name} onChange={e => updateService(svc.id, 'name', e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} onFocus={e => { e.target.style.borderColor = '#F2D06B'; }} onBlur={e => { e.target.style.borderColor = '#1E1E26'; }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" value={svc.price} onChange={e => updateService(svc.id, 'price', Number(e.target.value))} placeholder="Prix CHF" style={{ ...inputStyle, flex: 1 }} onFocus={e => { e.target.style.borderColor = '#F2D06B'; }} onBlur={e => { e.target.style.borderColor = '#1E1E26'; }} />
                  <input type="number" value={svc.duration} onChange={e => updateService(svc.id, 'duration', Number(e.target.value))} placeholder="Durée min" style={{ ...inputStyle, flex: 1 }} onFocus={e => { e.target.style.borderColor = '#F2D06B'; }} onBlur={e => { e.target.style.borderColor = '#1E1E26'; }} />
                </div>
              </div>
            ))}
            <button onClick={addService} style={{ width: '100%', height: '44px', background: 'none', border: '1px dashed #2E2E3E', borderRadius: '12px', color: '#54546C', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              + Ajouter un service
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, height: '52px', background: '#0D0D13', border: '1px solid #1E1E26', borderRadius: '14px', color: '#54546C', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Retour
          </button>
        )}
        <button
          onClick={() => step < 3 ? setStep(s => s + 1) : handleComplete()}
          style={{ flex: 2, height: '52px', background: '#F2D06B', border: 'none', borderRadius: '14px', color: '#050507', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          {step === 3 ? 'Terminer' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}
