import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ProErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Pro crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#050507',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,61,90,0.1)',
            border: '1px solid rgba(255,61,90,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="#FF3D5A" strokeWidth="1.5" fill="none">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 18,
            color: '#F4F4F8',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Une erreur est survenue
          </p>
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 14,
            color: '#9898B4',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            Votre session est intacte.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#F2D06B',
              color: '#050507',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              borderRadius: 14,
              height: 52,
              padding: '0 32px',
              cursor: 'pointer',
            }}
          >
            Reessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
