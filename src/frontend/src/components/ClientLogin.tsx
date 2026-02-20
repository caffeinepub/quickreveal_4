import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const ClientLogin: React.FC = () => {
  const { goToSplash, goToClientDashboard, loginClient } = useAppContext();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Veuillez entrer un numéro valide');
      return;
    }

    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    // Show OTP in toast
    toast.success(`Votre code OTP : ${code}`, {
      duration: 5000,
    });

    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      loginClient(phone);
      toast.success('Connexion réussie !');
      setTimeout(() => {
        goToClientDashboard();
      }, 500);
    } else {
      toast.error('Code OTP incorrect');
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
        <h1
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}
        >
          Connexion Client
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
          {step === 'phone'
            ? 'Entrez votre numéro de téléphone pour recevoir un code'
            : 'Entrez le code OTP reçu'}
        </p>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
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
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+41 79 123 45 67"
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
            <button type="submit" className="btn-white">
              ENVOYER LE CODE
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
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
                Code OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                maxLength={4}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#ffffff',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.5em',
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn-white" style={{ marginBottom: '12px' }}>
              VALIDER
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '14px',
                color: 'rgba(255, 255, 255, 0.55)',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              ← RETOUR
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClientLogin;
