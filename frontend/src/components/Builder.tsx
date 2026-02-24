import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Camera, Plus, Trash2, Check, X } from 'lucide-react';
import { useAppContext, LocalService } from '../context/AppContext';
import { SWISS_ROMANDE_CITIES } from '../utils/cityData';
import { SERVICE_PRESETS, CATEGORIES } from '../utils/servicePresets';
import SubscriptionScreen from './SubscriptionScreen';

const LANGUAGES = ['FR', 'EN', 'PT', 'ES', 'AR', 'DE'];
const LEAD_TIMES = [
  { value: 1, label: '1h' },
  { value: 2, label: '2h' },
  { value: 24, label: '24h' },
  { value: 48, label: '48h' },
];
const SERVICE_BADGES = ['Populaire', 'Nouveau', 'Promo'];

type BuilderStep = 'identity' | 'revolut' | 'services' | 'gallery' | 'availability' | 'flash' | 'reputation';

const STEPS: { key: BuilderStep; label: string }[] = [
  { key: 'identity', label: 'Identité' },
  { key: 'revolut', label: 'Paiement' },
  { key: 'services', label: 'Services' },
  { key: 'gallery', label: 'Galerie' },
  { key: 'availability', label: 'Disponibilités' },
  { key: 'flash', label: 'Flash' },
  { key: 'reputation', label: 'Réputation' },
];

