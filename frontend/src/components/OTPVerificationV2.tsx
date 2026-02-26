import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { IconArrowLeft, IconSpinner } from './icons/Icons';

export default function OTPVerificationV2() {
  const { navigateTo } = useAppContext();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    const code = newDigits.join('');
    if (code.length === 4) {
      verifyCode(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) newDigits[i] = pasted[i];
    setDigits(newDigits);
    if (pasted.length === 4) verifyCode(pasted);
    else inputRefs[Math.min(pasted.length, 3)].current?.focus();
  };

  const verifyCode = (code: string) => {
    if (code === '1234') {
      setLoading(true);
      setSuccess(true);
      setTimeout(() => {
        navigateTo('explorerV2');
      }, 800);
    } else {
      setError(true);
      setDigits(['', '', '', '']);
      setTimeout(() => inputRefs[0].current?.focus(), 50);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 24px 40px',
      }}
    >
      <button
        onClick={() => navigateTo('roleSelection')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--t3)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          marginBottom: '40px',
          padding: 0,
        }}
      >
        <IconArrowLeft size={18} color="var(--t3)" />
        Retour
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'rgba(242,208,107,0.1)',
            border: '1px solid rgba(242,208,107,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', color: 'var(--gold)' }}>SMS</span>
        </div>

        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '26px',
            color: 'var(--t1)',
            textAlign: 'center',
            marginBottom: '8px',
            letterSpacing: '-0.03em',
          }}
        >
          Verification
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--t3)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Code envoye au +41 79 *** ** 00
        </p>

        {/* OTP inputs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }} onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: '64px',
                height: '72px',
                background: 'var(--d2)',
                border: `2px solid ${error ? 'var(--alert)' : digit ? 'var(--gold)' : 'var(--edge1)'}`,
                borderRadius: '16px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '28px',
                color: success ? 'var(--flash)' : error ? 'var(--alert)' : 'var(--t1)',
                outline: 'none',
                transition: 'border-color 200ms, color 200ms',
                caretColor: 'var(--gold)',
              }}
            />
          ))}
        </div>

        {error && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              color: 'var(--alert)',
              marginBottom: '16px',
            }}
          >
            Code incorrect. Essayez 1234 pour la demo.
          </p>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--flash)' }}>
            <IconSpinner size={18} color="var(--flash)" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--flash)' }}>Verification...</span>
          </div>
        )}

        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: 'var(--t4)', marginTop: '32px' }}>
          Pas recu ?{' '}
          <button
            onClick={() => {}}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gold)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              padding: 0,
            }}
          >
            Renvoyer
          </button>
        </p>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            color: 'var(--t4)',
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          Code demo : 1234
        </p>
      </div>
    </div>
  );
}
