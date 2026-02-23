import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Check, Upload, X, GripVertical, Plus, Eye } from 'lucide-react';
import ImageUploader from './ImageUploader';
import GalleryPhotoUpload from './GalleryPhotoUpload';
import BuilderProgress from './BuilderProgress';
import { toast } from 'sonner';

type Category = 'Tatouage' | 'Piercing' | 'Branding' | 'Illustration';

interface ImageData {
  base64: string;
  cropParams: any;
}

export default function Builder() {
  const { goToNexusOS, publishStudio } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Profile
  const [coverPhoto, setCoverPhoto] = useState<ImageData | null>(null);
  const [logo, setLogo] = useState<ImageData | null>(null);
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState<Category>('Tatouage');
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState('');
  const [phone, setPhone] = useState('');
  const [gallery, setGallery] = useState<Array<ImageData | null>>([null, null, null]);

  const categories: Category[] = ['Tatouage', 'Piercing', 'Branding', 'Illustration'];
  const stepLabels = ['Profil'];

  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      setCities([...cities, cityInput.trim()]);
      setCityInput('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setCities(cities.filter((c) => c !== city));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!coverPhoto) {
        toast.error('Veuillez ajouter une photo de couverture');
        return;
      }
      if (!logo) {
        toast.error('Veuillez ajouter un logo');
        return;
      }
      if (!artistName.trim()) {
        toast.error('Veuillez entrer un nom d\'artiste');
        return;
      }
      if (cities.length === 0) {
        toast.error('Veuillez ajouter au moins une ville');
        return;
      }
      if (!phone.trim()) {
        toast.error('Veuillez entrer un numéro de téléphone');
        return;
      }
      
      // Check if at least 3 photos are uploaded
      const uploadedPhotos = gallery.filter(p => p !== null);
      if (uploadedPhotos.length < 3) {
        toast.error('Veuillez ajouter au moins 3 photos à votre galerie');
        return;
      }
      
      // Publish studio
      publishStudio({
        name: artistName,
        category: category.toLowerCase(),
        city: cities,
        phone,
        bio: `Studio professionnel de ${category.toLowerCase()}. Expertise et qualité garanties.`,
        modes: ['salon'],
        studioAddress: `${cities[0]}, Suisse`,
        studioLat: 46.5197,
        studioLng: 6.6323,
        services: [
          {
            name: `${category} standard`,
            priceStudio: 100,
            priceDomicile: null,
            duration: '1h',
          },
        ],
        availability: {
          lundi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          mardi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          mercredi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          jeudi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          vendredi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        },
        coverPhotoUrl: coverPhoto.base64,
        coverPhoto: coverPhoto.base64,
        gallery: uploadedPhotos.map(p => p!.base64),
      });

      toast.success('Profil créé avec succès !');
      goToNexusOS();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={goToNexusOS}
            className="w-12 h-12 rounded-full bg-[#F5F5F7]/10 hover:bg-[#F5F5F7]/20 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black">Créer votre profil</h1>
            <p className="text-[#F5F5F7]/60">Configurez votre studio professionnel</p>
          </div>
        </div>

        {/* Progress */}
        <BuilderProgress currentStep={currentStep} totalSteps={1} stepLabels={stepLabels} />

        {/* Step 1: Profile */}
        <div className="space-y-8 mt-8">
          {/* Cover Photo */}
          <div>
            <label className="input-label">Photo de couverture (1200x400px)</label>
            <ImageUploader
              aspectRatio="3:1"
              storageKey="nexus_builder_cover"
              onChange={setCoverPhoto}
              label=""
              helpText="Format recommandé : 1200x400px"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="input-label">Logo du studio (carré)</label>
            <ImageUploader
              aspectRatio="1:1"
              storageKey="nexus_builder_logo"
              onChange={setLogo}
              label=""
              helpText="Format recommandé : 150x150px"
            />
          </div>

          {/* Artist Name */}
          <div>
            <label className="input-label">Nom d'artiste</label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Ex: Studio Élé"
              className="input-field"
            />
          </div>

          {/* Category */}
          <div>
            <label className="input-label">Catégorie</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#E8D5B0] text-[#0A0A0A]'
                      : 'bg-[#F5F5F7]/5 border border-[#F5F5F7]/20 text-[#F5F5F7] hover:border-[#E8D5B0]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <label className="input-label">Villes</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                placeholder="Ex: Lausanne"
                className="input-field flex-1"
              />
              <button
                onClick={handleAddCity}
                className="px-6 py-3 bg-[#E8D5B0] rounded-xl font-bold text-[#0A0A0A] hover:bg-[#E8D5B0]/90 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E8D5B0]/20 border border-[#E8D5B0]/30 rounded-full text-sm"
                >
                  <span>{city}</span>
                  <button
                    onClick={() => handleRemoveCity(city)}
                    className="hover:text-[#DC2626] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="input-label">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+41 79 123 45 67"
              className="input-field"
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="input-label">Galerie (minimum 3 photos)</label>
            <GalleryPhotoUpload
              photos={gallery}
              onChange={setGallery}
              minPhotos={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-[#E8D5B0] rounded-xl font-bold text-[#0A0A0A] hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              PUBLIER LE PROFIL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
