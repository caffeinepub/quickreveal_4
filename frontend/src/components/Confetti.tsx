import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

const COLORS = ['#F2D06B', '#FFE89A', '#00D97A', '#F4F4F8', '#F2D06B'];

export default function Confetti() {
  const particles = useMemo<Particle[]>(() => (
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 800,
      duration: 1000 + Math.random() * 600,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  ), []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10000,
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-10px',
            width: 5,
            height: 8,
            borderRadius: 2,
            background: p.color,
            animation: `confettiFall ${p.duration}ms ${p.delay}ms ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
