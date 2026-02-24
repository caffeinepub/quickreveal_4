import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2, Gift } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { triggerGoldenConfetti } from '../utils/confetti';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const BENEFITS = [
  'Profil visible dans l\'Explorer',
  'Réservations illimitées',
  'NEXUS PAY activé',
  'Mode FLASH disponible',
  'Notifications temps réel',
  'Support prioritaire',
];

export default function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const { setCurrentScreen, setProProfile, addNotification } = useAppContext();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isProcessing && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isProcessing && countdown === 0) {
      handleActivationSuccess();
    }
  }, [isProcessing, countdown]);

  const handleActivate = () => {
    if (!email) return;
    setIsProcessing(true);
    setCountdown(3);
  };

  const handleActivationSuccess = () => {
    setIsProcessing(false);
    setIsSuccess(true);
    triggerGoldenConfetti();
    setProProfile(prev => ({
      ...prev,
      subscriptionActive: true,
      trialStartDate: Date.now(),
      isPublished: true,
    }));
    addNotification({
      type: 'confirmed',
      message: '🎉 Votre profil est en ligne ! Des clients peuvent déjà vous voir.',
    });
  };

  if (isSuccess) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="success-circle-anim flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-nexus-success/20 rounded-full flex items-center justify-center">
            <span className="text-5xl">🎉</span>
          </div>
          <div>
            <h2 className="text-white font-black text-2xl mb-2">Vous êtes en ligne !</h2>
            <p className="text-nexus-secondary text-sm leading-relaxed">
              Des clients autour de vous peuvent déjà voir votre profil.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => setCurrentScreen('nexusOS')}
              className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold rounded-nexus hover:opacity-90 transition-all"
            >
              Accéder à mon espace pro
            </button>
            <button
              onClick={() => setCurrentScreen('explorer')}
              className="w-full py-3 bg-nexus-card border border-nexus-border rounded-nexus text-white font-medium hover:border-nexus-gold transition-all"
            >
              👁️ Voir mon profil client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-container flex flex-col min-h-screen">
      <div className="flex items-center gap-4 px-4 py-4 border-b border-nexus-border">
        <button onClick={onBack} className="text-nexus-secondary hover:text-white">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-bold">Activer mon profil</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Offer header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-nexus-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={32} className="text-nexus-gold" />
          </div>
          <h2 className="text-white font-black text-3xl mb-1">🎁 7 JOURS GRATUITS</h2>
          <p className="text-nexus-secondary">puis <span className="text-white font-bold">19,90 CHF/mois</span></p>
          <p className="text-nexus-secondary text-sm">Résiliable à tout moment</p>
        </div>

        {/* Benefits */}
        <div className="bg-nexus-card border border-nexus-border rounded-nexus p-5 mb-6">
          <div className="flex flex-col gap-3">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-nexus-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-nexus-success" />
                </div>
                <span className="text-white text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-nexus-secondary text-sm mb-2 block">Email de facturation</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full bg-nexus-card border border-nexus-border rounded-nexus px-4 py-3 text-white placeholder-nexus-secondary focus:border-nexus-gold focus:outline-none"
          />
        </div>

        {/* Payment button */}
        <button
          onClick={handleActivate}
          disabled={!email || isProcessing}
          className="w-full py-4 bg-red-600 text-white font-bold rounded-nexus hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mb-4"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Traitement... ({countdown}s)
            </>
          ) : (
            '🔴 Payer via Revolut'
          )}
        </button>

        {/* Activate button */}
        <button
          onClick={handleActivate}
          disabled={!email || isProcessing}
          className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold text-lg rounded-nexus hover:opacity-90 disabled:opacity-50 transition-all shadow-gold"
        >
          ✅ ACTIVER MON ESSAI GRATUIT
        </button>
      </div>
    </div>
  );
}
