import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { AppUserRole } from '../backend';
import { toast } from 'sonner';

const Welcome: React.FC = () => {
  const { navigate } = useAppContext();
  const { identity } = useAuthContext();
  const saveProfile = useSaveCallerUserProfile();
  const [displayName, setDisplayName] = useState('');

  const handleCreateAccount = async (skipName: boolean = false) => {
    const name = skipName
      ? (identity?.getPrincipal().toString().slice(0, 8) ?? 'Utilisateur')
      : displayName.trim() || (identity?.getPrincipal().toString().slice(0, 8) ?? 'Utilisateur');

    try {
      await saveProfile.mutateAsync({ name, appRole: AppUserRole.client });
      toast.success('Bienvenue ! Votre compte est créé');
      setTimeout(() => navigate('explorer'), 300);
    } catch {
      navigate('explorer');
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '80px' }}>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '32px', fontWeight: 900, marginBottom: '8px', textAlign: 'center', color: '#E8C89A' }}>
          NEXUS
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '48px', fontSize: '18px', textAlign: 'center', fontWeight: 300 }}>
          Bienvenue sur NEXUS
        </p>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '8px' }}>
            Comment souhaitez-vous être appelé ? (optionnel)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Votre nom"
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #333', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <button
          onClick={() => handleCreateAccount(false)}
          disabled={saveProfile.isPending}
          style={{ width: '100%', background: '#E8C89A', border: 'none', borderRadius: '12px', padding: '14px 16px', color: '#0a0a0a', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', marginBottom: '12px' }}
        >
          COMMENCER
        </button>

        <button
          onClick={() => handleCreateAccount(true)}
          style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', padding: '14px 16px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}
        >
          PASSER
        </button>
      </div>
    </div>
  );
};

export default Welcome;
