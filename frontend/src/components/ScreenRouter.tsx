import React, { Suspense, lazy } from 'react';
import { useAppContext } from '../context/AppContext';

const Login = lazy(() => import('./Login'));
const RoleSelectionV2 = lazy(() => import('./RoleSelectionV2'));
const OTPVerificationV2 = lazy(() => import('./OTPVerificationV2'));
const ExplorerV2 = lazy(() => import('./ExplorerV2'));
const ProFiche = lazy(() => import('./ProFiche'));
const BookingFlow = lazy(() => import('./BookingFlow'));
const LiveStatus = lazy(() => import('./LiveStatus'));
const NexusOS = lazy(() => import('./NexusOS'));
const RoleSelection = lazy(() => import('./RoleSelection'));
const OTPVerification = lazy(() => import('./OTPVerification'));
const Welcome = lazy(() => import('./Welcome'));
const ProLogin = lazy(() => import('./ProLogin'));
const Subscription = lazy(() => import('./Subscription'));
const ClientDashboard = lazy(() => import('./ClientDashboard'));
const NotificationCenter = lazy(() => import('./NotificationCenter'));
const ProApp = lazy(() => import('./ProApp'));

const Spinner = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'var(--void)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: 32,
      height: 32,
      border: '2px solid rgba(242,208,107,0.2)',
      borderTop: '2px solid #F2D06B',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

export default function ScreenRouter() {
  const { currentScreen } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <Login />;
      case 'roleSelection': return <RoleSelectionV2 />;
      case 'roleSelectionV2': return <RoleSelectionV2 />;
      case 'otpVerification': return <OTPVerification />;
      case 'clientOtp': return <OTPVerificationV2 />;
      case 'otp': return <OTPVerification />;
      case 'welcome': return <Welcome />;
      case 'proLogin': return <ProLogin />;
      case 'proOnboarding': return <ProApp />;
      case 'explorerV2': return <ExplorerV2 />;
      case 'proFiche': return <ProFiche />;
      case 'bookingFlow': return <BookingFlow />;
      case 'liveStatus': return <LiveStatus />;
      case 'nexusOS': return <NexusOS />;
      case 'monBusiness': return <NexusOS />;
      case 'subscription': return <Subscription />;
      case 'clientDashboard': return <ClientDashboard />;
      case 'notificationCenter': return <NotificationCenter />;
      case 'proSuccess': return <ProApp />;
      case 'subscriptionSuccess': return <NexusOS />;
      case 'radarPro': return <ProApp />;
      case 'walletPro': return <ProApp />;
      case 'splash': return <Login />;
      case 'explorer': return <ExplorerV2 />;
      case 'providerDetail': return <ProFiche />;
      case 'bookingLocation': return <BookingFlow />;
      case 'bookingDate': return <BookingFlow />;
      case 'bookingContact': return <BookingFlow />;
      case 'subscriptionScreen': return <NexusOS />;
      case 'upgradeModal': return <NexusOS />;
      case 'builder': return <Login />;
      default: return <Login />;
    }
  };

  return (
    <Suspense fallback={<Spinner />}>
      {renderScreen()}
    </Suspense>
  );
}
