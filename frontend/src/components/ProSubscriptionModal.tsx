import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface ProSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashIcon = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="0" y1="1" x2="12" y2="1" />
  </svg>
);

const CheckAnimated = ({ animate }: { animate: boolean }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline
      points="8,20 16,28 32,12"
      style={{
        strokeDasharray: 40,
        strokeDashoffset: animate ? 0 : 40,
        transition: 'stroke-dashoffset 0.4s ease 0.1s',
      }}
    />
  </svg>
);

const ADVANTAGES = [
  'Profil visible par tous les clients',
  'Réservations illimitées',
  'Paiements sécurisés via NEXUS PAY',
  'Statistiques et analytics avancés',
  'Support prioritaire 7j/7',
  'Badge professionnel vérifié',
];

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      size: Math.random() * 6 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = '#F2D06B';
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;
      });
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

export default function ProSubscriptionModal({ isOpen, onClose }: ProSubscriptionModalProps) {
  const { navigateTo, setProActif, setEssaiJours, setFlashActive } = useAppContext();
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'form' | 'loading' | 'success'>('form');
  const [checkAnimate, setCheckAnimate] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase('form');
      setProgress(0);
      setCheckAnimate(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setPhase('loading');
    setProgress(0);

    let p = 0;
    progressRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        if (progressRef.current) clearInterval(progressRef.current);
        setPhase('success');
        setTimeout(() => setCheckAnimate(true), 100);
        setTimeout(() => {
          setProActif(true);
          setEssaiJours(7);
          setFlashActive(true);
          onClose();
          navigateTo('nexusOS');
        }, 2500);
      }
    }, 40);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050507',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Progress bar */}
      {(phase === 'loading' || phase === 'success') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: '#1C1C26',
          zIndex: 1001,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#F2D06B',
            transition: 'width 0.04s linear',
          }} />
        </div>
      )}

      {/* Success overlay */}
      {phase === 'success' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#050507',
          zIndex: 1002,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Confetti active={true} />
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#00D97E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            zIndex: 11,
          }}>
            <CheckAnimated animate={checkAnimate} />
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '10px',
            zIndex: 11,
          }}>
            Profil activé
          </div>
          <div style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#9898B4',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            zIndex: 11,
          }}>
            Visible par les clients dès maintenant
          </div>
        </div>
      )}

      {/* Form */}
      {phase === 'form' && (
        <div style={{ flex: 1, padding: '48px 24px 40px', display: 'flex', flexDirection: 'column' }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              alignSelf: 'flex-end',
              background: 'none',
              border: 'none',
              color: '#54546C',
              cursor: 'pointer',
              padding: '4px',
              marginBottom: '32px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          {/* Title */}
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#F4F4F8',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}>
            7 jours gratuits
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#9898B4',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '32px',
          }}>
            puis 19.90 CHF/mois
          </div>

          {/* Advantages */}
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ADVANTAGES.map((adv, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#54546C', flexShrink: 0 }}>
                  <DashIcon />
                </span>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#F4F4F8',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {adv}
                </span>
              </div>
            ))}
          </div>

          {/* Email input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#54546C',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'Inter, sans-serif',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: '100%',
                height: '48px',
                background: '#0D0D13',
                border: '1px solid #1E1E26',
                borderRadius: '12px',
                padding: '0 16px',
                color: '#F4F4F8',
                fontSize: '15px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#F2D06B'; }}
              onBlur={e => { e.target.style.borderColor = '#1E1E26'; }}
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              height: '56px',
              background: '#F2D06B',
              color: '#050507',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Commencer l'essai gratuit
          </button>

          <p style={{
            marginTop: '16px',
            fontSize: '12px',
            color: '#2E2E3E',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>
            Sans engagement · Annulable à tout moment
          </p>
        </div>
      )}
    </div>
  );
}
