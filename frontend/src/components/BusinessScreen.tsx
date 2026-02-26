import React, { useState } from 'react';
import { useProContext } from '../context/ProContext';
import CircularProgress from './CircularProgress';
import ServiceEditor, { ServiceItem } from './ServiceEditor';
import ExplorerPreview from './ExplorerPreview';

type BusinessTab = 'profil' | 'services' | 'tarifs' | 'paiement' | 'galerie';

const TABS: { id: BusinessTab; label: string }[] = [
  { id: 'profil', label: 'Profil' },
  { id: 'services', label: 'Services' },
  { id: 'tarifs', label: 'Tarifs' },
  { id: 'paiement', label: 'Paiement' },
  { id: 'galerie', label: 'Galerie' },
];

export default function BusinessScreen() {
  const { proData, setProData } = useProContext();
  const [activeTab, setActiveTab] = useState<BusinessTab>('profil');
  const [showServiceEditor, setShowServiceEditor] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local form state mapped to ProData fields
  const [prenom, setPrenom] = useState(proData.prenom || '');
  const [ville, setVille] = useState(proData.ville || '');
  const [categorie, setCategorie] = useState(proData.categorie || '');
  const [bio, setBio] = useState(proData.bio || '');
  const [slogan, setSlogan] = useState(proData.slogan || '');
  const [iban, setIban] = useState(proData.iban || '');
  const [radius, setRadius] = useState(10);
  const [atHome, setAtHome] = useState(true);

  // Services stored in ProData as {nom, prix, duree, badge}
  // We adapt them to/from ServiceItem for the editor
  const proServices = proData.services || [];

  // Convert ProData service shape → ServiceItem for the editor
  const toServiceItem = (s: typeof proServices[0], idx: number): ServiceItem => ({
    id: `svc-${idx}`,
    name: s.nom,
    price: s.prix,
    duration: s.duree,
    category: '',
    badge: s.badge,
  });

  // Convert ServiceItem → ProData service shape
  const fromServiceItem = (s: ServiceItem) => ({
    nom: s.name,
    prix: s.price,
    duree: s.duration,
    badge: s.badge || null,
  });

  // Editing: find the matching proData service by index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenAdd = () => {
    setEditingService(null);
    setEditingIndex(null);
    setShowServiceEditor(true);
  };

  const handleOpenEdit = (idx: number) => {
    setEditingService(toServiceItem(proServices[idx], idx));
    setEditingIndex(idx);
    setShowServiceEditor(true);
  };

  const handleSaveService = (service: ServiceItem) => {
    const converted = fromServiceItem(service);
    if (editingIndex !== null) {
      const updated = proServices.map((s, i) => (i === editingIndex ? converted : s));
      setProData((prev) => ({ ...prev, services: updated }));
    } else {
      setProData((prev) => ({ ...prev, services: [...prev.services, converted] }));
    }
    setShowServiceEditor(false);
    setEditingService(null);
    setEditingIndex(null);
  };

  const handleDeleteService = (idx: number) => {
    const updated = proServices.filter((_, i) => i !== idx);
    setProData((prev) => ({ ...prev, services: updated }));
  };

  // Completion score
  const completionFields = [
    !!prenom,
    !!ville,
    !!categorie,
    !!bio,
    proServices.length > 0,
    !!iban,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const handleSave = () => {
    setProData((prev) => ({
      ...prev,
      prenom,
      ville,
      categorie,
      bio,
      slogan,
      iban,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0D0D13',
    border: '1px solid #1C1C26',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#F4F4F8',
    fontFamily: 'Inter',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 600,
    color: '#9898B4',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  };

  const fieldStyle: React.CSSProperties = { marginBottom: 16 };

  // ── TAB RENDERERS ─────────────────────────────────────────────────────
  // Each tab returns a div with NO forced height — content takes natural size.

  const renderProfil = () => (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Nom du studio / marque</label>
        <input
          style={inputStyle}
          placeholder="Ex: Studio Élégance"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Slogan</label>
        <input
          style={inputStyle}
          placeholder="Ex: L'excellence à domicile"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Bio (max 500 caractères)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
          placeholder="Décrivez votre activité..."
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <span style={{ fontSize: 11, color: '#9898B4', fontFamily: 'Inter' }}>
          {bio.length}/500
        </span>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Catégorie</label>
        <select
          style={{ ...inputStyle, appearance: 'none' }}
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        >
          <option value="">Sélectionner...</option>
          <option value="barber">Barbier</option>
          <option value="coiffure">Coiffure</option>
          <option value="esthetique">Esthétique</option>
          <option value="massage">Massage</option>
          <option value="nail">Nail Art</option>
          <option value="maquillage">Maquillage</option>
        </select>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Ville</label>
        <input
          style={inputStyle}
          placeholder="Ex: Genève"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowPreview(true)}
          style={{
            width: '100%',
            height: 44,
            background: 'transparent',
            border: '1px solid #F2D06B',
            borderRadius: 10,
            color: '#F2D06B',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          👁 Aperçu Explorer
        </button>
      </div>
    </div>
  );

  const renderServices = () => (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleOpenAdd}
          style={{
            width: '100%',
            height: 48,
            background: '#F2D06B',
            border: 'none',
            borderRadius: 12,
            color: '#050507',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span> Ajouter un service
        </button>
      </div>

      {proServices.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#9898B4',
          fontFamily: 'Inter',
          fontSize: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✂️</div>
          <p style={{ margin: 0 }}>Aucun service ajouté</p>
          <p style={{ margin: '4px 0 0', fontSize: 12 }}>
            Ajoutez vos prestations pour attirer des clients
          </p>
        </div>
      ) : (
        <div>
          {proServices.map((service, idx) => (
            <div
              key={idx}
              style={{
                background: '#0D0D13',
                border: '1px solid #1C1C26',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{
                  margin: 0,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#F4F4F8',
                }}>
                  {service.nom}
                </p>
                <p style={{
                  margin: '2px 0 0',
                  fontFamily: 'Inter',
                  fontSize: 12,
                  color: '#9898B4',
                }}>
                  {service.duree} min · {service.prix} CHF
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleOpenEdit(idx)}
                  style={{
                    background: '#1C1C26',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    color: '#9898B4',
                    fontFamily: 'Inter',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteService(idx)}
                  style={{
                    background: 'rgba(255,80,80,0.1)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 10px',
                    color: '#FF5050',
                    fontFamily: 'Inter',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );

  const renderTarifs = () => (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Zone de déplacement : {radius} km</label>
        <input
          type="range"
          min={1}
          max={50}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#F2D06B' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#9898B4',
          fontFamily: 'Inter',
          marginTop: 4,
        }}>
          <span>1 km</span>
          <span>50 km</span>
        </div>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Prestation à domicile</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Oui', value: true },
            { label: 'Non', value: false },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setAtHome(opt.value)}
              style={{
                flex: 1,
                height: 44,
                background: atHome === opt.value ? '#F2D06B' : '#0D0D13',
                border: `1px solid ${atHome === opt.value ? '#F2D06B' : '#1C1C26'}`,
                borderRadius: 10,
                color: atHome === opt.value ? '#050507' : '#9898B4',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  const renderPaiement = () => (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{
        background: '#0D0D13',
        border: '1px solid #1C1C26',
        borderRadius: 14,
        padding: '20px 18px',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'rgba(242,208,107,0.12)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>
            💳
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#F4F4F8' }}>
              Paiement sécurisé
            </p>
            <p style={{ margin: 0, fontFamily: 'Inter', fontSize: 12, color: '#9898B4' }}>
              Powered by Stripe
            </p>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: 'Inter', fontSize: 13, color: '#9898B4', lineHeight: 1.5 }}>
          Les paiements clients sont traités de manière sécurisée. Les fonds sont libérés 24h après la prestation.
        </p>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>IBAN (virement automatique)</label>
        <input
          style={inputStyle}
          placeholder="CH00 0000 0000 0000 0000 0"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
        />
      </div>

      <div style={{
        background: 'rgba(242,208,107,0.06)',
        border: '1px solid rgba(242,208,107,0.15)',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 16,
      }}>
        <p style={{ margin: 0, fontFamily: 'Inter', fontSize: 12, color: '#F2D06B', lineHeight: 1.5 }}>
          ⚡ Commission plateforme : 1 CHF par réservation. Le reste vous est versé automatiquement.
        </p>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  const renderGalerie = () => (
    <div style={{ padding: '20px 20px 0' }}>
      <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#9898B4', marginTop: 0, marginBottom: 16 }}>
        Ajoutez des photos de vos réalisations pour attirer des clients.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 16,
      }}>
        {(proData.photos || [null, null, null, null]).map((photo, idx) => (
          <div
            key={idx}
            style={{
              aspectRatio: '1',
              background: photo ? `url(${photo}) center/cover no-repeat` : '#0D0D13',
              border: '1px dashed #1C1C26',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {!photo && (
              <span style={{ fontSize: 24, color: '#2E2E3E' }}>+</span>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#9898B4', textAlign: 'center' }}>
        Minimum 3 photos recommandées
      </p>
      <div style={{ height: 20 }} />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil': return renderProfil();
      case 'services': return renderServices();
      case 'tarifs': return renderTarifs();
      case 'paiement': return renderPaiement();
      case 'galerie': return renderGalerie();
      default: return null;
    }
  };

  return (
    <>
      {/* ── ROOT: fixed fullscreen flex column ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#050507',
      }}>
        {/* ── HEADER (flex-shrink:0) ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 10px',
          }}>
            <div>
              <p style={{
                margin: 0,
                fontFamily: 'Inter',
                fontWeight: 800,
                fontSize: 20,
                color: '#F4F4F8',
              }}>
                Mon Business
              </p>
              <p style={{
                margin: '2px 0 0',
                fontFamily: 'Inter',
                fontSize: 12,
                color: '#9898B4',
              }}>
                Complétez votre profil professionnel
              </p>
            </div>
            <CircularProgress percentage={completionPct} />
          </div>

          {/* Tab navigation */}
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '0 20px',
            scrollbarWidth: 'none',
            borderBottom: '1px solid #1C1C26',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flexShrink: 0,
                  padding: '8px 14px 10px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #F2D06B' : '2px solid transparent',
                  color: activeTab === tab.id ? '#F2D06B' : '#9898B4',
                  fontFamily: 'Inter',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT (flex:1, overflowY:auto) ── */}
        {/* Inner div has NO forced height — content takes its natural size */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
        }}>
          {renderTabContent()}
        </div>

        {/* ── YELLOW SAVE BUTTON (flex-shrink:0, anchored above tab bar) ── */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 8px))' as any,
          background: '#050507',
          borderTop: '1px solid #1C1C26',
        }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              height: 54,
              background: saved ? '#4CAF50' : '#F2D06B',
              color: '#050507',
              border: 'none',
              borderRadius: 14,
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {saved ? '✓ Sauvegardé !' : 'Sauvegarder et continuer'}
          </button>
        </div>
      </div>

      {/* ── SERVICE EDITOR MODAL ── */}
      {showServiceEditor && (
        <ServiceEditor
          service={editingService}
          onSave={handleSaveService}
          onClose={() => {
            setShowServiceEditor(false);
            setEditingService(null);
            setEditingIndex(null);
          }}
        />
      )}

      {/* ── EXPLORER PREVIEW MODAL ── */}
      {showPreview && (
        <ExplorerPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          proName={prenom}
          city={ville}
          category={categorie}
          location="domicile"
          services={proServices}
          mainPhoto={proData.photos?.[0] || null}
        />
      )}
    </>
  );
}
