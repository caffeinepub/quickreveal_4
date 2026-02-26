import React, { useState } from 'react';
import { IconShield, IconArrowLeft } from '../../components/icons';

interface AdminLoginScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AdminLoginScreen({ onSuccess, onBack }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe requis.');
      return;
    }
    setLoading(true);
    try {
      const storedEmail = localStorage.getItem('nexus_admin_email') ?? '';
      const storedPassword = localStorage.getItem('nexus_admin_password') ?? '';
      if (
        email.trim().toLowerCase() === storedEmail &&
        password === storedPassword
      ) {
        onSuccess();
      } else {
        setError('Identifiants incorrects.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 52,
    background: '#0D0D13',
    border: '1px solid #1C1C26',
    borderRadius: 12,
    padding: '0 16px',
    color: '#F4F4F8',
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050507',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: '48px 24px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#0D0D13',
            border: '1px solid #1C1C26',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <IconArrowLeft size={18} color="#F4F4F8" />
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 22,
              color: '#F4F4F8',
              letterSpacing: '-0.03em',
            }}
          >
            Administration
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9898B4' }}>
            Accès réservé
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '8px 24px',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(242,208,107,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <IconShield size={28} color="#F2D06B" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#9898B4',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Email
          </label>
          <input
            style={inputStyle}
            type="email"
            placeholder="admin@nexus.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#9898B4',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Mot de passe
          </label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(255,61,90,0.1)',
              border: '1px solid rgba(255,61,90,0.2)',
              borderRadius: 10,
              color: '#FF3D5A',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '12px 24px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 8px))',
          background: 'rgba(5,5,7,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: 56,
            background: loading
              ? 'rgba(242,208,107,0.4)'
              : 'linear-gradient(135deg, #F2D06B, #D4A050)',
            color: '#050507',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderRadius: 14,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 6px 24px rgba(242,208,107,0.2)',
          }}
        >
          {loading ? (
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid #050507',
                borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            'SE CONNECTER'
          )}
        </button>
      </div>
    </div>
  );
}
