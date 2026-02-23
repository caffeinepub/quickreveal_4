import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface PaymentFormProps {
  onValidationChange: (isValid: boolean, data: PaymentData | null) => void;
}

export interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onValidationChange }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validateCardNumber = (value: string): boolean => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (value: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    return true;
  };

  const validateCvc = (value: string): boolean => {
    return value.length === 3 && /^\d+$/.test(value);
  };

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (cardNumber && !validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis)';
    }
    
    if (expiry && !validateExpiry(expiry)) {
      newErrors.expiry = 'Date d\'expiration invalide (MM/AA)';
    }
    
    if (cvc && !validateCvc(cvc)) {
      newErrors.cvc = 'CVC invalide (3 chiffres requis)';
    }

    setErrors(newErrors);

    const isValid =
      validateCardNumber(cardNumber) &&
      validateExpiry(expiry) &&
      validateCvc(cvc);

    onValidationChange(
      isValid,
      isValid ? { cardNumber, expiry, cvc } : null
    );
  }, [cardNumber, expiry, cvc, onValidationChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <CreditCard size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Numéro de carte
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#1a1a1a',
            border: `1px solid ${errors.cardNumber ? '#ef4444' : 'rgba(255, 255, 255, 0.09)'}`,
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            if (!errors.cardNumber) {
              e.target.style.borderColor = '#E8D5B0';
            }
          }}
          onBlur={(e) => {
            if (!errors.cardNumber) {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
            }
          }}
        />
        {errors.cardNumber && (
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
            {errors.cardNumber}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Expiration
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#1a1a1a',
              border: `1px solid ${errors.expiry ? '#ef4444' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!errors.expiry) {
                e.target.style.borderColor = '#E8D5B0';
              }
            }}
            onBlur={(e) => {
              if (!errors.expiry) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
              }
            }}
          />
          {errors.expiry && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
              {errors.expiry}
            </div>
          )}
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
            CVC
          </label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
            placeholder="123"
            maxLength={3}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#1a1a1a',
              border: `1px solid ${errors.cvc ? '#ef4444' : 'rgba(255, 255, 255, 0.09)'}`,
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!errors.cvc) {
                e.target.style.borderColor = '#E8D5B0';
              }
            }}
            onBlur={(e) => {
              if (!errors.cvc) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
              }
            }}
          />
          {errors.cvc && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
              {errors.cvc}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

