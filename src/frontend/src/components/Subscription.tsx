import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PaymentForm, { PaymentData } from './PaymentForm';

const Subscription: React.FC = () => {
  const { goToNexusOS, updateSubscription } = useAppContext();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const handleSubscribe = () => {
    setShowPayment(true);
  };

  const handleValidationChange = (isValid: boolean, data: PaymentData | null) => {
    setIsPaymentValid(isValid);
    setPaymentData(data);
  };

  const handleConfirmPayment = () => {
    if (!isPaymentValid || !paymentData) return;

    setIsProcessing(true);
    setTimeout(() => {
      const trialEnd = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
      updateSubscription({
        status: 'trial',
        trialEndsAt: trialEnd,
        nextBillingDate: trialEnd,
        paymentMethod: {
          cardLast4: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
          cardExpiry: paymentData.expiry,
        },
      });
      setIsProcessing(false);
      goToNexusOS();
    }, 1500);
  };

  if (showPayment) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
        <div
          onClick={() => setShowPayment(false)}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            marginBottom: '32px',
            cursor: 'pointer',
          }}
        >
          NEXUS<span style={{ color: '#E8D5B0' }}>.</span>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              marginBottom: '12px',
            }}
          >
            Paiement
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', marginBottom: '32px', fontSize: '14px' }}>
            Sécurisez votre abonnement NEXUS
          </p>

          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <PaymentForm onValidationChange={handleValidationChange} />
          </div>

          <button
            className="btn-sand"
            onClick={handleConfirmPayment}
            disabled={!isPaymentValid || isProcessing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                TRAITEMENT...
              </>
            ) : (
              'CONFIRMER LE PAIEMENT'
            )}
          </button>

          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.35)',
              textAlign: 'center',
              marginTop: '16px',
              lineHeight: 1.6,
            }}
          >
            Paiement sécurisé. Vos données sont protégées.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <div
        onClick={goToNexusOS}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '22px',
          fontWeight: 900,
          letterSpacing: '-0.5px',
          marginBottom: '32px',
          cursor: 'pointer',
        }}
      >
        NEXUS<span style={{ color: '#E8D5B0' }}>.</span>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Trial Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(232,213,176,0.15), rgba(232,213,176,0.05))',
            border: '1px solid rgba(232,213,176,0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#E8D5B0',
              marginBottom: '8px',
            }}
          >
            OFFRE DE LANCEMENT
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '36px',
              fontWeight: 900,
              marginBottom: '8px',
            }}
          >
            GRATUIT le premier mois
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)' }}>
            puis 199 CHF/an
          </div>
        </div>

        {/* Pricing Card */}
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Abonnement NEXUS Pro
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '48px',
              fontWeight: 900,
              color: '#E8D5B0',
              marginBottom: '8px',
            }}
          >
            199.–
            <span style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)' }}>
              {' '}
              / an
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px' }}>
            Facturation annuelle · Résiliable à tout moment
          </div>

          {/* Advantages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {[
              'Profil professionnel complet',
              'Gestion des réservations en temps réel',
              'Calendrier intelligent',
              'Portefeuille et transactions',
              'Visibilité maximale sur NEXUS',
              'Support prioritaire',
            ].map((advantage, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(232,213,176,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#E8D5B0',
                  }}
                >
                  ✓
                </div>
                <div style={{ fontSize: '14px' }}>{advantage}</div>
              </div>
            ))}
          </div>

          <button className="btn-sand" onClick={handleSubscribe}>
            COMMENCER L'ESSAI GRATUIT
          </button>
        </div>

        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.35)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          En vous abonnant, vous acceptez nos conditions générales. Votre premier mois est gratuit,
          puis 199 CHF seront facturés annuellement. Vous pouvez annuler à tout moment.
        </div>
      </div>
    </div>
  );
};

export default Subscription;
