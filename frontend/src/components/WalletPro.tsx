import React, { useState, useEffect } from 'react';
import { useProContext } from '../context/ProContext';
import { IconArrowUp, IconArrowDown } from './icons/Icons';
import { DEMO_WALLET } from '../data/mockData';

export default function WalletPro() {
  const { walletCooldownEnd, setWalletCooldownEnd } = useProContext();
  const [solde, setSolde] = useState(DEMO_WALLET.solde);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!walletCooldownEnd) {
      setTimeLeft(0);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((walletCooldownEnd - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setWalletCooldownEnd(null);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [walletCooldownEnd]);

  const isCooldown = timeLeft > 0;

  const handleVirement = () => {
    if (isCooldown) return;
    setSolde(0);
    setWalletCooldownEnd(Date.now() + 30000);
  };

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--void)',
      padding: '24px 20px 100px',
    }}>
      <span style={{
        fontFamily: 'Inter',
        fontSize: 22,
        fontWeight: 700,
        color: 'var(--t1)',
        display: 'block',
        marginBottom: 24,
      }}>
        Wallet
      </span>

      {/* Balance card */}
      <div style={{
        background: 'var(--d2)',
        borderRadius: 20,
        padding: '28px 24px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(242,208,107,0.05)',
        }} />
        <span style={{
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--t4)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 8,
        }}>
          Solde disponible
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 40,
          fontWeight: 700,
          color: 'var(--t1)',
          display: 'block',
          marginBottom: 4,
        }}>
          {solde.toFixed(2)} CHF
        </span>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 13,
          color: 'var(--t4)',
        }}>
          Sequestre: {DEMO_WALLET.sequestre.toFixed(2)} CHF
        </span>
      </div>

      {/* Virement button */}
      <button
        onClick={handleVirement}
        disabled={isCooldown || solde === 0}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          border: 'none',
          background: isCooldown || solde === 0
            ? 'rgba(255,255,255,0.06)'
            : '#F2D06B',
          color: isCooldown || solde === 0
            ? 'var(--t4)'
            : '#050507',
          fontFamily: 'Inter',
          fontSize: 15,
          fontWeight: 700,
          cursor: isCooldown || solde === 0 ? 'not-allowed' : 'pointer',
          marginBottom: 8,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <IconArrowUp size={18} color={isCooldown || solde === 0 ? 'var(--t4)' : '#050507'} />
        {isCooldown
          ? `Disponible dans ${timeLeft}s`
          : 'Virer sur mon compte'}
      </button>

      {isCooldown && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(242,208,107,0.06)',
          borderRadius: 10,
          border: '1px solid rgba(242,208,107,0.15)',
          marginBottom: 16,
        }}>
          <span style={{
            fontFamily: 'Inter',
            fontSize: 12,
            color: 'var(--t4)',
          }}>
            Virement en cours de traitement. Disponible dans {timeLeft} secondes.
          </span>
        </div>
      )}

      {/* Transactions */}
      <div style={{ marginTop: 24 }}>
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--t2)',
          display: 'block',
          marginBottom: 12,
        }}>
          Transactions recentes
        </span>
        {DEMO_WALLET.transactions.map((tx: any, i: number) => {
          const isEntree = tx.type === 'entree';
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < DEMO_WALLET.transactions.length - 1
                ? '1px solid rgba(255,255,255,0.05)'
                : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isEntree
                    ? 'rgba(242,208,107,0.1)'
                    : 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {isEntree
                    ? <IconArrowDown size={16} color="var(--gold)" />
                    : <IconArrowUp size={16} color="var(--t4)" />
                  }
                </div>
                <div>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--t2)',
                    display: 'block',
                  }}>
                    {tx.nom}
                  </span>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: 11,
                    color: 'var(--t4)',
                  }}>
                    {tx.date}
                  </span>
                </div>
              </div>
              <span style={{
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 600,
                color: isEntree ? 'var(--gold)' : 'var(--t3)',
              }}>
                {isEntree ? '+' : ''}{tx.montant} CHF
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
