import React, { useState } from 'react';
import { useAppContext, PublishedStudio } from '../context/AppContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

type Step = 1 | 2 | 3 | 4;

interface ServiceForm {
  name: string;
  priceDomicile: string;
  priceStudio: string;
  duration: string;
}

const Builder: React.FC = () => {
  const { goToNexusOS, goToSubscription, goToSplash } = useAppContext();
  const [step, setStep] = useState<Step>(1);
  
  // Step 1: Info
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Logistics
  const [modeDomicile, setModeDomicile] = useState(false);
  const [modeStudio, setModeStudio] = useState(false);
  const [studioAddress, setStudioAddress] = useState('');
  const [studioLat, setStudioLat] = useState('');
  const [studioLng, setStudioLng] = useState('');

  // Step 3: Services
  const [services, setServices] = useState<ServiceForm[]>([
    { name: '', priceDomicile: '', priceStudio: '', duration: '' },
  ]);

  // Step 4: Availability
  const [availability, setAvailability] = useState<{ [day: string]: string[] }>({
    Lundi: [],
    Mardi: [],
    Mercredi: [],
    Jeudi: [],
    Vendredi: [],
    Samedi: [],
    Dimanche: [],
  });

  const handleStep2Next = () => {
    if (!modeDomicile && !modeStudio) {
      toast.error('Veuillez sélectionner au moins un mode de service');
      return;
    }

    if (modeStudio) {
      if (!studioAddress || !studioLat || !studioLng) {
        toast.error('Veuillez remplir l\'adresse et les coordonnées GPS du studio');
        return;
      }

      const lat = parseFloat(studioLat);
      const lng = parseFloat(studioLng);

      if (isNaN(lat) || isNaN(lng)) {
        toast.error('Coordonnées GPS invalides');
        return;
      }
    }

    setStep(3);
  };

  const addService = () => {
    setServices([...services, { name: '', priceDomicile: '', priceStudio: '', duration: '' }]);
  };

  const updateService = (index: number, field: keyof ServiceForm, value: string) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const toggleAvailability = (day: string, time: string) => {
    setAvailability((prev) => {
      const daySlots = prev[day] || [];
      const exists = daySlots.includes(time);
      return {
        ...prev,
        [day]: exists ? daySlots.filter((t) => t !== time) : [...daySlots, time],
      };
    });
  };

  const handlePublish = () => {
    // Validate services
    const validServices = services.filter(
      (s) => s.name && s.duration && (s.priceDomicile || s.priceStudio)
    );

    if (validServices.length === 0) {
      toast.error('Veuillez ajouter au moins une prestation valide');
      return;
    }

    goToSubscription();
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <Toaster />
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
        <button
          onClick={goToNexusOS}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            color: 'rgba(255, 255, 255, 0.55)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          ← RETOUR
        </button>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                background: step >= s ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* STEP 1: INFO */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              Informations
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
              Présentez votre activité professionnelle
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label className="input-label">Nom d'artiste *</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Ex: Studio Élégance"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Catégorie *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Barber">Barber</option>
                  <option value="Coiffure">Coiffure</option>
                  <option value="Esthétique">Esthétique</option>
                  <option value="Massage">Massage</option>
                </select>
              </div>

              <div>
                <label className="input-label">Ville *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Lausanne"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Téléphone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Bio *</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez votre expertise en quelques mots..."
                  className="input-field"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-sand"
              disabled={!artistName || !category || !city || !phone || !bio}
            >
              SUIVANT →
            </button>
          </div>
        )}

        {/* STEP 2: LOGISTICS */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              Logistique
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
              Comment souhaitez-vous travailler ?
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Mode de service *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  onClick={() => setModeDomicile(!modeDomicile)}
                  style={{
                    background: modeDomicile ? 'rgba(232,213,176,0.12)' : '#1a1a1a',
                    border: `1px solid ${modeDomicile ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🏠</span>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>JE ME DÉPLACE</span>
                </div>
                <div
                  onClick={() => setModeStudio(!modeStudio)}
                  style={{
                    background: modeStudio ? 'rgba(232,213,176,0.12)' : '#1a1a1a',
                    border: `1px solid ${modeStudio ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✂️</span>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>AU STUDIO</span>
                </div>
              </div>
            </div>

            {modeStudio && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label">Adresse du studio *</label>
                  <input
                    type="text"
                    value={studioAddress}
                    onChange={(e) => setStudioAddress(e.target.value)}
                    placeholder="Rue de Bourg 12, 1003 Lausanne"
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="input-label">Latitude *</label>
                    <input
                      type="text"
                      value={studioLat}
                      onChange={(e) => setStudioLat(e.target.value)}
                      placeholder="46.5197"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Longitude *</label>
                    <input
                      type="text"
                      value={studioLng}
                      onChange={(e) => setStudioLng(e.target.value)}
                      placeholder="6.6323"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1 }}>
                ← RETOUR
              </button>
              <button onClick={handleStep2Next} className="btn-sand" style={{ flex: 2 }}>
                SUIVANT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES */}
        {step === 3 && (
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              Prestations
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
              Configurez vos services et tarifs
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {services.map((service, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '16px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.55)' }}>
                      PRESTATION {idx + 1}
                    </div>
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(239, 68, 68, 0.7)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        SUPPRIMER
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(idx, 'name', e.target.value)}
                      placeholder="Nom de la prestation"
                      className="input-field"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">🏠 Domicile (CHF)</label>
                        <input
                          type="number"
                          value={service.priceDomicile}
                          onChange={(e) => updateService(idx, 'priceDomicile', e.target.value)}
                          placeholder="60"
                          className="input-field"
                          disabled={!modeDomicile}
                        />
                      </div>
                      <div>
                        <label className="input-label">✂️ Studio (CHF)</label>
                        <input
                          type="number"
                          value={service.priceStudio}
                          onChange={(e) => updateService(idx, 'priceStudio', e.target.value)}
                          placeholder="40"
                          className="input-field"
                          disabled={!modeStudio}
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={service.duration}
                      onChange={(e) => updateService(idx, 'duration', e.target.value)}
                      placeholder="Durée (ex: 60 min)"
                      className="input-field"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addService}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px dashed rgba(255, 255, 255, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                color: 'rgba(255, 255, 255, 0.55)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '24px',
              }}
            >
              + AJOUTER UNE PRESTATION
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1 }}>
                ← RETOUR
              </button>
              <button onClick={() => setStep(4)} className="btn-sand" style={{ flex: 2 }}>
                SUIVANT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AVAILABILITY */}
        {step === 4 && (
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              Disponibilités
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
              Sélectionnez vos créneaux disponibles
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {Object.keys(availability).map((day) => (
                <div key={day}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'rgba(255, 255, 255, 0.55)',
                      marginBottom: '10px',
                    }}
                  >
                    {day}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {timeSlots.map((time) => {
                      const isSelected = availability[day].includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => toggleAvailability(day, time)}
                          style={{
                            background: isSelected ? 'rgba(232,213,176,0.12)' : '#1a1a1a',
                            border: `1px solid ${isSelected ? '#E8D5B0' : 'rgba(255, 255, 255, 0.09)'}`,
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: isSelected ? '#E8D5B0' : 'rgba(255, 255, 255, 0.55)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(3)} className="btn-outline" style={{ flex: 1 }}>
                ← RETOUR
              </button>
              <button onClick={handlePublish} className="btn-sand" style={{ flex: 2 }}>
                PUBLIER →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Builder;
