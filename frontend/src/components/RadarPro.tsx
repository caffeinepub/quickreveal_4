import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,7 5.5,10.5 12,3" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="3" x2="11" y2="11" />
    <line x1="11" y1="3" x2="3" y2="11" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="7" cy="7" r="5.5" />
    <polyline points="7,4 7,7 9.5,9" />
  </svg>
);

interface RadarRequest {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  price: number;
  status: 'pending' | 'accepted' | 'declined';
}

const MOCK_REQUESTS: RadarRequest[] = [
  {
    id: '1',
    clientName: 'Marie Dupont',
    service: 'Coupe + Brushing',
    date: 'Aujourd\'hui',
    time: '14h30',
    address: 'Rue de Rive 12, Genève',
    price: 85,
    status: 'pending',
  },
  {
    id: '2',
    clientName: 'Sophie Laurent',
    service: 'Coloration complète',
    date: 'Demain',
    time: '10h00',
    address: 'Avenue de la Gare 5, Lausanne',
    price: 140,
    status: 'pending',
  },
  {
    id: '3',
    clientName: 'Emma Blanc',
    service: 'Soin visage',
    date: 'Vendredi',
    time: '16h00',
    address: 'Rue du Marché 8, Fribourg',
    price: 95,
    status: 'accepted',
  },
];

export default function RadarPro() {
  const [requests, setRequests] = useState<RadarRequest[]>(MOCK_REQUESTS);

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  };

  const pending = requests.filter(r => r.status === 'pending');
  const handled = requests.filter(r => r.status !== 'pending');

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingBottom: '80px' }}>
      <GlobalHeader />

      <div style={{ paddingTop: '80px', padding: '80px 16px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '4px',
          }}>
            Radar
          </h1>
          <p style={{ fontSize: '13px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
            {pending.length} demande{pending.length !== 1 ? 's' : ''} en attente
          </p>
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#54546C',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              fontFamily: 'Inter, sans-serif',
            }}>
              En attente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pending.map(req => (
                <div key={req.id} style={{
                  background: '#0D0D13',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#F4F4F8',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {req.clientName}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#54546C',
                        marginTop: '2px',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {req.service}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#F2D06B',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {req.price} CHF
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '14px',
                    fontSize: '12px',
                    color: '#54546C',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ClockIcon />
                      {req.date} · {req.time}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '12px',
                    color: '#54546C',
                    marginBottom: '14px',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {req.address}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleDecline(req.id)}
                      style={{
                        flex: 1,
                        height: '40px',
                        background: 'rgba(255,80,80,0.08)',
                        border: '1px solid rgba(255,80,80,0.2)',
                        borderRadius: '10px',
                        color: '#FF5050',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <XIcon />
                      Décliner
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      style={{
                        flex: 1,
                        height: '40px',
                        background: 'rgba(0,217,122,0.08)',
                        border: '1px solid rgba(0,217,122,0.2)',
                        borderRadius: '10px',
                        color: '#00D97A',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <CheckIcon />
                      Accepter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Handled requests */}
        {handled.length > 0 && (
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#54546C',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Traitées
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {handled.map(req => (
                <div key={req.id} style={{
                  background: '#0D0D13',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.6,
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#F4F4F8', fontFamily: 'Inter, sans-serif' }}>
                      {req.clientName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#54546C', fontFamily: 'Inter, sans-serif' }}>
                      {req.service}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: req.status === 'accepted' ? '#00D97A' : '#FF5050',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {req.status === 'accepted' ? 'Accepté' : 'Décliné'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && handled.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#54546C',
            fontFamily: 'Inter, sans-serif',
          }}>
            <div style={{ fontSize: '14px' }}>Aucune demande pour le moment</div>
          </div>
        )}
      </div>

      <BottomNav activeTab="radar" />
    </div>
  );
}