export default function Builder() {
  const { proProfile, setProProfile, navigate } = useAppContext();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('identity');
  const [showSubscription, setShowSubscription] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  const handleImageUpload = (file: File, field: 'coverPhoto' | 'profilePhoto') => {
    const reader = new FileReader();
    reader.onload = e => {
      setProProfile(prev => ({ ...prev, [field]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setProProfile(prev => ({
        ...prev,
        galleryPhotos: [...prev.galleryPhotos, e.target?.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (category: string) => {
    const presets = SERVICE_PRESETS[category] || [];
    const services: LocalService[] = presets.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      duration: p.duration,
      badges: p.badges,
    }));
    setProProfile(prev => ({ ...prev, category, services }));
  };

  const handlePublish = () => {
    const issues: string[] = [];
    if (!proProfile.revolutVerified) issues.push('revolut');
    if (proProfile.galleryPhotos.length < 3) issues.push('gallery');
    if (proProfile.services.length < 1) issues.push('services');

    if (issues.length > 0) {
      setShowValidationModal(true);
    } else {
      setShowSubscription(true);
    }
  };

  const updateService = (id: string, field: keyof LocalService, value: unknown) => {
    setProProfile(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const removeService = (id: string) => {
    setProProfile(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const addCustomService = () => {
    const newService: LocalService = {
      id: `custom-${Date.now()}`,
      name: 'Nouveau service',
      price: 50,
      duration: 30,
      badges: [],
    };
    setProProfile(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const toggleFlash = () => {
    const now = Date.now();
    setProProfile(prev => ({
      ...prev,
      flashMode: !prev.flashMode,
      flashActivatedAt: !prev.flashMode ? now : undefined,
    }));
  };

  if (showSubscription) {
    return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
  }

  return (
    <div className="nexus-container flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-nexus-border sticky top-0 bg-nexus-bg z-10">
        <button onClick={() => navigate('roleSelection')} className="text-nexus-secondary hover:text-white">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-bold">Mon Business</h1>
        <button
          onClick={handlePublish}
          className="px-4 py-2 bg-nexus-gold text-nexus-bg text-sm font-bold rounded-full hover:opacity-90 transition-all"
        >
          Publier
        </button>
      </div>

      {/* Step tabs */}
      <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-nexus-border">
        {STEPS.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentStep === step.key
                ? 'bg-nexus-gold text-nexus-bg'
                : i < stepIndex
                ? 'bg-nexus-success/20 text-nexus-success'
                : 'bg-nexus-card text-nexus-secondary'
            }`}
          >
            {i < stepIndex ? '✓ ' : ''}{step.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* SECTION A — IDENTITY */}
        {currentStep === 'identity' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white font-bold text-xl">Identité</h2>

            {/* Cover photo */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Photo de couverture (1200×400px)</label>
              <div
                className="w-full h-32 bg-nexus-card border-2 border-dashed border-nexus-border rounded-nexus flex items-center justify-center cursor-pointer hover:border-nexus-gold transition-colors overflow-hidden"
                onClick={() => coverInputRef.current?.click()}
              >
                {proProfile.coverPhoto ? (
                  <img src={proProfile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-nexus-secondary">
                    <Camera size={24} />
                    <span className="text-xs">Ajouter une photo de couverture</span>
                  </div>
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'coverPhoto')} />
            </div>

            {/* Profile photo */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Photo de profil (150×150px)</label>
              <div
                className="w-24 h-24 bg-nexus-card border-2 border-dashed border-nexus-border rounded-full flex items-center justify-center cursor-pointer hover:border-nexus-gold transition-colors overflow-hidden"
                onClick={() => profileInputRef.current?.click()}
              >
                {proProfile.profilePhoto ? (
                  <img src={proProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={20} className="text-nexus-secondary" />
                )}
              </div>
              <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profilePhoto')} />
            </div>

            {/* Brand name */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Nom d'artiste / Marque</label>
              <input
                type="text"
                value={proProfile.brandName}
                onChange={e => setProProfile(prev => ({ ...prev, brandName: e.target.value }))}
                placeholder="Ex: Studio Élé"
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
              />
            </div>

            {/* Slogan */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">
                Slogan <span className="text-nexus-secondary">({proProfile.slogan.length}/80)</span>
              </label>
              <input
                type="text"
                value={proProfile.slogan}
                onChange={e => setProProfile(prev => ({ ...prev, slogan: e.target.value.slice(0, 80) }))}
                placeholder="Votre slogan accrocheur..."
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">
                Bio professionnelle <span className="text-nexus-secondary">({proProfile.bio.length}/500)</span>
              </label>
              <textarea
                value={proProfile.bio}
                onChange={e => setProProfile(prev => ({ ...prev, bio: e.target.value.slice(0, 500) }))}
                placeholder="Décrivez votre expertise, votre expérience..."
                rows={4}
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Catégorie</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-3 rounded-nexus text-sm font-medium transition-all ${
                      proProfile.category === cat
                        ? 'bg-nexus-gold text-nexus-bg'
                        : 'bg-nexus-card border border-nexus-border text-white hover:border-nexus-gold'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Ville</label>
              <select
                value={proProfile.city}
                onChange={e => setProProfile(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white focus:border-nexus-gold focus:outline-none appearance-none"
              >
                <option value="">Choisir une ville</option>
                {SWISS_ROMANDE_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Radius */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">
                Rayon d'intervention: <span className="text-nexus-gold">{proProfile.radius} km</span>
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={proProfile.radius}
                onChange={e => setProProfile(prev => ({ ...prev, radius: Number(e.target.value) }))}
                className="w-full accent-nexus-gold"
              />
              <div className="flex justify-between text-nexus-secondary text-xs mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Langues</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setProProfile(prev => ({
                        ...prev,
                        languages: prev.languages.includes(lang)
                          ? prev.languages.filter(l => l !== lang)
                          : [...prev.languages, lang],
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      proProfile.languages.includes(lang)
                        ? 'bg-nexus-gold text-nexus-bg'
                        : 'bg-nexus-card border border-nexus-border text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Téléphone (masqué aux clients)</label>
              <input
                type="tel"
                value={proProfile.phone}
                onChange={e => setProProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+41 79 XXX XX XX"
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SECTION B — REVOLUT */}
        {currentStep === 'revolut' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white font-bold text-xl">💳 Recevoir mes paiements</h2>

            <div className="bg-nexus-card border border-nexus-border rounded-nexus p-5">
              <h3 className="text-white font-semibold mb-1">Votre compte Revolut</h3>
              <p className="text-nexus-secondary text-xs mb-4">
                C'est votre identité de paiement. Revolut a déjà tout vérifié de leur côté.
              </p>

              <input
                type="text"
                value={proProfile.revolut}
                onChange={e => setProProfile(prev => ({ ...prev, revolut: e.target.value, revolutVerified: false }))}
                placeholder="@votre-username-revolut ou +41 79 XXX XX XX"
                className="w-full bg-nexus-bg border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none mb-4"
              />

              {proProfile.revolutVerified ? (
                <div className="flex items-center gap-2 text-nexus-success">
                  <Check size={18} />
                  <span className="font-medium">💳 Revolut vérifié ✅</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (proProfile.revolut) {
                      setProProfile(prev => ({ ...prev, revolutVerified: true }));
                    }
                  }}
                  disabled={!proProfile.revolut}
                  className="w-full py-3 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  ✅ Valider mon Revolut
                </button>
              )}
            </div>

            <div className="bg-nexus-urgent/10 border border-nexus-urgent/30 rounded-nexus p-4">
              <p className="text-nexus-urgent text-sm font-medium">⚠️ Obligatoire pour publier</p>
              <p className="text-nexus-secondary text-xs mt-1">
                Ajoutez votre Revolut pour recevoir vos paiements et vous rendre visible
              </p>
            </div>
          </div>
        )}

        {/* SECTION C — SERVICES */}
        {currentStep === 'services' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">Catalogue services</h2>
              {proProfile.category && (
                <span className="text-nexus-gold text-xs bg-nexus-gold/10 px-2 py-1 rounded-full">
                  {proProfile.category}
                </span>
              )}
            </div>

            {proProfile.services.length === 0 && (
              <div className="bg-nexus-card border border-nexus-border rounded-nexus p-4 text-center">
                <p className="text-nexus-secondary text-sm">
                  Sélectionnez une catégorie dans "Identité" pour charger les presets
                </p>
              </div>
            )}

            {proProfile.services.map(service => (
              <div key={service.id} className="bg-nexus-card border border-nexus-border rounded-nexus p-4">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={e => updateService(service.id, 'name', e.target.value)}
                    className="bg-transparent text-white font-semibold text-base focus:outline-none border-b border-transparent focus:border-nexus-gold flex-1 mr-2"
                  />
                  <button onClick={() => removeService(service.id)} className="text-nexus-secondary hover:text-nexus-urgent">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-nexus-secondary text-xs mb-1 block">Prix (CHF)</label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={e => updateService(service.id, 'price', Number(e.target.value))}
                      className="w-full bg-nexus-bg border border-nexus-border rounded-lg px-3 py-2 text-white text-sm focus:border-nexus-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-nexus-secondary text-xs mb-1 block">Durée (min)</label>
                    <input
                      type="number"
                      value={service.duration}
                      onChange={e => updateService(service.id, 'duration', Number(e.target.value))}
                      className="w-full bg-nexus-bg border border-nexus-border rounded-lg px-3 py-2 text-white text-sm focus:border-nexus-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {SERVICE_BADGES.map(badge => (
                    <button
                      key={badge}
                      onClick={() => {
                        const current = service.badges || [];
                        const updated = current.includes(badge)
                          ? current.filter(b => b !== badge)
                          : [...current, badge];
                        updateService(service.id, 'badges', updated);
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                        service.badges?.includes(badge)
                          ? badge === 'Populaire' ? 'bg-nexus-gold text-nexus-bg'
                          : badge === 'Nouveau' ? 'bg-nexus-success text-white'
                          : 'bg-nexus-urgent text-white'
                          : 'bg-nexus-bg border border-nexus-border text-nexus-secondary'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addCustomService}
              className="w-full py-3 border-2 border-dashed border-nexus-border rounded-nexus text-nexus-secondary hover:border-nexus-gold hover:text-nexus-gold transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Ajouter un service custom
            </button>
          </div>
        )}

        {/* SECTION D — GALLERY */}
        {currentStep === 'gallery' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">Galerie</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${proProfile.galleryPhotos.length >= 3 ? 'bg-nexus-success/20 text-nexus-success' : 'bg-nexus-urgent/20 text-nexus-urgent'}`}>
                {proProfile.galleryPhotos.length}/3 min
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {proProfile.galleryPhotos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-nexus-gold text-nexus-bg text-xs px-1.5 py-0.5 rounded-full font-bold">⭐</div>
                  )}
                  <button
                    onClick={() => setProProfile(prev => ({ ...prev, galleryPhotos: prev.galleryPhotos.filter((_, idx) => idx !== i) }))}
                    className="absolute top-1 right-1 w-6 h-6 bg-nexus-urgent rounded-full flex items-center justify-center"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}

              <div
                className="aspect-square bg-nexus-card border-2 border-dashed border-nexus-border rounded-lg flex items-center justify-center cursor-pointer hover:border-nexus-gold transition-colors"
                onClick={() => galleryInputRef.current?.click()}
              >
                <Plus size={24} className="text-nexus-secondary" />
              </div>
            </div>

            <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleGalleryUpload(e.target.files[0])} />

            {proProfile.galleryPhotos.length < 3 && (
              <p className="text-nexus-secondary text-xs text-center">
                Minimum 3 photos requises pour publier votre profil
              </p>
            )}
          </div>
        )}

        {/* SECTION E — AVAILABILITY */}
        {currentStep === 'availability' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white font-bold text-xl">Disponibilités</h2>

            <div className="flex flex-col gap-3">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="flex items-center justify-between bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3">
                  <span className="text-white font-medium w-10">{day}</span>
                  <span className="text-nexus-secondary text-sm flex-1 mx-4">09:00 – 19:00</span>
                  <div className="flex items-center gap-2">
                    <span className="text-nexus-success text-xs">Disponible</span>
                    <div className="w-10 h-5 bg-nexus-success rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lead time */}
            <div>
              <label className="text-nexus-secondary text-sm mb-2 block">Délai minimum de réservation</label>
              <div className="grid grid-cols-4 gap-2">
                {LEAD_TIMES.map(lt => (
                  <button
                    key={lt.value}
                    onClick={() => setProProfile(prev => ({ ...prev, minBookingLeadTime: lt.value }))}
                    className={`py-2 rounded-nexus text-sm font-medium transition-all ${
                      proProfile.minBookingLeadTime === lt.value
                        ? 'bg-nexus-gold text-nexus-bg'
                        : 'bg-nexus-card border border-nexus-border text-white'
                    }`}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* At home */}
            <div className="flex items-center justify-between bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3">
              <span className="text-white">Je me déplace chez le client</span>
              <button
                onClick={() => setProProfile(prev => ({ ...prev, atHomeService: !prev.atHomeService }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${proProfile.atHomeService ? 'bg-nexus-success' : 'bg-nexus-border'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${proProfile.atHomeService ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION F — FLASH */}
        {currentStep === 'flash' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white font-bold text-xl">⚡ Mode Flash</h2>

            <div className="bg-nexus-card border border-nexus-border rounded-nexus p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">⚡ MODE FLASH</h3>
                  <p className={`text-sm mt-1 ${proProfile.flashMode ? 'text-nexus-success' : 'text-nexus-secondary'}`}>
                    {proProfile.flashMode ? '🟢 Je suis disponible MAINTENANT' : '⚫ Mode Flash désactivé'}
                  </p>
                </div>
                <button
                  onClick={toggleFlash}
                  className={`w-14 h-7 rounded-full relative transition-colors ${proProfile.flashMode ? 'bg-nexus-success' : 'bg-nexus-border'}`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow ${proProfile.flashMode ? 'translate-x-7' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {proProfile.flashMode && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-nexus-success rounded-full flash-pulse" />
                  <span className="text-nexus-success text-sm font-medium">Visible en tête de l'Explorer</span>
                </div>
              )}

              <p className="text-nexus-secondary text-sm">
                Apparaissez en tête de l'Explorer pour recevoir des demandes immédiates.
                Désactivation automatique après 4h.
              </p>
            </div>
          </div>
        )}

        {/* SECTION G — REPUTATION */}
        {currentStep === 'reputation' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-white font-bold text-xl">Score & Réputation</h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '⭐', label: 'Note moyenne', value: '—' },
                { icon: '⚡', label: 'Temps de réponse', value: '—' },
                { icon: '✅', label: 'Taux d\'acceptation', value: '—' },
                { icon: '🎯', label: 'Prestations réalisées', value: '0' },
              ].map((stat, i) => (
                <div key={i} className="bg-nexus-card border border-nexus-border rounded-nexus p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-bold text-xl">{stat.value}</div>
                  <div className="text-nexus-secondary text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="text-nexus-secondary text-sm text-center">
              Vos statistiques apparaîtront ici après vos premières prestations
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 px-4 py-4 border-t border-nexus-border">
        {stepIndex > 0 && (
          <button
            onClick={() => setCurrentStep(STEPS[stepIndex - 1].key)}
            className="flex-1 py-3 bg-nexus-card border border-nexus-border rounded-nexus text-white font-medium flex items-center justify-center gap-2 hover:border-nexus-gold transition-all"
          >
            <ArrowLeft size={18} />
            Précédent
          </button>
        )}
        {stepIndex < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(STEPS[stepIndex + 1].key)}
            className="flex-1 py-3 bg-nexus-gold text-nexus-bg font-bold rounded-nexus flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            Suivant
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            className="flex-1 py-3 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 transition-all"
          >
            Publier mon profil
          </button>
        )}
      </div>

      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm bg-nexus-card border border-nexus-border rounded-nexus p-6 slide-up">
            <h3 className="text-white font-bold text-lg mb-4">Profil incomplet</h3>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { key: 'revolut', label: 'Revolut renseigné', ok: proProfile.revolutVerified },
                { key: 'gallery', label: 'Minimum 3 photos', ok: proProfile.galleryPhotos.length >= 3 },
                { key: 'services', label: 'Minimum 1 service', ok: proProfile.services.length >= 1 },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.ok ? 'bg-nexus-success/20' : 'bg-nexus-urgent/20'}`}>
                    {item.ok ? <Check size={14} className="text-nexus-success" /> : <X size={14} className="text-nexus-urgent" />}
                  </div>
                  <span className={`text-sm ${item.ok ? 'text-nexus-success' : 'text-nexus-urgent'}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full py-3 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 transition-all"
            >
              Compléter mon profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
