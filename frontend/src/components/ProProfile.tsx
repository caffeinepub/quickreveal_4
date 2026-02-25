import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Star, Zap, Check, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function useCountUp(target: number, duration: number, delay: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, start]);
  return value;
}

const GALLERY_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

export default function ProProfile() {
  const { selectedPro, navigateTo, navigateToBookingFlow } = useAppContext();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const pro = selectedPro;

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const responseVal = useCountUp(pro?.responseTime || 8, 800, 0, statsStarted);
  const acceptanceVal = useCountUp(pro?.acceptanceRate || 97, 800, 150, statsStarted);
  const servicesVal = useCountUp(pro?.serviceCount || 124, 800, 300, statsStarted);

  if (!pro) {
    return (
      <div style={{ height: '100%', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => navigateTo('explorer')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Retour
        </button>
      </div>
    );
  }

  const services = pro.services || [
    { id: 's1', name: 'Coupe + Brushing', duration: '45min', price: 35, badge: 'Populaire' },
    { id: 's2', name: 'Coloration', duration: '90min', price: 85, badge: 'Nouveau' },
    { id: 's3', name: 'Soin Kératine', duration: '120min', price: 120, badge: 'Promo' },
    { id: 's4', name: 'Balayage', duration: '150min', price: 150 },
  ];

  const reviews = pro.reviews || [
    { id: 'r1', name: 'Sophie M.', rating: 5, text: 'Absolument incroyable ! Résultat parfait, je recommande vivement.' },
    { id: 'r2', name: 'Lucas B.', rating: 5, text: 'Pro très réactif, travail soigné. Reviendrai sans hésiter.' },
    { id: 'r3', name: 'Emma R.', rating: 4, text: 'Très bonne prestation, ponctuel et professionnel.' },
  ];

  const galleryGradients = pro.galleryGradients || GALLERY_GRADIENTS;

  const getInitials = (name: string) =>
    name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const badgeColor: Record<string, string> = {
    Populaire: 'rgba(212,175,55,0.2)',
    Nouveau: 'rgba(59,130,246,0.2)',
    Promo: 'rgba(239,68,68,0.2)',
  };
  const badgeTextColor: Record<string, string> = {
    Populaire: 'var(--gold)',
    Nouveau: '#60a5fa',
    Promo: '#f87171',
  };

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: 100,
        position: 'relative',
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 270,
          background: pro.coverGradient || pro.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 60%, var(--void) 100%)',
          }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigateTo('explorer')}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: 14,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={20} color="#fff" />
      </button>

      {/* Profile section */}
      <div style={{ padding: '0 20px', marginTop: -46 }}>
        {/* Avatar */}
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: '50%',
            background: pro.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
            border: '3px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            animation: 'breatheGold 2.5s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(212,175,55,0.4)',
            marginBottom: 12,
          }}
        >
          {pro.emoji || '✨'}
        </div>

        {/* Name + slogan */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--t1)',
            marginBottom: 4,
            lineHeight: 1.2,
          }}
        >
          {pro.name}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--t2)',
            fontStyle: 'italic',
            marginBottom: 12,
          }}
        >
          {pro.slogan || 'Expert beauté certifié NEXUS'}
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span
            style={{
              padding: '5px 10px',
              borderRadius: 20,
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid var(--edge-gold)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--gold)',
            }}
          >
            ⚡ Flash
          </span>
          {pro.hasRevolut && (
            <span
              style={{
                padding: '5px 10px',
                borderRadius: 20,
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                fontSize: 12,
                fontWeight: 700,
                color: '#60a5fa',
              }}
            >
              💳 Revolut ✅
            </span>
          )}
          <span
            style={{
              padding: '5px 10px',
              borderRadius: 20,
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              fontSize: 12,
              fontWeight: 700,
              color: '#fbbf24',
            }}
          >
            ⭐ {pro.rating || '4.9'} · {pro.reviewCount || 47} avis
          </span>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 0,
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid var(--edge-gold)',
            borderRadius: 22,
            padding: '16px 8px',
            marginBottom: 20,
          }}
        >
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>
              ⚡ {responseVal}
            </div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>
              MIN RÉPONSE
            </div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>
              ✓ {acceptanceVal}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>
              ACCEPTATION
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>
              🎯 {servicesVal}
            </div>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>
              PRESTATIONS
            </div>
          </div>
        </div>

        {/* Bio */}
        <p
          style={{
            fontSize: 14,
            color: 'var(--t2)',
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
          {pro.bio ||
            'Professionnel certifié avec plus de 5 ans d\'expérience. Spécialisé dans les techniques modernes et les soins personnalisés. Disponible à domicile ou en studio selon vos préférences.'}
        </p>

        {/* Services */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>
            Services
          </h2>
          <div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 8,
            }}
          >
            {services.map((svc: any) => {
              const isSelected = selectedService?.id === svc.id;
              return (
                <div key={svc.id} style={{ flexShrink: 0, width: 188 }}>
                  <div
                    onClick={() => setSelectedService(isSelected ? null : svc)}
                    style={{
                      width: 188,
                      background: 'var(--d3)',
                      border: isSelected
                        ? '1px solid var(--gold)'
                        : '1px solid var(--d4)',
                      borderRadius: 18,
                      padding: '16px 14px',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2)'
                        : 'none',
                      position: 'relative',
                    }}
                  >
                    {svc.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          padding: '3px 8px',
                          borderRadius: 8,
                          background: badgeColor[svc.badge] || 'rgba(212,175,55,0.2)',
                          fontSize: 10,
                          fontWeight: 700,
                          color: badgeTextColor[svc.badge] || 'var(--gold)',
                        }}
                      >
                        {svc.badge}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--t1)',
                        marginBottom: 6,
                        paddingRight: svc.badge ? 60 : 0,
                      }}
                    >
                      {svc.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10 }}>
                      {svc.duration}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: 'var(--gold)',
                        lineHeight: 1,
                      }}
                    >
                      {svc.price} CHF
                    </div>
                  </div>
                  {isSelected && (
                    <button
                      onClick={() => navigateToBookingFlow(pro, svc)}
                      style={{
                        width: '100%',
                        marginTop: 8,
                        padding: '10px',
                        borderRadius: 12,
                        background: 'var(--gold)',
                        border: 'none',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: 'pointer',
                        animation: 'riseIn 0.3s ease both',
                      }}
                    >
                      Réserver ce service
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>
            Galerie
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            {galleryGradients.slice(0, 4).map((grad: string, i: number) => (
              <div
                key={i}
                style={{
                  height: 120,
                  borderRadius: 14,
                  background: grad,
                }}
              />
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 14 }}>
            Avis clients
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.map((review: any) => (
              <div
                key={review.id}
                style={{
                  background: 'var(--d2)',
                  border: '1px solid var(--d4)',
                  borderRadius: 16,
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--gold), #b8860b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#000',
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(review.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                      {review.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gold)' }}>
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          padding: '12px 20px 28px',
          background: 'linear-gradient(to top, var(--void) 60%, transparent)',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigateToBookingFlow(pro, selectedService || services[0])}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, var(--gold) 0%, #b8860b 50%, var(--gold) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientDrift 3s ease infinite',
            border: 'none',
            color: '#000',
            fontSize: 16,
            fontWeight: 900,
            cursor: 'pointer',
            textShadow: '0 1px 2px rgba(255,255,255,0.3)',
            boxShadow: '0 4px 24px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2)',
            letterSpacing: '0.02em',
          }}
        >
          ⚡ RÉSERVER MAINTENANT — {selectedService?.price || pro.startingPrice || 35} CHF
        </button>
      </div>
    </div>
  );
}
