import React, { useState, useEffect } from 'react';

const DEMO_RADAR = {
  enAttente: [
    { id: 'req-1', clientPrenom: 'Thomas', clientNom: 'M.', clientInitials: 'TM', note: 4.9, distance: 0.8, service: 'Coupe + Barbe', montant: 55, expiresIn: 228 },
    { id: 'req-2', clientPrenom: 'Lucas', clientNom: 'B.', clientInitials: 'LB', note: 4.7, distance: 1.2, service: 'Degrade premium', montant: 45, expiresIn: 408 },
    { id: 'req-3', clientPrenom: 'Julien', clientNom: 'P.', clientInitials: 'JP', note: 4.6, distance: 0.6, service: 'Degrade', montant: 45, expiresIn: 0 },
  ],
  confirmees: [
    { id: 'conf-1', clientPrenom: 'Lucas', clientNom: 'B.', clientInitials: 'LB', service: 'Degrade premium', montant: 45, messages: [{ from: 'client', text: 'Bonjour ! Je confirme mon rendez-vous. Je serai la a l heure.', time: '10:02' }, { from: 'pro', text: 'Parfait ! Je serai pret. Avez-vous une preference particuliere pour la coupe ?', time: '10:04' }, { from: 'client', text: 'Oui, un degrade classique avec les cotes courts s il vous plait.', time: '10:05' }] },
    { id: 'conf-2', clientPrenom: 'Thomas', clientNom: 'M.', clientInitials: 'TM', service: 'Coupe + Barbe', montant: 55, messages: [] },
    { id: 'conf-3', clientPrenom: 'Antoine', clientNom: 'R.', clientInitials: 'AR', service: 'Rasage traditionnel', montant: 40, messages: [] },
    { id: 'conf-4', clientPrenom: 'Mehdi', clientNom: 'A.', clientInitials: 'MA', service: 'Coupe homme', montant: 35, messages: [] },
  ],
  historique: [
    { clientPrenom: 'Mehdi', clientNom: 'A.', clientInitials: 'MA', service: 'Coupe homme', statut: 'fait' },
    { clientPrenom: 'Julien', clientNom: 'P.', clientInitials: 'JP', service: 'Barbe design', statut: 'decline' },
  ],
};

type RadarTab = 'attente' | 'confirmees' | 'historique';

