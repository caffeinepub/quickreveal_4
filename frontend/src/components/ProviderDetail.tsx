import React, { useState } from 'react';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ProviderDetail() {
  const { selectedPro, navigateTo } = useAppContext();
  const [selectedService, setSelectedService] = useState<any>(null);

  const pro = selectedPro;

  if (!pro) {
    return (
      <div
        style={{
          height: '100%',
          background: 'var(--void)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => navigateTo('explorer')}
          style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Retour
        </button>
      </div>
    );
  }

  const services = (pro as any).services || [
    { id: 's1', name: 'Coupe + Brushing', duration: '45min', price: 35, badge: 'Populaire' },
    { id: 's2', name: 'Coloration', duration: '90min', price: 85 },
  ];

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        paddingBottom: 100,
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 220,
          background: (pro as any).coverGradient || (pro as any).gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigateTo('explorer')}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>
      </div>

      <div style={{ padding: '0 20px', marginTop: -40 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: (pro as any).gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
            border: '3px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            marginBottom: 12,
          }}
        >
          {(pro as any).emoji || '✨'}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
          {pro.name}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--t2)', fontStyle: 'italic', marginBottom: 12 }}>
          {(pro as any).slogan || 'Expert beauté certifié NEXUS'}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span
            style={{
              padding: '4px 10px',
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
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              fontSize: 12,
              fontWeight: 700,
              color: '#fbbf24',
            }}
          >
            ⭐ {(pro as any).rating || '4.9'}
          </span>
        </div>

        {/* Services */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 12 }}>
            Services
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {services.map((svc: any) => (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: selectedService?.id === svc.id ? 'rgba(212,175,55,0.1)' : 'var(--d2)',
                  border:
                    selectedService?.id === svc.id
                      ? '1px solid var(--gold)'
                      : '1px solid var(--d4)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
                    {svc.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>{svc.duration}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--gold)' }}>
                  {svc.price} CHF
                </div>
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
          onClick={() => navigateTo('bookingFlow')}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
            border: 'none',
            color: '#000',
            fontSize: 15,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          }}
        >
          ⚡ RÉSERVER — {selectedService?.price || (pro as any).startingPrice || 35} CHF
        </button>
      </div>
    </div>
  );
}
