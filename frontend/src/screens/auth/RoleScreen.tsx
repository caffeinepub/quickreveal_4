import React from 'react';
import { IconUser, IconEdit, IconShield, IconArrowLeft } from '../../components/icons';

interface RoleScreenProps {
  onSelectClient: () => void;
  onSelectPro: () => void;
  onSelectAdmin: () => void;
  onBack: () => void;
}

export default function RoleScreen({ onSelectClient, onSelectPro, onSelectAdmin, onBack }: RoleScreenProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '48px 24px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', background: '#0D0D13', border: '1px solid #1C1C26', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <IconArrowLeft size={18} color="#F4F4F8" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#F4F4F8', letterSpacing: '-0.03em' }}>Choisir votre role</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9898B4' }}>Comment souhaitez-vous utiliser NEXUS ?</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 24px 24px' }}>
        {[
          {
            onClick: onSelectClient,
            icon: <IconUser size={24} color="#F2D06B" />,
            iconBg: 'rgba(242,208,107,0.1)',
            title: 'Client',
            desc: 'Reservez des prestations beaute pres de chez vous. Coiffure, barbier, esthetique, massage.',
            tags: ['Reservation rapide', 'Paiement TWINT', 'Suivi en direct'],
            tagColor: '#F2D06B',
            tagBg: 'rgba(242,208,107,0.08)',
            tagBorder: 'rgba(242,208,107,0.15)',
            hoverBorder: 'rgba(242,208,107,0.3)',
          },
          {
            onClick: onSelectPro,
            icon: <IconEdit size={24} color="#5B7FFF" />,
            iconBg: 'rgba(91,127,255,0.1)',
            title: 'Professionnel',
            desc: 'Gerez votre activite beaute. Agenda, paiements TWINT, radar de demandes.',
            tags: ['Radar demandes', 'Wallet CHF', 'Mon Business'],
            tagColor: '#5B7FFF',
            tagBg: 'rgba(91,127,255,0.08)',
            tagBorder: 'rgba(91,127,255,0.15)',
            hoverBorder: 'rgba(91,127,255,0.3)',
          },
        ].map((card) => (
          <button
            key={card.title}
            onClick={card.onClick}
            style={{ width: '100%', background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 20, padding: '24px 20px', marginBottom: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 16 }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#F4F4F8', marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#9898B4', lineHeight: 1.6 }}>{card.desc}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {card.tags.map((tag) => (
                  <span key={tag} style={{ padding: '3px 10px', background: card.tagBg, border: `1px solid ${card.tagBorder}`, borderRadius: 999, fontSize: 11, color: card.tagColor, fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}

        <button onClick={onSelectAdmin} style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconShield size={14} color="#54546C" />
          <span style={{ fontSize: 12, color: '#54546C', fontWeight: 500 }}>Acces administrateur</span>
        </button>
      </div>
    </div>
  );
}
