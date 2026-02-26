import React, { useState, useRef, useEffect } from 'react';
import { sendOTP, verifyOTP } from '../../lib/twilio';
import { IconPhone, IconArrowLeft } from '../../components/icons';

interface OTPScreenProps {
  role: 'client' | 'pro';
  onSuccess: (phone: string) => void;
  onBack: () => void;
}

export default function OTPScreen({ role, onSuccess, onBack }: OTPScreenProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      setResendCooldown((prev) => {
        if (prev <= 1) { if (cooldownRef.current) clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setError('');
    const cleaned = phone.replace(/\s/g, '');
    if (!cleaned || cleaned.length < 10) { setError('Numero de telephone invalide.'); return; }
    setLoading(true);
    try {
      await sendOTP(cleaned);
      if (!mountedRef.current) return;
      setStep('code');
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      if (mountedRef.current) setError("Impossible d'envoyer le SMS. Verifiez votre numero.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleDigitChange = (idx: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = char;
    setDigits(newDigits);
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (newDigits.every((d) => d !== '')) handleVerify(newDigits.join(''));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code ?? digits.join('');
    if (finalCode.length < 6) { setError('Entrez les 6 chiffres du code SMS.'); return; }
    setError('');
    setLoading(true);
    try {
      const cleaned = phone.replace(/\s/g, '');
      const valid = await verifyOTP(cleaned, finalCode);
      if (!mountedRef.current) return;
      if (valid) {
        onSuccess(cleaned);
      } else {
        setError('Code incorrect. Verifiez votre SMS.');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      if (mountedRef.current) setError('Erreur de verification. Reessayez.');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      const cleaned = phone.replace(/\s/g, '');
      await sendOTP(cleaned);
      if (!mountedRef.current) return;
      startCooldown();
      setDigits(['', '', '', '', '', '']);
    } catch {
      if (mountedRef.current) setError("Impossible de renvoyer le SMS.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: '100%', height: 52, background: '#0D0D13', border: '1px solid #1C1C26', borderRadius: 12, padding: '0 16px', color: '#F4F4F8', fontFamily: 'Inter, sans-serif', fontSize: 16, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050507', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '48px 24px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', background: '#0D0D13', border: '1px solid #1C1C26', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <IconArrowLeft size={18} color="#F4F4F8" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: '#F4F4F8', letterSpacing: '-0.03em' }}>
            {step === 'phone' ? 'Votre numero' : 'Code SMS'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9898B4' }}>
            {step === 'phone' ? `Verification ${role === 'client' ? 'client' : 'professionnel'}` : `Code envoye au ${phone}`}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '8px 24px' }}>
        {step === 'phone' ? (
          <div>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(242,208,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <IconPhone size={28} color="#F2D06B" />
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#9898B4', lineHeight: 1.6 }}>
              Entrez votre numero de telephone suisse. Vous recevrez un code de verification par SMS.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9898B4', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Numero de telephone
              </label>
              <input style={inp} type="tel" placeholder="+41 79 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()} />
            </div>
            {error && <div style={{ padding: '10px 14px', background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.2)', borderRadius: 10, color: '#FF3D5A', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 28px', fontSize: 14, color: '#9898B4', lineHeight: 1.6 }}>Entrez le code a 6 chiffres recu par SMS.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{ width: 44, height: 56, background: '#0D0D13', border: `1px solid ${d ? '#F2D06B' : '#1C1C26'}`, borderRadius: 12, color: '#F4F4F8', fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 700, textAlign: 'center', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
                />
              ))}
            </div>
            {error && <div style={{ padding: '10px 14px', background: 'rgba(255,61,90,0.1)', border: '1px solid rgba(255,61,90,0.2)', borderRadius: 10, color: '#FF3D5A', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</div>}
            <button onClick={handleResend} disabled={resendCooldown > 0 || loading} style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? '#54546C' : '#F2D06B', fontSize: 13, fontWeight: 500, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', display: 'block', margin: '0 auto' }}>
              {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
            </button>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: '12px 24px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 8px))', background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={step === 'phone' ? handleSendOTP : () => handleVerify()}
          disabled={loading || (step === 'code' && digits.some((d) => !d))}
          style={{
            width: '100%', height: 56,
            background: loading || (step === 'code' && digits.some((d) => !d)) ? 'rgba(242,208,107,0.3)' : 'linear-gradient(135deg, #F2D06B, #D4A050)',
            color: '#050507', fontWeight: 700, fontSize: 15, letterSpacing: '0.06em',
            textTransform: 'uppercase', borderRadius: 14, border: 'none',
            cursor: loading || (step === 'code' && digits.some((d) => !d)) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(242,208,107,0.2)',
          }}
        >
          {loading ? <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #050507', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} /> : step === 'phone' ? 'ENVOYER LE CODE' : 'VERIFIER'}
        </button>
      </div>
    </div>
  );
}
