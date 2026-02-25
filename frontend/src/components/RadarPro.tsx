import React from 'react';
import { IconRadar, IconCheck, IconClock } from './icons/Icons';
import { DEMO_RADAR } from '../data/mockData';

export default function RadarPro() {
  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      padding: '24px 20px 100px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <IconRadar size={22} color="var(--gold)" />
        <span style={{
          fontFamily: 'Inter',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--t1)',
        }}>
          Radar
        </span>
      </div>

      {/* Pending requests */}
      {DEMO_RADAR.enAttente.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--t4)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 12,
          }}>
            En attente ({DEMO_RADAR.enAttente.length})
          </span>
          {DEMO_RADAR.enAttente.map((req, i) => (
            <RequestCard
              key={i}
              clientName={`${req.clientPrenom} ${req.clientNom}`}
              service={req.service}
              amount={req.montant}
              type="pending"
            />
          ))}
        </div>
      )}

      {/* Confirmed */}
      {DEMO_RADAR.confirmees.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--t4)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 12,
          }}>
            Confirmes ({DEMO_RADAR.confirmees.length})
          </span>
          {DEMO_RADAR.confirmees.map((req, i) => (
            <RequestCard
              key={i}
              clientName={`${req.clientPrenom} ${req.clientNom}`}
              service={req.service}
              amount={req.montant}
              type="confirmed"
            />
          ))}
        </div>
      )}

      {/* History */}
      {DEMO_RADAR.historique.length > 0 && (
        <div>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--t4)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 12,
          }}>
            Historique
          </span>
          {DEMO_RADAR.historique.map((req, i) => (
            <RequestCard
              key={i}
              clientName={`${req.clientPrenom} ${req.clientNom}`}
              service={req.service}
              type="history"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RequestCardProps {
  clientName: string;
  service: string;
  amount?: number;
  type: 'pending' | 'confirmed' | 'history';
}

function RequestCard({ clientName, service, amount, type }: RequestCardProps) {
  return (
    <div style={{
      background: 'var(--d2)',
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 10,
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--t1)',
          display: 'block',
          marginBottom: 2,
        }}>
          {clientName}
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          color: 'var(--t4)',
        }}>
          {service}{amount !== undefined ? ` — ${amount} CHF` : ''}
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 20,
        background: type === 'confirmed'
          ? 'rgba(242,208,107,0.1)'
          : type === 'pending'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.04)',
      }}>
        {type === 'confirmed' ? (
          <IconCheck size={12} color="var(--gold)" />
        ) : (
          <IconClock size={12} color="var(--t4)" />
        )}
        <span style={{
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: 600,
          color: type === 'confirmed' ? 'var(--gold)' : 'var(--t4)',
        }}>
          {type === 'confirmed' ? 'Confirme' : type === 'pending' ? 'En attente' : 'Termine'}
        </span>
      </div>
    </div>
  );
}
