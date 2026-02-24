import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Loader2, Shield } from 'lucide-react';

export default function Splash() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const { setCurrentScreen, setAppRole, setPhoneVerified } = useAppContext();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  useEffect(() => {
    if (isAuthenticated && isFetched && !profileLoading) {
      if (userProfile) {
        // User has a profile — route based on role
        if (userProfile.appRole === 'professional') {
          setAppRole('professional');
          setCurrentScreen('nexusOS');
        } else if (userProfile.appRole === 'client') {
          setAppRole('client');
          setPhoneVerified(true);
          setCurrentScreen('explorer');
        } else {
          setCurrentScreen('roleSelection');
        }
      } else {
        setCurrentScreen('roleSelection');
      }
    }
  }, [isAuthenticated, isFetched, profileLoading, userProfile]);

  return (
    <div className="nexus-container flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-bg via-nexus-bg to-nexus-card opacity-80" />

      {/* Gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-nexus-gold opacity-5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src="/assets/generated/nexus-logo.dim_400x120.png"
              alt="NEXUS"
              className="h-16 object-contain"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-4xl font-black tracking-widest text-white">
              NEXUS
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-1 mb-3 align-bottom" />
            </div>
          </div>
          <p className="text-nexus-secondary text-sm text-center">
            Services à domicile premium — Suisse romande
          </p>
        </div>

        {/* Auth section */}
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          {isLoading || (isAuthenticated && profileLoading) ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-nexus-gold animate-spin" />
              <p className="text-nexus-secondary text-sm">Connexion en cours...</p>
            </div>
          ) : !isAuthenticated ? (
            <>
              <button
                onClick={login}
                className="w-full py-4 bg-nexus-gold text-nexus-bg font-bold text-lg rounded-nexus hover:opacity-90 active:scale-95 transition-all shadow-gold"
              >
                Se connecter
              </button>

              <div className="flex items-center gap-2 text-nexus-secondary text-xs">
                <Shield size={14} />
                <span>Authentification sécurisée — Face ID / Empreinte / WebAuthn</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1">
          <p className="text-nexus-secondary text-xs">Réservations instantanées 24h/24</p>
          <p className="text-nexus-secondary text-xs">CHF · +41 · Suisse romande</p>
        </div>
      </div>
    </div>
  );
}
