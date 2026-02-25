import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function OTPVerification() {
  const { navigateTo, setAppRole, setUserName } = useAppContext();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every(d => d !== '') && newDigits.join('').length === 4) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = (code: string) => {
    setVerifying(true);
    setTimeout(() => {
      if (code === '1234') {
        setSuccess(true);
        setTimeout(() => {
          setAppRole('client');
          setUserName('Alexandre');
          navigateTo('explorer');
        }, 800);
      } else {
        setError('Code incorrect. Utilisez 1234 pour la démo.');
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
        setVerifying(false);
      }
    }, 900);
  };

  const handleResend = () => {
    setDigits(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orb */}
      <div
        style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,224,122,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          animation: 'orbeFloat 16s ease infinite',
        }}
      />

      {/* Header with logo */}
      <div
        style={{
          paddingTop: 'calc(56px + env(safe-area-inset-top, 0px))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          zIndex: 1,
          animation: 'dropIn 0.3s ease forwards',
        }}
      >
        <div style={{ lineHeight: 1, userSelect: 'none' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 24,
              color: 'var(--t1)',
              letterSpacing: '-1.5px',
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 28,
              color: 'var(--blue)',
              letterSpacing: 0,
            }}
          >
            .
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          width: '100%',
          maxWidth: 430,
          zIndex: 1,
          flex: 1,
          justifyContent: 'center',
          marginTop: -40,
        }}
      >
        {/* SMS sent pill */}
        <div
          style={{
            background: 'rgba(0,224,122,0.06)',
            border: '1px solid rgba(0,224,122,0.18)',
            borderRadius: 'var(--r-full)',
            padding: '10px 20px',
            marginBottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'dropIn 0.4s ease 0.1s both',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--flash)',
              animation: 'breatheFlash 1.5s ease infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 13,
              color: 'var(--flash)',
            }}
          >
            SMS envoyé au +41 79 *** ** 42
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 28,
            color: 'var(--t1)',
            letterSpacing: '-0.04em',
            textAlign: 'center',
            marginBottom: 8,
            animation: 'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both',
          }}
        >
          Vérification
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 15,
            color: 'var(--t3)',
            textAlign: 'center',
            marginBottom: 36,
            animation: 'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both',
          }}
        >
          Entrez le code reçu par SMS
        </p>

        {/* OTP inputs */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            animation: 'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both',
          }}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={verifying || success}
              style={{
                width: 68,
                height: 76,
                background: success
                  ? 'rgba(0,224,122,0.06)'
                  : digit
                  ? 'var(--d3)'
                  : 'var(--d2)',
                border: `2px solid ${
                  success
                    ? 'rgba(0,224,122,0.4)'
                    : error
                    ? 'rgba(255,61,90,0.5)'
                    : digit
                    ? 'var(--edge-gold)'
                    : 'var(--edge-2)'
                }`,
                borderRadius: 'var(--r-md)',
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: success ? 'var(--flash)' : 'var(--t1)',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'all 200ms ease',
                boxShadow: digit && !error && !success
                  ? '0 0 0 3px rgba(242,208,107,0.06)'
                  : 'none',
                cursor: verifying || success ? 'not-allowed' : 'text',
              }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              animation: 'dropIn 0.3s ease forwards',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--alert)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--alert)',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Verifying state */}
        {verifying && !success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--gold-w)',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                border: '2px solid rgba(242,208,107,0.2)',
                borderTop: '2px solid var(--gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--t2)',
              }}
            >
              Vérification en cours...
            </span>
          </div>
        )}

        {/* Success state */}
        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              animation: 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--flash)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-flash)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050507" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--flash)',
              }}
            >
              Identité vérifiée
            </span>
          </div>
        )}

        {/* Demo hint */}
        {!verifying && !success && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: 400,
              color: 'var(--t4)',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Code de démo :{' '}
            <span
              style={{
                color: 'var(--gold)',
                fontWeight: 700,
              }}
            >
              1234
            </span>
          </p>
        )}

        {/* Resend link */}
        {!verifying && !success && (
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--gold)',
              cursor: 'pointer',
              marginTop: 20,
              padding: '8px 16px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Renvoyer le code
          </button>
        )}

        {/* Back button */}
        {!verifying && !success && (
          <button
            onClick={() => navigateTo('roleSelection')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--t3)',
              cursor: 'pointer',
              marginTop: 8,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 11,
          color: 'var(--t4)',
          letterSpacing: '0.05em',
          zIndex: 1,
        }}
      >
        NEXUS · Suisse romande · CHF
      </div>
    </div>
  );
}
