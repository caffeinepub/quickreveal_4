import React, { useState } from 'react';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';

const DEMO_PROS_MAP: Record<string, {
  id: string;
  brandName: string;
  slogan: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  minPrice: number;
  isFlash: boolean;
  hasRevolut: boolean;
  coverPhoto: string;
  profilePhoto: string;
  bio: string;
  services: { id: string; name: string; duration: number; price: number; badges: string[] }[];
  acceptanceRate: number;
  totalPrestations: number;
}> = {
  'julien-rossi': {
    id: 'julien-rossi',
    brandName: 'Julien Rossi',
    slogan: 'Barber premium à domicile',
    category: 'Barber',
    city: 'Lausanne',
    rating: 4.9,
    reviewCount: 47,
    responseTime: '3 min',
    minPrice: 35,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/barber-lausanne-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-julien-rossi.dim_800x600.png',
    bio: 'Spécialiste coupe homme et barbe depuis 10 ans. Je me déplace à domicile dans tout le canton de Vaud.',
    services: [
      { id: 's1', name: 'Coupe homme', duration: 45, price: 45, badges: ['Populaire'] },
      { id: 's2', name: 'Barbe complète', duration: 30, price: 35, badges: [] },
      { id: 's3', name: 'Coupe + Barbe', duration: 75, price: 70, badges: ['Promo'] },
    ],
    acceptanceRate: 97,
    totalPrestations: 124,
  },
  'lucie-esthetics': {
    id: 'lucie-esthetics',
    brandName: 'Lucie Esthetics',
    slogan: 'Beauté & bien-être à domicile',
    category: 'Esthétique',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 63,
    responseTime: '5 min',
    minPrice: 55,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/esthetique-lausanne-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-lucie-esthetics.dim_800x600.png',
    bio: 'Esthéticienne diplômée, spécialiste soins visage et corps. Disponible 7j/7 à Genève et environs.',
    services: [
      { id: 's1', name: 'Soin visage', duration: 60, price: 75, badges: ['Populaire'] },
      { id: 's2', name: 'Épilation jambes', duration: 45, price: 55, badges: [] },
      { id: 's3', name: 'Manucure', duration: 30, price: 40, badges: ['Nouveau'] },
    ],
    acceptanceRate: 95,
    totalPrestations: 89,
  },
  'zen-touch': {
    id: 'zen-touch',
    brandName: 'Zen Touch',
    slogan: 'Massage & relaxation premium',
    category: 'Massage',
    city: 'Genève',
    rating: 5.0,
    reviewCount: 29,
    responseTime: '10 min',
    minPrice: 80,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/massage-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-zen-touch.dim_800x600.png',
    bio: 'Masseur certifié, techniques suédoises et thaïlandaises. Votre bien-être est ma priorité.',
    services: [
      { id: 's1', name: 'Massage relaxant 60min', duration: 60, price: 90, badges: ['Populaire'] },
      { id: 's2', name: 'Massage sportif', duration: 45, price: 80, badges: [] },
      { id: 's3', name: 'Massage duo', duration: 90, price: 160, badges: ['Nouveau'] },
    ],
    acceptanceRate: 100,
    totalPrestations: 45,
  },
  'sophiane-hair': {
    id: 'sophiane-hair',
    brandName: 'Sophiane Hair',
    slogan: 'Coiffure créative & tendance',
    category: 'Coiffure',
    city: 'Lausanne',
    rating: 4.7,
    reviewCount: 38,
    responseTime: '8 min',
    minPrice: 60,
    isFlash: false,
    hasRevolut: false,
    coverPhoto: '/assets/generated/coiffure-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-sophiane-hair.dim_800x600.png',
    bio: 'Coiffeuse passionnée, spécialiste colorations et coupes femme.',
    services: [
      { id: 's1', name: 'Coupe femme', duration: 60, price: 80, badges: ['Populaire'] },
      { id: 's2', name: 'Coloration', duration: 120, price: 120, badges: [] },
      { id: 's3', name: 'Brushing', duration: 45, price: 60, badges: [] },
    ],
    acceptanceRate: 92,
    totalPrestations: 67,
  },
  'noura-beauty': {
    id: 'noura-beauty',
    brandName: 'Noura Beauty',
    slogan: 'Maquillage & soins orientaux',
    category: 'Esthétique',
    city: 'Fribourg',
    rating: 4.6,
    reviewCount: 21,
    responseTime: '15 min',
    minPrice: 45,
    isFlash: false,
    hasRevolut: false,
    coverPhoto: '/assets/generated/coiffure-fribourg-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-noura-beauty.dim_800x600.png',
    bio: 'Maquilleuse professionnelle, spécialiste mariages et événements.',
    services: [
      { id: 's1', name: 'Maquillage événement', duration: 60, price: 85, badges: ['Populaire'] },
      { id: 's2', name: 'Soin hammam', duration: 90, price: 95, badges: ['Nouveau'] },
      { id: 's3', name: 'Henné', duration: 45, price: 45, badges: [] },
    ],
    acceptanceRate: 88,
    totalPrestations: 34,
  },
  'barber-geneva': {
    id: 'barber-geneva',
    brandName: 'Mageste Labs',
    slogan: 'Barber shop haut de gamme',
    category: 'Barber',
    city: 'Genève',
    rating: 4.8,
    reviewCount: 55,
    responseTime: '5 min',
    minPrice: 40,
    isFlash: true,
    hasRevolut: true,
    coverPhoto: '/assets/generated/barber-geneva-cover.dim_1200x400.png',
    profilePhoto: '/assets/generated/provider-mageste-labs.dim_800x600.png',
    bio: 'Barbier expert, spécialiste dégradés et soins barbe.',
    services: [
      { id: 's1', name: 'Dégradé américain', duration: 45, price: 50, badges: ['Populaire'] },
      { id: 's2', name: 'Rasage traditionnel', duration: 30, price: 40, badges: [] },
      { id: 's3', name: 'Coupe + Rasage', duration: 75, price: 80, badges: ['Promo'] },
    ],
    acceptanceRate: 96,
    totalPrestations: 112,
  },
};

