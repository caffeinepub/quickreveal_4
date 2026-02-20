import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const DEMO_CREDENTIALS = {
  email: 'pro@nexus.ch',
  password: 'nexus2025',
};

const ProLogin: React.FC = () => {
  const { goToSplash, goToNexusOS, loginPro } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      loginPro(email);
      setTimeout(() => {
        goToNexusOS();
      }, 300);
    } else {
      toast.error('Identifiants incorrects');
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <Toaster />
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px',
        }}
      >
        <div
          onClick={goToSplash}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '60px' }}>
        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span> OS
        </div>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '32px',
            fontSize: '13px',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
          }}
        >
          MODE PROFESSIONNEL
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pro@nexus.ch"
              style={{
                width: '100%',
                background: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '8px',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn-sand">
            SE CONNECTER
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(232,213,176,0.08)',
            border: '1px solid rgba(232,213,176,0.2)',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          <strong style={{ color: '#E8D5B0' }}>Compte de démo :</strong>
          <br />
          Email: pro@nexus.ch
          <br />
          Mot de passe: nexus2025
        </div>
      </div>
    </div>
  );
};

export default ProLogin;
