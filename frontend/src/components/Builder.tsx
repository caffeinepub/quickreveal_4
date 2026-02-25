import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DemoPro, DemoService } from '../utils/demoData';

interface ServiceForm {
  nom: string;
  prix: string;
  duree: string;
  description: string;
}

export default function Builder() {
  const { navigateTo, setSelectedPro } = useAppContext();
  const [step, setStep] = useState(1);
  const [prenom, setPrenom] = useState('');
  const [ville, setVille] = useState('');
  const [categorie, setCategorie] = useState('barber');
  const [bio, setBio] = useState('');
  const [slogan, setSlogan] = useState('');
  const [services, setServices] = useState<ServiceForm[]>([{ nom: '', prix: '', duree: '30', description: '' }]);

  const addService = () => {
    setServices([...services, { nom: '', prix: '', duree: '30', description: '' }]);
  };

  const updateService = (index: number, field: keyof ServiceForm, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    const mappedServices: DemoService[] = services
      .filter(s => s.nom.trim())
      .map((s, i) => ({
        id: `custom-${i}`,
        nom: s.nom,
        prix: parseInt(s.prix) || 0,
        duree: parseInt(s.duree) || 30,
        description: s.description,
        badge: null,
      }));

    const newPro: DemoPro = {
      id: `custom-${Date.now()}`,
      prenom,
      nom: '',
      initials: prenom.slice(0, 2).toUpperCase(),
      categorie,
      ville,
      flashActif: false,
      note: 5.0,
      nbAvis: 0,
      prixDepuis: mappedServices[0]?.prix ?? 0,
      gradient: 'linear-gradient(135deg, #0A0614, #180B2E)',
      coverUrl: '',
      bio,
      slogan,
      services: mappedServices,
    };

    setSelectedPro(newPro as any);
    navigateTo('proFiche');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'var(--d2)',
    color: 'var(--t1)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 12,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', padding: '52px 20px 80px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>Creer mon profil</h1>
      <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 32 }}>Etape {step} sur 2</p>

      {step === 1 && (
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Prenom / Nom de marque
          </label>
          <input value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} placeholder="Alexandre" />

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Ville
          </label>
          <input value={ville} onChange={e => setVille(e.target.value)} style={inputStyle} placeholder="Lausanne" />

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Categorie
          </label>
          <select value={categorie} onChange={e => setCategorie(e.target.value)} style={{ ...inputStyle, appearance: 'none' as const }}>
            <option value="barber">Barber</option>
            <option value="coiffure">Coiffure</option>
            <option value="esthetique">Esthetique</option>
            <option value="massage">Massage</option>
          </select>

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Slogan
          </label>
          <input value={slogan} onChange={e => setSlogan(e.target.value)} style={inputStyle} placeholder="L art de la coupe parfaite" />

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            Bio
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            style={{ ...inputStyle, height: 100, resize: 'none' as const }}
            placeholder="Decrivez votre expertise..."
          />

          <button
            onClick={() => setStep(2)}
            disabled={!prenom.trim() || !ville.trim()}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: 'none',
              background: prenom.trim() && ville.trim() ? '#F2D06B' : 'var(--d3)',
              color: prenom.trim() && ville.trim() ? '#050507' : 'var(--t4)',
              fontSize: 15,
              fontWeight: 700,
              cursor: prenom.trim() && ville.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>Vos services</h2>

          {services.map((service, i) => (
            <div key={i} style={{ background: 'var(--d1)', borderRadius: 16, padding: 16, marginBottom: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>Service {i + 1}</span>
                {services.length > 1 && (
                  <button onClick={() => removeService(i)} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 18 }}>×</button>
                )}
              </div>
              <input value={service.nom} onChange={e => updateService(i, 'nom', e.target.value)} style={inputStyle} placeholder="Nom du service" />
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={service.prix} onChange={e => updateService(i, 'prix', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Prix CHF" type="number" />
                <input value={service.duree} onChange={e => updateService(i, 'duree', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Duree min" type="number" />
              </div>
              <input value={service.description} onChange={e => updateService(i, 'description', e.target.value)} style={inputStyle} placeholder="Description" />
            </div>
          ))}

          <button
            onClick={addService}
            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--t3)', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 20 }}
          >
            + Ajouter un service
          </button>

          <button
            onClick={handleFinish}
            style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: '#F2D06B', color: '#050507', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Creer mon profil
          </button>
        </div>
      )}
    </div>
  );
}
