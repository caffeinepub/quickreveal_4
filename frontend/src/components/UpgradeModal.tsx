import React from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useAppContext();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('builder');
  };

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#1a1a1a', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '32px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', padding: '8px' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '24px', fontWeight: 900, marginBottom: '16px' }}>
          LANCER MON SERVICE
        </h2>

        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px', lineHeight: '1.6' }}>
          Passez à un compte professionnel pour lancer votre service, publier vos prestations et recevoir des réservations de clients.
        </p>

        <div style={{ background: 'rgba(232, 200, 154, 0.08)', border: '1px solid rgba(232, 200, 154, 0.2)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ color: '#E8C89A', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Avantages inclus :
          </h3>
          <ul style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Créez votre profil professionnel</li>
            <li>Publiez vos services et tarifs</li>
            <li>Gérez votre agenda et disponibilités</li>
            <li>Recevez et acceptez des réservations</li>
            <li>Tableau de bord Mon Espace Pro complet</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleUpgrade} style={{ flex: 1, background: '#E8C89A', border: 'none', borderRadius: '10px', padding: '14px 16px', color: '#0a0a0a', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
            CONTINUER
          </button>
          <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', padding: '14px 16px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
            ANNULER
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