function getBadgeStyle(badge: string): React.CSSProperties {
  switch (badge) {
    case 'Populaire':
      return { backgroundColor: 'rgba(232,200,154,0.15)', color: '#E8C89A', border: '1px solid rgba(232,200,154,0.3)' };
    case 'Nouveau':
      return { backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' };
    case 'Promo':
      return { backgroundColor: 'rgba(79,110,247,0.15)', color: '#4F6EF7', border: '1px solid rgba(79,110,247,0.3)' };
    default:
      return { backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #2A2A2A' };
  }
}

export default function ProviderDetail() {
  const { navigate, screenParams } = useAppContext();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Get pro from screenParams or fallback to first demo pro
  const paramProvider = screenParams?.provider as { id?: string } | undefined;
  const proId = paramProvider?.id ?? '';
  const pro = DEMO_PROS_MAP[proId] ?? DEMO_PROS_MAP['julien-rossi'];

  const selectedServiceData = pro.services.find((s) => s.id === selectedServiceId) ?? pro.services[0];
  const ctaPrice = selectedServiceData?.price ?? pro.minPrice;

  const handleBook = () => {
    navigate('bookingFlow', {
      provider: {
        id: pro.id,
        name: pro.brandName,
        category: pro.category,
        coverPhotoUrl: pro.coverPhoto,
        modes: ['domicile'],
        studioAddress: '',
      },
      service: {
        id: selectedServiceData.id,
        name: selectedServiceData.name,
        priceStudio: selectedServiceData.price,
        priceDomicile: selectedServiceData.price,
        duration: `${selectedServiceData.duration} min`,
      },
    });
  };

  return (
    <div
      className="screen-transition"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0A0A0A',
        paddingTop: '56px',
        paddingBottom: '80px',
        position: 'relative',
      }}
    >
      <GlobalHeader />

      {/* Back button */}
      <button
        onClick={() => navigate('explorer')}
        className="btn-tap"
        style={{
          position: 'fixed',
          top: '68px',
          left: '16px',
          zIndex: 110,
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ArrowLeft size={20} color="#FFFFFF" />
      </button>

      {/* Cover photo */}
      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
        <img
          src={pro.coverPhoto}
          alt={pro.brandName}
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.8) 100%)',
          }}
        />
      </div>

      {/* Profile photo overlapping cover */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid #E8C89A',
            overflow: 'hidden',
            zIndex: 5,
          }}
        >
          <img
            src={pro.profilePhoto}
            alt={pro.brandName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '0 20px', paddingTop: '52px' }}>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              marginBottom: '4px',
            }}
          >
            {pro.brandName}
          </h1>
          <p
            style={{
              color: '#888888',
              fontSize: '14px',
              fontStyle: 'italic',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '16px',
            }}
          >
            {pro.slogan}
          </p>

          {/* Inline badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {pro.isFlash && (
              <span
                className="flash-badge"
                style={{
                  backgroundColor: 'rgba(34,197,94,0.15)',
                  color: '#22C55E',
                  border: '1px solid rgba(34,197,94,0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  padding: '5px 12px',
                  borderRadius: '50px',
                }}
              >
                ⚡ Flash
              </span>
            )}
            {pro.hasRevolut && (
              <span
                style={{
                  backgroundColor: '#1A1A1A',
                  color: '#CCCCCC',
                  border: '1px solid #2A2A2A',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  padding: '5px 12px',
                  borderRadius: '50px',
                }}
              >
                💳 Revolut ✅
              </span>
            )}
            <span
              style={{
                backgroundColor: 'rgba(232,200,154,0.1)',
                color: '#E8C89A',
                border: '1px solid rgba(232,200,154,0.2)',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                padding: '5px 12px',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Star size={11} fill="#E8C89A" color="#E8C89A" />
              {pro.rating}
            </span>
            <span
              style={{
                backgroundColor: '#1A1A1A',
                color: '#888888',
                border: '1px solid #2A2A2A',
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif",
                padding: '5px 12px',
                borderRadius: '50px',
              }}
            >
              {pro.reviewCount} avis
            </span>
          </div>

          {/* Score bar */}
          <div
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#E8C89A', fontWeight: 700, fontSize: '18px', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                ⚡ {pro.responseTime}
              </div>
              <div style={{ color: '#888888', fontSize: '11px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>
                réponse
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A' }}>
              <div style={{ color: '#22C55E', fontWeight: 700, fontSize: '18px', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                ✅ {pro.acceptanceRate}%
              </div>
              <div style={{ color: '#888888', fontSize: '11px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>
                acceptation
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', fontFamily: "'Inter', sans-serif", marginBottom: '4px' }}>
                🎯 {pro.totalPrestations}
              </div>
              <div style={{ color: '#888888', fontSize: '11px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>
                prestas
              </div>
            </div>
          </div>

          {/* Bio */}
          <p
            style={{
              color: '#CCCCCC',
              fontSize: '15px',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            {pro.bio}
          </p>

          {/* Services */}
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              marginBottom: '14px',
            }}
          >
            Services
          </h2>
          <div
            className="scroll-no-bar"
            style={{ display: 'flex', gap: '12px', marginBottom: '24px', paddingBottom: '4px' }}
          >
            {pro.services.map((service) => {
              const isSelected = selectedServiceId
                ? selectedServiceId === service.id
                : service === pro.services[0];
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className="btn-tap"
                  style={{
                    flexShrink: 0,
                    width: '180px',
                    backgroundColor: isSelected ? '#1F1A12' : '#1A1A1A',
                    border: isSelected ? '1.5px solid #E8C89A' : '1px solid #2A2A2A',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', fontFamily: "'Inter', sans-serif", marginBottom: '8px' }}>
                    {service.name}
                  </div>
                  <div style={{ color: '#888888', fontSize: '12px', fontFamily: "'Inter', sans-serif", marginBottom: '10px' }}>
                    {service.duration} min
                  </div>
                  <div
                    style={{
                      color: '#E8C89A',
                      fontWeight: 700,
                      fontSize: '18px',
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: service.badges.length > 0 ? '10px' : '0',
                    }}
                  >
                    {service.price} CHF
                  </div>
                  {service.badges.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {service.badges.map((badge) => (
                        <span
                          key={badge}
                          style={{
                            ...getBadgeStyle(badge),
                            fontSize: '10px',
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            padding: '3px 8px',
                            borderRadius: '50px',
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Location info */}
          <div
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '24px' }}>📍</span>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
                {pro.city}
              </div>
              <div style={{ color: '#888888', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                Déplacement à domicile disponible
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderTop: '1px solid rgba(232,200,154,0.3)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <button
          onClick={handleBook}
          className="btn-tap-gold"
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: '#E8C89A',
            color: '#0A0A0A',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Zap size={16} />
          RÉSERVER MAINTENANT — {ctaPrice} CHF
        </button>
      </div>
    </div>
  );
}
