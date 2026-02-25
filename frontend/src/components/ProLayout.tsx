import React, { useState } from 'react';
import { ProProvider } from '../context/ProContext';
import ProTabBar from './ProTabBar';
import DashboardScreen from './DashboardScreen';
import BusinessScreen from './BusinessScreen';
import RadarPro from './RadarPro';
import WalletPro from './WalletPro';
import SubscriptionModal from './SubscriptionModal';
import SubscriptionSuccess from './SubscriptionSuccess';
import ProErrorBoundary from './ProErrorBoundary';

type ProTab = 'radar' | 'wallet' | 'dashboard' | 'business';

export default function ProLayout() {
  const [activeTab, setActiveTab] = useState<ProTab>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proActif, setProActif] = useState(false);

  return (
    <ProErrorBoundary>
      <ProProvider>
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#050507',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 430,
          margin: '0 auto',
          overflow: 'hidden',
        }}>
          {/* Tab content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          }}>
            {activeTab === 'radar' && <RadarPro />}
            {activeTab === 'wallet' && <WalletPro />}
            {activeTab === 'dashboard' && (
              <DashboardScreen
                proActif={proActif}
                onActivate={() => setShowModal(true)}
              />
            )}
            {activeTab === 'business' && (
              <BusinessScreen
                onActivate={() => setShowModal(true)}
              />
            )}
          </div>

          {/* Tab bar */}
          <ProTabBar
            active={activeTab}
            onChange={(tab) => setActiveTab(tab as ProTab)}
          />

          {/* Subscription modal — bottom sheet */}
          <SubscriptionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubscribe={() => {
              setShowModal(false);
              setShowSuccess(true);
            }}
          />

          {/* Success overlay */}
          {showSuccess && (
            <SubscriptionSuccess
              onComplete={() => {
                setShowSuccess(false);
                setProActif(true);
                setActiveTab('dashboard');
              }}
            />
          )}
        </div>
      </ProProvider>
    </ProErrorBoundary>
  );
}
