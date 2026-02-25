import React from 'react';
import { useProContext } from '../context/ProContext';
import { IconFlash, IconStar, IconCalendar, IconUser } from './icons/Icons';

export default function DashboardScreen() {
  const { proActif, proData } = useProContext();

  const stats = [
    { label: 'Reservations', value: proActif ? '3' : '0', icon: IconCalendar, iconColor: 'var(--gold)' },
    { label: 'Clients', value: proActif ? '12' : '0', icon: IconUser, iconColor: 'var(--gold)' },
    { label: 'Note moyenne', value: proActif ? '4.8' : '—', icon: IconStar, iconColor: 'var(--gold)' },
    { label: 'Flash actif', value: proData.flashActif ? 'Oui' : 'Non', icon: IconFlash, iconColor: 'var(--gold)' },
  ];

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      padding: '24px 20px 100px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--t1)',
          }}>
            Bonjour, {proData.prenom}
          </span>
          {proActif && (
            <div style={{
              background: 'rgba(242,208,107,0.15)',
              border: '1px solid rgba(242,208,107,0.4)',
              borderRadius: 20,
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--gold)',
              }} />
              <span style={{
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.05em',
              }}>
                ESSAI GRATUIT J1/7
              </span>
            </div>
          )}
        </div>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          color: 'var(--t4)',
        }}>
          {proData.ville} — {proData.categorie}
        </span>
      </div>

      {/* Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 24,
      }}>
        {stats.map(({ label, value, icon: Icon, iconColor }) => (
          <div key={label} style={{
            background: 'var(--d2)',
            borderRadius: 16,
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon size={16} color={iconColor} />
              <span style={{
                fontFamily: 'Inter',
                fontSize: 11,
                color: 'var(--t4)',
                fontWeight: 500,
              }}>
                {label}
              </span>
            </div>
            <span style={{
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--t1)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Status banner */}
      {!proActif && (
        <div style={{
          background: 'var(--d2)',
          borderRadius: 16,
          padding: '20px',
          border: '1px solid rgba(242,208,107,0.2)',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 14,
            color: 'var(--t3)',
            lineHeight: 1.5,
          }}>
            Activez votre profil dans l'onglet Business pour commencer a recevoir des reservations.
          </span>
        </div>
      )}

      {proActif && (
        <div style={{
          background: 'var(--d2)',
          borderRadius: 16,
          padding: '20px',
          border: '1px solid rgba(242,208,107,0.15)',
        }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--gold)',
            display: 'block',
            marginBottom: 8,
          }}>
            Profil actif
          </span>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: 'var(--t3)',
            lineHeight: 1.5,
          }}>
            Votre profil est visible par les clients dans l'Explorer. Les reservations arrivent directement ici.
          </span>
        </div>
      )}
    </div>
  );
}
