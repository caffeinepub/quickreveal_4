import React from 'react';
import { useAppContext, PublishedStudio } from '../context/AppContext';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const Subscription: React.FC = () => {
  const { goToNexusOS, publishStudio, setActiveNexusTab, goToSplash } = useAppContext();

  const handleSubscribe = () => {
    // Create published studio from builder data
    const studio: PublishedStudio = {
      name: 'Mon Studio',
      category: 'Coiffure',
      city: 'Lausanne',
      phone: '+41 79 123 45 67',
      bio: 'Studio professionnel de qualité',
      modes: ['domicile', 'salon'],
      studioAddress: 'Rue de Bourg 12, 1003 Lausanne',
      studioLat: 46.5197,
      studioLng: 6.6323,
      services: [
        {
          name: 'Coupe classique',
          priceDomicile: 60,
          priceStudio: 40,
          duration: '45 min',
        },
      ],
      availability: {},
      coverPhotoUrl: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    };

    publishStudio(studio);
    setActiveNexusTab('portfolio');
    
    toast.success('🚀 Studio en ligne !');
    
    setTimeout(() => {
      goToNexusOS();
    }, 1000);
  };

  const advantages = [
    'Visibilité maximale dans l\'Explorer',
    'Gestion complète de votre agenda',
    'Système de paiement sécurisé',
    'Notifications en temps réel',
    'Support prioritaire 7j/7',
    'Analytics détaillés',
  ];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <Toaster />
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px',
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
      </div>

      {/* Content */}
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E8D5B0 0%, #d4b896 100%)',
            color: '#0a0a0a',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          ✨ OFFRE DE LANCEMENT
        </div>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
        >
          Rejoignez NEXUS
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          Développez votre activité avec la plateforme professionnelle la plus avancée de Suisse
          romande
        </p>

        {/* Pricing Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '2px solid #E8D5B0',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#E8D5B0',
              marginBottom: '12px',
            }}
          >
            GRATUIT le premier mois
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.55)',
              marginBottom: '20px',
            }}
          >
            puis <strong style={{ color: '#ffffff' }}>199 CHF/an</strong>
          </div>

          <div
            style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.09)',
              marginBottom: '20px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {advantages.map((advantage, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} color="#22c55e" strokeWidth={3} />
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  {advantage}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubscribe} className="btn-sand" style={{ marginBottom: '20px' }}>
          COMMENCER GRATUITEMENT
        </button>

        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.35)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Aucune carte bancaire requise · Annulation à tout moment
        </div>
      </div>
    </div>
  );
};

export default Subscription;
