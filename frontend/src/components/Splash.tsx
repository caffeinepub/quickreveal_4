import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Splash() {
  const { navigate, setAppRole, setPhoneVerified } = useAppContext();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated && isFetched && !profileLoading) {
      if (userProfile) {
        if (userProfile.appRole === 'professional') {
          setAppRole('professional');
          navigate('nexusOS');
        } else if (userProfile.appRole === 'client') {
          setAppRole('client');
          setPhoneVerified(true);
          navigate('explorer');
        } else {
          navigate('roleSelection');
        }
      } else {
        navigate('roleSelection');
      }
    }
  }, [isAuthenticated, isFetched, profileLoading, userProfile]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      console.error('Login error:', error);
    }
  };

  return (
    <div
      className="screen-transition"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      {/* Main centered content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {/* NEXUS Logo — typographic only */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: '52px',
              color: '#FFFFFF',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            NEXUS
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: '60px',
              color: '#4F6EF7',
              letterSpacing: '-2px',
              lineHeight: 1,
              marginLeft: '2px',
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            color: '#888888',
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: 300,
            marginBottom: '32px',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Services à domicile premium
        </p>

        {/* Golden separator */}
        <div className="gold-separator" style={{ marginBottom: '32px' }} />

        {/* CTA Button */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="btn-tap-gold"
          style={{
            width: '85%',
            maxWidth: '340px',
            height: '56px',
            backgroundColor: '#E8C89A',
            color: '#0A0A0A',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(232, 200, 154, 0.3)',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            opacity: isLoggingIn ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          {isLoggingIn ? (
            <>
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #0A0A0A',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block',
                }}
              />
              Connexion...
            </>
          ) : (
            'SE CONNECTER'
          )}
        </button>

        {/* Security line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#555555',
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          <span>🔒</span>
          <span>Face ID · Empreinte · WebAuthn</span>
        </div>
      </div>

      {/* Bottom locale info */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#333333',
          fontSize: '11px',
          letterSpacing: '0.05em',
        }}
      >
        CHF · Suisse romande · +41
      </div>
    </div>
  );
}
