import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import BottomNav from './BottomNav';
import GlobalHeader from './GlobalHeader';

const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="13" x2="8" y2="3" />
    <polyline points="4,7 8,3 12,7" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <polyline points="4,9 8,13 12,9" />
  </svg>
);

interface ToastItem {
  id: string;
  message: string;
}

const CHART_DATA = [
  { day: 'L', amount: 45 },
  { day: 'M', amount: 120 },
  { day: 'M', amount: 80 },
  { day: 'J', amount: 200 },
  { day: 'V', amount: 95 },
  { day: 'S', amount: 240 },
  { day: 'D', amount: 60 },
];

export default function WalletPro() {
  const { wallet } = useAppContext();
  const [virementDone, setVirementDone] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleVirement = () => {
    if (virementDone) return;
    setVirementDone(true);

    const toastId = Date.now().toString();
    setToasts(prev => [...prev, { id: toastId, message: `Virement de ${wallet.balance} CHF vers votre Revolut` }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 5000);

    timerRef.current = setTimeout(() => {
      setVirementDone(false);
    }, 30000);
  };

  const maxAmount = Math.max(...CHART_DATA.map(d => d.amount));
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div style={{ minHeight: '100vh', background: '#050507', paddingBottom: '80px' }}>
      <GlobalHeader />

      {/* Toast notifications */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '380px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: '#0D0D13',
            border: '1px solid #1E1E26',
            borderLeft: '3px solid #00D97A',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {toast.message}
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '80px', padding: '80px 16px 0' }}>
        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0A0A0A, #0F0E0A)',
          border: '1px solid rgba(242,208,107,0.15)',
          borderRadius: '20px',
          padding: '28px 24px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#54546C',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif',
          }}>
            SOLDE DISPONIBLE
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#F2D06B',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1,
            marginBottom: '20px',
          }}>
            {wallet.balance} CHF
          </div>

          {/* Escrow */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#F4F4F8',
              fontFamily: 'Inter, sans-serif',
            }}>
              {wallet.escrow} CHF séquestre
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#54546C',
              marginTop: '3px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Libéré dans 48h après prestation
            </div>
          </div>

          {/* Virement button */}
          <button
            onClick={handleVirement}
            disabled={virementDone}
            style={{
              width: '100%',
              height: '48px',
              background: virementDone ? '#1C1C26' : '#F2D06B',
              color: virementDone ? '#54546C' : '#050507',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: virementDone ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {virementDone ? (
              'Virement initié'
            ) : (
              <>
                <ArrowUpIcon />
                Virer vers Revolut
              </>
            )}
          </button>
        </div>

        {/* Chart */}
        <div style={{
          background: '#0D0D13',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#54546C',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, sans-serif',
          }}>
            Cette semaine
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            height: '80px',
          }}>
            {CHART_DATA.map((d, i) => {
              const isToday = i === todayIndex;
              const barHeight = Math.max(8, (d.amount / maxAmount) * 72);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    background: isToday ? '#F2D06B' : '#1C1C26',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s',
                  }} />
                  <span style={{
                    fontSize: '10px',
                    color: isToday ? '#F2D06B' : '#2E2E3E',
                    fontWeight: isToday ? 700 : 400,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div style={{
          background: '#0D0D13',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#54546C',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, sans-serif',
          }}>
            Transactions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {wallet.transactions.map(tx => (
              <div key={tx.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: tx.type === 'credit' ? 'rgba(0,217,122,0.08)' : 'rgba(255,80,80,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tx.type === 'credit' ? '#00D97A' : '#FF5050',
                  flexShrink: 0,
                }}>
                  {tx.type === 'credit' ? <ArrowDownIcon /> : <ArrowUpIcon />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#F4F4F8',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {tx.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#54546C',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {tx.date}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: tx.type === 'credit' ? '#00D97A' : '#FF5050',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {tx.type === 'credit' ? '+' : ''}{tx.amount} CHF
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav activeTab="wallet" />
    </div>
  );
}
