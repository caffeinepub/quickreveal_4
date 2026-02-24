import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { AppUserRole } from '../backend';

interface OTPVerificationProps {
  onBack: () => void;
}

export default function OTPVerification({ onBack }: OTPVerificationProps) {
  const { setCurrentScreen, setAppRole, setPhoneVerified } = useAppContext();
  const saveProfile = useSaveCallerUserProfile();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      setError('Veuillez entrer un numéro valide');
      return;
    }
    setError('');
    setStep('otp');
    setCountdown(30);
  };

  const handleVerifyOTP = async () => {
    if (otp !== '1234') {
      setError('Code incorrect. Essayez 1234');
      return;
    }
    setError('');
    setIsVerifying(true);
    try {
      await saveProfile.mutateAsync({ name: 'Client', appRole: AppUserRole.client });
      setSuccess(true);
      setPhoneVerified(true);
      setAppRole('client');
      setTimeout(() => {
        setCurrentScreen('explorer');
      }, 1500);
    } catch {
      setError('Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  if (success) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center min-h-screen px-6">
        <div className="success-circle-anim flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-nexus-success/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-nexus-success" />
          </div>
          <h2 className="text-white font-bold text-xl">✅ Téléphone vérifié</h2>
          <p className="text-nexus-secondary text-sm">Redirection vers l'Explorer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-container flex flex-col min-h-screen px-6 py-8">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-nexus-secondary hover:text-white">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-bold text-xl">Vérification téléphone</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-16 h-16 bg-nexus-card rounded-full flex items-center justify-center mx-auto">
          <Phone size={28} className="text-nexus-gold" />
        </div>

        {step === 'phone' ? (
          <>
            <div>
              <p className="text-nexus-secondary text-sm mb-4 text-center">
                Entrez votre numéro pour recevoir un code de vérification
              </p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+41 79 XXX XX XX"
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
              />
            </div>
            {error && <p className="text-nexus-urgent text-sm text-center">{error}</p>}
            <button
              onClick={handleSendOTP}
              className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 active:scale-95 transition-all"
            >
              Envoyer le code
            </button>
          </>
        ) : (
          <>
            <div>
              <p className="text-nexus-secondary text-sm mb-2 text-center">
                Code envoyé au <span className="text-white">{phone}</span>
              </p>
              <p className="text-nexus-secondary text-xs mb-4 text-center">
                (Simulation : entrez <span className="text-nexus-gold font-bold">1234</span>)
              </p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-4 text-white text-center text-3xl tracking-widest placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
              />
            </div>

            {countdown > 0 ? (
              <p className="text-nexus-secondary text-sm text-center">
                Renvoyer dans <span className="text-nexus-gold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={() => { setCountdown(30); setStep('phone'); }}
                className="text-nexus-gold text-sm text-center hover:underline"
              >
                Renvoyer le code
              </button>
            )}

            {error && <p className="text-nexus-urgent text-sm text-center">{error}</p>}

            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 4 || isVerifying}
              className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 size={20} className="animate-spin" /> : null}
              Vérifier
            </button>
          </>
        )}
      </div>
    </div>
  );
}
