import React, { useState } from 'react';
import { User, Scissors, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { AppUserRole } from '../backend';
import OTPVerification from './OTPVerification';
import ProOnboardingModal from './ProOnboardingModal';

export default function RoleSelection() {
  const { setCurrentScreen, setAppRole, phoneVerified } = useAppContext();
  const { logout } = useAuth();
  const saveProfile = useSaveCallerUserProfile();
  const [showOTP, setShowOTP] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClientSelect = async () => {
    if (phoneVerified) {
      setAppRole('client');
      await saveProfile.mutateAsync({ name: 'Client', appRole: AppUserRole.client });
      setCurrentScreen('explorer');
    } else {
      setShowOTP(true);
    }
  };

  const handleProSelect = () => {
    setShowProModal(true);
  };

  if (showOTP) {
    return <OTPVerification onBack={() => setShowOTP(false)} />;
  }

  return (
    <>
      <div className="nexus-container flex flex-col min-h-screen px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={logout} className="text-nexus-secondary hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="text-white font-black text-xl tracking-widest">
            NEXUS<span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full ml-0.5 mb-1 align-bottom" />
          </div>
          <div className="w-6" />
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Vous êtes ?</h1>
          <p className="text-nexus-secondary">Choisissez votre profil pour continuer</p>
        </div>

        {/* Role cards */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleClientSelect}
            disabled={isLoading || saveProfile.isPending}
            className="w-full p-6 bg-nexus-card border border-nexus-border rounded-nexus text-left hover:border-nexus-gold transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-nexus-bg rounded-full flex items-center justify-center group-hover:bg-nexus-gold/10 transition-colors">
                <User size={28} className="text-nexus-gold" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Je cherche un service</h2>
                <p className="text-nexus-secondary text-sm mt-0.5">Réservez un pro près de chez vous</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleProSelect}
            className="w-full p-6 bg-nexus-card border border-nexus-border rounded-nexus text-left hover:border-nexus-gold transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-nexus-bg rounded-full flex items-center justify-center group-hover:bg-nexus-gold/10 transition-colors">
                <Scissors size={28} className="text-nexus-gold" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Je propose un service</h2>
                <p className="text-nexus-secondary text-sm mt-0.5">Développez votre activité avec NEXUS</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-nexus-secondary text-xs">
            En continuant, vous acceptez les{' '}
            <span className="text-nexus-gold">Conditions d'utilisation</span>
          </p>
        </div>
      </div>

      {showProModal && (
        <ProOnboardingModal onClose={() => setShowProModal(false)} />
      )}
    </>
  );
}
