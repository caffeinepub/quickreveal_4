import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Splash: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 0 56px',
        overflow: 'hidden',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 800ms ease-in-out',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/generated/splash-hero.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 10, 10, 0.4)',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 28px' }}>
        <div
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '64px',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: '6px',
          }}
        >
          NEXUS<span style={{ color: '#6b7dff' }}>.</span>
        </div>
        <div
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '40px',
          }}
        >
          Connect.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn-white" onClick={() => setCurrentScreen('explorer')}>
            EXPLORER
          </button>
          <button className="btn-dark">ESPACE PRO</button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
