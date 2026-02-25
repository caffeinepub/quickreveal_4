import React, { useState, useEffect } from 'react';
import { useProContext } from '../context/ProContext';

const DEMO_WALLET = {
  solde: 240,
  sequestre: 55,
  graphique: [40, 65, 55, 90, 110, 80, 20],
  jours: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  transactions: [
    { nom: 'Thomas M.', montant: 55, type: 'entree', date: "Aujourd hui 10:00" },
    { nom: 'Lucas B.', montant: 45, type: 'entree', date: "Aujourd hui 13:30" },
    { nom: 'Antoine R.', montant: 40, type: 'entree', date: "Hier 16:00" },
    { nom: 'Mehdi A.', montant: 35, type: 'entree', date: "Hier 11:00" },
    { nom: 'Julien P.', montant: 30, type: 'entree', date: "Lun 14:30" },
    { nom: 'Virement IBAN', montant: -65, type: 'sortie', date: "Lun 09:00" },
  ],
};

export default function WalletPro() {
  const { walletCooldownEnd, setWalletCooldownEnd } = useProContext();
  const [solde, setSolde] = useState(DEMO_WALLET.solde);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [smsToast, setSmsToast] = useState<{ message: string; numero: string } | null>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletCooldownEnd) {
        const left = Math.max(0, Math.ceil((walletCooldownEnd - Date.now()) / 1000));
        setCooldownLeft(left);
        if (left === 0) setWalletCooldownEnd(null);
      } else {
        setCooldownLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [walletCooldownEnd]);

  const showSms = (message: string, numero: string) => {
    setSmsToast({ message, numero });
    setTimeout(() => setSmsToast(null), 4300);
  };

  const handleVirement = () => {
    if (cooldownLeft > 0 || solde <= 0) return;
    const montant = solde;
    setSolde(0);
    setWalletCooldownEnd(Date.now() + 30000);
    setCooldownLeft(30);
    showSms(`Virement de ${montant} CHF initie vers votre IBAN`, '+41 79 000 00 00');
  };

  const maxVal = Math.max(...DEMO_WALLET.graphique);

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

      <div style={{ padding: '24px 20px 100px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', margin: '0 0 24px' }}>
          Wallet
        </h1>

        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--d1), var(--d2))',
          borderRadius: 20,
          padding: '24px',
          marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            Solde disponible
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
            {solde} CHF
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>
            En sequestre : {DEMO_WALLET.sequestre} CHF
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{
          background: 'var(--d1)',
          borderRadius: 18,
          padding: '20px',
          marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            Cette semaine
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {DEMO_WALLET.graphique.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: barsVisible ? `${(val / maxVal) * 64}px` : '0px',
                  background: i === 4 ? '#F2D06B' : 'var(--d3)',
                  borderRadius: '4px 4px 0 0',
                  transition: `height 0.4s ease ${i * 80}ms`,
                }} />
                <span style={{ fontSize: 9, color: 'var(--t3)' }}>{DEMO_WALLET.jours[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleVirement}
          disabled={cooldownLeft > 0 || solde <= 0}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 16,
            border: 'none',
            background: cooldownLeft > 0 || solde <= 0 ? 'var(--d2)' : '#F2D06B',
            color: cooldownLeft > 0 || solde <= 0 ? 'var(--t3)' : '#050507',
            fontSize: 15,
            fontWeight: 700,
            cursor: cooldownLeft > 0 || solde <= 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            marginBottom: 24,
            transition: 'all 0.2s ease',
          }}
        >
          {cooldownLeft > 0
            ? `Disponible dans ${cooldownLeft}s`
            : solde <= 0
            ? 'Solde insuffisant'
            : 'Virer sur mon compte'}
        </button>

        {/* Transactions */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            Transactions
          </div>
          {DEMO_WALLET.transactions.map((tx, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < DEMO_WALLET.transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: tx.type === 'entree' ? 'rgba(0,217,122,0.1)' : 'rgba(255,80,80,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: tx.type === 'entree' ? '#00D97A' : '#FF5050',
                  fontWeight: 700,
                }}>
                  {tx.type === 'entree' ? '+' : '-'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{tx.nom}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{tx.date}</div>
                </div>
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: tx.type === 'entree' ? '#00D97A' : '#FF5050',
              }}>
                {tx.type === 'entree' ? '+' : ''}{tx.montant} CHF
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
