import React, { useState } from 'react';
import { IconShield } from '../components/icons';

interface SetupScreenProps {
  onComplete: () => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [payrexxInstance, setPayrexxInstance] = useState('');
  const [payrexxSecret, setPayrexxSecret] = useState('');
  const [workerUrl, setWorkerUrl] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirm, setAdminConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!payrexxInstance.trim()) { setError("L'instance Payrexx est requise."); return; }
    if (!payrexxSecret.trim()) { setError('Le secret Payrexx est requis.'); return; }
    if (!workerUrl.trim()) { setError("L'URL du Worker est requise."); return; }
    if (!adminEmail.trim()) { setError("L'email admin est requis."); return; }
    if (!adminPassword.trim() || adminPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres.');
      return;
    }
    if (adminPassword !== adminConfirm) { setError('Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    try {
      localStorage.setItem('nexus_payrexx_instance', payrexxInstance.trim());
      localStorage.setItem('nexus_payrexx_secret', payrexxSecret.trim());
      localStorage.setItem('nexus_worker_url', workerUrl.trim());
      localStorage.setItem('nexus_admin_email', adminEmail.trim().toLowerCase());
      localStorage.setItem('nexus_admin_password', adminPassword);
      localStorage.setItem('nexus_setup_done', '1');
      onComplete();
    } catch {
      setError('Erreur lors de la sauvegarde. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', height: 52, background: '#0D0D13', border: '1px solid #1C1C26',
    borderRadius: 12, padding: '0 16px', color: '#F4F4F8', fontFamily: 'Inter, sans-serif',
    fontSize: 16, outline: 'none', boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#9898B4',
    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
  };
  const section: React.CSSProperties = {
    background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 16,
    padding: '20px 18px', marginBottom: 16,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '48px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(242,208,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconShield size={22} color="#F2D06B" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, color: '#F4F4F8', letterSpacing: '-0.03em' }}>Configuration initiale</div>
            <div style={{ fontSize: 12, color: '#9898B4', marginTop: 2 }}>NEXUS Platform</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#9898B4', lineHeight: 1.6 }}>
          Configurez les services externes avant de lancer la plateforme.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 24px' }}>
        <div style={section}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F2D06B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Payrexx TWINT</div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Instance Payrexx</label>
            <input style={inp} placeholder="nexus" value={payrexxInstance} onChange={(e) => setPayrexxInstance(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Secret API Payrexx</label>
            <input style={inp} type="password" placeholder="votre_secret_api" value={payrexxSecret} onChange={(e) => setPayrexxSecret(e.target.value)} />
          </div>
        </div>

        <div style={section}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5B7FFF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>SMS OTP (Cloudflare Worker)</div>
          <div>
            <label style={lbl}>Worker URL</label>
            <input style={inp} placeholder="https://nexus-sms.workers.dev" value={workerUrl} onChange={(e) => setWorkerUrl(e.target.value)} />
          </div>
        </div>

        <div style={section}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00D97A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Compte Administrateur</div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Email admin</label>
            <input style={inp} type="email" placeholder="admin@nexus.ch" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Mot de passe</label>
            <input style={inp} type="password" placeholder="Minimum 8 caracteres" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Confirmer le mot de passe</label>
            <input style={inp} type="password" placeholder="Repeter le mot de passe" value={adminConfirm} onChange={(e) => setAdminConfirm(e.target.value)} />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.2)', borderRadius: 10, color: '#FF3D5A', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>

      <div style={{ flexShrink: 0, padding: '12px 24px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 8px))', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', height: 56,
            background: loading ? 'rgba(242,208,107,0.4)' : 'linear-gradient(135deg, #F2D06B, #D4A050)',
            color: '#050507', fontWeight: 700, fontSize: 15, letterSpacing: '0.06em',
            textTransform: 'uppercase', borderRadius: 14, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(242,208,107,0.25)',
          }}
        >
          {loading ? (
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #050507', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          ) : 'Initialiser NEXUS'}
        </button>
      </div>
    </div>
  );
}