export default function RadarPro() {
  const [activeTab, setActiveTab] = useState<RadarTab>('attente');
  const [requests, setRequests] = useState(DEMO_RADAR.enAttente.map(r => ({ ...r })));
  const [confirmed, setConfirmed] = useState(DEMO_RADAR.confirmees.map(r => ({ ...r })));
  const [smsToast, setSmsToast] = useState<{ message: string; numero: string } | null>(null);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev.map(r => ({
        ...r,
        expiresIn: Math.max(0, r.expiresIn - 1),
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showSms = (message: string, numero: string) => {
    setSmsToast({ message, numero });
    setTimeout(() => setSmsToast(null), 4300);
  };

  const handleAccept = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    showSms(`Reservation acceptee — ${req.service}`, '+41 79 000 00 00');
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const tabs: { id: RadarTab; label: string; count: number }[] = [
    { id: 'attente', label: 'En attente', count: requests.length },
    { id: 'confirmees', label: 'Confirmees', count: confirmed.length },
    { id: 'historique', label: 'Historique', count: DEMO_RADAR.historique.length },
  ];

  return (
    <div style={{ minHeight: '100%', background: 'var(--void)', fontFamily: 'Inter, sans-serif' }}>
      {/* SMS Toast */}
      {smsToast && (
        <div style={{
          position: 'fixed',
          top: 72,
          left: 20,
          right: 20,
          zIndex: 999,
          background: 'rgba(9,9,13,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: '4px solid #00D97A',
          borderRadius: 16,
          padding: '16px 18px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          animation: 'slideDown 0.3s ease-out',
          maxWidth: 390,
          margin: '0 auto',
        }}>
          <div style={{ color: '#00D97A', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F4F4F8' }}>SMS envoye</div>
            <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2 }}>{smsToast.message}</div>
            <div style={{ fontSize: 11, color: '#54546C', marginTop: 4 }}>{smsToast.numero}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', margin: '0 0 20px' }}>
          Radar
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                padding: '9px 4px',
                borderRadius: 10,
                border: 'none',
                background: activeTab === id ? 'var(--d3)' : 'var(--d1)',
                color: activeTab === id ? 'var(--t1)' : 'var(--t3)',
                fontSize: 11,
                fontWeight: activeTab === id ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
              }}
            >
              {label}
              {count > 0 && (
                <span style={{
                  marginLeft: 4,
                  background: activeTab === id ? '#F2D06B' : 'rgba(255,255,255,0.1)',
                  color: activeTab === id ? '#050507' : 'var(--t3)',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 100px' }}>
        {activeTab === 'attente' && (
          <div>
            {requests.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--t3)', fontSize: 14 }}>
                Aucune demande en attente
              </div>
            )}
            {requests.map((req) => (
              <div key={req.id} style={{
                background: 'var(--d1)',
                borderRadius: 18,
                padding: '18px',
                marginBottom: 12,
                border: req.expiresIn === 0 ? '1px solid rgba(255,80,80,0.3)' : '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--d3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--t1)',
                    flexShrink: 0,
                  }}>
                    {req.clientInitials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
                      {req.clientPrenom} {req.clientNom}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                      {req.note} — {req.distance} km
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: req.expiresIn === 0 ? '#FF5050' : '#F2D06B',
                    background: req.expiresIn === 0 ? 'rgba(255,80,80,0.1)' : 'rgba(242,208,107,0.1)',
                    padding: '4px 8px',
                    borderRadius: 8,
                  }}>
                    {req.expiresIn === 0 ? 'Expire' : formatTime(req.expiresIn)}
                  </div>
                </div>

                <div style={{
                  background: 'var(--d2)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--t2)' }}>{req.service}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{req.montant} CHF</span>
                </div>

                {req.expiresIn > 0 && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => handleDecline(req.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'transparent',
                        color: 'var(--t3)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Decliner
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      style={{
                        flex: 2,
                        padding: '12px',
                        borderRadius: 12,
                        border: 'none',
                        background: '#F2D06B',
                        color: '#050507',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Accepter — {req.montant} CHF
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'confirmees' && (
          <div>
            {confirmed.map((conf) => (
              <div key={conf.id} style={{
                background: 'var(--d1)',
                borderRadius: 18,
                padding: '18px',
                marginBottom: 12,
                border: '1px solid rgba(0,217,122,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(0,217,122,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#00D97A',
                    flexShrink: 0,
                  }}>
                    {conf.clientInitials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
                      {conf.clientPrenom} {conf.clientNom}
                    </div>
                    <div style={{ fontSize: 12, color: '#00D97A', marginTop: 2 }}>
                      Confirme — {conf.service}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
                    {conf.montant} CHF
                  </div>
                </div>

                {conf.messages.length > 0 && (
                  <div style={{
                    background: 'var(--d2)',
                    borderRadius: 12,
                    padding: '12px',
                    maxHeight: 120,
                    overflowY: 'auto',
                  }}>
                    {conf.messages.map((msg, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.from === 'pro' ? 'flex-end' : 'flex-start',
                        marginBottom: 8,
                      }}>
                        <div style={{
                          maxWidth: '80%',
                          background: msg.from === 'pro' ? 'rgba(242,208,107,0.15)' : 'var(--d3)',
                          borderRadius: 10,
                          padding: '8px 10px',
                        }}>
                          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{msg.text}</div>
                          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'historique' && (
          <div>
            {DEMO_RADAR.historique.map((item, i) => (
              <div key={i} style={{
                background: 'var(--d1)',
                borderRadius: 16,
                padding: '16px 18px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: item.statut === 'fait' ? 'rgba(0,217,122,0.1)' : 'rgba(255,80,80,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: item.statut === 'fait' ? '#00D97A' : '#FF5050',
                  flexShrink: 0,
                }}>
                  {item.clientInitials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>
                    {item.clientPrenom} {item.clientNom}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{item.service}</div>
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.statut === 'fait' ? '#00D97A' : '#FF5050',
                  background: item.statut === 'fait' ? 'rgba(0,217,122,0.1)' : 'rgba(255,80,80,0.1)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.04em',
                }}>
                  {item.statut === 'fait' ? 'Effectue' : 'Decline'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
