import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function BookingContact() {
  const { navigateTo } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigateTo('explorer'), 2000);
  };

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--void)',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <button
        onClick={() => navigateTo('explorer')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--t2)',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 20 }}>
        Vos coordonnées
      </h1>

      {success ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            animation: 'successPop 0.5s ease both',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>
            Réservation confirmée !
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Nom complet', value: name, setter: setName, placeholder: 'Jean Dupont' },
            { label: 'Téléphone', value: phone, setter: setPhone, placeholder: '+41 79 000 00 00' },
            { label: 'Adresse', value: address, setter: setAddress, placeholder: 'Rue de la Paix 1, Genève' },
          ].map(field => (
            <div key={field.label}>
              <label
                style={{
                  fontSize: 13,
                  color: 'var(--t3)',
                  fontWeight: 600,
                  marginBottom: 6,
                  display: 'block',
                }}
              >
                {field.label}
              </label>
              <input
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'var(--d2)',
                  border: '1px solid var(--d4)',
                  color: 'var(--t1)',
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading || !name || !phone}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              background:
                loading || !name || !phone
                  ? 'var(--d3)'
                  : 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)',
              border: 'none',
              color: loading || !name || !phone ? 'var(--t3)' : '#000',
              fontSize: 16,
              fontWeight: 800,
              cursor: loading || !name || !phone ? 'not-allowed' : 'pointer',
              marginTop: 8,
            }}
          >
            {loading ? 'Confirmation...' : 'Confirmer la réservation'}
          </button>
        </div>
      )}
    </div>
  );
}
