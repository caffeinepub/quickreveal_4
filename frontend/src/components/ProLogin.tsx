import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProLogin: React.FC = () => {
  const { navigate } = useAppContext();
  const { login, isLoading } = useAuthContext();

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      // handled
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div onClick={() => navigate('splash')} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', cursor: 'pointer', color: '#E8C89A' }}>
          NEXUS
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '60px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '12px' }}>
          Mon Espace Pro
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '40px', fontSize: '14px' }}>
          Connectez-vous pour accéder à votre tableau de bord professionnel
        </p>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{ width: '100%', background: '#E8C89A', border: 'none', borderRadius: '12px', padding: '16px', color: '#0a0a0a', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
          SE CONNECTER
        </button>

        <button
          onClick={() => navigate('splash')}
          style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '14px', color: 'rgba(255, 255, 255, 0.55)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', marginTop: '12px' }}
        >
          RETOUR
        </button>
      </div>
    </div>
  );
};

export default ProLogin;
