import React, { useState } from 'react';
import { ProProvider, useProContext } from '../context/ProContext';
import ProTabBar from './ProTabBar';
import DashboardScreen from './DashboardScreen';
import RadarPro from './RadarPro';
import WalletPro from './WalletPro';
import BusinessScreen from './BusinessScreen';
import SubscriptionModal from './SubscriptionModal';
import SubscriptionSuccess from './SubscriptionSuccess';
import ProErrorBoundary from './ProErrorBoundary';

type ProTab = 'radar' | 'wallet' | 'dashboard' | 'business';

function ProLayoutInner() {
  const [activeTab, setActiveTab] = useState<ProTab>('dashboard');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const { proActif } = useProContext();

  const handleSubscribe = () => {
    setShowSubscriptionModal(false);
    setShowSubscriptionSuccess(true);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'radar':
        return <RadarPro />;
      case 'wallet':
        return <WalletPro />;
      case 'dashboard':
        return (
          <DashboardScreen
            proActif={proActif}
            onActivate={() => setShowSubscriptionModal(true)}
          />
        );
      case 'business':
        return <BusinessScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#050507',
        overflow: 'hidden',
      }}
    >
      {/* SCROLLABLE CONTENT ZONE */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          style={{
            minHeight: '100%',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
          }}
        >
          {renderTab()}
        </div>
      </div>

      {/* TAB BAR — NOT FIXED, flex sibling */}
      <div
        style={{
          flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'rgba(5,5,7,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          zIndex: 100,
        }}
      >
        <ProTabBar active={activeTab} onChange={(tab) => setActiveTab(tab as ProTab)} />
      </div>

      {/* Overlays */}
      {showSubscriptionModal && (
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
      {showSubscriptionSuccess && (
        <SubscriptionSuccess onComplete={() => setShowSubscriptionSuccess(false)} />
      )}
    </div>
  );
}

export default function ProLayout() {
  return (
    <ProProvider>
      <ProErrorBoundary>
        <ProLayoutInner />
      </ProErrorBoundary>
    </ProProvider>
  );
}
