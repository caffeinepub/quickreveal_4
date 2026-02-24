import React from 'react';
import { X, Users, Calendar, CreditCard, Bell, Percent } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { AppUserRole } from '../backend';

interface ProOnboardingModalProps {
  onClose: () => void;
}

const BENEFITS = [
  { icon: <Users size={18} />, text: 'Profil visible par des milliers de clients autour de vous' },
  { icon: <Calendar size={18} />, text: 'Réservations instantanées 24h/24' },
  { icon: <CreditCard size={18} />, text: 'Paiements garantis NEXUS PAY' },
  { icon: <Bell size={18} />, text: 'Notifications temps réel' },
  { icon: <Percent size={18} />, text: 'Zéro commission les 7 premiers jours' },
];

export default function ProOnboardingModal({ onClose }: ProOnboardingModalProps) {
  const { setCurrentScreen, setAppRole } = useAppContext();
  const saveProfile = useSaveCallerUserProfile();

  const handleStart = async () => {
    try {
      await saveProfile.mutateAsync({ name: 'Professionnel', appRole: AppUserRole.professional });
      setAppRole('professional');
      setCurrentScreen('builder');
      onClose();
    } catch {
      setAppRole('professional');
      setCurrentScreen('builder');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-nexus bg-nexus-card rounded-t-3xl p-6 pb-10 slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-black text-2xl">LANCER MON SERVICE</h2>
            <p className="text-nexus-gold text-sm mt-1">7 jours gratuits · Sans engagement</p>
          </div>
          <button onClick={onClose} className="text-nexus-secondary hover:text-white p-1">
            <X size={22} />
          </button>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-3 mb-8">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-nexus-gold/10 rounded-full flex items-center justify-center text-nexus-gold flex-shrink-0">
                {benefit.icon}
              </div>
              <p className="text-white text-sm">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            disabled={saveProfile.isPending}
            className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold text-lg rounded-nexus hover:opacity-90 active:scale-95 transition-all shadow-gold"
          >
            Commencer 7 jours gratuits
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-nexus-secondary hover:text-white text-sm transition-colors"
          >
            Pas maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
