import React from 'react';
import { useProContext } from '../context/ProContext';

interface DashboardScreenProps {
  proActif?: boolean;
  onActivate?: () => void;
}

export default function DashboardScreen({ proActif: proActifProp, onActivate }: DashboardScreenProps) {
  // Try to read from context; fall back to prop
  let proActif = proActifProp ?? false;
  let proData = {
    prenom: 'Alexandre',
    ville: 'Lausanne',
    categorie: 'barber',
    iban: '',
    photos: [null, null, null, null] as (string | null)[],
    services: [] as { nom: string; prix: number; duree: number; badge: string | null }[],
    flashActif: false,
    slogan: '',
    bio: '',
  };

  try {
    const ctx = useProContext();
    // prop takes precedence over context for proActif (ProLayout owns this state)
    if (proActifProp === undefined) {
      proActif = ctx.proActif;
    }
    proData = ctx.proData;
  } catch {
    // fallback — context not available
  }

  const stats = [
    { label: 'Prestations', value: proActif ? '12' : '0' },
    { label: 'Ce mois', value: proActif ? '240 CHF' : '0 CHF' },
    { label: 'Note', value: proActif ? '4.9' : '-' },
    { label: 'Avis', value: proActif ? '8' : '0' },
  ];

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      padding: '24px 20px 100px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 400 }}>
            Bonjour,
          </span>
          {proActif && (
            <div style={{
              background: 'rgba(242,208,107,0.12)',
              border: '1px solid rgba(242,208,107,0.3)',
              borderRadius: 20,
              padding: '4px 10px',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F2D06B', letterSpacing: '0.05em' }}>
                ESSAI GRATUIT J1/7
              </span>
            </div>
          )}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
          {proData.prenom}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0 0' }}>
          {proData.categorie} — {proData.ville}
        </p>
      </div>

      {/* Status Banner */}
      {!proActif ? (
        <div style={{
          background: 'rgba(242,208,107,0.08)',
          border: '1px solid rgba(242,208,107,0.2)',
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#F2D06B', margin: '0 0 4px' }}>
            Profil non active
          </p>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: '0 0 12px' }}>
            Completez votre profil dans Mon Business pour commencer a recevoir des clients.
          </p>
          {onActivate && (
            <button
              onClick={onActivate}
              style={{
                background: '#F2D06B',
                color: '#050507',
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                borderRadius: 10,
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Activer mon profil
            </button>
          )}
        </div>
      ) : (
        <div style={{
          background: 'rgba(0,217,122,0.08)',
          border: '1px solid rgba(0,217,122,0.2)',
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#00D97A', margin: '0 0 4px' }}>
            Profil actif
          </p>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0 }}>
            Votre profil est visible par les clients. Essai gratuit en cours — 7 jours.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 28,
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--d1)',
            borderRadius: 16,
            padding: '18px 16px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 400 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Actions rapides
        </h2>
        {[
          { label: 'Voir mon profil public', desc: 'Apercu client de votre fiche' },
          { label: 'Modifier mes services', desc: 'Prix, durees, descriptions' },
          { label: 'Gerer mes disponibilites', desc: 'Horaires et jours de travail' },
        ].map((action) => (
          <div key={action.label} style={{
            background: 'var(--d1)',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 8,
            border: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>
                {action.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                {action.desc}
              </div>
            </div>
            <span style={{ color: 'var(--t3)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
