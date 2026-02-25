import React, { useState } from 'react';
import { ProProvider, useProContext } from '../context/ProContext';
import ProTabBar from './ProTabBar';
import RadarPro from './RadarPro';
import WalletPro from './WalletPro';
import DashboardScreen from './DashboardScreen';
import BusinessScreen from './BusinessScreen';

function ProLayoutInner() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { proActif } = useProContext();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'radar' && <RadarPro />}
        {activeTab === 'wallet' && <WalletPro />}
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'business' && (
          <BusinessScreen onActivationSuccess={() => setActiveTab('dashboard')} />
        )}
      </div>
      <ProTabBar active={activeTab} onChange={setActiveTab} proActif={proActif} />
    </div>
  );
}

export default function ProLayout() {
  return (
    <ProProvider>
      <ProLayoutInner />
    </ProProvider>
  );
}
