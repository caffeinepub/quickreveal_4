import React, { Suspense, lazy } from 'react';
import { useAppContext } from '../context/AppContext';

const Splash = lazy(() => import('./Splash'));
const RoleSelection = lazy(() => import('./RoleSelection'));
const OTPVerification = lazy(() => import('./OTPVerification'));
const Explorer = lazy(() => import('./Explorer'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const NexusOS = lazy(() => import('./NexusOS'));
const Builder = lazy(() => import('./Builder'));
const Subscription = lazy(() => import('./Subscription'));
const SubscriptionScreen = lazy(() => import('./SubscriptionScreen'));
const ProLogin = lazy(() => import('./ProLogin'));
const Welcome = lazy(() => import('./Welcome'));
const LandingPage = lazy(() => import('./LandingPage'));
const ProProfile = lazy(() => import('./ProProfile'));
const BookingFlow = lazy(() => import('./BookingFlow'));
const LiveStatus = lazy(() => import('./LiveStatus'));
const RadarPro = lazy(() => import('./RadarPro'));
const WalletPro = lazy(() => import('./WalletPro'));
const MonBusiness = lazy(() => import('./MonBusiness'));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'var(--void)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(242,208,107,0.3)',
          borderTopColor: '#F2D06B',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default function ScreenRouter() {
  const { currentScreen } = useAppContext();

  return (
    <div className="screen-enter" key={currentScreen} style={{ height: '100%' }}>
      <Suspense fallback={<LoadingFallback />}>
        {currentScreen === 'splash' && <Splash />}
        {currentScreen === 'roleSelection' && <RoleSelection />}
        {(currentScreen === 'otpVerification' || currentScreen === 'otp') && <OTPVerification />}
        {currentScreen === 'explorer' && <Explorer />}
        {currentScreen === 'clientDashboard' && <ClientDashboard />}
        {currentScreen === 'nexusOS' && <NexusOS />}
        {(currentScreen === 'pro-dashboard') && <NexusOS />}
        {currentScreen === 'builder' && <Builder />}
        {currentScreen === 'subscription' && <Subscription />}
        {currentScreen === 'subscriptionScreen' && <SubscriptionScreen />}
        {currentScreen === 'proLogin' && <ProLogin />}
        {currentScreen === 'welcome' && <Welcome />}
        {currentScreen === 'landing' && <LandingPage />}
        {currentScreen === 'proProfile' && <ProProfile />}
        {currentScreen === 'bookingFlow' && <BookingFlow />}
        {currentScreen === 'liveStatus' && <LiveStatus />}
        {(currentScreen === 'radarPro' || currentScreen === 'radar-pro') && <RadarPro />}
        {(currentScreen === 'walletPro' || currentScreen === 'wallet-pro') && <WalletPro />}
        {(currentScreen === 'monBusiness' || currentScreen === 'mon-business') && <MonBusiness />}
        {currentScreen === 'notificationCenter' && <NexusOS />}
      </Suspense>
    </div>
  );
}
